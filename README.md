# Arquería Montada Orion — sitio web

Landing page de la escuela de arquería a caballo, publicada con GitHub Pages.

**URL:** https://juhiriart.github.io/web-arqueriamontadaorion/

Es un sitio estático (HTML + CSS + JS, sin frameworks ni build): lo que está en el repo es exactamente lo que se publica.

## Estructura

```
├── index.html          Inicio (landing)
├── clases.html         Niveles, clase de prueba y preguntas frecuentes
├── galeria.html        Galería con filtros y visor de fotos
├── contacto.html       Formulario, datos de contacto y mapa
├── 404.html            Página de error para rutas inexistentes
├── assets/
│   ├── css/styles.css  Estilos de todo el sitio (colores y fuentes arriba de todo)
│   ├── js/main.js      Menú móvil, galería y formulario
│   └── img/
│       ├── logo.svg    Logo provisorio (también es el favicon)
│       └── galeria/    Fotos (por ahora son placeholders .svg)
└── .nojekyll           Le indica a GitHub Pages que sirva los archivos tal cual
```

## Ver el sitio en la compu

- Rápido: doble clic en `index.html`.
- Con servidor local (más parecido a GitHub Pages): desde esta carpeta correr
  `python -m http.server 8000` y abrir http://localhost:8000
- En VS Code también sirve la extensión **Live Server**.

## Publicar en GitHub Pages

1. Subir los cambios a la rama `main`:
   ```
   git add .
   git commit -m "Primera versión del sitio"
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)** → **Save**
3. En uno o dos minutos el sitio queda online en la URL de arriba. Cada `push` a `main` lo actualiza solo.

## Pendientes (contenido de prueba)

Todos los textos, datos y fotos son provisorios. Para dejarlo listo:

- [ ] **Fotos:** guardar las fotos reales en `assets/img/galeria/` (`.jpg` o `.webp`, ~1600 px de ancho, idealmente < 300 KB) y actualizar las rutas en `galeria.html` (atributos `href` y `src`) y en `index.html`.
- [ ] **Datos de contacto:** WhatsApp, email, Instagram, dirección y horarios. Están en `contacto.html` y en el footer de **cada** página.
- [ ] **Formulario:** GitHub Pages no puede enviar mails por sí solo. Crear un formulario gratis en [Formspree](https://formspree.io) y reemplazar `TU_ID_DE_FORMSPREE` en `contacto.html`. Mientras tanto el formulario muestra un aviso de prueba.
- [ ] **Mapa:** en `contacto.html` reemplazar el bloque `map-placeholder` por el iframe de Google Maps (las instrucciones están en un comentario en el mismo archivo).
- [ ] **Textos:** revisar niveles, duraciones, edades, precios y preguntas frecuentes en `clases.html`.
- [ ] **Logo:** reemplazar `assets/img/logo.svg` por el logo definitivo.
- [ ] **Foto de portada (opcional):** en `styles.css` hay un bloque comentado para poner una foto de fondo en el inicio.

## Agregar una página nueva

1. Duplicar una página existente (por ejemplo `clases.html`) y renombrarla, ej. `nosotros.html`.
2. Cambiar `<title>`, la `description` y el contenido dentro de `<main>`.
3. En el menú, mover `aria-current="page"` al link de la página nueva.
4. Agregar el link `<li><a href="nosotros.html">Nosotros</a></li>` en el menú (header) y en el footer de **todas** las páginas.

> El header y el footer están repetidos en cada HTML a propósito: así el sitio funciona abriendo los archivos directamente, sin servidor ni herramientas extra. Si el sitio crece mucho, conviene pasar a un generador (por ejemplo Jekyll, que GitHub Pages soporta) para no repetirlos.

## Dominio propio (opcional)

Si más adelante se usa un dominio (ej. `arqueriamontadaorion.com.ar`):

1. Configurarlo en **Settings → Pages → Custom domain** (GitHub crea el archivo `CNAME`).
2. En `404.html` cambiar `<base href="/web-arqueriamontadaorion/">` por `<base href="/">`.
