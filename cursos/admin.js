/* H3L · Cursos · administración (vista de gestión; los cambios se exportan a catalog.json) */
(function(){'use strict';var HC=window.HC,$=HC.$,esc=HC.esc;HC.adminMode=true;
var KEY='h3l-cursos-admin',ov={hidden:[],order:[],titles:{}};try{ov=Object.assign(ov,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
var data,courses={};
function persist(){try{localStorage.setItem(KEY,JSON.stringify(ov))}catch(e){}}
function ordered(){var a=data.courses.slice();a.sort(function(x,y){var i=ov.order.indexOf(x.id),j=ov.order.indexOf(y.id);return(i<0?x.n:i)-(j<0?y.n:j)});return a}
function render(){var all=Object.keys(courses).map(function(k){return courses[k]}),nl=0,nq=0,nx=0,mins=0,done=0,tot=0;
  all.forEach(function(c){nl+=c.modules.reduce(function(a,m){return a+m.lessons.length},0);nq+=c.modules.reduce(function(a,m){return a+m.quiz.length},0)+c.exam.length;nx+=(c.downloads||[]).length;mins+=c.totalSec/60;var p=HC.progress(c);done+=p.lessons;tot+=p.lessonsTotal});
  $('#kp').innerHTML='<div><b>'+data.courses.length+'</b><span>cursos ('+(data.courses.length-ov.hidden.length)+' publicados)</span></div><div><b>'+nl+'</b><span>lecciones</span></div><div><b>'+nq+'</b><span>preguntas de evaluación</span></div><div><b>'+nx+'</b><span>archivos Excel</span></div><div><b>'+Math.round(mins)+' min</b><span>de narración</span></div><div><b>'+done+'/'+tot+'</b><span>progreso en este navegador</span></div>';
  var h='<div style="overflow-x:auto"><table class="ad"><thead><tr><th>#</th><th>'+HC.t('ttl')+'</th><th>Sección / módulos</th><th>Lecciones</th><th>Evaluaciones</th><th>Excel</th><th>'+HC.t('vis')+'</th><th>'+HC.t('ord')+'</th></tr></thead><tbody>';
  ordered().forEach(function(m,i){var c=courses[m.id],vis=ov.hidden.indexOf(m.id)<0;
    h+='<tr><td>'+(i+1)+'</td><td><input type="text" data-t="'+m.id+'" value="'+esc(ov.titles[m.id]||m.title)+'" aria-label="'+HC.t('ttl')+'"><br><a href="curso.html?c='+m.id+'" style="color:var(--green);font-size:12px">curso.html?c='+m.id+'</a></td>'+
    '<td>'+(c?c.modules.map(function(x){return esc(x.title)+' <small>('+x.lessons.length+')</small>'}).join('<br>'):'…')+'</td><td>'+(c?c.modules.reduce(function(a,x){return a+x.lessons.length},0)+2:'')+' (+ presentación y cierre)</td>'+
    '<td>'+(c?c.modules.length+' quizzes + examen ('+c.exam.length+' preg.)':'')+'</td><td>'+(c?(c.downloads||[]).map(function(d){return '<a href="'+esc(d.file)+'">'+esc(d.title)+'</a>'}).join('<br>'):'')+'</td>'+
    '<td><label><input type="checkbox" data-v="'+m.id+'" '+(vis?'checked':'')+'> '+HC.t(vis?'pub':'hid')+'</label></td><td><button class="btn o s" data-u="'+m.id+'" aria-label="subir">▲</button> <button class="btn o s" data-d="'+m.id+'" aria-label="bajar">▼</button></td></tr>'});
  h+='</tbody></table></div>';$('#ad').innerHTML=h;
  HC.$$('[data-v]').forEach(function(e){e.addEventListener('change',function(){var id=e.getAttribute('data-v');ov.hidden=ov.hidden.filter(function(x){return x!==id});if(!e.checked)ov.hidden.push(id);persist();render()})});
  HC.$$('[data-t]',$('#ad')).forEach(function(e){e.addEventListener('change',function(){ov.titles[e.getAttribute('data-t')]=e.value;persist()})});
  function mv(id,dir){var o=ordered().map(function(x){return x.id}),i=o.indexOf(id),j=i+dir;if(j<0||j>=o.length)return;var t=o[i];o[i]=o[j];o[j]=t;ov.order=o;persist();render()}
  HC.$$('[data-u]').forEach(function(e){e.addEventListener('click',function(){mv(e.getAttribute('data-u'),-1)})});HC.$$('[data-d]').forEach(function(e){e.addEventListener('click',function(){mv(e.getAttribute('data-d'),1)})})}
$('#exp').addEventListener('click',function(){var out=JSON.parse(JSON.stringify(data));out.courses=ordered().map(function(m){var x=Object.assign({},m);if(ov.titles[m.id])x.title=ov.titles[m.id];x.hidden=ov.hidden.indexOf(m.id)>=0;return x});
  out.sections.forEach(function(s){s.courses=s.courses.slice()});
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}));a.download='catalog.json';document.body.appendChild(a);a.click();a.remove()});
$('#rst').addEventListener('click',function(){ov={hidden:[],order:[],titles:{}};persist();render()});
HC.langSelect($('#lang'));HC.apply();HC.onlang=function(){HC.apply();render()};
HC.loadCatalog().then(function(c){data=c;return Promise.all(c.courses.map(function(m){return HC.loadCourse(m.id).then(function(x){courses[m.id]=x}).catch(function(){})}))}).then(render);
})();
