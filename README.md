# Jinetes de Orión — Escuela de Arquería Montada

Sitio web de la escuela de arquería montada de San Carlos de Bariloche, publicado con GitHub Pages.
El diseño replica el que está hecho en Canva.

**URL:** https://juhiriart.github.io/web-arqueriamontadaorion/

Es un sitio estático (HTML + CSS + JS, sin frameworks ni build): lo que está en el repo es exactamente lo que se publica.

## Estructura

```
├── index.html          Inicio: título, foto principal, historia y "Reservá tu clase"
├── nosotros.html       Quiénes somos, misión y visión
├── clases.html         Arquería, equitación y modalidades (horarios)
├── eventos.html        Próximas fechas (carrusel de flyers)
├── propuestas.html     Clínica deportiva, desarrollo personal y experiencia cultural
├── bienestar.html      Bienestar equino + link al manifiesto (PDF)
├── galeria.html        Galería de fotos con visor
├── contacto.html       Conectate con nosotros
├── 404.html            Página de error para rutas inexistentes
├── assets/
│   ├── css/styles.css  Estilos (colores y fuentes al principio del archivo)
│   ├── js/main.js      Menú móvil, desplegables, carrusel y visor de fotos
│   └── img/
│       ├── logo-jinetes-de-orion.png, favicon.png, apple-touch-icon.png
│       ├── hero.jpg, nosotros-*.jpg, clases.jpg, bienestar.jpg, grupo.jpg
│       ├── eventos/    Flyers de próximas fechas
│       └── galeria/    Fotos de la galería (foto-01.jpg … foto-10.jpg)
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
   git commit -m "Sitio con el diseño de Canva"
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)** → **Save**
3. En uno o dos minutos el sitio queda online en la URL de arriba. Cada `push` a `main` lo actualiza solo.

## Pendientes

- [ ] **Manifiesto de Bienestar Equino:** subir el PDF como `assets/docs/manifiesto-bienestar-equino.pdf` (el link de `bienestar.html` ya apunta ahí; hasta entonces da error).
- [ ] **Fotos en mejor calidad:** las imágenes salieron del PDF de Canva y algunas de la galería son chicas (300–400 px). Si se reemplazan por los originales, mantener el mismo nombre de archivo y no hace falta tocar el HTML.
- [ ] **Logo en alta resolución:** idealmente un PNG o SVG de al menos 600 px para `assets/img/logo-jinetes-de-orion.png`.
- [ ] **Idioma:** el selector se ve, pero por ahora solo hay español (inglés figura como "Próximamente").
- [ ] **Próximas fechas:** los flyers son de noviembre; actualizarlos cuando pasen las fechas.

## Cambiar contenido

- **Textos:** están directamente en cada HTML, dentro de `<main>`.
- **Flyers de eventos:** en `eventos.html`, cada flyer es un bloque `<figure class="carousel-item">`. Para sumar uno, copiar un bloque y cambiar la imagen, el `alt` (descripción del flyer) y el `figcaption`. Si hay más de los que entran en pantalla, aparecen las flechas del carrusel.
- **Fotos de la galería:** en `galeria.html`, un bloque `<figure class="gallery-item">` por foto.
- **Datos de contacto:** están en `contacto.html` y en el footer de **cada** página.

## Agregar una página nueva

1. Duplicar una página existente (por ejemplo `propuestas.html`) y renombrarla.
2. Cambiar `<title>`, la `description` y el contenido dentro de `<main>`.
3. En el menú, mover `aria-current="page"` al link de la página nueva.
4. Agregar el link en el menú de **todas** las páginas (y en `404.html`).

> El header y el footer están repetidos en cada HTML a propósito: así el sitio funciona abriendo los archivos directamente, sin servidor ni herramientas extra.

## Dominio propio (opcional)

Si más adelante se usa un dominio (ej. `jinetesdeorion.com.ar`):

1. Configurarlo en **Settings → Pages → Custom domain** (GitHub crea el archivo `CNAME`).
2. En `404.html` cambiar `<base href="/web-arqueriamontadaorion/">` por `<base href="/">`.
3. Actualizar la URL de `og:image` en el `<head>` de las páginas (es la imagen que aparece al compartir el link por WhatsApp o redes).
