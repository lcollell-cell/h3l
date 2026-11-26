/* Tercer perfil del Campus: Capacitacion Interna (abre acceso/). Autor: Leandro Collell. */
(function () {
  'use strict';
  function poner() {
    var d = document.querySelector('button[data-act="role"][data-v="docente"]'), s = d && d.parentElement;
    if (!s || s.querySelector('[data-interna]')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-interna', '');
    b.setAttribute('aria-pressed', 'false');
    b.textContent = 'Capacitación Interna';
    b.addEventListener('click', function () { location.href = 'acceso/?rol=interna'; });
    s.style.flexWrap = 'wrap';
    s.appendChild(b);
  }
  new MutationObserver(poner).observe(document.documentElement, { childList: true, subtree: true });
  poner();
})();
