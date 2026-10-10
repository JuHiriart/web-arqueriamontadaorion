# Jinetes de Orión — Escuela de Arquería Montada

Sitio web de la escuela de arquería montada de San Carlos de Bariloche, publicado con GitHub Pages, en español y en inglés.

**URL:** https://juhiriart.github.io/web-arqueriamontadaorion/

## Cargar fotos nuevas (inicio, galería y próximas fechas)

Estas fotos se cargan solas desde su carpeta. No hace falta tocar ningún HTML.

| Qué | Carpeta |
| --- | --- |
| Slideshow del inicio | `assets/img/inicio/` |
| Galería | `assets/img/galeria/` |
| Próximas fechas (flyers) | `assets/img/eventos/` |

1. Copiá la foto en la carpeta (también se puede hacer desde la web de GitHub: entrar a la carpeta → **Add file → Upload files**).
2. Subí los cambios a `main`. En uno o dos minutos aparece en el sitio.

Para sacar una foto, borrala de la carpeta (y su `.txt`, si tiene).

### Descripciones de las fotos

Cada foto puede tener un archivo de texto **con el mismo nombre** al lado:

```
assets/img/eventos/2-cordoba-curso-inicial.jpg
assets/img/eventos/2-cordoba-curso-inicial.txt      ← descripción en español
assets/img/eventos/2-cordoba-curso-inicial.en.txt   ← descripción en inglés (opcional)
```

- **Inicio:** el texto aparece como leyenda sobre la foto ("Tiro con arco a caballo en el bosque").
- **Galería y eventos:** el texto se lee en el visor ampliado y lo usan los lectores de pantalla.
- Si no hay `.txt`, la foto igual aparece: sin leyenda y con una descripción genérica ("Foto de Jinetes de Orión 12").
- Se editan con cualquier editor de texto (Bloc de notas, VS Code). Guardar en UTF-8 para que salgan bien las tildes.

### Otros detalles

- **Orden:** se muestran por nombre de archivo (`1-...`, `2-...`, etc.). Para los flyers conviene numerarlos en el orden de las fechas, por ejemplo `1-pucon.jpg`, `2-cordoba.jpg`.
- **Tamaño:** no hace falta achicar las fotos. Al publicar, las muy grandes se reducen solas y se generan miniaturas livianas. Igual, cuanto más livianas se suban, más rápido se ve todo. Para el inicio conviene usar fotos horizontales.
- **Formatos:** `.jpg`, `.png` o `.webp`.
- **El inicio** muestra además 12 fotos de la galería elegidas al azar y todos los flyers.

## Estructura

```
├── index.html, nosotros.html, clases.html, eventos.html,
│   propuestas.html, bienestar.html, galeria.html, contacto.html   Páginas en español
├── en/                     Las mismas páginas en inglés
├── 404.html                Página de error para rutas inexistentes
├── assets/
│   ├── css/styles.css      Estilos (colores, tamaños de letra y espaciados al principio)
│   ├── js/main.js          Menú, carruseles, visor y carga de fotos desde carpetas
│   ├── docs/               Manifiesto de Bienestar Equino (PDF)
│   ├── fonts/              Cinzel (títulos) y Lato (texto), licencia SIL OFL
│   └── img/
│       ├── inicio/         ← fotos del slideshow del inicio (se cargan solas)
│       ├── galeria/        ← fotos de la galería (se cargan solas)
│       ├── eventos/        ← flyers de próximas fechas (se cargan solos)
│       └── ...             Fotos fijas de cada sección, logo y favicon
├── scripts/preparar_imagenes.py   Arma las listas de fotos al publicar
└── .github/workflows/publicar.yml Publica el sitio en cada push a main
```

## Ver el sitio en la compu

Las fotos de la galería y de eventos necesitan un servidor local (abriendo el HTML con doble clic no se pueden leer las carpetas). Desde esta carpeta:

```
python -m http.server 8000
```

y abrir http://localhost:8000. Lo que se agregue a las carpetas aparece al recargar la página. En VS Code también sirve la extensión **Live Server**.

## Publicar en GitHub Pages

**Una sola vez:** en GitHub, **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

Después, cada `push` a `main` publica el sitio solo (se puede ver el progreso en la pestaña **Actions**):

```
git add .
git commit -m "Describir el cambio"
git push
```

## Cambiar textos

- Los textos están en cada HTML, dentro de `<main>`. **Cada página existe en español (raíz) y en inglés (`en/`)**: si se cambia un texto, hay que cambiarlo en las dos.

  | Español | Inglés |
  | --- | --- |
  | `index.html` | `en/index.html` |
  | `nosotros.html` | `en/about.html` |
  | `clases.html` | `en/lessons.html` |
  | `eventos.html` | `en/events.html` |
  | `propuestas.html` | `en/proposals.html` |
  | `bienestar.html` | `en/equine-welfare.html` |
  | `galeria.html` | `en/gallery.html` |
  | `contacto.html` | `en/contact.html` |

- Los datos de contacto también están en el footer de **todas** las páginas.
- **Tipografías:** se cambian al principio de `assets/css/styles.css` (`--font` para el texto y `--font-display` para los títulos).

## Pendientes

- [ ] **Logo en alta resolución:** el archivo "Logo Blanco sin fondo.png" vino sin transparencia (es blanco sobre blanco) y no se puede usar. Mientras tanto se usa el logo extraído del Canva. Exportarlo de nuevo como PNG con fondo transparente y reemplazar `assets/img/logo-jinetes-de-orion.png`.

## Dominio propio (opcional)

1. Configurarlo en **Settings → Pages → Custom domain**.
2. En `404.html` cambiar `<base href="/web-arqueriamontadaorion/">` por `<base href="/">`.
3. Actualizar las URLs de `og:image` y `hreflang` en el `<head>` de las páginas.
