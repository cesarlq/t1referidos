/**
 * Convierte texto plano con espacios, tabs y saltos de línea a HTML
 * preservando el formato original
 */
export function textToHtml(text: string): string {
  if (!text) return '';
  
  return text
    // Escapar caracteres HTML especiales
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    // Convertir tabs a espacios (4 espacios por tab)
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    // Convertir múltiples espacios consecutivos a &nbsp;
    .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))
    // Convertir saltos de línea a <br>
    .replace(/\n/g, '<br>')
    // Preservar espacios al inicio de línea
    .replace(/^( +)/gm, (match) => '&nbsp;'.repeat(match.length));
}

/**
 * Convierte HTML básico de vuelta a texto plano
 * para edición en el formulario
 */
export function htmlToText(html: string): string {
  if (!html) return '';
  
  return html
    // Convertir <br> a saltos de línea
    .replace(/<br\s*\/?>/gi, '\n')
    // Convertir &nbsp; a espacios
    .replace(/&nbsp;/g, ' ')
    // Desescapar caracteres HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Verifica si un texto contiene HTML
 */
export function isHtmlContent(text: string): boolean {
  if (!text) return false;
  return /<br\s*\/?>|&nbsp;|&lt;|&gt;|&quot;|&#39;|&amp;/.test(text);
}
