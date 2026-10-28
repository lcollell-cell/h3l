/* integración con el sitio H3L: dentro de la sección, los enlaces cambian de pestaña sin recargar */
(function(){
  var emb=false;try{emb=window.parent!==window&&/[?&]embed=1/.test(location.search)}catch(e){}
  if(!emb)return;
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var h=a.getAttribute('href')||'';
    var m=h.match(/^app\.html#(.+)$/);
    if(m){e.preventDefault();parent.postMessage({h3l:'tool',hash:m[1]},location.origin);return}
    var g=h.match(/^(?:\.\.\/)?index\.html\?(.*)$/);
    if(g){e.preventDefault();parent.postMessage({h3l:'goto',query:g[1]},location.origin)}
  },true);
})();
