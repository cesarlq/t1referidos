# Preservación de Formato en Campos de Texto

## Descripción

Este proyecto implementa un sistema para preservar el formato de texto (espacios, tabs, saltos de línea) en los campos de texto multiline de las vacantes. El sistema convierte automáticamente el texto plano a HTML antes de guardarlo en la base de datos y lo convierte de vuelta a texto plano para la edición.

## Campos Afectados

Los siguientes campos de las vacantes preservan el formato:
- `descripcion_puesto` (requerido)
- `responsabilidades` (opcional)
- `requisitos` (opcional)
- `beneficios` (opcional)

## Funcionamiento

### 1. Entrada de Datos (Formulario)
- El usuario escribe texto normal en los campos multiline
- Los espacios, tabs y saltos de línea se mantienen visualmente en el textarea
- Se muestra un helper text informando que el formato se preservará

### 2. Procesamiento al Guardar
- Antes de enviar a la base de datos, el texto se convierte a HTML usando `textToHtml()`
- Los espacios múltiples se convierten a `&nbsp;`
- Los tabs se convierten a 4 espacios no separables (`&nbsp;`)
- Los saltos de línea se convierten a `<br>`
- Los caracteres especiales HTML se escapan por seguridad

### 3. Almacenamiento
- El texto se guarda en la base de datos como HTML
- Ejemplo: `"Línea 1\n    Línea con tab"` → `"Línea 1<br>&nbsp;&nbsp;&nbsp;&nbsp;Línea con tab"`

### 4. Visualización
- Al mostrar las vacantes, se usa el componente `FormattedText`
- El HTML se renderiza usando `dangerouslySetInnerHTML`
- Se aplican estilos CSS para preservar el formato visual

### 5. Edición
- Al cargar datos para edición, se detecta si el contenido es HTML
- Si es HTML, se convierte de vuelta a texto plano usando `htmlToText()`
- El usuario ve el texto original con formato preservado

## Archivos Involucrados

### Utilidades
- `src/util/textToHtml.ts`: Funciones de conversión entre texto y HTML
  - `textToHtml()`: Convierte texto plano a HTML
  - `htmlToText()`: Convierte HTML a texto plano
  - `isHtmlContent()`: Detecta si un texto contiene HTML

### Componentes
- `src/components/FormattedText.tsx`: Componente para mostrar texto formateado
- `src/components/admin/VacanteForm.tsx`: Formulario con procesamiento de formato
- `src/components/VacanteCard.tsx`: Visualización de vacantes con formato

## Ejemplo de Uso

### Texto de Entrada
```
Responsabilidades principales:
    • Desarrollar aplicaciones web
    • Mantener código existente
        - Revisar pull requests
        - Documentar cambios

Requisitos técnicos:
    - React.js
    - Node.js
```

### HTML Generado
```html
Responsabilidades principales:<br>&nbsp;&nbsp;&nbsp;&nbsp;• Desarrollar aplicaciones web<br>&nbsp;&nbsp;&nbsp;&nbsp;• Mantener código existente<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Revisar pull requests<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Documentar cambios<br><br>Requisitos técnicos:<br>&nbsp;&nbsp;&nbsp;&nbsp;- React.js<br>&nbsp;&nbsp;&nbsp;&nbsp;- Node.js
```

### Visualización Final
El texto se muestra exactamente como fue escrito, preservando:
- Indentación con espacios y tabs
- Saltos de línea
- Estructura visual del contenido

## Seguridad

- Todos los caracteres HTML especiales se escapan automáticamente
- Solo se permiten tags básicos de formato (`<br>`, `&nbsp;`, etc.)
- No hay riesgo de inyección XSS ya que el contenido se procesa de forma controlada

## Compatibilidad

- Funciona con contenido existente (texto plano)
- Detecta automáticamente si el contenido ya está en formato HTML
- Migración transparente sin pérdida de datos
