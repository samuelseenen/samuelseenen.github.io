// =========================================================
// main.js: idioma, tema claro/oscuro, texto dividido y
// botón de copiar email. No depende de GSAP.
// =========================================================

(function () {
  const root = document.documentElement;
  const translations = window.TRANSLATIONS;

  /* ---------- Utilidades compartidas con los otros scripts ---------- */
  window.site = {
    lang: root.lang || 'es',

    // Devuelve el texto de una clave en el idioma actual
    t(key) {
      return (translations[this.lang] && translations[this.lang][key]) || translations.es[key] || '';
    },
  };

  /* ---------- Texto dividido ----------
     Convierte "Hola mundo" en palabras (o letras) envueltas en <span>
     para poder animarlas una a una. Los lectores de pantalla leen
     el texto completo desde una copia oculta (.sr-only). */
  function splitText(el, text) {
    const mode = el.dataset.split; // 'words' o 'chars'
    const words = text.trim().split(/\s+/);

    const visual = words
      .map((word) => {
        const inner = mode === 'chars' ? [...word].map((ch) => `<span class="c">${ch}</span>`).join('') : `<span class="c">${word}</span>`;
        return `<span class="w">${inner}</span>`;
      })
      .join(' ');

    el.innerHTML = `<span class="sr-only">${text}</span><span aria-hidden="true">${visual}</span>`;
    el.classList.add('is-split');
  }

  document.querySelectorAll('[data-split]').forEach((el) => splitText(el, el.textContent));

  /* ---------- Idioma ---------- */
  function applyLanguage(lang, { animate = false } = {}) {
    site.lang = lang;
    root.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const text = site.t(el.dataset.i18n);
      if (el.hasAttribute('data-split')) {
        splitText(el, text);
        // Al cambiar de idioma, los títulos se muestran sin volver a animarse
        if (!animate) el.classList.add('done');
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', site.t(el.dataset.i18nAria));
    });

    document.title = site.t('meta.title');
    document.querySelector('meta[name="description"]').setAttribute('content', site.t('meta.description'));

    syncThemeLabel();
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  document.querySelector('.lang').addEventListener('click', () => {
    const next = site.lang === 'es' ? 'en' : 'es';
    try {
      localStorage.setItem('lang', next);
    } catch (e) {}
    applyLanguage(next);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeLabel() {
    const isDark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-label', site.t(isDark ? 'nav.themeToLight' : 'nav.themeToDark'));
    themeMeta.setAttribute('content', isDark ? '#0d0f12' : '#f3f4f6');
  }

  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', root.dataset.theme);
    } catch (e) {}
    syncThemeLabel();
  }

  // El nuevo tema se expande en círculo desde el botón (View Transitions API).
  // Si el navegador no lo soporta, el cambio es instantáneo.
  themeBtn.addEventListener('click', () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
      toggleTheme();
      return;
    }

    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(toggleTheme).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  });

  /* ---------- Copiar email ---------- */
  const copyBtn = document.querySelector('.copy');
  const copyLabel = copyBtn.querySelector('.copy-label');
  const copyStatus = document.querySelector('[data-copy-status]');
  let copyTimer;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
    } catch (e) {
      return;
    }
    copyBtn.classList.add('done');
    copyLabel.textContent = site.t('contact.copied');
    copyStatus.textContent = site.t('contact.copied');
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyBtn.classList.remove('done');
      copyLabel.textContent = site.t('contact.copy');
      copyStatus.textContent = '';
    }, 2000);
  });

  /* ---------- Enlaces internos con desplazamiento suave ---------- */
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  /* ---------- Año del pie ---------- */
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  /* ---------- Arranque ---------- */
  // Traduce al idioma guardado (o el del navegador). En la primera carga
  // los títulos sí se animan, por eso animate: true.
  applyLanguage(site.lang, { animate: true });
  root.classList.remove('i18n-pending');
})();
