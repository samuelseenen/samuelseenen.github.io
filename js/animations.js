// =========================================================
// animations.js: animaciones de toda la página con GSAP y
// ScrollTrigger.
//
// Todo lo que se mueve está dentro de gsap.matchMedia(), así
// que si el usuario tiene activado "reducir movimiento" en su
// sistema, no se ejecuta y la página se ve completa y estática.
// =========================================================

(function () {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  let tunnelPin = null; // ScrollTrigger del túnel (solo en escritorio con movimiento)

  // Posición de scroll para elementos de la experiencia: mientras dura el túnel
  // la sección está fijada, así que todo lo que hay dentro llega más tarde
  const afterTunnel = (edge, viewport) => () => {
    const delay = tunnelPin ? tunnelPin.end - tunnelPin.start : 0;
    return `${edge}+=${delay} ${viewport}`;
  };

  /* ---------- Bloques .reveal: aparecen al entrar en pantalla ----------
     (la transición está en styles.css; no necesita GSAP) */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Si GSAP no ha cargado (por ejemplo, sin conexión), se muestra todo sin animar
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll('.split').forEach((el) => el.classList.add('done'));
    document.querySelector('.chrono').classList.add('is-in');
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Solo con movimiento permitido ---------- */
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      fine: '(hover: hover) and (pointer: fine)',
      desktop: '(min-width: 900px)',
    },
    (context) => {
      const { motion, fine, desktop } = context.conditions;
      if (!motion) return;

      // Funciones que deshacen lo que no revierte gsap.matchMedia por sí solo
      const cleanups = [() => root.classList.remove('nav-hidden')];
      const cleanup = () => cleanups.forEach((fn) => fn());

      // Entrada de la portada: el nombre sube letra a letra y luego el resto
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero-title .c', { y: 0, yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.025 }, 0.1)
        .fromTo('[data-hero]', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, clearProps: 'transform' }, 0.25);

      // Solo con ratón: en tablets táctiles el scroll fijado se nota brusco
      if (desktop && fine) {
        // Túnel: la portada y la experiencia quedan fijadas a la vez, una encima
        // de la otra. Mientras la cámara entra en el código del fondo y la portada
        // pasa a través de la cámara, la experiencia aparece desde el fondo
        // (pequeña en el centro) hasta ocupar su sitio. Al terminar, se sigue
        // bajando con normalidad desde la experiencia.
        const hero = document.querySelector('.hero');
        const exp = document.getElementById('experiencia');
        const expGrid = exp.querySelector('.exp-grid');
        // El túnel dura el 40% de la altura de la portada
        const tunnelLength = () => '+=' + Math.round(hero.offsetHeight * 0.4);

        // La experiencia se coloca justo encima de la portada (ver .tunnel en styles.css)
        root.classList.add('tunnel');
        exp.style.marginTop = `-${hero.offsetHeight}px`;

        gsap
          .timeline({
            scrollTrigger: { trigger: hero, start: 'top top', end: tunnelLength, pin: true, pinSpacing: false, scrub: 0.3 },
          })
          // Primera mitad: la portada pasa a través de la cámara y desaparece
          .to('.hero-copy', { scale: 1.35, autoAlpha: 0, transformOrigin: '30% 50%', ease: 'power1.in', duration: 0.4 }, 0)
          .to('.notepad figcaption', { autoAlpha: 0, ease: 'power1.in', duration: 0.2 }, 0)
          // Todo el recorrido: avanzamos por el túnel
          .to(window.heroTunnel, { zoom: 7, ease: 'power1.in', duration: 1 }, 0);

        // La escala se aplica a mano (no con una animación de ScrollTrigger) para
        // poder quitarla mientras ScrollTrigger mide posiciones: si no, los puntos
        // de la línea de tiempo se calcularían sobre la sección encogida.
        const easeOut = gsap.parseEase('power3.out');
        const emerge = (progress) => {
          // Mientras dura el túnel la sección es transparente y deja ver la portada
          root.classList.toggle('tunnel-active', progress < 1);
          // Segunda mitad: la experiencia llega desde el fondo
          const e = gsap.utils.clamp(0, 1, (progress - 0.4) / 0.6);
          gsap.set(expGrid, {
            scale: 0.3 + 0.7 * easeOut(e),
            autoAlpha: e,
            // Crece desde el centro de la pantalla
            transformOrigin: `50% ${innerHeight / 2 - expGrid.offsetTop}px`,
          });
        };

        tunnelPin = ScrollTrigger.create({
          id: 'experiencia', // main.js lleva los enlaces a #experiencia al final del túnel
          trigger: exp,
          start: 'top top',
          end: tunnelLength,
          pin: true,
          onUpdate: (self) => emerge(self.progress),
        });

        // Antes de medir: sección a tamaño real y colocada sobre la portada.
        // Después de medir todo: se vuelve a aplicar el estado del túnel.
        const beforeMeasure = () => {
          exp.style.marginTop = `-${hero.offsetHeight}px`;
          gsap.set(expGrid, { clearProps: 'transform,transformOrigin,opacity,visibility' });
        };
        const afterMeasure = () => tunnelPin && emerge(tunnelPin.progress);
        ScrollTrigger.addEventListener('refreshInit', beforeMeasure);
        ScrollTrigger.addEventListener('refresh', afterMeasure);
        emerge(tunnelPin.progress);

        cleanups.push(() => {
          tunnelPin = null;
          root.classList.remove('tunnel', 'tunnel-active');
          exp.style.marginTop = '';
          ScrollTrigger.removeEventListener('refreshInit', beforeMeasure);
          ScrollTrigger.removeEventListener('refresh', afterMeasure);
          gsap.set(expGrid, { clearProps: 'transform,transformOrigin,opacity,visibility' });
        });
      }

      // Títulos de sección: palabras (o letras) que suben al entrar en pantalla
      gsap.utils.toArray('[data-split]').forEach((el) => {
        if (el.closest('.hero')) return;
        gsap.fromTo(
          el.querySelectorAll('.c'),
          { y: 0, yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: el.dataset.split === 'chars' ? 0.035 : 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%' },
            onComplete: () => el.classList.add('done'),
          },
        );
      });


      // Tarjetas de "Lo que he construido"
      gsap.fromTo(
        '.bento .cell',
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.12,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.bento', start: 'top 80%' },
        },
      );

      // Los formatos de banner se dibujan uno a uno
      gsap.fromTo(
        '.fmt',
        { scale: 0, transformOrigin: '0% 100%' },
        { scale: 1, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.1, scrollTrigger: { trigger: '.formats', start: 'top 85%' } },
      );

      // El código de WordPress se "teclea" línea a línea
      gsap.fromTo(
        '.snippet .ln',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.45,
          ease: 'steps(16)',
          stagger: 0.3,
          scrollTrigger: { trigger: '.snippet', start: 'top 85%' },
        },
      );

      // Flujo del sistema QR: la petición recorre UI → PHP → MySQL en bucle
      const steps = gsap.utils.toArray('.flow li');
      const flow = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
      steps.forEach((step, i) => {
        flow.call(() => steps.forEach((s) => s.classList.toggle('on', s === step)), [], i * 0.7);
      });
      flow.call(() => steps.forEach((s) => s.classList.remove('on')), [], steps.length * 0.7);
      ScrollTrigger.create({
        trigger: '.flow',
        start: 'top 95%',
        end: 'bottom 5%',
        onToggle: (self) => (self.isActive ? flow.play() : flow.pause()),
      });

      // Stack: las líneas se dibujan y las tecnologías aparecen en cascada
      const stackTrigger = { trigger: '.groups', start: 'top 85%' };
      gsap.fromTo('.group', { '--line': 0 }, { '--line': 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: stackTrigger });
      gsap.fromTo(
        '.group li',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.04, delay: 0.15, scrollTrigger: stackTrigger },
      );

      // La navegación se esconde al bajar y vuelve al subir
      ScrollTrigger.create({
        start: 'top -160',
        end: 'max',
        onUpdate: (self) => root.classList.toggle('nav-hidden', self.direction === 1),
        onLeaveBack: () => root.classList.remove('nav-hidden'),
      });

      return cleanup;
    },
  );

  /* ---------- Siempre activo (no es movimiento, es estado) ----------
     Se crean después de las secciones fijadas (pin) para que ScrollTrigger
     calcule sus posiciones con el espacio que añaden. */

  // Barra de progreso de lectura bajo la navegación
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => nav.style.setProperty('--progress', self.progress.toFixed(4)),
  });

  // Enlace de la navegación activo según la sección visible. Se mide la
  // posición real en cada scroll porque durante el túnel la experiencia
  // está fijada encima de la portada y aún no cuenta como visible.
  const navSections = [...document.querySelectorAll('[data-section]')]
    .map((link) => ({ link, section: document.getElementById(link.dataset.section) }))
    .filter((item) => item.section);

  function syncActiveLink() {
    const line = innerHeight * 0.45;
    let current = null;
    navSections.forEach(({ section }) => {
      if (tunnelPin && section.id === 'experiencia' && tunnelPin.progress < 1) return;
      const r = section.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = section;
    });
    navSections.forEach(({ link, section }) => link.classList.toggle('active', section === current));
  }

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: syncActiveLink, onRefresh: syncActiveLink });

  // Las fuentes cambian la altura del texto: se recalculan posiciones al cargarlas
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());

  // Línea del tiempo de la experiencia: las etapas crecen una vez al verse
  // (la transición está en styles.css). Durante el túnel la sección está
  // fijada, por eso se cuenta desde el final del túnel.
  ScrollTrigger.create({
    trigger: '.chrono',
    start: afterTunnel('top', '85%'),
    once: true,
    onEnter: () => document.querySelector('.chrono').classList.add('is-in'),
  });
})();
