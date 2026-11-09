(function(){'use strict';var HC=window.HC,$=HC.$;
HC.langSelect($('#lang'));HC.apply();
function run(qs){var q=new URLSearchParams(qs===undefined?location.search:qs),d={n:q.get('n'),c:q.get('c'),d:q.get('d'),s:q.get('s'),h:q.get('h')},id=q.get('id'),box=$('#vr');
  if(!id||!d.n||!d.c){box.innerHTML='<div class="res f">'+HC.esc(HC.t('ver_none'))+'</div>';return}
  Promise.all([HC.cert.code(d),HC.loadCatalog().catch(function(){return null})]).then(function(r){var ok=r[0]===id,m=r[1]&&r[1].courses.filter(function(x){return x.id===d.c})[0];
    box.innerHTML='<div class="res '+(ok?'p':'f')+'">'+HC.esc(HC.t(ok?'ver_ok':'ver_bad'))+'</div>'+
    '<div class="q"><p class="t">'+HC.esc(HC.cert.norm(d.n))+'</p><p>'+HC.esc(m?m.title:d.c)+'</p><p class="note-s">'+HC.esc(d.d)+' · '+HC.esc(d.h)+' h · '+HC.esc(d.s)+' %</p><p class="note-s" style="font-family:var(--mono)">'+HC.esc(id)+'</p></div>'})}
function fromText(t){t=String(t||'').trim();if(!t)return null;var i=t.indexOf('?');var qs=i>=0?t.slice(i):(t.indexOf('=')>0?'?'+t:'');if(!qs)return null;var q=new URLSearchParams(qs);return(q.get('id')&&q.get('n')&&q.get('c'))?qs:null}
$('#vf').addEventListener('submit',function(e){e.preventDefault();var qs=fromText($('#vIn').value);if(!qs){$('#vr').innerHTML='<div class="res f">'+HC.esc(HC.t('ver_inv'))+'</div>';return}run(qs)});
HC.onlang=function(){HC.apply();run(last)};var last;var _run=run;run=function(qs){last=qs;return _run(qs)};run();
})();
