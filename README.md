# Samuel Senén López | Portfolio

Este es mi portfolio personal. Soy desarrollador full-stack junior y aquí recojo mi experiencia, lo que he construido y las tecnologías con las que trabajo: creatividades HTML5 animadas, emails responsive y aplicaciones web con PHP y MySQL.

Lo he hecho con HTML, CSS y JavaScript, sin frameworks, para tener control total sobre el peso de la página y las animaciones.

Puedes verlo en **[samuelsenen.dev](https://samuelsenen.dev)**.

## Características

- Bilingüe: español e inglés, con cambio de idioma sin recargar la página.
- Modo oscuro y modo claro, con transición circular entre temas.
- Banner 300×250 animado con GSAP y controles para recorrer su línea de tiempo.
- Fondo de la portada dibujado con Canvas: una recreación de mi primera página en el Bloc de notas, que se teclea sola.
- Animaciones al hacer scroll con GSAP y ScrollTrigger.
- Diseño responsive con menú desplegable en móvil y respeto a la preferencia de movimiento reducido del sistema.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- [GSAP](https://gsap.com) y ScrollTrigger
- Tipografías [Schibsted Grotesk](https://fonts.google.com/specimen/Schibsted+Grotesk) e [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono), alojadas en el propio sitio

## Estructura

```
index.html          Estructura y contenido de la página
css/styles.css      Estilos
js/i18n.js          Textos en español e inglés
js/main.js          Idioma, tema claro/oscuro, menú móvil, texto dividido y copia del email
js/banner.js        Banner animado
js/hero-canvas.js   Fondo de la portada (la página del Bloc de notas)
js/animations.js    Animaciones de scroll
assets/             CV, favicon, icono para iOS e imagen para redes sociales
assets/fonts/       Tipografías
assets/projects/    Capturas de los proyectos
CNAME               Dominio propio (samuelsenen.dev) para GitHub Pages
```

## Publicar cambios

La web está publicada en GitHub Pages. Cuando modifico el CSS o el JavaScript, subo el número `?v=` de sus enlaces en `index.html` (por ejemplo, de `?v=2` a `?v=3`). Así los navegadores descargan los archivos nuevos y no mezclan versiones.

## Contacto

**Samuel Senén López**
[Web](https://samuelsenen.dev) · [LinkedIn](https://www.linkedin.com/in/samuel-senen-673502163) · [GitHub](https://github.com/samuelseenen) · samuelsenen@gmail.com
