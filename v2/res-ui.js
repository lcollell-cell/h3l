/* H3L · Revisión de reservas PD — interfaz: tablero, caso STAR, soportes, ficha de venta y recorrido guiado.
   Desarrollado por Leandro Collell. */
(function(){'use strict';
var R=window.RES,V=window.VZ,P=R.P,$=function(id){return document.getElementById(id)};
var f=V.fmt,sg=V.sgn;
function I(k,v){return H3L.t(k,v)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function I2(k,v){var o={};if(v)for(var n in v)o[n]=typeof v[n]==='string'?esc(v[n]):v[n];return H3L.t(k,o)}
function MM(v){return f(v/1000,2)}
function Mb(v){return f(v,1)}
function E(tag,cls,html,parent){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e}

/* ---------- estado ---------- */
var S={ds:R.demo(),src:{name:'',demo:true,v:null,hash:''},price:P.priceBase,decision:false,sel:null,hl:[],answer:null,tab:'board',files:{},pending:null,decLog:[],tour:-1,showTbl:{}};
var A=null;
function recalc(){A=R.analyze(S.ds,S.price);
  if(!S.sel||!A.wells.some(function(w){return w.id===S.sel})){var fx=A.wells.filter(function(w){return w.act==='fix'})[0];S.sel=fx?fx.id:A.wells.slice().sort(function(a,b){return a.var-b.var})[0].id}}
function well(id){return A.wells.filter(function(w){return w.id===id})[0]}
var COL={down:'var(--red)',limit:'var(--red)',fix:'var(--orange)',up:'var(--blue)',ok:'var(--gray-mark)',nodata:'var(--gray-mark)'};
var mlab={};function mLabel(x){var k=H3L.lang;if(!mlab[k])mlab[k]={};if(mlab[k][x])return mlab[k][x];var s;try{s=new Intl.DateTimeFormat(H3L.loc,{month:'short',year:'2-digit'}).format(new Date(Math.floor(x/12),x%12,1)).replace(/\./g,'')}catch(e){s=R.ym(x)}return mlab[k][x]=s}
function hostH(h,min){var v=h.clientHeight;return Math.max(min||150,v||min||150)}
function dnums(){var L=A.wells,d=L.filter(function(w){return w.act==='down'||w.act==='limit'}),u=L.filter(function(w){return w.act==='up'}),x=L.filter(function(w){return w.act==='fix'}),T=A.tot,upv=0;
  u.forEach(function(w){upv+=w.model-w.booked});var cost=x.length*P.wo;
  return {down:d.length,over:T.over,fix:x.length,gain:T.gain,gainNpv:T.gainNpv,cost:cost,roi:cost?T.gainNpv*1000/cost:0,up:u.length,upv:upv,rep:T.rep1,plan:T.model+T.gain,ids:d.concat(x,u).map(function(w){return w.id})}}
function attCount(){var n=0,req=['report','tests','econ'];req.forEach(function(k){if(S.files[k])n++});if(!S.src.demo)n+=2;return {att:n,req:5}}

/* ======================================================== KPI ======================================================== */
function renderKPIs(){var T=A.tot,dv=(T.model-T.booked)/T.booked*100,h=$('kpis'),D=dnums(),ac=attCount(),v=S.src.v;h.textContent='';
  function k(cls,l,val,unit,sub,tag,click){var e=E(tag||'div','kpi '+(cls||''),'<div class="l">'+esc(l)+'</div><div class="v">'+val+(unit?'<small>'+esc(unit)+'</small>':'')+'</div><div class="s">'+sub+'</div>',h);if(click){e.type='button';e.addEventListener('click',click)}return e}
  k('',I('k1.l'),MM(T.booked),'MMbbl',I2('k1.s',{n:A.wells.length,k:A.fields.length})+(S.decision?' · <b>'+I2('k1.rep',{v:MM(D.rep)})+'</b>':''));
  k(dv<-0.05?'neg':'',I('k2.l'),MM(T.model),'MMbbl',I2('k2.s',{d:sg(dv,1)+' %',p:f(S.price,0)}));
  k(T.over>0&&!S.decision?'neg':'ok',I('k3.l'),S.decision?MM(0):MM(T.over),'MMbbl',S.decision?I('k3.done'):I2('k3.s',{p:f(T.over/T.booked*100,1),n:D.down}));
  k('pos',I('k4.l'),'+'+MM(T.gain),'MMbbl',I2('k4.s',{n:D.fix,v:f(T.gainNpv,1),r:f(D.roi,0)}));
  var demo=S.src.demo,sc=v?v.score:null;
  k(demo?'':(v&&v.fail?'bad':(v&&v.warn?'warn':'ok')),I('k5.l'),demo?I('k5.demo'):f(sc,0)+' %','',demo?I('k5.demoS'):I2('k5.s',{ok:v.ok,w:v.warn,x:v.fail,a:ac.att,t:ac.req}),'button',function(){switchTab('sup')})}

/* ======================================================== 1 · puente ======================================================== */
function bridgeSteps(){var b=A.bridge,T=A.tot,L=function(k){return I(k)};
  function ids(a){return A.wells.filter(function(w){return a.indexOf(w.act)>=0}).map(function(w){return w.id}).slice(0,6).join(', ')}
  function st(key,val,col,total,list,tolx){var full=L('br.'+key),t=total?f(val,2):sg(val,2),tip=[{k:full,v:t+' MMbbl'}];if(list)tip.push({k:L('br.nw'),v:ids(list)||'—'});
    return {kind:total?'total':undefined,label:L('br.'+key+'S'),short:L('br.'+key+'S'),full:full,value:val,text:t,color:col,tip:tip}}
  return [st('book',T.booked/1000,'var(--ink-2)',true),
   st('over',(b.down+b.limit)/1000,'var(--red)',false,['down','limit']),
   st('fix',b.fix/1000,'var(--orange)',false,['fix']),
   st('up',b.up/1000,'var(--blue)',false,['up']),
   st('ok',(b.ok+b.nodata)/1000,'var(--gray-mark)',false),
   st('model',T.model/1000,'var(--ink-2)',true),
   st('gain',T.gain/1000,'var(--blue)',false,['fix']),
   st('plan',(T.model+T.gain)/1000,'var(--ink-2)',true)]}
function drawBridge(){var h=$('pl-bridge');if(!h.clientWidth)return;V.waterfall(h,{steps:bridgeSteps(),h:hostH(h,120),unit:'MMbbl',tickFmt:function(v){return f(v,1)},label:I('c1.t')});
  $('lg-bridge').innerHTML='<span><i style="background:var(--red)"></i>'+esc(I('lg.over'))+'</span> <span><i style="background:var(--orange)"></i>'+esc(I('lg.fix'))+'</span> <span><i style="background:var(--blue)"></i>'+esc(I('lg.up'))+'</span> <span><i style="background:var(--gray-mark)"></i>'+esc(I('lg.ok',{t:f(P.tol,0)}))+'</span>'}

/* ======================================================== 2 · variación por pozo ======================================================== */
function drawVar(){var host=$('pl-var');if(!host.clientWidth)return;
  var F=A.fields,nF=F.length,top=20,bot=24,avail=Math.max(120,hostH(host,120)),laneH=Math.max(44,(avail-top-bot)/nF),h=top+bot+laneH*nF,m={t:top,r:18,b:bot,l:88},lim=60,
    fr=V.frame(host,h,m,I('c2.t')),svg=fr.svg,iw=fr.iw,x=function(v){return m.l+(Math.max(-lim,Math.min(lim,v))+lim)/(2*lim)*iw};
  V.S('rect',{x:x(-P.tol),y:m.t-4,width:x(P.tol)-x(-P.tol),height:nF*laneH+4,fill:'var(--line-2)',opacity:.9},svg);
  V.T(svg,x(P.tol)+4,m.t-7,I('v.tolB',{t:f(P.tol,0)}),'t-note','start');
  var g=V.S('g',{'class':'ax'},svg);
  [-60,-40,-20,20,40,60].forEach(function(t){V.S('line',{x1:x(t),x2:x(t),y1:m.t,y2:m.t+nF*laneH},g);V.T(g,x(t),m.t+nF*laneH+16,sg(t,0)+' %','','middle')});
  V.S('line',{x1:x(0),x2:x(0),y1:m.t-4,y2:m.t+nF*laneH,stroke:'var(--gray-dark)','stroke-width':1},svg);V.T(g,x(0),m.t+nF*laneH+16,'0','','middle');
  F.forEach(function(fd,li){var y0=m.t+li*laneH,cy=y0+laneH/2;
    if(li)V.S('line',{x1:m.l-80,x2:fr.W-m.r,y1:y0,y2:y0,stroke:'var(--line)','stroke-width':1},svg);
    var nm=fd.id,L=V.wrap(nm,12);L.slice(0,2).forEach(function(l,k){V.T(svg,m.l-12,cy+4+(k-(Math.min(L.length,2)-1)/2)*13,l,'t-lbl','end')});
    var ws=A.wells.filter(function(w){return w.field===fd.id}).sort(function(a,b){return a.var-b.var}),placed=[];
    ws.forEach(function(w,i){var dy=((i%3)-1)*Math.max(13,laneH*0.24),px=x(w.var),py=cy+dy,hl=S.hl.indexOf(w.id)>=0,sel=w.id===S.sel,col=COL[w.act],gr=V.S('g',{'class':'vbar'},svg);
      if(hl)V.S('circle',{cx:px,cy:py,r:12,fill:'#CFE1FA'},gr);
      var dot=V.S('circle',{cx:px,cy:py,r:(hl||sel)?7.5:6,fill:col,stroke:sel?'var(--ink)':'#fff','stroke-width':sel?2.5:1.5,opacity:w.act==='ok'?.75:1},gr);
      if(w.act!=='ok'){var txt=w.id+(Math.abs(w.var)>=lim?' '+sg(w.var,0)+' %':''),left=w.var<0&&px-10>m.l+34,tx=V.T(gr,left?px-10:px+10,py+4,txt,'t-note',left?'end':'start');if(w.var>0&&px>fr.W-m.r-60){tx.setAttribute('x',px-10);tx.setAttribute('text-anchor','end')}
        if(sel||hl)tx.setAttribute('style','font-weight:700;fill:var(--ink)')}
      var hit=V.S('circle',{cx:px,cy:py,r:13,fill:'transparent'},gr);
      V.bindTip(hit,w.id+' · '+w.field,[{k:I('tb.booked'),v:Mb(w.booked)+' Mbbl'},{k:I('tb.model'),v:Mb(w.model)+' Mbbl'},{k:I('tb.var'),v:sg(w.var,0)+' %',c:col},{k:I('tb.act'),v:I('act.'+w.act)}]);
      hit.setAttribute('role','button');hit.style.cursor='pointer';
      hit.addEventListener('click',function(){selectWell(w.id)});
      hit.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectWell(w.id)}})})});
  $('lg-var').innerHTML='<span><i class="dt" style="background:var(--red)"></i>'+esc(I('lg.lvar1'))+'</span> <span><i class="dt" style="background:var(--orange)"></i>'+esc(I('lg.lvar2'))+'</span> <span><i class="dt" style="background:var(--blue)"></i>'+esc(I('lg.lvar3'))+'</span> <span><i class="dt" style="background:var(--gray-mark)"></i>'+esc(I('lg.lvar4'))+'</span>'}
function selectWell(id){S.sel=id;drawVar();renderDecl();var s=$('wsel');if(s)s.value=id}

/* ======================================================== 3 · declinación ======================================================== */
function declData(w){var lastX=A.lastX,first=w.series.length?w.series[0].x:lastX-35,N0=lastX-first+1,FW=36,N=N0+FW,labels=[],obs=[],mod=[],bk=[],lim=[],pre=[],i;
  var qe=A.qel,Db=(w.q0>qe&&w.booked>0)?(w.q0-qe)*R.DAY/1000/w.booked:null,map={};w.series.forEach(function(p){map[p.x]=p.q});
  for(i=0;i<N;i++){var x=first+i;labels.push(mLabel(x));obs.push(map[x]!=null?map[x]:null);var dt=x-lastX;
    mod.push(dt>=0?w.q0*Math.exp(-w.D*dt):null);bk.push(dt>=0&&Db?w.q0*Math.exp(-Db*dt):null);lim.push(isFinite(qe)?qe:null);
    pre.push(dt>=0&&w.drop?w.drop.qPred*Math.exp(-w.drop.D*dt):null)}
  return {labels:labels,obs:obs,mod:mod,bk:bk,lim:lim,pre:pre,N0:N0,N:N,first:first,Db:Db}}
function renderDecl(){var w=well(S.sel);if(!w)return;var host=$('pl-decl');
  $('declT').textContent=I('c3.t2',{w:w.id});
  $('declS').innerHTML=I2('c3.s2',{f:w.field,q:f(w.q0,0),l:f(A.qel,1)})+' <span class="pill '+({down:'r',limit:'r',fix:'o',up:'b',ok:'',nodata:''}[w.act])+'">'+esc(I('act.'+w.act))+'</span>';
  var sel=$('wsel');if(sel&&sel.options.length!==A.wells.length){sel.textContent='';A.wells.forEach(function(x){var o=document.createElement('option');o.value=x.id;o.textContent=x.id;sel.appendChild(o)})}if(sel)sel.value=w.id;
  var d=declData(w);
  if(host.clientWidth){var series=[{name:I('sr.mod'),pts:d.mod,c:'var(--blue)',w:2.5},{name:I('sr.bk'),pts:d.bk,c:'var(--red)',w:2,dash:'6 4'},{name:I('sr.lim',{q:f(A.qel,1)}),pts:d.lim,c:'var(--ink-2)',w:1.2,dash:'2 3',tip:false}];
    if(w.drop)series.splice(2,0,{name:I('sr.pre'),pts:d.pre,c:'var(--orange)',w:2,dash:'3 3'});
    var ticks=[];for(var i=0;i<d.N;i+=12)ticks.push(i);
    V.line(host,{x:d.labels,series:series,dots:[{name:I('sr.obs'),pts:d.obs,c:'var(--gray-dark)',r:3}],vlines:[{i:d.N0-1,label:I('c.today'),dx:-5,anchor:'end'}],xTicks:ticks,h:hostH(host,120),yMin:0,yFmt:function(v){return f(v,0)},tipFmt:function(v){return f(v,0)+' bbl/d'},label:I('c3.t2',{w:w.id})+'. '+I('c3.s2',{f:w.field,q:f(w.q0,0),l:f(A.qel,1)})+'. '+I('c3.leg',{b:Mb(w.booked),m:Mb(w.model)}),l:46})}
  $('lg-decl').innerHTML='<span><i class="dt" style="background:var(--gray-dark)"></i>'+esc(I('sr.obs'))+'</span> <span><i class="ln" style="background:var(--blue)"></i>'+esc(I('sr.mod'))+'</span> <span><i class="ln" style="background:var(--red)"></i>'+esc(I('sr.bk'))+'</span>'+(w.drop?' <span><i class="ln" style="background:var(--orange)"></i>'+esc(I('sr.pre'))+'</span>':'')+' <span><i class="ln" style="background:var(--ink-2)"></i>'+esc(I('lg.lim'))+'</span> <span>bbl/d</span>';
  /* tabla gemela */
  var rows='',T=[0,6,12,24,36];T.forEach(function(t){var q=w.q0*Math.exp(-w.D*t),qb=d.Db?w.q0*Math.exp(-d.Db*t):null;rows+='<tr><td>+'+t+'</td><td>'+f(q,0)+'</td><td>'+(qb!=null?f(qb,0):'—')+'</td><td>'+f(A.qel,1)+'</td></tr>'});
  $('tb-decl').innerHTML='<table><thead><tr><th>'+esc(I('tb.months'))+'</th><th>'+esc(I('sr.modS'))+'</th><th>'+esc(I('sr.bkS'))+'</th><th>'+esc(I('sr.limS'))+'</th></tr></thead><tbody>'+rows+'</tbody></table>'}

/* ======================================================== 4 · campos ======================================================== */
function drawField(){var h=$('pl-field'),T=A.tot,html='<table class="fld"><thead><tr><th>'+esc(I('tb.field'))+'</th><th>'+esc(I('tb.booked'))+'</th><th>'+esc(I('tb.model'))+'</th><th>'+esc(I('tb.var'))+'</th><th>'+esc(I('tb.review'))+'</th></tr></thead><tbody>';
  A.fields.forEach(function(F){var d=(F.model-F.booked)/F.booked*100,pills='';
    if(F.down+F.limit)pills+='<span class="pill r" title="'+esc(I('lg.over'))+'">'+(F.down+F.limit)+'</span>';
    if(F.fix)pills+='<span class="pill o" title="'+esc(I('lg.fix'))+'">'+F.fix+'</span>';
    if(F.up)pills+='<span class="pill b" title="'+esc(I('lg.up',{t:''}))+'">'+F.up+'</span>';
    html+='<tr><td>'+esc(F.id)+'</td><td>'+MM(F.booked)+'</td><td>'+MM(F.model)+'</td><td><span class="dv '+(d<-1?'n':d>1?'p':'')+'">'+sg(d,1)+' %</span></td><td>'+(pills||'—')+'</td></tr>'});
  var d=(T.model-T.booked)/T.booked*100;
  html+='<tr><td>'+esc(I('tb.total'))+'</td><td><b>'+MM(T.booked)+'</b></td><td><b>'+MM(T.model)+'</b></td><td><span class="dv '+(d<-1?'n':d>1?'p':'')+'">'+sg(d,1)+' %</span></td><td></td></tr></tbody></table><p class="note">'+esc(I('c4.n'))+'</p>';
  h.innerHTML=html}

/* ======================================================== tablas gemelas ======================================================== */
function renderTables(){var br=bridgeSteps(),rows='';br.forEach(function(s){rows+='<tr><td>'+esc(s.full)+'</td><td>'+esc(s.text)+'</td></tr>'});
  $('tb-bridge').innerHTML='<table><thead><tr><th>'+esc(I('tb.step'))+'</th><th>MMbbl</th></tr></thead><tbody>'+rows+'</tbody></table>';
  var L=A.wells.slice().sort(function(a,b){return a.var-b.var});rows='';
  L.forEach(function(w){rows+='<tr class="'+(S.hl.indexOf(w.id)>=0?'hl':'')+'"><td>'+esc(w.id)+'</td><td>'+esc(w.field)+'</td><td>'+Mb(w.booked)+'</td><td>'+Mb(w.model)+'</td><td>'+sg(w.var,0)+' %</td><td>'+esc(I('act.'+w.act))+'</td></tr>'});
  $('tb-var').innerHTML='<table><thead><tr><th>'+esc(I('tb.well'))+'</th><th>'+esc(I('tb.field'))+'</th><th>'+esc(I('tb.booked'))+' (Mbbl)</th><th>'+esc(I('tb.model'))+' (Mbbl)</th><th>'+esc(I('tb.var'))+'</th><th>'+esc(I('tb.act'))+'</th></tr></thead><tbody>'+rows+'</tbody></table>'}
function toggleTbl(k){S.showTbl[k]=!S.showTbl[k];applyTbl()}
function applyTbl(){['bridge','var','decl'].forEach(function(k){var on=!!S.showTbl[k];$('pl-'+k).hidden=on;$('tb-'+k).hidden=!on;var b=document.querySelector('[data-tbl="'+k+'"]');b.setAttribute('aria-pressed',on);b.textContent=I(on?'c.chart':'c.table')});renderCharts(true)}

/* ======================================================== columna lateral ======================================================== */
function renderSide(){var D=dnums(),box=$('decision');box.className='box dec'+(S.decision?' done':'');
  var html='<h3>'+esc(I('d.t'))+'</h3><p class="sub">'+esc(I('d.s'))+'</p><ul>'
   +'<li><span class="n">1</span><span>'+I2('d.a1',{n:D.down,v:Mb(D.over)})+'</span></li>'
   +'<li><span class="n">2</span><span>'+I2('d.a2',{n:D.fix,g:Mb(D.gain),k:f(D.cost,0),v:f(D.gainNpv,1),r:f(D.roi,0)})+'</span></li>'
   +'<li><span class="n">3</span><span>'+I2('d.a3',{n:D.up,v:Mb(D.upv)})+'</span></li></ul>';
  if(S.decision){var dd=(D.rep-A.tot.booked)/A.tot.booked*100;html+='<div class="res">'+I2('d.res',{r:MM(D.rep),d:sg(dd,1)+' %',p:MM(D.plan)})+'</div>'}
  html+='<div class="row"><button class="btn '+(S.decision?'ghost':'pri')+'" id="bApply" type="button">'+esc(I(S.decision?'d.undo':'d.apply'))+'</button>'+(S.decision?'<button class="btn dark" id="bReg" type="button">'+esc(I('d.reg'))+'</button>':'')+'<button class="btn ghost" id="bStar" type="button">'+esc(I('d.star'))+'</button></div>'
   +(S.decLog.length?'<p class="note">'+esc(I('d.logged',{n:S.decLog.length}))+'</p>':'');
  box.innerHTML=html;
  $('bApply').onclick=function(){S.decision=!S.decision;S.hl=S.decision?D.ids:[];renderAll()};
  $('bStar').onclick=function(){switchTab('star')};
  if($('bReg'))$('bReg').onclick=function(){registerDecision()};
  $('vPrice').textContent=f(S.price,0)+' USD';$('rgPrice').value=S.price;$('vTol').textContent='±'+f(P.tol,0)+' %';$('rgTol').value=P.tol;
  $('assumeNote').textContent=I('as.n',{q:f(A.qel,1),r:f(P.roy*100,0),v:f(P.vc,0),f:f(P.fixed,0),w:f(P.wo,0),d:f(P.disc*100,0),m:f(P.win,0)})}
function renderAnswer(){var b=$('answer'),a=S.answer;if(!a){b.hidden=true;return}b.hidden=false;
  var html='<div style="display:flex;gap:8px;align-items:flex-start"><div style="flex:1"><h3>'+esc(a.title)+'</h3><p class="sub">“'+esc(a.q)+'”</p></div><button class="tv" type="button" id="aClose" aria-label="'+esc(I('a.close'))+'" style="font-size:18px;line-height:1;padding:2px 8px;border:1px solid var(--line);border-radius:6px">×</button></div><p>'+a.html+'</p>';
  if(a.rows&&a.rows.length){html+='<div class="mini"><table><thead><tr>'+a.head.map(function(x){return '<th>'+esc(x)+'</th>'}).join('')+'</tr></thead><tbody>'+a.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+esc(c)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
  if(a.act)html+='<div class="row" style="display:flex;margin-top:10px"><button class="btn pri sm" id="aAct" type="button">'+esc(a.act.l)+'</button></div>';
  if(a.src&&a.src.length)html+='<div class="src"><b>'+esc(I('a.src'))+'</b><ul>'+a.src.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ul></div>';
  b.innerHTML=html;b.setAttribute('role','status');
  $('aClose').onclick=function(){S.answer=null;S.hl=[];renderAnswer();drawVar()};
  if($('aAct'))$('aAct').onclick=function(){if(a.act.k==='apply'){S.decision=true;S.hl=dnums().ids;renderAll()}else if(a.act.k==='support')switchTab('sup')}}

/* ======================================================== consulta ======================================================== */
function srcLines(a){return [I('r.src1',{f:S.src.demo?I('src.demo'):S.src.name,n:a.wells.length}),I('r.src2',{w:P.win}),I('r.src3',{p:f(a.price,0),f:f(P.fixed,0),r:f(P.roy*100,0),q:f(a.qel,1)})]}
var ctx={I:I2,f:f,P:P,DAY:R.DAY,A:function(){return A},
  setPrice:function(p){S.price=Math.max(40,Math.min(100,Math.round(p)));recalc();renderAll(true);return A},
  baseTotal:function(){return R.analyze(S.ds,P.priceBase).tot.model},
  srcName:function(){return S.src.demo?I('src.demo'):S.src.name},srcWith:srcLines,
  dataState:function(){var v=S.src.v,ac=attCount();return {demo:S.src.demo,name:S.src.name,ok:v?v.ok:0,warn:v?v.warn:0,fail:v?v.fail:0,score:v?v.score:0,att:ac.att,t:ac.req}},
  decision:function(){var d=dnums();d.cost=d.cost;return d}};
function ask(q){q=String(q||'').trim();if(!q)return;var inp=$('askIn');inp.value=q;
  var a=window.RESASK.run(q,ctx);S.answer=a;S.hl=a.hl||[];if(a.sel)S.sel=a.sel;
  renderAnswer();drawVar();renderDecl();renderTables();$('side').scrollTop=0;
  if(a.kind==='none'){}}
function renderChips(){var c=$('chips');c.textContent='';for(var i=1;i<=5;i++){(function(i){var b=E('button','chip',null,c);b.type='button';b.textContent=I('q.'+i);b.addEventListener('click',function(){ask(I('q.'+i))})})(i)}}

/* ======================================================== decisión registrada ======================================================== */
function registerDecision(){var D=dnums();S.decLog.push({at:new Date().toISOString(),price:S.price,tolerance_pct:P.tol,wells_written_down:A.wells.filter(function(w){return w.act==='down'||w.act==='limit'}).map(function(w){return w.id}),wells_to_repair:A.wells.filter(function(w){return w.act==='fix'}).map(function(w){return w.id}),wells_to_document_upside:A.wells.filter(function(w){return w.act==='up'}).map(function(w){return w.id}),pd_to_report_mbbl:+D.rep.toFixed(1),over_booked_mbbl:+D.over.toFixed(1),recoverable_mbbl:+D.gain.toFixed(1),npv_mmusd:+D.gainNpv.toFixed(2)});renderSide();toast(I('d.regok'))}
function toast(t){var el=$('tip');el.textContent=t;el.classList.add('on');el.style.left='50%';el.style.top='80px';el.style.transform='translateX(-50%)';setTimeout(function(){el.classList.remove('on');el.style.transform=''},2200)}
function dl(name,text,type){try{var b=new Blob([text],{type:type||'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u)},400)}catch(e){}}
function evidenceLog(){var v=S.src.v,T=A.tot;return JSON.stringify({tool:'H3L Global Energy · Revisión de reservas PD',generated_at:new Date().toISOString(),assumptions:{price_usd_bbl:S.price,royalty:P.roy,variable_cost_usd_bbl:P.vc,fixed_cost_usd_well_month:P.fixed,workover_cost_kusd:P.wo,tolerance_pct:P.tol,fit_window_months:P.win,discount_rate:P.disc,horizon_months:P.hz,decline_model:'exponential, least squares on ln(q)'},
  dataset:S.src.demo?{source:'demo (synthetic data)'}:{file:S.src.name,sha256:S.src.hash,rows:v.rows,wells:v.nWells,last_month:R.ym(v.lastX),controls:v.checks.map(function(c){return {id:c.id,status:c.st,count:c.n}}),score_pct:v.score},
  attachments:Object.keys(S.files).map(function(k){var a=S.files[k];return {slot:k,file:a.name,bytes:a.size,sha256:a.hash,attached_at:a.at}}),
  results:{pd_booked_mbbl:+T.booked.toFixed(1),pd_model_mbbl:+T.model.toFixed(1),over_booked_mbbl:+T.over.toFixed(1),recoverable_with_plan_mbbl:+T.gain.toFixed(1),npv_gain_mmusd:+T.gainNpv.toFixed(2)},
  wells:A.wells.map(function(w){return {well:w.id,field:w.field,booked_mbbl:+w.booked.toFixed(1),model_mbbl:+w.model.toFixed(1),variance_pct:+w.var.toFixed(1),action:w.act}}),decisions:S.decLog,note:'Consistency controls are not a certification of reserves. Classification under SPE-PRMS remains with the qualified reserves evaluator.'},null,2)}

/* ======================================================== caso STAR ======================================================== */
function renderStar(){var b=$('starBody'),T=A.tot,D=dnums(),mo=0,fx=A.wells.filter(function(w){return w.act==='fix'}),dv=(T.model-T.booked)/T.booked*100;
  A.wells.forEach(function(w){if(w.series.length)mo=Math.max(mo,w.series[w.series.length-1].x-w.series[0].x+1)});
  var A55=R.analyze(S.ds,55),lim55=A55.wells.filter(function(w){return w.act==='limit'}).length,d55=(A55.tot.model-T.model)/T.model*100;
  var worst=A.wells.filter(function(w){return w.act==='down'||w.act==='limit'}).sort(function(a,c){return (c.booked-c.model)-(a.booked-a.model)})[0];
  var rep=D.rep,expA=T.exp0,expC=T.exp1;
  var h='';
  h+='<section class="st" id="st-S"><div class="lt">S<small>'+esc(I('s.Sk'))+'</small></div><div><h2>'+esc(I('s.Sh'))+'</h2><p class="tx">'+I2('s.S',{n:A.wells.length,k:A.fields.length,b:MM(T.booked),mo:f(mo,0),p:f(S.price,0)})+'</p>'
   +'<div class="ev3"><div class="big"><div class="v">'+MM(T.booked)+'</div><div class="l">'+esc(I('s.e1'))+'</div></div><div class="big"><div class="v">'+MM(T.model)+'</div><div class="l">'+esc(I('s.e2'))+'</div></div><div class="big"><div class="v '+(dv<0?'neg':'pos')+'">'+sg(dv,1)+' %</div><div class="l">'+esc(I('s.e3'))+'</div></div></div></div></section>';
  h+='<section class="st" id="st-T"><div class="lt">T<small>'+esc(I('s.Tk'))+'</small></div><div><h2>'+esc(I('s.Th'))+'</h2><p class="tx">'+I2('s.T',{})+'</p></div></section>';
  h+='<section class="st" id="st-A"><div class="lt">A<small>'+esc(I('s.Ak'))+'</small></div><div><h2>'+esc(I('s.Ah'))+'</h2><ol class="steps">'
   +step(1,'s.a1h',I2('s.a1p',{b:MM(T.booked),m:MM(T.model),d:sg(dv,1)+' %'}),'go1')
   +step(2,'s.a2h',I2('s.a2p',{n:D.down,v:Mb(D.over),w:worst?worst.id:'—',d:worst?f(worst.var,0):'0',m:D.fix,r:fx.length?f(fx[0].drop.ratio*100,0):'0',t:f(P.tol,0)}),'go2')
   +step(3,'s.a3h',I2('s.a3p',{g:Mb(D.gain),k:f(D.cost,0),v:f(D.gainNpv,1),r:f(D.roi,0)}),'go3')
   +step(4,'s.a4h',I2('s.a4p',{d:sg(d55,1)+' %',n:lim55,p:f(S.price,0)}),'go4')
   +step(5,'s.a5h',I2('s.a5p',{}),'go5')+'</ol></div></section>';
  h+='<section class="st" id="st-R"><div class="lt">R<small>'+esc(I('s.Rk'))+'</small></div><div><h2>'+esc(I('s.Rh'))+'</h2><p class="tx">'+I2('s.R',{a:MM(expA),c:MM(expC),g:MM(D.gain),v:f(D.gainNpv,1)})+'</p>'
   +'<table class="opt" style="margin-top:12px"><thead><tr><th>'+esc(I('s.oh0'))+'</th><th>'+esc(I('s.oh1'))+'</th><th>'+esc(I('s.oh2'))+'</th><th>'+esc(I('s.oh3'))+'</th><th>'+esc(I('s.oh4'))+'</th><th>'+esc(I('s.oh5'))+'</th></tr></thead><tbody>'
   +'<tr><td>'+esc(I('s.oA'))+'<small>'+esc(I('s.oAs'))+'</small></td><td>'+MM(T.booked)+'</td><td>'+MM(expA)+'</td><td>—</td><td>—</td><td>—</td></tr>'
   +'<tr><td>'+esc(I('s.oB'))+'<small>'+esc(I('s.oBs'))+'</small></td><td>'+MM(T.model)+'</td><td>'+MM(0)+'</td><td>—</td><td>—</td><td>—</td></tr>'
   +'<tr class="pick"><td>'+esc(I('s.oC'))+'<small>'+esc(I('s.oCs'))+'</small></td><td>'+MM(rep)+'</td><td>'+MM(expC)+'</td><td>+'+MM(D.gain)+'</td><td>'+f(D.cost/1000,2)+'</td><td>+'+f(D.gainNpv,1)+'</td></tr></tbody></table>'
   +'<div class="bigres"><div class="big"><div class="v neg">'+sg((rep-T.booked)/T.booked*100,1)+' %</div><div class="l">'+esc(I('s.r1'))+'</div></div><div class="big"><div class="v pos">'+MM(expA)+' → '+MM(expC)+'</div><div class="l">'+esc(I('s.r2'))+'</div></div><div class="big"><div class="v pos">+'+f(D.gainNpv,1)+' <span style="font-size:14px">MMUSD</span></div><div class="l">'+esc(I('s.r3',{r:f(D.roi,0)}))+'</div></div></div>'
   +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn pri" id="sApply" type="button">'+esc(I(S.decision?'d.undo':'d.apply'))+'</button><button class="btn ghost" id="sBoard" type="button">'+esc(I('s.open'))+'</button></div>'
   +'<p class="note">'+esc(I(S.src.demo?'s.noteDemo':'s.noteData'))+'</p></div></section>';
  b.innerHTML=h;
  function go(id,fn){var e=b.querySelector('[data-go="'+id+'"]');if(e)e.addEventListener('click',fn)}
  go('go1',function(){openCard('c-bridge')});go('go2',function(){S.hl=D.ids;openCard('c-var');drawVar()});
  go('go3',function(){if(fx[0])S.sel=fx[0].id;openCard('c-decl');renderDecl();drawVar()});
  go('go4',function(){ctx.setPrice(55);openCard('rgPrice')});go('go5',function(){switchTab('sup')});
  $('sApply').onclick=function(){S.decision=!S.decision;S.hl=S.decision?D.ids:[];renderAll()};$('sBoard').onclick=function(){switchTab('board')}}
function step(n,hk,p,id){return '<li><span class="n">'+n+'</span><div><h3>'+esc(I(hk))+'</h3><p>'+p+'</p></div><button class="btn ghost sm" type="button" data-go="'+id+'">'+esc(I('s.see'))+'</button></li>'}
function openCard(id){switchTab('board');setTimeout(function(){var e=$(id);if(!e)return;var c=e.closest('.card')||e.closest('.box')||e;c.classList.add('pulse');if(c.scrollIntoView)try{c.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(x){}setTimeout(function(){c.classList.remove('pulse')},2400)},60)}

/* ======================================================== soportes ======================================================== */
var SLOTS=['prod','booked','report','tests','econ','plan'];
function fsize(n){return n>1048576?f(n/1048576,1)+' MB':f(Math.max(1,n/1024),0)+' KB'}
function renderSupports(){var m=$('mat'),v=S.pending||S.src.v;m.textContent='';
  SLOTS.forEach(function(k){var row=E('div','mrow'),icon='○',cls='',det=esc(I('m.'+k+'.d')),btn='';
    if(k==='prod'||k==='booked'){if(S.src.demo){cls='demo';icon='◆';det=esc(I('m.demo'))}else{cls='done';icon='✓';det=esc(S.src.name)+' · '+esc((S.src.hash||'').slice(0,12))}}
    else{var a=S.files[k];if(a){cls='done';icon='✓';det=esc(a.name)+' · '+fsize(a.size)+' · '+esc((a.hash||'').slice(0,12))+' · '+esc(new Date(a.at).toLocaleString(H3L.loc))}
      btn='<button class="btn ghost sm" type="button" data-att="'+k+'">'+esc(I(a?'m.replace':'m.attach'))+'</button>'}
    row.className='mrow '+cls;row.innerHTML='<span class="ic" aria-hidden="true">'+icon+'</span><div><b>'+esc(I('m.'+k+'.t'))+(k==='plan'?' <span style="font-weight:500;color:var(--ink-2)">('+esc(I('m.opt'))+')</span>':'')+'</b><small>'+det+'</small></div><div>'+btn+'</div>';m.appendChild(row)});
  Array.prototype.forEach.call(m.querySelectorAll('[data-att]'),function(b){b.addEventListener('click',function(){pickFile(b.getAttribute('data-att'))})});
  var sc=$('score'),ck=$('chk');ck.textContent='';
  if(!v){sc.innerHTML='<div class="v">—</div><div class="t">'+esc(I('u.none'))+'</div>';$('useIt').disabled=true}
  else{sc.innerHTML='<div class="v">'+f(v.score,0)+' %</div><div><div class="t"><b>'+esc(v.name)+'</b> · '+I2('u.sum',{r:f(v.rows,0),w:f(v.nWells||0,0),ok:v.ok,a:v.warn,x:v.fail})+'</div><div class="meter"><i style="width:'+v.score+'%"></i></div></div>';
    v.checks.forEach(function(c){var d=E('div','crow '+c.st,'<div><b>'+esc(I('k.'+c.id))+'</b><p>'+I2('k.'+c.id+'.'+c.st,{n:f(c.n,0),ex:c.v.ex||'—',miss:c.v.miss||'',d:c.v.d||''})+'</p></div><span class="tg">'+esc(I('st.'+c.st))+'</span>',ck)});
    $('useIt').disabled=!(S.pending&&S.pending.usable)}
  $('useDemo').hidden=S.src.demo;
  $('supNote').textContent=v?(v.usable||!S.pending?I('u.note'):I('u.blocked')):I('u.note')}
var fileMode=null;
function pickFile(slot){fileMode=slot;var i=$('fileIn');i.accept=slot?'':'.csv,.tsv,.txt,text/csv,text/plain';i.value='';i.click()}
function handleFile(file,slot){if(!file)return;var rd=new FileReader();
  rd.onload=function(){var buf=rd.result;R.hash(buf).then(function(hs){
    var isText=/\.(csv|tsv|txt)$/i.test(file.name)||/^text\//.test(file.type);
    if(isText&&!slot){var txt;try{txt=new TextDecoder('utf-8').decode(buf)}catch(e){txt=''}validateText(txt,file.name,hs,file.size)}
    else{var k=slot;if(!k){var n=file.name.toLowerCase();k=/(inform|report|reserv)/.test(n)?'report':/(prueba|test|estado|mecan|well)/.test(n)?'tests':/(econ|precio|price|costo|cost)/.test(n)?'econ':/(plan|interv)/.test(n)?'plan':null;
      if(!k)k=['report','tests','econ','plan'].filter(function(x){return !S.files[x]})[0]||'plan'}
      S.files[k]={name:file.name,size:file.size,hash:hs,at:new Date().toISOString()};renderSupports();renderKPIs()}})};
  rd.readAsArrayBuffer(file)}
function validateText(txt,name,hs,size){var v=R.validate(txt,name);v.hash=hs;v.size=size;S.pending=v;renderSupports()}
function useData(){var v=S.pending;if(!v||!v.usable)return;S.ds=v.ds;S.src={name:v.name,demo:false,v:v,hash:v.hash};S.pending=null;S.sel=null;S.hl=[];S.answer=null;S.decision=false;S.files.prod=null;recalc();renderAll();switchTab('board')}
function useDemo(){S.ds=R.demo();S.src={name:'',demo:true,v:null,hash:''};S.pending=null;S.sel=null;S.hl=[];S.answer=null;S.decision=false;recalc();renderAll()}
function loadSample(txt,name){var enc=new TextEncoder().encode(txt);R.hash(enc.buffer).then(function(hs){validateText(txt,name,hs,enc.length)})}

/* ======================================================== ficha de venta ======================================================== */
function renderSales(){var T=A.tot,D=dnums(),sh=$('sheet'),worst=A.wells.filter(function(w){return w.act==='down'||w.act==='limit'}).length;
  sh.innerHTML='<div class="sh-top"><div><h1>'+esc(I('v.h1'))+'</h1><p>'+esc(I('v.p'))+'</p><div class="who">'+esc(I('v.who'))+'</div></div>'
   +'<div class="proof"><div><div class="v">'+MM(T.over)+'</div><div class="l">'+I2('v.p1',{n:worst,t:A.wells.length})+'</div></div><div><div class="v">+'+MM(T.gain)+'</div><div class="l">'+I2('v.p2',{n:D.fix,v:f(T.gainNpv,1)})+'</div></div><div><div class="v">12</div><div class="l">'+esc(I('v.p3'))+'</div></div><div><div class="v">0</div><div class="l">'+esc(I('v.p4'))+'</div></div></div></div>'
   +'<div class="sh-body"><div><h2>'+esc(I('v.c1t'))+'</h2><ul><li><span class="d">▸</span><span>'+esc(I('v.c1a'))+'</span></li><li><span class="d">▸</span><span>'+esc(I('v.c1b'))+'</span></li><li><span class="d">▸</span><span>'+esc(I('v.c1c'))+'</span></li></ul></div>'
   +'<div><h2>'+esc(I('v.c2t'))+'</h2><ol><li><span class="n">1</span><span><b>'+esc(I('v.c2a'))+'</b> '+esc(I('v.c2as'))+'</span></li><li><span class="n">2</span><span><b>'+esc(I('v.c2b'))+'</b> '+esc(I('v.c2bs'))+'</span></li><li><span class="n">3</span><span><b>'+esc(I('v.c2c'))+'</b> '+esc(I('v.c2cs'))+'</span></li></ol></div>'
   +'<div><h2>'+esc(I('v.c3t'))+'</h2><ul><li><span class="d">✓</span><span>'+esc(I('v.c3a'))+'</span></li><li><span class="d">✓</span><span>'+esc(I('v.c3b'))+'</span></li><li><span class="d">✓</span><span>'+esc(I('v.c3c'))+'</span></li><li><span class="d">✓</span><span>'+esc(I('v.c3d'))+'</span></li><li><span class="d">–</span><span>'+esc(I('v.c3e'))+'</span></li></ul></div></div>'
   +'<div class="sh-body" style="padding-top:0;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px"><div><h2>S · '+esc(I('s.Sk'))+'</h2><p style="margin-top:8px;font-size:13px;line-height:1.5">'+I2('v.sS',{b:MM(T.booked),n:A.wells.length})+'</p></div><div><h2>T · '+esc(I('s.Tk'))+'</h2><p style="margin-top:8px;font-size:13px;line-height:1.5">'+esc(I('v.sT'))+'</p></div><div><h2>A · '+esc(I('s.Ak'))+'</h2><p style="margin-top:8px;font-size:13px;line-height:1.5">'+I2('v.sA',{n:D.down,m:D.fix})+'</p></div><div><h2>R · '+esc(I('s.Rk'))+'</h2><p style="margin-top:8px;font-size:13px;line-height:1.5">'+I2('v.sR',{a:MM(T.exp0),c:MM(T.exp1),g:MM(D.gain)})+'</p></div></div>'
   +'<div class="sh-fig"><div class="ch" style="margin-bottom:4px"><div><h3>'+esc(I('c1.t'))+'</h3><p>'+esc(I('c1.s'))+'</p></div></div><div class="plot" id="pl-sales"></div></div>'
   +'<div class="sh-foot"><a class="btn pri" href="../index.html?go=contacto">'+esc(I('v.cta'))+'</a><p>'+esc(I('v.limits'))+'</p></div>';
  var h=$('pl-sales');if(h.clientWidth)V.waterfall(h,{steps:bridgeSteps(),h:200,unit:'MMbbl',tickFmt:function(v){return f(v,1)},label:I('c1.t')})}

/* ======================================================== recorrido guiado ======================================================== */
var STEPS=[
 {tab:'board',t:'#kpis',k:'1',fn:function(){S.decision=false;S.answer=null;S.hl=[];renderAll()}},
 {tab:'board',t:'#c-bridge',k:'2'},
 {tab:'board',t:'#c-var',k:'3',fn:function(){S.hl=dnums().ids;drawVar()}},
 {tab:'board',t:'#askbar',k:'4',fn:function(){typeAsk(I('q.1'))}},
 {tab:'board',t:'#decision',k:'5',fn:function(){S.decision=true;S.hl=dnums().ids;renderAll()}},
 {tab:'sup',t:'#chk',k:'6',fn:function(){loadSample(R.badCSV(),'ejemplo_con_errores.csv')}},
 {tab:'sales',t:'#sheet',k:'7'}];
function tourShow(i){var el=$('tour');if(i<0||i>=STEPS.length){tourEnd();return}
  S.tour=i;var s=STEPS[i];switchTab(s.tab);if(s.fn)s.fn();
  el.hidden=false;el.innerHTML='<div class="k">'+esc(I('tr.step',{i:i+1,n:STEPS.length}))+'</div><h4>'+esc(I('tr.'+s.k+'.t'))+'</h4><p>'+esc(I('tr.'+s.k+'.p'))+'</p><div class="row"><button class="btn ghost sm" id="trP" type="button"'+(i?'':' disabled')+'>'+esc(I('tr.prev'))+'</button><span class="sp"></span><button class="btn ghost sm" id="trX" type="button">'+esc(I('tr.end'))+'</button><button class="btn pri sm" id="trN" type="button">'+esc(I(i===STEPS.length-1?'tr.done':'tr.next'))+'</button></div>';
  $('trP').onclick=function(){tourShow(i-1)};$('trN').onclick=function(){tourShow(i+1)};$('trX').onclick=tourEnd;
  setTimeout(function(){var t=document.querySelector(s.t);if(!t)return;var c=t.closest('.card')||t;c.classList.add('pulse');try{c.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}setTimeout(function(){c.classList.remove('pulse')},2600)},120)}
function tourEnd(){S.tour=-1;$('tour').hidden=true}
var typeT=null;
function typeAsk(q){var inp=$('askIn'),i=0,reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
  clearInterval(typeT);if(reduce){ask(q);return}inp.value='';typeT=setInterval(function(){i++;inp.value=q.slice(0,i);if(i>=q.length){clearInterval(typeT);setTimeout(function(){ask(q)},350)}},28)}

/* ======================================================== pestañas, render general ======================================================== */
function switchTab(id){S.tab=id;['board','star','sup','sales'].forEach(function(k){var on=k===id;$('p-'+k).classList.toggle('on',on);var t=$('tab-'+k);t.setAttribute('aria-selected',on)});
  try{history.replaceState(null,'',(location.search||'')+(id==='board'?'':'#'+id))}catch(e){}
  renderActive();if(id==='board')window.scrollTo(0,0)}
function renderActive(){if(S.tab==='board')renderCharts();else if(S.tab==='star')renderStar();else if(S.tab==='sup')renderSupports();else if(S.tab==='sales')renderSales()}
function renderCharts(skipTables){if(S.tab!=='board')return;if(!S.showTbl.bridge)drawBridge();if(!S.showTbl['var'])drawVar();if(!S.showTbl.decl)renderDecl();drawField();if(!skipTables)renderTables()}
function renderAll(quiet){renderKPIs();renderSide();renderAnswer();renderActive();if(S.tab==='board'){renderTables();if(S.showTbl.decl)renderDecl()}if(!quiet){}}
function paintStatic(){$('fsTxt').textContent=I(document.body.classList.contains('fs')?'t.fsx':'t.fs');renderChips();applyTblLabels()}
function applyTblLabels(){['bridge','var','decl'].forEach(function(k){var b=document.querySelector('[data-tbl="'+k+'"]');b.textContent=I(S.showTbl[k]?'c.chart':'c.table')})}

/* ---------- pantalla completa ---------- */
function isFs(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function toggleFs(){var el=document.documentElement,on=document.body.classList.contains('fs');
  if(!on){var rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq){try{var p=rq.call(el);if(p&&p.catch)p.catch(function(){})}catch(e){}}document.body.classList.add('fs')}
  else{var ex=document.exitFullscreen||document.webkitExitFullscreen;if(isFs()&&ex){try{ex.call(document)}catch(e){}}document.body.classList.remove('fs')}
  syncFs()}
function syncFs(){var on=document.body.classList.contains('fs');$('fsBtn').setAttribute('aria-pressed',on);$('fsTxt').textContent=I(on?'t.fsx':'t.fs');setTimeout(function(){renderCharts(true)},120)}
function onFsChange(){if(!isFs()&&document.body.classList.contains('fs')){document.body.classList.remove('fs')}syncFs()}

/* ======================================================== arranque ======================================================== */
function init(){
  recalc();
  $('langNav').appendChild(H3L.select({dark:true}));H3L.apply();
  document.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){switchTab(b.getAttribute('data-tab'))})});
  document.querySelectorAll('[data-tbl]').forEach(function(b){b.addEventListener('click',function(){toggleTbl(b.getAttribute('data-tbl'))})});
  $('askForm').addEventListener('submit',function(e){e.preventDefault();ask($('askIn').value)});
  $('wsel').addEventListener('change',function(){selectWell(this.value)});
  $('rgPrice').addEventListener('input',function(){S.price=+this.value;recalc();renderAll()});
  $('rgTol').addEventListener('input',function(){P.tol=+this.value;recalc();renderAll()});
  $('fsBtn').addEventListener('click',toggleFs);
  document.addEventListener('fullscreenchange',onFsChange);document.addEventListener('webkitfullscreenchange',onFsChange);
  $('tourBtn').addEventListener('click',function(){tourShow(0)});$('tour2').addEventListener('click',function(){tourShow(0)});
  $('prn').addEventListener('click',function(){switchTab('sales');setTimeout(function(){window.print()},150)});
  $('pick').addEventListener('click',function(){pickFile(null)});$('fileIn').addEventListener('change',function(){handleFile(this.files[0],fileMode);fileMode=null});
  var dp=$('drop');['dragenter','dragover'].forEach(function(n){dp.addEventListener(n,function(e){e.preventDefault();dp.classList.add('over')})});['dragleave','drop'].forEach(function(n){dp.addEventListener(n,function(e){e.preventDefault();dp.classList.remove('over')})});
  dp.addEventListener('drop',function(e){var fl=e.dataTransfer&&e.dataTransfer.files;if(fl)for(var i=0;i<fl.length;i++)handleFile(fl[i],null)});
  dp.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pickFile(null)}});
  $('dlTpl').addEventListener('click',function(){dl('plantilla_reservas_pd.csv',R.templateCSV(),'text/csv')});
  $('ldOk').addEventListener('click',function(){loadSample(R.toCSV(R.demo()),'ejemplo_limpio.csv')});
  $('ldBad').addEventListener('click',function(){loadSample(R.badCSV(),'ejemplo_con_errores.csv')});
  $('useIt').addEventListener('click',useData);$('useDemo').addEventListener('click',useDemo);
  $('dlLog').addEventListener('click',function(){dl('registro_evidencia_h3l.json',evidenceLog(),'application/json')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&S.tour>=0)tourEnd()});
  var tmr=null;window.addEventListener('beforeprint',function(){if(S.tab!=='sales')switchTab('sales')});window.addEventListener('resize',function(){clearTimeout(tmr);tmr=setTimeout(function(){renderCharts(true)},160)});
  if(window.ResizeObserver){var ro=new ResizeObserver(function(){clearTimeout(tmr);tmr=setTimeout(function(){if(S.tab==='board')renderCharts(true)},160)});ro.observe($('grid'))}
  H3L.on(function(){mlab={};paintStatic();renderAll();document.title=I('t.title')});
  var h=(location.hash||'').replace('#','');if(['star','sup','sales'].indexOf(h)>=0)S.tab=h;
  paintStatic();document.title=I('t.title');
  var go=S.tab;S.tab='board';renderKPIs();renderSide();switchTab(go);
  var qq=null;try{qq=(new URLSearchParams(location.search)).get('q')}catch(e){}if(qq&&go==='board')ask(qq);
  window.H3LRes={S:function(){return S},A:function(){return A},ask:ask,tab:switchTab,tour:tourShow}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
