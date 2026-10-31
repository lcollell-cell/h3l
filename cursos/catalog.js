/* H3L · Cursos · catálogo */
(function(){'use strict';var HC=window.HC,$=HC.$,esc=HC.esc;
var data=null,courses={};
function card(m){var c=courses[m.id],cs=HC.cs(m.id),p=c?HC.progress(c):{pct:0,cert:false,lessons:0};
  var st=p.cert?HC.t('review'):(p.pct>0?HC.t('resume'):HC.t('start'));
  var nl=c?c.modules.reduce(function(a,x){return a+x.lessons.length},0):'…',mins=c?Math.round(c.totalSec/60):'…';
  var nq=c?(c.modules.length+1):'…',nx=c?(c.downloads||[]).length:'…';
  return '<article class="card"><div class="cv" style="--cc:'+esc(m.color)+'">'+HC.ico[m.icon]+'<div class="tag">'+esc(m.tag)+'</div><h3>'+esc(m.title)+'</h3></div>'+
  '<div class="cb"><p>'+esc(m.short)+'</p><div class="meta"><span>'+nl+' '+HC.t('lessons')+'</span><span>≈ '+mins+' '+HC.t('min')+' + Excel</span><span>'+nq+' '+HC.t('exams')+'</span><span>'+HC.t('level')+': '+esc(m.level)+'</span></div>'+
  '<div class="bar" role="progressbar" aria-valuenow="'+p.pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+p.pct+'%"></i></div>'+
  '<div class="acts"><a class="btn g s" href="curso.html?c='+esc(m.id)+'">'+st+'</a>'+(p.pct>0?'<span class="badge">'+p.pct+' % '+HC.t('done')+'</span>':'')+(p.cert?'<span class="badge">'+HC.t('certok')+'</span>':'')+'</div></div></article>'}
var VKEY='h3l-cursos-vista',TKEY='h3l-cursos-arbol',view='cards',q='',open_={};
try{var v0=localStorage.getItem(VKEY);if(v0==='cards'||v0==='list'||v0==='tree')view=v0;open_=JSON.parse(localStorage.getItem(TKEY)||'{}')||{}}catch(e){}
function sv(){try{localStorage.setItem(VKEY,view);localStorage.setItem(TKEY,JSON.stringify(open_))}catch(e){}}
function norm(x){return String(x||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function nLes(c){return c?c.modules.reduce(function(a,x){return a+x.lessons.length},0):0}
function courseHit(m,c,qq){if(!qq)return true;var hay=[m.title,m.short,m.tag,m.level].join(' ');if(c){hay+=' '+c.title+' '+(c.subtitle||'');c.modules.forEach(function(md){hay+=' '+md.title;md.lessons.forEach(function(l){hay+=' '+l.title})});(c.downloads||[]).forEach(function(d){hay+=' '+d.title})}return norm(hay).indexOf(qq)>=0}
function secList(){var by={};data.courses.forEach(function(m){by[m.id]=m});var qq=norm(q.trim());
  return data.sections.map(function(s){return{s:s,list:s.courses.map(function(id){return by[id]}).filter(function(m){return m&&courseHit(m,courses[m.id],qq)})}}).filter(function(x){return x.list.length})}
function vCards(sl){return sl.map(function(x){return '<div style="margin-bottom:30px"><h2 style="font-size:17px;margin-top:14px">'+esc(x.s.title)+' <small>'+x.list.length+'</small></h2><p style="margin-bottom:12px;font-size:13.5px">'+esc(x.s.desc)+'</p><div class="grid">'+x.list.map(card).join('')+'</div></div>'}).join('')}
function vList(sl){var h='<div class="ltw"><table class="lt"><thead><tr><th>'+HC.t('th_c')+'</th><th class="c1">'+HC.t('th_lv')+'</th><th class="c2">'+HC.t('th_ls')+'</th><th class="c2">'+HC.t('th_du')+'</th><th>'+HC.t('th_pr')+'</th><th>'+HC.t('th_ac')+'</th></tr></thead><tbody>';
  sl.forEach(function(x){h+='<tr class="gs"><td colspan="6"><b>'+esc(x.s.title)+'</b> <small>'+x.list.length+'</small><span> · '+esc(x.s.desc)+'</span></td></tr>';
    x.list.forEach(function(m){var c=courses[m.id],p=c?HC.progress(c):{pct:0,cert:false},st=p.cert?HC.t('review'):(p.pct>0?HC.t('resume'):HC.t('start'));
      h+='<tr><td><i class="dot" style="background:'+esc(m.color)+'"></i><a href="curso.html?c='+esc(m.id)+'"><b>'+esc(m.title)+'</b></a><div class="sub">'+esc(m.tag)+' · '+esc(m.short)+'</div></td><td class="c1">'+esc(m.level)+'</td><td class="c2">'+(c?nLes(c):'…')+'</td><td class="c2">'+(c?'≈ '+Math.round(c.totalSec/60)+' '+HC.t('min'):'…')+'</td>'+
      '<td><div class="bar" role="progressbar" aria-valuenow="'+p.pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+p.pct+'%"></i></div><small>'+p.pct+' %'+(p.cert?' · '+HC.t('certok'):'')+'</small></td><td><a class="btn g s" href="curso.html?c='+esc(m.id)+'">'+st+'</a></td></tr>'})});
  return h+'</tbody></table></div>'}
function tnode(id,cls,label,kids,extra,deflt){var op=open_[id];if(op===undefined)op=!!deflt;if(q.trim()&&kids)op=true;
  return '<li role="treeitem" data-id="'+esc(id)+'"'+(kids?' aria-expanded="'+(op?'true':'false')+'"':'')+'><div class="row '+cls+'" tabindex="-1">'+(kids?'<span class="tg" aria-hidden="true"></span>':'<span class="tg lf" aria-hidden="true"></span>')+label+(extra||'')+'</div>'+(kids?'<ul role="group"'+(op?'':' hidden')+'>'+kids+'</ul>':'')+'</li>'}
function vTree(sl){var qq=norm(q.trim()),h='<ul class="tree" role="tree" aria-label="'+esc(HC.t('vw_tree'))+'">';
  sl.forEach(function(x){var kc='';x.list.forEach(function(m){var c=courses[m.id],cs=HC.cs(m.id),p=c?HC.progress(c):{pct:0},km='';
    if(c){var cm=!qq||norm(m.title+' '+m.tag).indexOf(qq)>=0;
      c.modules.forEach(function(md){var kl='',mm=!qq||cm||norm(md.title).indexOf(qq)>=0;
        md.lessons.forEach(function(l){if(qq&&!cm&&!mm&&norm(l.title).indexOf(qq)<0)return;var dn=cs.l[l.id]&&cs.l[l.id].d;kl+=tnode('l:'+l.id,'lf','<a href="curso.html?c='+esc(m.id)+'&amp;l='+esc(l.id)+'">'+esc(l.title)+'</a>','',(dn?'<span class="ok">✓</span>':'')+'<small>'+Math.round(l.dur/60*10)/10+' '+HC.t('min')+'</small>')});
        if(kl||!qq||cm){var qd=cs.q&&cs.q[md.id]&&cs.q[md.id].best>=70;kl+=tnode('q:'+md.id,'lf','<a href="curso.html?c='+esc(m.id)+'">'+esc(HC.t('quiz_m'))+'</a>','',qd?'<span class="ok">✓</span>':'');km+=tnode('m:'+md.id,'md','<b>'+esc(md.title)+'</b>',kl,'<small>'+md.lessons.length+' '+HC.t('lessons')+'</small>',false)}});
      if((c.downloads||[]).length&&(!qq||cm||c.downloads.some(function(d){return norm(d.title).indexOf(qq)>=0}))){var kf='';c.downloads.forEach(function(d,i){kf+=tnode('f:'+m.id+i,'lf fl','<a href="'+esc(d.file)+'" download>'+esc(d.title)+'</a>','','<small>xlsx</small>')});km+=tnode('x:'+m.id,'md','<b>'+esc(HC.t('tr_files'))+'</b>',kf,'<small>'+c.downloads.length+'</small>',false)}
      km+=tnode('e:'+m.id,'lf','<a href="curso.html?c='+esc(m.id)+'">'+esc(HC.t('tr_exam'))+'</a>','',(cs.e&&cs.e.best>=70?'<span class="ok">✓</span>':''))}
    kc+=tnode('c:'+m.id,'cr','<i class="dot" style="background:'+esc(m.color)+'"></i><a href="curso.html?c='+esc(m.id)+'"><b>'+esc(m.title)+'</b></a>',km||'<li class="ld">…</li>','<small>'+(c?nLes(c)+' '+HC.t('lessons')+' · ':'')+p.pct+' %</small>',false)});
    h+=tnode('s:'+x.s.id,'sc','<b>'+esc(x.s.title)+'</b>',kc,'<small>'+x.list.length+'</small>',true)});
  return h+'</ul><p class="trh">'+esc(HC.t('tr_hint'))+'</p>'}
function treeKeys(){var T=$('.tree');if(!T)return;
  function rows(){return Array.prototype.filter.call(T.querySelectorAll('.row'),function(r){var li=r.parentElement.parentElement.closest('li[aria-expanded="false"]');return !li})}
  function foc(r){if(!r)return;Array.prototype.forEach.call(T.querySelectorAll('.row'),function(x){x.tabIndex=-1});r.tabIndex=0;r.focus()}
  function toggle(li,on){var op=on==null?li.getAttribute('aria-expanded')!=='true':on;li.setAttribute('aria-expanded',op?'true':'false');var g=li.querySelector(':scope > ul');if(g)g.hidden=!op;open_[li.getAttribute('data-id')]=op;sv()}
  var first=T.querySelector('.row');if(first)first.tabIndex=0;
  T.addEventListener('click',function(e){var row=e.target.closest('.row');if(!row)return;var li=row.parentElement;if(e.target.closest('a'))return;if(li.hasAttribute('aria-expanded'))toggle(li);foc(row)});
  T.addEventListener('keydown',function(e){var row=e.target.closest('.row');if(!row)return;var li=row.parentElement,rs=rows(),i=rs.indexOf(row),k=e.key,ex=li.getAttribute('aria-expanded');
    if(k==='ArrowDown'){foc(rs[i+1]);e.preventDefault()}else if(k==='ArrowUp'){foc(rs[i-1]);e.preventDefault()}
    else if(k==='ArrowRight'){if(ex==='false')toggle(li,true);else if(ex==='true')foc(rs[i+1]);e.preventDefault()}
    else if(k==='ArrowLeft'){if(ex==='true')toggle(li,false);else{var p=li.parentElement.closest('li');if(p)foc(p.querySelector(':scope > .row'))}e.preventDefault()}
    else if(k==='Home'){foc(rs[0]);e.preventDefault()}else if(k==='End'){foc(rs[rs.length-1]);e.preventDefault()}
    else if(k==='Enter'||k===' '){var a=row.querySelector('a');if(a&&!li.hasAttribute('aria-expanded')){a.click()}else if(li.hasAttribute('aria-expanded'))toggle(li);e.preventDefault()}})}
function render(){if(!data)return;var sl=secList(),h;
  if(view==='list')h=vList(sl);else if(view==='tree')h=vTree(sl);else h=vCards(sl);
  if(!sl.length)h='<p class="nores">'+esc(HC.t('nores'))+'</p>';
  $('#secs').innerHTML=h;$('#secs').setAttribute('data-v',view);
  Array.prototype.forEach.call(document.querySelectorAll('#vsw button'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===view?'true':'false')});
  $('#trbtns').hidden=view!=='tree';if(view==='tree')treeKeys();
  var nl=0,nx=0,nc=data.courses.length;Object.keys(courses).forEach(function(k){var c=courses[k];nl+=c.modules.reduce(function(a,x){return a+x.lessons.length},0);nx+=(c.downloads||[]).length});
  var nq=Object.keys(courses).reduce(function(a,k){return a+courses[k].modules.length+1},0);
  $('#stats').innerHTML='<div><b>'+nc+'</b><span>'+HC.t('st_c')+'</span></div><div><b>'+nl+'</b><span>'+HC.t('st_l')+'</span></div><div><b>'+nq+'</b><span>'+HC.t('st_q')+'</span></div><div><b>'+nx+'</b><span>'+HC.t('st_x')+'</span></div>';
  $('#langnote').textContent=HC.t('lang_note')}
function bind(){Array.prototype.forEach.call(document.querySelectorAll('#vsw button'),function(b){b.addEventListener('click',function(){view=b.getAttribute('data-v');sv();render()})});
  var qi=$('#qs'),tm;qi.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){q=qi.value;render()},120)});
  $('#exAll').addEventListener('click',function(){var T=document.querySelectorAll('.tree li[aria-expanded]');Array.prototype.forEach.call(T,function(li){open_[li.getAttribute('data-id')]=true});sv();render()});
  $('#coAll').addEventListener('click',function(){var T=document.querySelectorAll('.tree li[aria-expanded]');Array.prototype.forEach.call(T,function(li){open_[li.getAttribute('data-id')]=false});q='';$('#qs').value='';sv();render()})}
bind();HC.langSelect($('#lang'));HC.apply();HC.onlang=function(){HC.apply();render()};
HC.loadCatalog().then(function(c){data=c;render();return Promise.all(c.courses.map(function(m){return HC.loadCourse(m.id).then(function(x){courses[m.id]=x}).catch(function(){})}))}).then(render);
})();
