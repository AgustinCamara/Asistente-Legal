/* theme.js
   maneja el tema oscuro/claro. guarda la preferencia en localStorage
   y al cargar la pagina chequea si hay algo guardado o si el sistema
   operativo tiene dark mode activado. */

/** aplica el tema y lo guarda en localStorage */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

/** toggle: alterna entre dark y light */
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/** al cargar, lee la preferencia guardada o la del sistema */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }
})();
