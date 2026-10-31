(function(){'use strict';var HC=window.HC,$=HC.$;
HC.langSelect($('#lang'));HC.apply();
function run(){var q=new URLSearchParams(location.search),d={n:q.get('n'),c:q.get('c'),d:q.get('d'),s:q.get('s'),h:q.get('h')},id=q.get('id'),box=$('#vr');
  if(!id||!d.n||!d.c){box.innerHTML='<div class="res f">'+HC.esc(HC.t('ver_none'))+'</div>';return}
  Promise.all([HC.cert.code(d),HC.loadCatalog().catch(function(){return null})]).then(function(r){var ok=r[0]===id,m=r[1]&&r[1].courses.filter(function(x){return x.id===d.c})[0];
    box.innerHTML='<div class="res '+(ok?'p':'f')+'">'+HC.esc(HC.t(ok?'ver_ok':'ver_bad'))+'</div>'+
    '<div class="q"><p class="t">'+HC.esc(HC.cert.norm(d.n))+'</p><p>'+HC.esc(m?m.title:d.c)+'</p><p class="note-s">'+HC.esc(d.d)+' · '+HC.esc(d.h)+' h · '+HC.esc(d.s)+' %</p><p class="note-s" style="font-family:var(--mono)">'+HC.esc(id)+'</p></div>'})}
HC.onlang=function(){HC.apply();run()};run();
})();
