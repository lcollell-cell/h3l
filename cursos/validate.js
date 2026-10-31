/* H3L · Cursos · validación, comparación y firma de propuestas (la usan la app del tutor y el panel del administrador) */
(function(){'use strict';var HV=window.HV={};
var SCENES=['bul','tbl','fm','viz','case'];
HV.SCENES=SCENES;
function isS(x){return typeof x==='string'&&x.trim().length>0}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean).length}
HV.widgets=function(){var W=window.HW||{};return Object.keys(W).filter(function(k){return typeof W[k]==='function'&&k!=='build'}).sort()};
/* devuelve {errors:[{p,m}], warnings:[{p,m}]}; p = ruta legible */
HV.validate=function(c,orig){var E=[],W=[];function e(p,m){E.push({p:p,m:m})}function w(p,m){W.push({p:p,m:m})}
  ['title','subtitle','desc'].forEach(function(k){if(!isS(c[k]))e(k,'req')});
  if(orig&&c.id!==orig.id)e('id','id');
  if(!Array.isArray(c.objectives)||!c.objectives.length||!c.objectives.every(isS))e('objectives','req');
  if(!Array.isArray(c.labs))e('labs','req');
  if(!(c.practiceMin>0))e('practiceMin','num');
  var I=c.intro||{};if(!isS(I.hook))e('intro.hook','req');
  if(!Array.isArray(I.questions)||I.questions.length!==3||!I.questions.every(isS))e('intro.questions','three');
  ['caso','S','T','A','R'].forEach(function(k){if(!I.star||!isS(I.star[k]))e('intro.star.'+k,'req')});
  var O=c.outro||{};if(!Array.isArray(O.can)||O.can.length<3||!O.can.every(isS))w('outro.can','nocan');if(!isS(O.phrase))e('outro.phrase','req');if(!Array.isArray(O.recap)||!O.recap.length||!O.recap.every(isS))e('outro.recap','req');
  var ids={},all=[];var WN=HV.widgets();
  if(!Array.isArray(c.modules)||!c.modules.length)e('modules','req');
  (c.modules||[]).forEach(function(m,mi){var mp='modules.'+mi;if(!isS(m.id))e(mp+'.id','req');if(!isS(m.title))e(mp+'.title','req');
    if(!Array.isArray(m.quiz)||m.quiz.length!==3)e(mp+'.quiz','quiz3');
    (m.quiz||[]).forEach(function(q,qi){qcheck(q,mp+'.quiz.'+qi)});
    if(!Array.isArray(m.lessons)||!m.lessons.length)e(mp+'.lessons','req');
    (m.lessons||[]).forEach(function(l,li){var lp=mp+'.lessons.'+li;if(!isS(l.id))e(lp+'.id','req');else{if(ids[l.id])e(lp+'.id','dup');ids[l.id]=1;all.push(l.id)}
      if(!isS(l.title))e(lp+'.title','req');if(!isS(l.comp))e(lp+'.comp','req');
      if(!Array.isArray(l.cues)||!l.cues.length){e(lp+'.cues','req');return}
      var tw=0;
      l.cues.forEach(function(q,ci){var cp=lp+'.cues.'+ci;if(!isS(q.say)){e(cp+'.say','req')}else{var n=words(q.say);tw+=n;if(n>70)w(cp+'.say','long')}
        if(q.hl!=null&&!(Number.isInteger(q.hl)&&q.hl>=-1))e(cp+'.hl','hl');
        if(q.scene)scene(q.scene,cp+'.scene');
        if(q.q)qcheck(q.q,cp+'.q');
        if(q.lab&&!(q.scene&&q.scene.t==='viz'))w(cp+'.lab','labviz')});
      if(tw<60)w(lp,'short');if(tw>260)w(lp,'longl')}) });
  function qcheck(q,p){if(!isS(q.q))e(p+'.q','req');if(!Array.isArray(q.o)||q.o.length!==4||!q.o.every(isS))e(p+'.o','four');if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))e(p+'.a','ans');if(!isS(q.e))e(p+'.e','req')}
  function scene(s,p){if(SCENES.indexOf(s.t)<0){e(p+'.t','type');return}
    if(s.t==='bul'){if(!isS(s.k))e(p+'.k','req');if(!Array.isArray(s.items)||!s.items.length||!s.items.every(isS))e(p+'.items','req')}
    if(s.t==='tbl'){if(!Array.isArray(s.cols)||!s.cols.length)e(p+'.cols','req');else if(!Array.isArray(s.rows)||!s.rows.length||!s.rows.every(function(r){return Array.isArray(r)&&r.length===s.cols.length}))e(p+'.rows','rows')}
    if(s.t==='fm'){if(!isS(s.f))e(p+'.f','req')}
    if(s.t==='viz'){if(WN.length&&WN.indexOf(s.w)<0)e(p+'.w','widget');if(!s.p||typeof s.p!=='object')e(p+'.p','json')}
    if(s.t==='case'){['h','src','S','T','A','R'].forEach(function(k){if(!isS(s[k]))e(p+'.'+k,'req')})}}
  if(!Array.isArray(c.exam)||c.exam.length!==6)e('exam','exam6');(c.exam||[]).forEach(function(q,i){qcheck(q,'exam.'+i)});
  if(!Array.isArray(c.competencies)||!c.competencies.length)e('competencies','req');
  (c.competencies||[]).forEach(function(k,i){if(!isS(k.name))e('competencies.'+i+'.name','req');(k.lessons||[]).forEach(function(id){if(!ids[id])e('competencies.'+i+'.lessons','comp')})});
  (c.downloads||[]).forEach(function(d,i){var p='downloads.'+i;if(!isS(d.file)||d.file.indexOf('xlsx/')!==0)e(p+'.file','file');if(!isS(d.title))e(p+'.title','req')});
  (c.cases||[]).forEach(function(d,i){['title','text','src'].forEach(function(k){if(!isS(d[k]))e('cases.'+i+'.'+k,'req')})});
  (c.refs||[]).forEach(function(d,i){['tag','cite'].forEach(function(k){if(!isS(d[k]))e('refs.'+i+'.'+k,'req')})});
  if(!(c.refs||[]).length)w('refs','norefs');
  return{errors:E,warnings:W}};
/* comparación estructural; devuelve lista de {p,k:'edit'|'add'|'del',a,b} */
function keyOf(x,i){return x&&typeof x==='object'&&!Array.isArray(x)&&x.id?String(x.id):String(i)}
HV.diff=function(a,b){var out=[];function rec(x,y,p){if(out.length>600)return;
  if(JSON.stringify(x)===JSON.stringify(y))return;
  if(Array.isArray(x)&&Array.isArray(y)){var byId=x.concat(y).every(function(v){return v&&typeof v==='object'&&!Array.isArray(v)&&v.id});
    if(byId){var mx={},my={};x.forEach(function(v){mx[v.id]=v});y.forEach(function(v){my[v.id]=v});var seen={};
      x.concat(y).forEach(function(v){if(seen[v.id])return;seen[v.id]=1;var q=p+'['+v.id+']';if(!my[v.id])out.push({p:q,k:'del',a:mx[v.id]});else if(!mx[v.id])out.push({p:q,k:'add',b:my[v.id]});else rec(mx[v.id],my[v.id],q)});
      var ox=x.map(function(v){return v.id}).filter(function(i){return my[i]}).join(),oy=y.map(function(v){return v.id}).filter(function(i){return mx[i]}).join();if(ox!==oy)out.push({p:p+' (orden)',k:'edit',a:ox,b:oy});return}
    var n=Math.max(x.length,y.length);for(var i=0;i<n;i++){var q=p+'['+(i+1)+']';if(i>=x.length)out.push({p:q,k:'add',b:y[i]});else if(i>=y.length)out.push({p:q,k:'del',a:x[i]});else rec(x[i],y[i],q)}return}
  if(x&&y&&typeof x==='object'&&typeof y==='object'&&!Array.isArray(x)&&!Array.isArray(y)){var ks={};Object.keys(x).concat(Object.keys(y)).forEach(function(k){ks[k]=1});
    Object.keys(ks).forEach(function(k){var q=p?p+'.'+k:k;if(!(k in y))out.push({p:q,k:'del',a:x[k]});else if(!(k in x))out.push({p:q,k:'add',b:y[k]});else rec(x[k],y[k],q)});return}
  out.push({p:p,k:'edit',a:x,b:y})}
  rec(a,b,'');return out};
HV.short=function(v,n){var s=typeof v==='string'?v:JSON.stringify(v);n=n||160;return s&&s.length>n?s.slice(0,n)+'…':s};
function canon(x){if(Array.isArray(x))return x.map(canon);if(x&&typeof x==='object'){var o={};Object.keys(x).sort().forEach(function(k){o[k]=canon(x[k])});return o}return x}
HV.canon=function(x){return JSON.stringify(canon(x))};
HV.hash=function(x){var s=typeof x==='string'?x:HV.canon(x);if(!(window.crypto&&crypto.subtle))return Promise.resolve('');return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(v){return('0'+v.toString(16)).slice(-2)}).join('')})};
HV.words=words;
})();
