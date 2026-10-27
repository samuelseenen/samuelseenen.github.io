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

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      el.setAttribute('alt', site.t(el.dataset.i18nAlt));
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

  /* ---------- Línea del tiempo de la experiencia ----------
     Cada etapa se coloca y se mide según sus fechas, de 2021 a hoy. La
     etapa actual llega siempre hasta el día de hoy. */
  const chrono = document.querySelector('.chrono');
  const CHRONO_START = new Date(2021, 0, 1);
  const today = new Date();

  // "2023-10" → 15 de octubre de 2023 (mitad de mes, para que dos etapas
  // seguidas que comparten mes no se monten una encima de otra)
  const midMonth = (ym) => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m - 1, 15);
  };
  const toPercent = (date) => ((date - CHRONO_START) / (today - CHRONO_START)) * 100;

  chrono.querySelectorAll('.seg').forEach((seg) => {
    const from = toPercent(midMonth(seg.dataset.from));
    const to = seg.dataset.to ? toPercent(midMonth(seg.dataset.to)) : 100;
    seg.style.setProperty('--l', `${from}%`);
    seg.style.setProperty('--w', `${Math.max(0, to - from)}%`);
  });

  // Años en el eje y la marca de "hoy"
  const axis = chrono.querySelector('.chrono-axis');
  for (let year = CHRONO_START.getFullYear(); year <= today.getFullYear(); year++) {
    const tick = document.createElement('span');
    tick.textContent = year;
    tick.style.left = `${toPercent(new Date(year, 0, 1))}%`;
    if (year === CHRONO_START.getFullYear()) tick.className = 'first';
    axis.append(tick);
  }
  const todayTick = document.createElement('span');
  todayTick.className = 'today';
  todayTick.dataset.i18n = 'exp.today';
  todayTick.textContent = site.t('exp.today');
  todayTick.style.left = '100%';
  axis.append(todayTick);

  // Pasar el ratón por una etapa resalta su trabajo en la lista, y al revés
  const highlight = (job, on) => {
    document.querySelectorAll(`[data-job="${job}"]`).forEach((el) => el.classList.toggle('is-hl', on));
  };
  document.querySelectorAll('.seg[data-job], .job[data-job]').forEach((el) => {
    el.addEventListener('pointerenter', () => highlight(el.dataset.job, true));
    el.addEventListener('pointerleave', () => highlight(el.dataset.job, false));
  });

  // Duración de cada trabajo, contando el mes de inicio y el de fin (como
  // LinkedIn). El actual se cuenta hasta este mes.
  function formatDuration(months) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    const es = site.lang === 'es';
    const parts = [];
    if (y) parts.push(es ? `${y} ${y === 1 ? 'año' : 'años'}` : `${y} ${y === 1 ? 'year' : 'years'}`);
    if (m) parts.push(es ? `${m} ${m === 1 ? 'mes' : 'meses'}` : `${m} ${m === 1 ? 'month' : 'months'}`);
    return parts.join(es ? ' y ' : ', ');
  }

  function updateDurations() {
    document.querySelectorAll('.dur').forEach((el) => {
      const [y1, m1] = el.dataset.from.split('-').map(Number);
      const [y2, m2] = el.dataset.to ? el.dataset.to.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
      el.textContent = formatDuration((y2 - y1) * 12 + (m2 - m1) + 1);
    });
  }

  updateDurations();
  document.addEventListener('langchange', updateDurations);

  /* ---------- Capturas del proyecto destacado ----------
     Cada miniatura muestra su captura en la imagen grande */
  const shotMain = document.querySelector('.shot-main');
  const thumbs = document.querySelectorAll('.thumb');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      shotMain.src = thumb.dataset.src;
      shotMain.dataset.i18nAlt = thumb.dataset.altKey;
      shotMain.alt = site.t(thumb.dataset.altKey);
      thumbs.forEach((t) => {
        const current = t === thumb;
        t.classList.toggle('is-current', current);
        t.setAttribute('aria-pressed', String(current));
      });
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

  /* ---------- Menú en móvil ---------- */
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.menu-btn');

  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // Escape cierra el menú y devuelve el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menuBtn.focus();
    }
  });

  // Al pasar a escritorio el menú deja de existir como panel
  matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

  /* ---------- Enlaces internos con desplazamiento suave ---------- */
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      closeMenu();

      // La experiencia está fijada durante el túnel de la portada (escritorio):
      // se baja hasta el final del túnel, cuando ya está en su sitio
      const pinned = window.ScrollTrigger && ScrollTrigger.getById(target.id);
      if (pinned) window.scrollTo({ top: pinned.end, behavior });
      else target.scrollIntoView({ behavior });

      // El foco del teclado pasa a la sección de destino
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
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
