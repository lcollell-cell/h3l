/* altura automática dentro del sitio: el marco crece con el contenido y la página se desplaza como un todo */
(function(){
  var emb=false;try{emb=window.parent!==window&&/[?&]embed=1/.test(location.search)}catch(e){}
  if(!emb)return;
  var last=0;
  function send(){var h=Math.ceil(document.body.getBoundingClientRect().height);if(h&&h!==last){last=h;parent.postMessage({h3l:'height',h:h,frame:'flujo'},location.origin)}}
  if(window.ResizeObserver)new ResizeObserver(send).observe(document.body);
  window.addEventListener('load',send);setTimeout(send,300);
})();
