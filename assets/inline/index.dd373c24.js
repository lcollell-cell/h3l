/* v2: permite abrir una sección con ?go=<seccion> (ej. ?go=calculators) */
(function(){try{var g=new URLSearchParams(location.search).get('go');if(g&&/^[a-z-]+$/.test(g)){window.addEventListener('load',function(){setTimeout(function(){try{if(document.getElementById('section-'+g)&&typeof goSection==='function')goSection(g);}catch(e){}},200);});}}catch(e){}})();
