/* ==========================================================================
   Arquería Montada Orion — scripts del sitio
   ========================================================================== */
(function () {
  'use strict';

  /* --- Menú móvil ------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* --- Año en el footer ------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* --- Galería: filtros ------------------------------------------------- */
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((item) => {
        item.hidden = filter !== 'todas' && item.dataset.category !== filter;
      });
    });
  });

  /* --- Galería: visor de fotos ------------------------------------------ */
  const lightbox = document.getElementById('lightbox');

  if (lightbox && items.length && typeof lightbox.showModal === 'function') {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let current = 0;

    const visibleItems = () => items.filter((item) => !item.hidden);

    const show = (item) => {
      const link = item.querySelector('a');
      const thumb = item.querySelector('img');
      const text = item.querySelector('figcaption');
      img.src = link.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = text ? text.textContent : '';
    };

    const step = (delta) => {
      const list = visibleItems();
      current = (current + delta + list.length) % list.length;
      show(list[current]);
    };

    items.forEach((item) => {
      item.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        current = visibleItems().indexOf(item);
        show(item);
        lightbox.showModal();
      });
    });

    lightbox.querySelector('[data-prev]').addEventListener('click', () => step(-1));
    lightbox.querySelector('[data-next]').addEventListener('click', () => step(1));
    lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());

    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    // Click en el fondo oscuro cierra el visor
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
  }

  /* --- Formulario de contacto ------------------------------------------- */
  // Pensado para Formspree (https://formspree.io): GitHub Pages no tiene backend.
  const form = document.getElementById('contact-form');

  if (form) {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('[type="submit"]');

    const setStatus = (state, message) => {
      status.dataset.state = state;
      status.textContent = message;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (form.action.includes('TU_ID_DE_FORMSPREE')) {
        setStatus('info', 'Formulario de prueba: todavía no está conectado a un servicio de envío (ver README).');
        return;
      }

      submit.disabled = true;
      setStatus('info', 'Enviando…');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(response.statusText);
        form.reset();
        setStatus('ok', '¡Gracias! Recibimos tu mensaje y te respondemos a la brevedad.');
      } catch (err) {
        setStatus('error', 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.');
      } finally {
        submit.disabled = false;
      }
    });
  }
})();
