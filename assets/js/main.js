/* ==========================================================================
   Jinetes de Orión — scripts del sitio
   ========================================================================== */
(function () {
  'use strict';

  /* --- Menú móvil ------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  const setNavOpen = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setNavOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* --- Desplegables (Nosotros, Idioma) ---------------------------------- */
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

  /* --- Carrusel (Próximas fechas) --------------------------------------- */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');

    // Las flechas solo aparecen si hay más flyers de los que entran en pantalla
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.hidden = track.scrollLeft <= 4;
      next.hidden = track.scrollLeft >= max - 4;
    };

    const page = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.9 });

    prev.addEventListener('click', () => page(-1));
    next.addEventListener('click', () => page(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* --- Visor de fotos (Galería y flyers de eventos) ---------------------- */
  const lightbox = document.getElementById('lightbox');
  const items = Array.from(document.querySelectorAll('[data-lightbox-item]'));

  if (lightbox && items.length && typeof lightbox.showModal === 'function') {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let current = 0;

    const show = (index) => {
      current = (index + items.length) % items.length;
      const item = items[current];
      const thumb = item.querySelector('img');
      const text = item.querySelector('figcaption');
      img.src = item.querySelector('a').getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = text ? text.textContent : '';
    };

    items.forEach((item, index) => {
      item.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        show(index);
        lightbox.showModal();
      });
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
