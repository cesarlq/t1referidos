import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Usamos el cliente de Supabase para server actions/route handlers
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Interfaz para los datos que esperamos en la tabla de referencias
interface ReferenciaInsertData {
  vacante_id: string;
  referidor_nombre: string;
  referidor_email: string;
  referidor_empresa?: string | null;
  candidato_nombre: string;
  candidato_email: string;
  candidato_telefono?: string | null;
  candidato_linkedin?: string | null;
  relacion_con_candidato: string;
  años_conociendo?: number | null;
  justificacion_recomendacion: string;
  fortalezas_principales?: string[] | null;
  cv_url?: string | null;
  cv_filename?: string | null;
  cv_size_bytes?: number | null;
}

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM; // Ej: 'Portal de Referidos <noreply@tudominio.com>'
const emailAdmin = process.env.EMAIL_ADMIN; // Ej: 'admin@tudominio.com'

if (!resendApiKey) {
  console.warn("RESEND_API_KEY no está configurada. El envío de correos está deshabilitado.");
}
if (!emailFrom) {
  console.warn("EMAIL_FROM no está configurado. El envío de correos podría fallar o usar un remitente por defecto no deseado.");
}
if (!emailAdmin) {
  console.warn("EMAIL_ADMIN no está configurado. No se enviarán notificaciones al administrador.");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  
  // Cliente anónimo para uploads de Storage
  const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    const formData = await request.formData();

    const vacante_id = formData.get('vacante_id') as string;
    const referidor_nombre = formData.get('referidor_nombre') as string;
    const referidor_email = formData.get('referidor_email') as string;
    const referidor_empresa = formData.get('referidor_empresa') as string | null;
    const candidato_nombre = formData.get('candidato_nombre') as string;
    const candidato_email = formData.get('candidato_email') as string;
    const candidato_telefono = formData.get('candidato_telefono') as string | null;
    const candidato_linkedin = formData.get('candidato_linkedin') as string | null;
    const relacion_con_candidato = formData.get('relacion_con_candidato') as string;
    const años_conociendo_str = formData.get('años_conociendo') as string | null;
    const justificacion_recomendacion = formData.get('justificacion_recomendacion') as string;
    const fortalezas_principales_str = formData.get('fortalezas_principales') as string | null;
    const cvFile = formData.get('cv') as File | null;

    if (!vacante_id || !referidor_nombre || !referidor_email || !candidato_nombre || !candidato_email || !relacion_con_candidato || !justificacion_recomendacion) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    let cv_url: string | null = null;
    let cv_filename: string | null = null;
    let cv_size_bytes: number | null = null;

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'El archivo es demasiado grande (máx. 5MB).' }, { status: 400 });
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(cvFile.type)) {
        return NextResponse.json({ error: 'Formato de archivo no soportado.' }, { status: 400 });
      }

      const uniqueFilename = `${Date.now()}_${cvFile.name.replace(/\s+/g, '_')}`;
      const filePath = `public/${vacante_id}/${uniqueFilename}`;

      const { error: storageError } = await supabaseAnon.storage
        .from('cvs')
        .upload(filePath, cvFile, { cacheControl: '3600', upsert: false });

      if (storageError) {
        console.error('Error subiendo CV a Supabase Storage:', storageError);
        return NextResponse.json({ error: `Error al subir CV: ${storageError.message}` }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseAnon.storage.from('cvs').getPublicUrl(filePath);
      cv_url = publicUrlData?.publicUrl || null;
      cv_filename = cvFile.name;
      cv_size_bytes = cvFile.size;
    }

    const referenciaData: ReferenciaInsertData = {
      vacante_id,
      referidor_nombre,
      referidor_email,
      referidor_empresa: referidor_empresa || null,
      candidato_nombre,
      candidato_email,
      candidato_telefono: candidato_telefono || null,
      candidato_linkedin: candidato_linkedin || null,
      relacion_con_candidato,
      años_conociendo: años_conociendo_str ? parseInt(años_conociendo_str, 10) : null,
      justificacion_recomendacion,
      fortalezas_principales: fortalezas_principales_str ? fortalezas_principales_str.split(',').map(s => s.trim()).filter(s => s) : null,
      cv_url,
      cv_filename,
      cv_size_bytes,
    };

    const { data: insertedReferencia, error: dbError } = await supabase
      .from('referencias')
      .insert([referenciaData])
      .select() // Para obtener los datos insertados, incluyendo el ID generado
      .single();

    if (dbError) {
      console.error('Error insertando referencia en DB:', dbError);
      return NextResponse.json({ error: `Error al guardar la referencia: ${dbError.message}` }, { status: 500 });
    }

    // Envío de correos si todo fue bien y Resend está configurado
    if (resend && emailFrom && insertedReferencia) {
      try {
        // Correo de confirmación al referidor
        await resend.emails.send({
          from: emailFrom,
          to: referidor_email,
          subject: 'Confirmación de Referencia Enviada - T1Referidos',
          text: `Hola ${referidor_nombre},\n\nGracias por referir a ${candidato_nombre}. Hemos recibido tu recomendación y la estamos procesando.\n\nSaludos,\nEl equipo de T1Referidos`,
          // Podrías usar `html:` para plantillas más complejas
        });

        // Correo de notificación al administrador (si está configurado)
        if (emailAdmin) {
          // Podríamos querer obtener el título de la vacante para el correo al admin
          let tituloVacante = 'No especificada';
          const { data: vacanteData } = await supabase.from('vacantes').select('titulo_puesto').eq('id', vacante_id).single();
          if (vacanteData) {
            tituloVacante = vacanteData.titulo_puesto;
          }

          await resend.emails.send({
            from: emailFrom,
            to: emailAdmin,
            subject: `Nueva Referencia Recibida: ${candidato_nombre} para ${tituloVacante}`,
            text: `Se ha recibido una nueva referencia:\n\nReferidor: ${referidor_nombre} (${referidor_email})\nCandidato: ${candidato_nombre} (${candidato_email})\nVacante: ${tituloVacante} (ID: ${vacante_id})\nJustificación: ${justificacion_recomendacion}\n\n${cv_url ? `CV Adjunto: ${cv_url}` : 'No se adjuntó CV.'}\n\nRevisar en el panel de administración.`,
          });
        }
        console.log('Correos de notificación enviados.');
      } catch (emailError) {
        console.error('Error enviando correos con Resend:', emailError);
        // No fallamos la solicitud completa si solo fallan los correos, pero lo registramos.
        // Podrías decidir si esto debe ser un error crítico o no.
      }
    } else {
      console.warn('Resend no está configurado completamente, no se enviaron correos.');
    }

    return NextResponse.json({ message: 'Referencia enviada con éxito', data: insertedReferencia }, { status: 201 });

  } catch (error) {
    console.error('Error en el endpoint POST /api/referencias:', error);
    let errorMessage = 'Un error inesperado ocurrió.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
