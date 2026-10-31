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
function render(){if(!data)return;var by={};data.courses.forEach(function(m){by[m.id]=m});
  var h='',i;data.sections.forEach(function(s){var list=s.courses.map(function(id){return by[id]}).filter(Boolean);if(!list.length)return;
    h+='<div style="margin-bottom:30px"><h2 style="font-size:17px;margin-top:14px">'+esc(s.title)+' <small>'+list.length+'</small></h2><p style="margin-bottom:12px;font-size:13.5px">'+esc(s.desc)+'</p><div class="grid">'+list.map(card).join('')+'</div></div>'});
  $('#secs').innerHTML=h;
  var nl=0,nx=0,nc=data.courses.length;Object.keys(courses).forEach(function(k){var c=courses[k];nl+=c.modules.reduce(function(a,x){return a+x.lessons.length},0);nx+=(c.downloads||[]).length});
  var nq=Object.keys(courses).reduce(function(a,k){return a+courses[k].modules.length+1},0);
  $('#stats').innerHTML='<div><b>'+nc+'</b><span>'+HC.t('st_c')+'</span></div><div><b>'+nl+'</b><span>'+HC.t('st_l')+'</span></div><div><b>'+nq+'</b><span>'+HC.t('st_q')+'</span></div><div><b>'+nx+'</b><span>'+HC.t('st_x')+'</span></div>';
  $('#langnote').textContent=HC.t('lang_note')}
HC.langSelect($('#lang'));HC.apply();HC.onlang=function(){HC.apply();render()};
HC.loadCatalog().then(function(c){data=c;render();return Promise.all(c.courses.map(function(m){return HC.loadCourse(m.id).then(function(x){courses[m.id]=x}).catch(function(){})}))}).then(render);
})();
