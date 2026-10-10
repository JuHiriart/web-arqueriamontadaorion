/* ==========================================================================
   Jinetes de Orión — scripts del sitio
   ========================================================================== */
(function () {
  'use strict';

  // Repositorio de GitHub: último recurso para listar las fotos de las carpetas
  const REPO = { owner: 'JuHiriart', name: 'web-arqueriamontadaorion', branch: 'main' };

  // Raíz del sitio, calculada desde este archivo (sirve igual para las páginas en /en/)
  const SITE_ROOT = new URL('../../', document.currentScript.src);

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'es';
  const T = {
    es: {
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      showPhoto: (i, n) => `Ver foto ${i} de ${n}`,
      slide: 'diapositiva',
      slideOf: (i, n) => `${i} de ${n}`,
      photo: 'Foto de Jinetes de Orión',
      flyer: 'Flyer de próxima fecha',
    },
    en: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      showPhoto: (i, n) => `Show photo ${i} of ${n}`,
      slide: 'slide',
      slideOf: (i, n) => `${i} of ${n}`,
      photo: 'Jinetes de Orión photo',
      flyer: 'Upcoming date flyer',
    },
  }[LANG];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Menú móvil ------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  const setNavOpen = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
    nav.classList.toggle('is-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setNavOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* --- Desplegable de idioma -------------------------------------------- */
  const dropdowns = Array.from(document.querySelectorAll('[data-dropdown]'));

  const closeDropdowns = (except) => {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove('is-open');
      dd.querySelector('[data-dropdown-toggle]').setAttribute('aria-expanded', 'false');
    });
  };

  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('[data-dropdown-toggle]');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(dd);
      btn.setAttribute('aria-expanded', String(open));
      dd.classList.toggle('is-open', open);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown]')) closeDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openDropdown = dropdowns.find((dd) => dd.classList.contains('is-open'));
    if (openDropdown) {
      closeDropdowns();
      openDropdown.querySelector('[data-dropdown-toggle]').focus();
    } else if (nav && nav.classList.contains('is-open')) {
      setNavOpen(false);
      toggle.focus();
    }
  });

  /* --- Año en el footer ------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* --- Fotos cargadas desde carpetas (inicio, galería y eventos) --------
     Las imágenes de assets/img/<carpeta>/ se listan, en orden:
       1. del listado de la carpeta (servidor local, siempre al día),
       2. de datos/<carpeta>.json (lo genera GitHub Actions al publicar),
       3. de la API de GitHub (por si el sitio se publicó sin ese paso).
     Un .txt con el mismo nombre que la foto (y .en.txt en inglés) es su descripción. */
  const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
  const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
  const fileName = (url) => decodeURIComponent(new URL(url).pathname.split('/').pop());
  const textUrls = (src) => {
    const base = src.replace(/\.[^./]+$/, '');
    return LANG === 'en' ? [`${base}.en.txt`, `${base}.txt`] : [`${base}.txt`];
  };

  async function fromDirectoryListing(folder) {
    const dir = new URL(`assets/img/${folder}/`, SITE_ROOT);
    const res = await fetch(dir, { cache: 'no-store' });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return null;
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const files = new Set();
    doc.querySelectorAll('a[href]').forEach((a) => {
      const url = new URL(a.getAttribute('href'), dir);
      const rest = url.pathname.slice(dir.pathname.length);
      if (url.origin === dir.origin && url.pathname.startsWith(dir.pathname) && rest && !rest.includes('/')) {
        files.add(url.origin + url.pathname);
      }
    });
    return withTexts([...files]);
  }

  async function fromManifest(folder) {
    const res = await fetch(new URL(`datos/${folder}.json`, SITE_ROOT), { cache: 'no-cache' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.map((f) => ({
      src: new URL(f.src, SITE_ROOT).href,
      mini: new URL(f.mini || f.src, SITE_ROOT).href,
      ancho: f.ancho,
      alto: f.alto,
      texto: (LANG === 'en' && f.texto_en) || f.texto || '',
    }));
  }

  async function fromGitHubApi(folder) {
    const api = `https://api.github.com/repos/${REPO.owner}/${REPO.name}/contents/assets/img/${folder}?ref=${REPO.branch}`;
    const res = await fetch(api, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) return null;
    const files = (await res.json())
      .filter((f) => f.type === 'file')
      .map((f) => new URL(f.path, SITE_ROOT).href);
    return withTexts(files);
  }

  // Arma la lista de imágenes y lee las descripciones .txt que las acompañan
  async function withTexts(files) {
    const texts = new Set(files.filter((f) => /\.txt$/i.test(f)));
    return Promise.all(
      files
        .filter((f) => IMG_RE.test(f))
        .map(async (src) => {
          const txt = textUrls(src).find((u) => texts.has(u));
          let texto = '';
          if (txt) {
            try {
              const res = await fetch(txt);
              if (res.ok) texto = (await res.text()).trim();
            } catch (err) {
              /* sin descripción */
            }
          }
          return { src, mini: src, texto };
        })
    );
  }

  const listCache = {};

  function listImages(folder) {
    if (!listCache[folder]) {
      listCache[folder] = (async () => {
        for (const source of [fromDirectoryListing, fromManifest, fromGitHubApi]) {
          try {
            const list = await source(folder);
            if (list && list.length) {
              return list.sort((a, b) => collator.compare(fileName(a.src), fileName(b.src)));
            }
          } catch (err) {
            /* probar la siguiente fuente */
          }
        }
        return [];
      })();
    }
    return listCache[folder];
  }

  // Descripción: el .txt si existe; si no, el nombre del archivo cuando es descriptivo
  function describe(item, base, index) {
    if (item.texto) return item.texto;
    const name = fileName(item.src)
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();
    const words = name.split(/\s+/).filter((w) => /^[a-záéíóúñü]{3,}$/i.test(w));
    if (words.length >= 2 && !/^(img|dsc|mg|whatsapp|image|imagen|foto|photo|pxl|slide)$/i.test(words[0])) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return `${base} ${index + 1}`;
  }

  /* --- Slideshow de fotos (inicio) -------------------------------------- */
  function createSlide(item, index, total) {
    const slide = document.createElement('figure');
    slide.className = 'slide' + (index === 0 ? ' is-active' : '');
    slide.setAttribute('aria-roledescription', T.slide);
    slide.setAttribute('aria-label', T.slideOf(index + 1, total));
    if (index > 0) slide.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = describe(item, T.photo, index);
    if (index > 0) img.loading = 'lazy';
    if (item.ancho && item.alto) {
      img.width = item.ancho;
      img.height = item.alto;
    }
    slide.appendChild(img);

    if (item.texto) {
      const caption = document.createElement('figcaption');
      caption.textContent = item.texto;
      slide.appendChild(caption);
    }
    return slide;
  }

  function startSlideshow(slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const dotsWrap = slideshow.querySelector('[data-slide-dots]');
    const pauseBtn = slideshow.querySelector('[data-slide-pause]');
    const INTERVAL = 6000;
    let current = 0;
    let timer = null;
    let paused = reduceMotion;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', T.showPhoto(i + 1, slides.length));
      dot.addEventListener('click', () => {
        go(i);
        start();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function go(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (!paused && slides.length > 1) timer = setInterval(() => go(current + 1), INTERVAL);
    }

    slideshow.querySelector('[data-slide-prev]').addEventListener('click', () => {
      go(current - 1);
      start();
    });

    slideshow.querySelector('[data-slide-next]').addEventListener('click', () => {
      go(current + 1);
      start();
    });

    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', String(paused));
      start();
    });

    // Se detiene mientras el mouse o el foco están sobre las fotos
    slideshow.addEventListener('mouseenter', stop);
    slideshow.addEventListener('mouseleave', start);
    slideshow.addEventListener('focusin', stop);
    slideshow.addEventListener('focusout', start);

    pauseBtn.setAttribute('aria-pressed', String(paused));
    go(0);
    start();
  }

  document.querySelectorAll('[data-slideshow]').forEach(async (slideshow) => {
    const items = await listImages(slideshow.dataset.slideshow);
    if (!items.length) {
      slideshow.hidden = true;
      return;
    }
    const holder = slideshow.querySelector('[data-slides]');
    items.forEach((item, i) => holder.appendChild(createSlide(item, i, items.length)));
    slideshow.classList.remove('is-loading');
    startSlideshow(slideshow);
  });

  /* --- Carruseles con flechas (flyers y fotos) -------------------------- */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');

    // Las flechas solo aparecen si hay más elementos de los que entran
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.hidden = track.scrollLeft <= 4;
      next.hidden = track.scrollLeft >= max - 4;
    };

    const page = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.9 });

    prev.addEventListener('click', () => page(-1));
    next.addEventListener('click', () => page(1));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('fotos:cargadas', update);
    window.addEventListener('resize', update);
    update();
  });

  /* --- Galería y carruseles que se llenan desde una carpeta -------------- */
  function createFigure(item, index, base, className) {
    const figure = document.createElement('figure');
    figure.className = className;
    figure.setAttribute('data-lightbox-item', '');

    const link = document.createElement('a');
    link.href = item.src;

    const img = document.createElement('img');
    img.src = item.mini;
    img.alt = describe(item, base, index);
    img.loading = 'lazy';
    img.decoding = 'async';
    if (item.ancho && item.alto) {
      img.width = item.ancho;
      img.height = item.alto;
    }

    const caption = document.createElement('figcaption');
    caption.className = 'sr-only';
    caption.textContent = img.alt;

    link.appendChild(img);
    figure.append(link, caption);
    return figure;
  }

  const shuffle = (list) => {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  document.querySelectorAll('[data-fotos]').forEach(async (container) => {
    const folder = container.dataset.fotos;
    const block = container.closest('[data-fotos-bloque]') || container.parentElement;
    const empty = block.querySelector('[data-fotos-vacio]');
    const more = block.querySelector('[data-ver-mas]');
    const base = folder === 'eventos' ? T.flyer : T.photo;
    const className = container.dataset.clase || 'gallery-item';

    let items = await listImages(folder);
    container.classList.remove('is-loading');

    if (!items.length) {
      const carousel = container.closest('[data-carousel]');
      (carousel || container).hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    if ('aleatorio' in container.dataset) items = shuffle(items.slice());
    if (container.dataset.cantidad) items = items.slice(0, Number(container.dataset.cantidad));

    const perPage = Number(container.dataset.porPagina) || items.length;
    let shown = 0;

    const showMore = () => {
      const fragment = document.createDocumentFragment();
      items.slice(shown, shown + perPage).forEach((item, k) => {
        fragment.appendChild(createFigure(item, shown + k, base, className));
      });
      container.appendChild(fragment);
      shown = Math.min(items.length, shown + perPage);
      if (more) more.hidden = shown >= items.length;
      container.dispatchEvent(new CustomEvent('fotos:cargadas'));
    };

    if (more) more.addEventListener('click', showMore);
    showMore();
  });

  /* --- Visor de fotos --------------------------------------------------- */
  // Cada [data-lightbox-group] (galería, carrusel) se recorre por separado
  const lightbox = document.getElementById('lightbox');

  if (lightbox && typeof lightbox.showModal === 'function') {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let list = [];
    let current = 0;

    const show = (index) => {
      current = (index + list.length) % list.length;
      const item = list[current];
      const thumb = item.querySelector('img');
      const text = item.querySelector('figcaption');
      img.src = item.querySelector('a').href;
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = text ? text.textContent : '';
    };

    // Delegación: funciona también con las fotos que se agregan después
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-lightbox-item] a');
      if (!link) return;
      e.preventDefault();
      const item = link.closest('[data-lightbox-item]');
      const group = item.closest('[data-lightbox-group]') || document;
      list = Array.from(group.querySelectorAll('[data-lightbox-item]'));
      show(list.indexOf(item));
      lightbox.showModal();
    });

    lightbox.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
    lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());

    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    // Click en el fondo oscuro cierra el visor
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
  }
})();
