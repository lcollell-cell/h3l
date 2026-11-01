/* H3L · Cursos · página de Suscripción (simulación completa: cuenta, cursos gratis, compra simulada y comprobante de ejemplo) */
(function(){'use strict';var HC=window.HC,P=HC.subs,$=HC.$,e=HC.esc,T=P.T,cat=null,msg={};
HC.langSelect($('#lang'));HC.apply();
function titles(){var o={};(cat?cat.courses:[]).forEach(function(m){o[m.id]=m.title});return o}
function sel(id,opts,val){return'<select id="'+id+'">'+opts.map(function(o){return'<option value="'+e(o[0])+'"'+(o[0]===val?' selected':'')+'>'+e(o[1])+'</option>'}).join('')+'</select>'}
function field(id,label,val,type,ph){return'<label style="display:block;margin:8px 0"><span class="note-s" style="display:block">'+e(label)+'</span><input id="'+id+'" type="'+(type||'text')+'" value="'+e(val||'')+'" placeholder="'+e(ph||'')+'" style="width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font:500 15px var(--font)"></label>'}
function sec(id){return $('#'+id)}
function render(){var st=P.get(),a=st.acct||{},tt=titles(),left=P.freeLeft();
  document.documentElement.lang=HC.lang;document.title=T('pageT');
  sec('simbanner').textContent=T('sim');$('#pgT').textContent=T('pageT');$('#plan').textContent=T('plan',{n:P.CFG.free,p:P.CFG.price});$('#soon').textContent=T('soon');
  sec('ctl').innerHTML='<b>'+e(st.on?T('simOn'):T('simOff'))+'</b> <button class="btn g s" id="tgl" style="margin-left:8px">'+e(st.on?T('actOff'):T('actOn'))+'</button> <button class="btn o s" id="rst">'+e(T('reset'))+'</button>';
  /* 1 cuenta */
  sec('s1').innerHTML='<h3>'+e(T('s1'))+'</h3>'+field('aN',T('name'),a.name)+field('aE',T('email'),a.email,'email')+field('aC',T('country'),a.country)+field('aT',T('tax'),a.tax)+field('aA',T('addr'),a.addr)+'<button class="btn g" id="aS">'+e(T('save'))+'</button> <span class="note-s" id="aM">'+e(msg.acct||'')+'</span>';
  /* 2 gratis */
  var h2='<h3>'+e(T('s2',{n:P.CFG.free}))+'</h3>';
  if(st.freeOk){h2+='<p class="note-s">'+e(T('mine'))+': '+st.free.map(function(i){return e(tt[i]||i)}).join(' · ')+'</p>'}
  else{h2+='<p class="note-s">'+e(T('left',{k:P.CFG.free-(msg.pick||[]).length}))+'</p><div id="fl" style="display:grid;gap:4px">'+(cat?cat.courses:[]).map(function(m){var on=(msg.pick||[]).indexOf(m.id)>=0;return'<label style="display:flex;gap:8px;align-items:center;min-height:36px"><input type="checkbox" data-f="'+e(m.id)+'"'+(on?' checked':'')+'> '+e(m.title)+'</label>'}).join('')+'</div><button class="btn g" id="fC" style="margin-top:10px"'+((msg.pick||[]).length?'':' disabled')+'>'+e(T('confirmF'))+'</button> <span class="note-s" id="fM">'+e(msg.free||'')+'</span>'}
  sec('s2').innerHTML=h2;
  /* 3 compra */
  var lockedList=(cat?cat.courses:[]).filter(function(m){return P.status(m.id)==='locked'||(!st.on&&st.free.indexOf(m.id)<0&&st.paid.indexOf(m.id)<0)});
  var want=msg.buy||new URLSearchParams(location.search).get('buy')||'';if(!lockedList.some(function(m){return m.id===want}))want=lockedList[0]?lockedList[0].id:'';
  var h3='<h3>'+e(T('s3',{p:P.CFG.price}))+'</h3>';
  if(!lockedList.length)h3+='<p class="note-s">'+e(T('nolock'))+'</p>';
  else h3+='<label class="note-s">'+e(T('course'))+'</label>'+sel('bC',lockedList.map(function(m){return[m.id,m.title]}),want)+field('cN',T('card'),'4242 4242 4242 4242','text')+'<div style="display:flex;gap:10px"><div style="flex:1">'+field('cE',T('exp'),'12/30')+'</div><div style="flex:1">'+field('cV',T('cvc'),'123')+'</div></div><button class="btn g" id="bP">'+e(T('pay',{p:P.CFG.price}))+'</button><div id="bM" role="status" aria-live="polite" style="margin-top:10px;font-weight:700">'+(msg.pay||'')+'</div>';
  sec('s3').innerHTML=h3;
  /* 4 pedidos */
  sec('s4').innerHTML='<h3>'+e(T('s4'))+'</h3>'+(st.orders.length?st.orders.map(function(o,i){return'<div class="q" style="margin:8px 0"><b>'+e(o.id)+'</b> · '+e(o.date)+' · USD '+o.total.toFixed(2)+'<br>'+o.items.map(function(x){return e(x.title)}).join(' · ')+'<br><button class="btn o s" data-v="'+i+'">'+e(T('view'))+'</button> <button class="btn o s" data-d="'+i+'">'+e(T('dl'))+'</button></div>'}).join(''):'<p class="note-s">'+e(T('none'))+'</p>');
  var r=sec('real');r.innerHTML='<summary><b>'+e(T('real'))+'</b></summary><ol style="margin:10px 0 0 18px">'+T('rs').map(function(x){return'<li>'+e(x)+'</li>'}).join('')+'</ol>'}
function luhn(n){var s=0,d=false;for(var i=n.length-1;i>=0;i--){var x=+n[i];if(d){x*=2;if(x>9)x-=9}s+=x;d=!d}return s%10===0}
function blob(o,openIt){var b=new Blob([P.invoiceHtml(o)],{type:'text/html'}),u=URL.createObjectURL(b);if(openIt){window.open(u,'_blank','noopener')}else{var a=document.createElement('a');a.href=u;a.download='H3L_comprobante_ejemplo_'+o.id+'.html';document.body.appendChild(a);a.click();a.remove()}setTimeout(function(){URL.revokeObjectURL(u)},20000)}
function readAcct(){return{name:$('#aN').value.trim(),email:$('#aE').value.trim(),country:$('#aC').value.trim(),tax:$('#aT').value.trim(),addr:$('#aA').value.trim()}}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
document.addEventListener('click',function(ev){var t=ev.target.closest('button');if(!t)return;var st=P.get();
  if(t.id==='tgl'){P.setOn(!st.on);render();return}
  if(t.id==='rst'){P.reset();msg={};render();return}
  if(t.id==='aS'){var a=readAcct();if(!a.name||!/.+@.+\..+/.test(a.email)||!a.country){msg.acct=T('needFields');render();return}st.acct=a;P.save();msg.acct=T('saved')+' ✓';render();return}
  if(t.id==='fC'){if(!P.acctOk()){msg.free=T('needFields');render();return}if(!window.confirm(T('confirmQ')))return;(msg.pick||[]).forEach(function(i){P.useFree(i)});msg.pick=[];msg.free='';render();return}
  if(t.dataset.v!=null){blob(st.orders[+t.dataset.v],true);return}
  if(t.dataset.d!=null){blob(st.orders[+t.dataset.d],false);return}
  if(t.id==='bP'){pay(t)}});
document.addEventListener('change',function(ev){var c=ev.target;if(c.dataset&&c.dataset.f){var p=msg.pick||[];if(c.checked){if(p.length>=P.CFG.free-(P.get().freeOk?P.get().free.length:0)){c.checked=false;return}p.push(c.dataset.f)}else p=p.filter(function(x){return x!==c.dataset.f});msg.pick=p;render()}else if(c.id==='bC'){msg.buy=c.value}});
function pay(btn){var out=$('#bM');if(!P.acctOk()){out.textContent=T('needFields');return}
  var num=$('#cN').value.replace(/\s+/g,'');if(!/^\d{13,19}$/.test(num)||!luhn(num)){out.textContent=T('badCard');return}
  var id=$('#bC').value,tt=titles();btn.disabled=true;
  (async function(){out.textContent='⏳ '+T('st1');await sleep(900);
    if(/0002$/.test(num)){out.textContent='✗ '+T('dec');btn.disabled=false;return}
    out.textContent='✓ '+T('st2');await sleep(700);out.textContent+=' · ⏳ '+T('st3');await sleep(800);
    var o=P.order([id],tt);msg.buy='';msg.pay='<span style="color:var(--ok)">✓ '+e(T('st4'))+': '+e(tt[id]||id)+' · '+e(o.id)+'</span>';render()})()}
HC.onlang=function(){HC.apply();render()};
HC.loadCatalog().then(function(c){cat=c;render()}).catch(function(){render()});
})();
