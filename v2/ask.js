/* Consulta en lenguaje natural + vigilancia de anomalías (motor local de demostración).
   Recuperación BM25 sobre documentos de ejemplo, ajuste de tendencia por regresión, detección de desvíos
   y armado de tableros. Desarrollado por Leandro Collell. */
(function(){'use strict';
var V=window.VZ;if(!V||!window.H3L)return;
var $=V.$,H=V.H,fmt=V.fmt,sgn=V.sgn,reduce=V.reduce;
function f0(n){return fmt(n,0)}function f1(n){return fmt(n,1)}
function B(s){return '<b>'+s+'</b>'}
function I(k,v){return H3L.t(k,v)}
function PS(){return H3L.nf.pct.replace(' ','\u00a0')}
function spc(n,d){return sgn(n,d)+PS()}
function fn(id){return I('f.'+id)}
function andJoin(a){return a.join(I('c.and'))}
var C={blue:'var(--blue)',orange:'var(--orange)',red:'var(--red)',gm:'var(--gray-mark)',gd:'var(--gray-dark)',ink:'var(--ink-2)'};

/* ===================== datos de demostración (reproducibles) ===================== */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var R=rng(20261008);function gauss(){var u=1-R(),v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
var FIELDS=['Norte','Sur','Costa','Altiplano','Valle'],ND=120,TODAY=ND-1,AN0=104,NETBACK=38,CARBON=45;
var P0={Norte:3700,Sur:1700,Costa:1250,Altiplano:1350,Valle:550},DK={Norte:.0006,Sur:.0008,Costa:.0007,Altiplano:.0009,Valle:.001};
var WELLS=[['C-01',.16,0],['C-02',.15,0],['C-03',.17,.55],['C-04',.12,0],['C-05',.14,.45],['C-06',.10,0],['C-07',.09,0],['C-08',.07,0]];
var COSTA_DROP=WELLS.reduce(function(a,w){return a+w[1]*w[2]},0);
function costaF(t){return t<AN0?1:(t===AN0?1-COSTA_DROP/2:1-COSTA_DROP)}
(function(){var tot=0;FIELDS.forEach(function(f){tot+=P0[f]*Math.exp(-DK[f]*TODAY)*(f==='Costa'?costaF(TODAY):1)});var k=8300/tot;FIELDS.forEach(function(f){P0[f]*=k})})();
var prod={};FIELDS.forEach(function(f){prod[f]=[];for(var t=0;t<ND;t++)prod[f].push(P0[f]*Math.exp(-DK[f]*t)*(1+.012*gauss())*(f==='Costa'?costaF(t):1))});
var OB={Norte:2.1,Sur:1.7,Costa:1.6,Altiplano:1.3,Valle:1.5},EB={Norte:35,Sur:22,Costa:17,Altiplano:20,Valle:10.5};
var opex={},emis={};FIELDS.forEach(function(f){opex[f]=[];emis[f]=[];for(var i=0;i<12;i++){var o=OB[f]*(1+.002*i)*(1+.025*gauss()),e=EB[f]*(1+.02*gauss());
  if(f==='Valle'&&i>=10)o*=(i===10?1.24:1.31);if(f==='Sur'&&i>=9)e*=(i===9?1.20:i===10?1.24:1.27);opex[f].push(o);emis[f].push(e)}});
var MET={
 prod:{id:'prod',daily:true,k:20,adv:-1,data:prod,board:'operativo',win:60,def:30},
 opex:{id:'opex',daily:false,k:3,adv:1,data:opex,board:'tactico',win:12,def:3},
 emis:{id:'emis',daily:false,k:3,adv:1,data:emis,board:'transicion',win:12,def:3}};
var BT={prod:'b2.tab',opex:'b3.tab',emis:'b5.tab'};
/* los textos de cada métrica se leen del idioma vigente */
function texts(){Object.keys(MET).forEach(function(id){var m=MET[id];m.nm=I('a.m.'+id+'.nm');m.Nm=I('a.m.'+id+'.Nm');m.unit=I('a.m.'+id+'.u');m.boardNm=I(BT[id])})}
texts();
function monthNames(){var a=I('c.months').split('|');return a.slice(9).concat(a.slice(0,9))}

/* ===================== documentos y recuperación (BM25), por idioma ===================== */
var DOCIDS=['OP-014','OP-021','ING-007','OP-033','FIN-012','FIN-019','FIN-021','AMB-004','AMB-009','AMB-012','RES-003','RES-008','INV-002','GOB-001'];
function doc(id){return {id:id,t:I('doc.'+id+'.t'),x:I('doc.'+id+'.x'),act:H3L.has('doc.'+id+'.a')?I('doc.'+id+'.a'):null}}
function norm(s){var t=String(s).toLowerCase();try{t=t.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}catch(e){}return t}
function stem(w){if(w.length<=4)return w;var l=H3L.lang;if(l==='en')return w.replace(/(ing|ed|es|s)$/,'');if(l==='fr')return w.replace(/(es|s|x)$/,'');return w.replace(/(es|s)$/,'')}
function tok(s){var st={};I('a.stop').split(' ').forEach(function(w){st[w]=1});return norm(s).replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(function(w){return w&&!st[w]}).map(stem)}
var IDXC={};
function getIdx(){var l=H3L.lang;if(IDXC[l])return IDXC[l];
  var IDX=DOCIDS.map(function(id){var d=doc(id),t=tok(d.t+' '+d.x),tf={};t.forEach(function(w){tf[w]=(tf[w]||0)+1});return {d:d,tf:tf,len:t.length}}),DF={};
  IDX.forEach(function(x){for(var w in x.tf)DF[w]=(DF[w]||0)+1});
  return IDXC[l]={IDX:IDX,DF:DF,AVG:IDX.reduce(function(a,x){return a+x.len},0)/IDX.length}}
function search(q,n){var G=getIdx(),IDX=G.IDX,DF=G.DF,AVG=G.AVG,qt=tok(q),res=IDX.map(function(x){var s=0;qt.forEach(function(w){var f=x.tf[w];if(!f)return;var idf=Math.log(1+(IDX.length-DF[w]+.5)/(DF[w]+.5));s+=idf*f*2.5/(f+1.5*(.25+.75*x.len/AVG))});return {d:x.d,s:s}}).filter(function(r){return r.s>0}).sort(function(a,b){return b.s-a.s});return res.slice(0,n||3)}

/* ===================== detección de anomalías ===================== */
function mean(a){return a.reduce(function(s,x){return s+x},0)/a.length}
function regress(y){var n=y.length,sx=0,sy=0,sxx=0,sxy=0,i;for(i=0;i<n;i++){sx+=i;sy+=y[i];sxx+=i*i;sxy+=i*y[i]}var b=(n*sxy-sx*sy)/(n*sxx-sx*sx),a=(sy-b*sx)/n,ss=0;for(i=0;i<n;i++){var r=y[i]-(a+b*i);ss+=r*r}return {a:a,b:b,s:Math.sqrt(ss/Math.max(1,n-2))}}
function analyze(m,series){
  var n=series.length,k=m.k,tr=series.slice(0,n-k).map(function(v){return m.daily?Math.log(v):v}),fit=regress(tr),exp=[],lo=[],hi=[],z=[],i;
  for(i=0;i<n;i++){var e=fit.a+fit.b*i;exp.push(m.daily?Math.exp(e):e);lo.push(m.daily?Math.exp(e-2*fit.s):e-2*fit.s);hi.push(m.daily?Math.exp(e+2*fit.s):e+2*fit.s);var v=m.daily?Math.log(series[i]):series[i];z.push((v-e)/fit.s)}
  var lastZ=mean(z.slice(n-k)),bad=z.map(function(x){return m.adv*x*-1*-1}),start=-1;
  /* "mal" = desvío en el sentido adverso, en desviaciones estándar */
  var badz=z.map(function(x){return x*m.adv});
  for(i=Math.max(0,n-k-12);i<n;i++){var ok=true,miss=0;for(var j=i;j<n;j++){if(badz[j]<=1.5){miss++;if(miss>1){ok=false;break}}}if(ok&&badz[i]>1.5){start=i;break}}
  var anomalous=badz.slice(n-k).reduce(function(a,x){return a+x},0)/k>=3.5&&start>=0;
  var span=m.daily?7:1,act=mean(series.slice(n-span)),ex=mean(exp.slice(n-span)),gap=m.adv<0?ex-act:act-ex,impact=0;
  if(m.id==='prod')impact=gap*NETBACK*30/1000;else if(m.id==='opex')impact=gap*1000;else impact=gap*CARBON;
  return {fit:fit,exp:exp,lo:lo,hi:hi,z:z,lastZ:lastZ,badZ:mean(badz.slice(n-k)),start:start,anomalous:anomalous,act:act,ex:ex,gap:gap,impact:Math.max(0,impact),pers:start>=0?n-start:0,n:n}}
function scanAll(){var out=[];Object.keys(MET).forEach(function(id){var m=MET[id];FIELDS.forEach(function(f){var a=analyze(m,m.data[f]);if(a.anomalous)out.push({m:m,f:f,a:a})})});out.sort(function(x,y){return y.a.impact-x.a.impact});return out}
function totalSeries(m){var n=m.data[FIELDS[0]].length,t=[];for(var i=0;i<n;i++)t.push(FIELDS.reduce(function(s,f){return s+m.data[f][i]},0));return t}

/* ===================== interpretación de la consulta (palabras clave por idioma) ===================== */
var RC={};function RE(k){var id=H3L.lang+k;return RC[id]||(RC[id]=new RegExp(I(k)))}
function hasWord(t,name){var n=norm(name).replace(/[^a-z0-9 ]/g,'');return new RegExp('(^|[^a-z0-9])'+n+'([^a-z0-9]|$)').test(t)}
function detectMetric(t){
  if(RE('a.re.emis').test(t))return 'emis';
  if(RE('a.re.opex').test(t))return 'opex';
  if(RE('a.re.prod').test(t))return 'prod';
  return null}
function interpret(q){
  var t=norm(q),r={q:q,t:t,metric:detectMetric(t),fields:[],N:null,mode:'trend',other:null};
  FIELDS.forEach(function(f){if(hasWord(t,fn(f)))r.fields.push(f)});
  var m=t.match(RE('a.re.num'));if(m){var n=+m[1],ui=I('a.unitw').split('|').indexOf(m[2]);r.N=ui===1?n*7:n;r.Nunit=['d','w','m'][ui]}
  if(RE('a.re.diag').test(t))r.mode='diag';
  if(RE('a.re.cmp').test(t)||r.fields.length>1)r.mode='compare';
  if(RE('a.re.scan').test(t)&&!r.fields.length&&!r.metric)r.mode='scan';
  if(RE('a.re.res').test(t))r.other='reservas';
  else if(RE('a.re.inv').test(t))r.other='estrategico';
  return r}

/* ===================== armado del tablero ===================== */
function dateLabel(i,m){if(!m.daily)return monthNames()[i];var d=new Date(2026,9,8);d.setDate(d.getDate()-(TODAY-i));return H3L.lang==='en'?(d.getMonth()+1)+'/'+d.getDate():d.getDate()+'/'+(d.getMonth()+1)}
function wellsData(){var a=analyze(MET.prod,prod.Costa);
  var base=mean(prod.Costa.slice(AN0-14,AN0-1)),nowBase=a.ex;
  return WELLS.map(function(w){var b=w[1]*base,af=w[1]*(1-w[2])*nowBase;return {id:w[0],before:b,after:af,lost:Math.max(0,b-af)}})}

function plan(itp){
  var m=MET[itp.metric],single=itp.fields.length===1,fields=itp.fields.length?itp.fields:null,focus=single?itp.fields[0]:null;
  var N=itp.N||m.def;if(!m.daily&&itp.Nunit==='d')N=Math.max(1,Math.round(N/30));if(!m.daily&&itp.Nunit==='w')N=Math.max(1,Math.round(N/4));
  N=Math.max(m.daily?3:1,Math.min(N,m.daily?45:5));
  var per={};FIELDS.forEach(function(f){var s=m.data[f],cur=mean(s.slice(s.length-N)),prev=mean(s.slice(s.length-2*N,s.length-N)),an=analyze(m,s);per[f]={cur:cur,prev:prev,chg:(cur/prev-1)*100,a:an}});
  var tot=totalSeries(m),totA=analyze(m,tot);
  var worst=FIELDS.filter(function(f){return per[f].a.anomalous}).sort(function(a,b){return per[b].a.impact-per[a].a.impact})[0]||null;
  return {m:m,itp:itp,N:N,per:per,tot:tot,totA:totA,single:single,focus:focus,worst:worst,fields:fields}}

function legendHTML(l){return l.map(function(x){return '<span><i'+(x.ln?' class="ln"':'')+' style="background:'+x.c+(x.dot?';border-radius:50%':'')+'"></i>'+x.t+'</span>'}).join('')}
function tableHTML(t){return '<table><thead><tr>'+t.head.map(function(x){return '<th scope="col">'+x+'</th>'}).join('')+'</tr></thead><tbody>'+t.rows.map(function(r){return '<tr>'+r.map(function(c,i){return (i===0?'<th scope="row" style="font-weight:600;color:var(--ink)">':'<td>')+c+(i===0?'</th>':'</td>')}).join('')+'</tr>'}).join('')+'</tbody></table>'}
function pcs(x){return fmt(x,0)+PS()}

function build(P,auto){
  var m=P.m,itp=P.itp,LIM=f1(3.5);
  /* qué se muestra: un campo, la comparación de varios, el campo con la mayor anomalía o todos juntos */
  var mainId,mainA,mainS,mainName;
  if(P.single)mainId=P.focus;
  else if(P.fields&&P.fields.length>1)mainId=null;
  else if(P.worst)mainId=P.worst;
  else mainId='ALL';
  if(mainId===null){mainA=null;mainS=null;mainName=andJoin(P.fields.map(fn))}
  else if(mainId==='ALL'){mainA=P.totA;mainS=P.tot;mainName=I('a.all')}
  else{mainA=P.per[mainId].a;mainS=m.data[mainId];mainName=fn(mainId)}
  var N=P.N,unitN=m.daily?I('a.u.days'):(N===1?I('a.u.month'):I('a.u.months')),unitP=m.daily?I('a.u.days'):I('a.u.months');
  var q=(itp.q||'')+' '+I('a.boost.'+m.id)+(mainA&&mainA.anomalous?' '+I('a.boost.an'):'');
  var hits=search(q,3);
  var an=mainA&&mainA.anomalous,actDoc=hits.filter(function(h){return h.d.act})[0];
  var cards=[],read=[],kpis=[];
  /* ① evolución */
  var win=m.win,n=(mainS||m.data[FIELDS[0]]).length,from=Math.max(0,n-win),xs=[],i;for(i=from;i<n;i++)xs.push(dateLabel(i,m));
  var nx=xs.length,tk=m.daily?[0,10,20,30,40,50,nx-1]:[0,2,4,6,8,10,11];
  cards.push({title:I('a.c1t',{Nm:m.Nm,f:mainName}),sub:I(m.daily?'a.c1sD':'a.c1sM',{w:win,u:m.unit}),
    legend:mainA?[{c:C.blue,t:I('c.real'),ln:1},{c:C.gd,t:I('a.exp'),ln:1},{c:'rgba(42,120,214,.25)',t:I('a.band2')}]:P.fields.map(function(f,j){return {c:[C.blue,C.orange,C.gd][j%3],t:fn(f),ln:1}}),
    draw:function(h,lb){
      if(mainA){var s=mainS.slice(from),a=mainA,st=a.start>=0&&a.start>=from?a.start-from:-1;
        V.line(h,{label:lb,x:xs,xTicks:tk,tipFmt:m.daily?f0:f1,yFmt:m.daily?f0:f1,h:280,r:46,
          vlines:an&&st>=0?[{i:st,label:I('a.start'),dx:-5,anchor:'end'}]:[],
          bands:[{lo:a.lo.slice(from),hi:a.hi.slice(from),c:C.blue,op:.12,name:I('a.band')}],
          series:[{name:I('a.exp'),c:C.gd,w:1.5,dash:'5 4',pts:a.exp.slice(from)},{name:I('c.real'),c:C.blue,w:2.5,pts:s,end:m.daily?f0(s[s.length-1]):f1(s[s.length-1]),endAnchor:'start',endDy:4}]})}
      else{V.line(h,{label:lb,x:xs,xTicks:tk,tipFmt:m.daily?f0:f1,yFmt:m.daily?f0:f1,h:280,r:46,yMin:0,series:P.fields.map(function(f,j){var s=m.data[f].slice(from);return {name:fn(f),c:[C.blue,C.orange,C.gd][j%3],w:2.25,pts:s,end:m.daily?f0(s[s.length-1]):f1(s[s.length-1]),endAnchor:'start',endDy:4}})})}},
    table:(function(){var cols=mainA?[{n:mainName,s:mainS}]:P.fields.map(function(f){return {n:fn(f),s:m.data[f]}}),rows=[],step=m.daily?10:1;
      for(var j=nx-1;j>=0;j-=step){var ix=from+j;rows.push([xs[j]].concat(cols.map(function(c){return m.daily?f0(c.s[ix]):f1(c.s[ix])})))}
      return {head:[I('a.date')].concat(cols.map(function(c){return c.n+' ('+m.unit+')'})),rows:rows}})(),wide:true});
  /* ② dónde se concentra */
  var order=FIELDS.slice().sort(function(a,b){var pa=P.per[a],pb=P.per[b];return m.adv*(pb.chg-pa.chg)});
  cards.push({title:I('a.c2t'),sub:I('a.c2s',{n:N,u:unitN}),
    legend:[{c:C.orange,t:I('a.adv')},{c:C.gm,t:I('a.inr')}],
    draw:function(h,lb){V.barsH(h,{label:lb,rows:order.map(function(f){var p=P.per[f],hot=p.a.anomalous;return {label:fn(f),value:Math.abs(p.chg),color:hot?C.orange:C.gm,text:spc(p.chg,1),tip:[{k:I('a.now'),v:(m.daily?f0(p.cur):f1(p.cur))+' '+m.unit},{k:I('a.bef'),v:(m.daily?f0(p.prev):f1(p.prev))+' '+m.unit},{k:I('a.devx'),v:sgn(p.a.badZ*m.adv,1)+' σ'}]}}),max:Math.max(5,Math.max.apply(null,order.map(function(f){return Math.abs(P.per[f].chg)}))*1.1),d:1,unit:I('a.chg'),lw:92,r:62,tickFmt:pcs})},
    table:{head:I('a.t2h').split('|'),rows:order.map(function(f){var p=P.per[f];return [fn(f),m.daily?f0(p.cur):f1(p.cur),m.daily?f0(p.prev):f1(p.prev),spc(p.chg,1)]})}});
  /* ③ qué lo explica */
  var wellsOn=m.id==='prod'&&mainId==='Costa';
  if(wellsOn){var W=wellsData().sort(function(a,b){return b.lost-a.lost});
    cards.push({title:I('a.c3wt',{f:mainName}),sub:I('a.c3ws'),legend:[{c:C.orange,t:I('a.c3wl1')},{c:C.gm,t:I('a.c3wl2')}],
      draw:function(h,lb){V.barsH(h,{label:lb,rows:W.map(function(w){return {label:w.id,value:w.lost,color:w.lost>5?C.orange:C.gm,text:w.lost>5?I('a.c3wlost',{x:f0(w.lost)}):I('a.c3wno'),tip:[{k:I('a.bef'),v:f0(w.before)+' bopd'},{k:I('a.now'),v:f0(w.after)+' bopd'}]}}),max:Math.max.apply(null,W.map(function(w){return w.lost}))*1.1,unit:'bopd',lw:56,r:84})},
      table:{head:I('a.c3wh').split('|'),rows:W.map(function(w){return [w.id,f0(w.before),f0(w.after)]})}})}
  else{var imp=FIELDS.map(function(f){return {f:f,v:P.per[f].a.impact}}).sort(function(a,b){return b.v-a.v});
    cards.push({title:I('a.c3it'),sub:I('a.c3is'),legend:[{c:C.orange,t:I('a.c3il1')},{c:C.gm,t:I('a.c3il2')}],
      draw:function(h,lb){V.barsH(h,{label:lb,rows:imp.map(function(r){var hot=P.per[r.f].a.anomalous;return {label:fn(r.f),value:hot?r.v:0,color:hot?C.orange:C.gm,text:hot?I('a.c3itx',{x:f0(r.v)}):I('a.c3ino'),tip:[{k:I('a.c3iimp'),v:f0(P.per[r.f].a.impact)+' '+I('a.kusdm')}]}}),max:Math.max(50,imp[0].v*1.1),unit:I('a.kusdm'),lw:92,r:84})},
      table:{head:I('a.c3ih').split('|'),rows:imp.map(function(r){return [fn(r.f),P.per[r.f].a.anomalous?f0(r.v):'0']})}})}
  /* indicadores */
  var curv=mainA?mainA.act:mean(P.tot.slice(P.tot.length-(m.daily?7:1))),dev=mainA?mainA.badZ*m.adv:null;
  var chgMain=mainA?(mainId==='ALL'?(function(){var s=P.tot,c=mean(s.slice(s.length-N)),p=mean(s.slice(s.length-2*N,s.length-N));return (c/p-1)*100})():P.per[mainId].chg):null;
  kpis=[{l:I('a.k1',{Nm:m.Nm,f:mainName}),v:mainA?(m.daily?f0(curv):f1(curv)):'—',u:m.unit,d:I(m.daily?'a.k1d1':'a.k1d2')},
    {l:I('a.k2'),v:mainA?spc(chgMain,1):'—',u:'',d:I('a.k2d',{n:N,u:unitN})},
    {l:I('a.k3'),v:mainA?sgn(dev,1):'—',u:'σ',d:an?I('a.k3a',{l:LIM}):I('a.k3b')},
    {l:I('a.k4'),v:an?f0(mainA.impact):'0',u:I('a.kusdm'),d:an?I('a.k4a',{p:mainA.pers,u:unitP}):I('a.k4b')}];
  /* lectura integrada */
  var worstId=order[0];
  if(mainA){var a=mainA;
    read.push({n:1,h:an?I('a.r1a',{nm:m.nm,f:mainName,p:spc((a.act/a.ex-1)*100,1),d:dateLabel(a.start,m),pp:a.pers,u:unitP}):I('a.r1b',{nm:m.nm,f:mainName,z:sgn(mainA.badZ*m.adv,1)})})}
  else read.push({n:1,h:I('a.r1c',{list:mainName})});
  var hot=FIELDS.filter(function(f){return P.per[f].a.anomalous});
  read.push({n:2,h:hot.length?I('a.r2a',{list:hot.map(fn).join(', '),rest:hot.length<FIELDS.length?I('a.r2r',{n:FIELDS.length-hot.length}):''}):I('a.r2b',{nm:m.nm,f:fn(worstId),p:spc(P.per[worstId].chg,1)})});
  if(wellsOn&&an){var Wd=wellsData().filter(function(w){return w.lost>5}).sort(function(a,b){return b.lost-a.lost}),lost=Wd.reduce(function(s,w){return s+w.lost},0);
    read.push({n:3,h:I('a.r3a',{n:Wd.length,ids:andJoin(Wd.map(function(w){return w.id})),pc:pcs(lost/(mainA.gap||1)*100),l:f0(lost)})})}
  else if(an){read.push({n:3,h:I('a.r3b',{i:f0(mainA.impact),how:I('a.how.'+m.id,{p:m.id==='emis'?CARBON:NETBACK})})})}
  else read.push({n:3,h:I('a.r3c',{l:LIM})});
  /* decisión */
  var dec;
  if(an){var act=actDoc?actDoc.d.act:I('a.defact');
    dec={what:act,big:f0(mainA.impact),u:I('a.du'),cap:I('a.dcap',{d:dateLabel(mainA.start,m),p:mainA.pers,u:unitP}),
      gains:[(m.id==='prod'?I('a.dg1p',{g:f0(mainA.gap)}):I('a.dg1o',{v:f1(mainA.ex),u:m.unit})),I('a.dg2',{id:actDoc?actDoc.d.id:'GOB-001'})],board:m.board,boardNm:m.boardNm}}
  else dec={what:I('a.nwhat'),big:sgn(chgMain==null?0:chgMain,1),u:I('a.nu'),cap:I('a.ncap'),gains:[I('a.ng1'),I('a.ng2',{b:m.boardNm})],board:m.board,boardNm:m.boardNm,none:true};
  return {title:itp.q,metric:m,cards:cards,kpis:kpis,read:read,dec:dec,hits:hits,mainName:mainName,an:an,N:N,unitN:unitN,unitP:unitP,auto:auto,P:P,mainA:mainA}}

/* ===================== presentación ===================== */
var out=$('ask-out'),token=0;
function renderBoard(R,animated){
  out.textContent='';var box=H('div',{'class':'out',id:'ask-board',tabindex:'-1'},out);
  H('div',{'class':'tag'},box,I(R.auto?'a.tag.auto':'a.tag.user'));H('h3',{'class':'q'},box,R.auto?R.autoTitle:R.title);
  var u=H('p',{'class':'understood'},box);u.innerHTML=I('a.under',{m:R.metric.nm,f:R.mainName,n:R.N,u:R.unitN,mode:I(R.auto?'a.mode.auto':R.P.itp.mode==='compare'?'a.mode.compare':R.P.itp.mode==='diag'?'a.mode.diag':'a.mode.trend')});
  var pipe=H('div',{'class':'pipe'},box),log=H('ul',{'class':'log','aria-label':I('a.stepsAria')},pipe);
  var m=R.metric,a=R.mainA,P=R.P,hits=R.hits,LIM=f1(3.5);
  var steps=[
   {who:I('a.ag.orq'),t:I('a.s1',{m:m.nm,f:R.mainName}),src:I('a.s1s')},
   {who:I('a.ag.rec'),t:I('a.s2',{n:DOCIDS.length,h:hits.length,ids:hits.map(function(h){return h.d.id}).join(', ')}),src:I('a.s2s')},
   {who:I('ag.ana'),t:a?I('a.s3',{n:a.n-m.k,u:R.unitP,k:m.k,z:sgn(a.badZ*m.adv,1),tail:R.an?I('a.s3t',{d:dateLabel(a.start,m)}):'.'}):I('a.s3b'),src:I('a.s3s',{w:I(m.daily?'a.s3w1':'a.s3w2'),l:LIM})},
   {who:I('ag.aud'),t:I('a.s4',{tail:R.an?I('a.s4t',{p:a.pers,u:R.unitP}):'.'}),src:I('a.s4s')},
   {who:I('ag.red'),t:I('a.s5',{n:R.cards.length}),src:I('a.s5s')}];
  var mount=function(){renderBody(box,R)};
  function line(s,done){var li=H('li',null,log);li.className=done?'':'run';li.innerHTML='<div class="who"><i class="st"></i>'+s.who+'</div><div>'+(done?s.t+'<em>'+s.src+'</em>':I('a.working'))+'</div>';return li}
  if(!animated||reduce){steps.forEach(function(s){line(s,true)});mount();return}
  var tk=++token,i=0;(function next(){if(tk!==token)return;if(i>=steps.length){mount();return}var s=steps[i],li=line(s,false);setTimeout(function(){if(tk!==token)return;li.className='';li.innerHTML='<div class="who"><i class="st"></i>'+s.who+'</div><div>'+s.t+'<em>'+s.src+'</em></div>';i++;next()},420)})()}
function renderBody(box,R){
  var k=H('div',{'class':'kpis'},box);R.kpis.forEach(function(x){var d=H('div',{'class':'kpi'},k);d.innerHTML='<div class="l">'+x.l+'</div><div class="v">'+x.v+(x.u?'<small>'+x.u+'</small>':'')+'</div><div class="d">'+x.d+'</div>'});
  var bd=H('div',{'class':'board'},box),ch=H('div',{'class':'charts'},bd),aside=H('aside',{'class':'aside','aria-label':I('d.asideAria')},bd),cardEls=[];
  R.cards.forEach(function(c,i){var card=H('article',{'class':'card'+(c.wide?' wide':'')},ch),h=H('div',{'class':'ch'},card);H('span',{'class':'badge','aria-hidden':'true'},h,String(i+1));var t=H('div',null,h);H('h3',null,t,c.title);H('p',null,t,c.sub);
    var tv=H('button',{'class':'tv',type:'button','aria-pressed':'false'},h,I('u.table')),plot=H('div',{'class':'plot'},card),tb=H('div',{'class':'tbl'},card);tb.innerHTML=tableHTML(c.table);tb.hidden=true;
    var lg=H('div',{'class':'legend'},card);lg.innerHTML=legendHTML(c.legend);
    var o={c:c,plot:plot,tb:tb,card:card};cardEls.push(o);
    tv.addEventListener('click',function(){var on=tb.hidden;tb.hidden=!on;plot.hidden=on;tv.textContent=on?I('v.chart'):I('u.table');tv.setAttribute('aria-pressed',on?'true':'false');V.hideTip();if(!on)draw(o)});
    card.addEventListener('mouseenter',function(){hl(i+1,true)});card.addEventListener('mouseleave',function(){hl(i+1,false)})});
  function draw(o){try{o.c.draw(o.plot,o.c.title)}catch(e){o.plot.textContent=I('v.fail');if(window.console)console.error(e)}}
  function hl(n,on){cardEls.forEach(function(o,i){o.card.classList.toggle('hl',on&&i+1===n)});[].forEach.call(olEl.children,function(li){li.classList.toggle('hl',on&&+li.getAttribute('data-n')===n)})}
  var rd=H('section',{'class':'read'},aside);H('h3',null,rd,I('d.read'));H('p',{'class':'sub'},rd,I('d.readSub'));
  var olEl=H('ol',null,rd);R.read.forEach(function(r){var li=H('li',{'data-n':r.n,tabindex:'0'},olEl);H('span',{'class':'badge','aria-hidden':'true'},li,String(r.n));H('span',null,li).innerHTML=r.h;
    li.addEventListener('mouseenter',function(){hl(r.n,true)});li.addEventListener('mouseleave',function(){hl(r.n,false)});li.addEventListener('focus',function(){hl(r.n,true)});li.addEventListener('blur',function(){hl(r.n,false)})});
  var sc=H('section',{'class':'srcs'},aside),sh=H('h3',null,sc,I('a.srcs')),sl=H('ul',{'class':'src'},sc);R.hits.forEach(function(h){var li=H('li',null,sl);li.innerHTML='<span class="sc">'+fmt(h.s,1)+'</span><b>'+h.d.id+'</b> · '+h.d.t+'<br>'+h.d.x.slice(0,140)+(h.d.x.length>140?'…':'')});
  var dc=H('section',{'class':'dec'},aside),d=R.dec;
  dc.innerHTML='<h3>'+I(d.none?'a.dh2':'a.dh1')+'</h3><p class="what">'+d.what+'</p><div class="hero"><span class="big">'+d.big+'</span><span class="u">'+d.u+'</span></div><p class="cap">'+d.cap+'</p><ul class="gain">'+d.gains.map(function(g){return '<li>'+g+'</li>'}).join('')+'</ul><div class="row"><button type="button" class="btn lite" data-a="ok">'+I(d.none?'a.bok2':'a.bok1')+'</button><button type="button" class="btn sec" data-a="go">'+I('a.bgo',{b:d.boardNm})+'</button></div><p class="note">'+I('a.note')+'</p>';
  dc.querySelector('[data-a=ok]').addEventListener('click',function(){var b=this,st;b.disabled=true;b.textContent=I(d.none?'a.bokd2':'a.bokd1');try{st=new Date().toLocaleDateString(H3L.loc)}catch(e){st=new Date().toISOString().slice(0,10)}dc.querySelector('.note').textContent=I('a.logged',{d:st})});
  dc.querySelector('[data-a=go]').addEventListener('click',function(){if(window.H3LBoards)window.H3LBoards.open(d.board)});
  cardEls.forEach(draw);
  var rs;window.addEventListener('resize',function(){clearTimeout(rs);rs=setTimeout(function(){cardEls.forEach(function(o){if(o.tb.hidden&&document.body.contains(o.plot))draw(o)})},160)});
}

/* ===================== consulta del usuario ===================== */
var LAST=null;
function scrollBoard(){var el=$('ask-board');if(el&&el.scrollIntoView){try{el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}catch(e){}}}
function show(itp,auto,animated){LAST={itp:itp,auto:auto};var P=plan(itp),R=build(P,auto);if(auto)R.autoTitle=I('a.autoT',{nm:P.m.nm,f:fn(itp.fields[0])});renderBoard(R,animated);return R}
function openAnomaly(an,auto,animated){return show({q:I('a.q',{nm:an.m.nm,f:fn(an.f)}),t:'',metric:an.m.id,fields:[an.f],N:an.m.def,mode:'diag'},auto,animated)}
function message(fnHtml){LAST={msg:fnHtml};out.textContent='';var b=H('div',{'class':'out'},out);var p=H('p',{'class':'understood'},b);p.innerHTML=fnHtml()}
function ask(q){
  q=q.trim();if(!q)return;var itp=interpret(q);
  if(itp.mode==='scan'){var all=scanAll();if(all.length){openAnomaly(all[0],false,true);return}message(function(){return I('a.noscan')});return}
  if(itp.other&&!itp.metric){var id=itp.other;message(function(){return I('a.other',{b:I(id==='reservas'?'b4.tab':'b1.tab')})});if(window.H3LBoards)setTimeout(function(){window.H3LBoards.open(id)},350);return}
  if(!itp.metric){message(function(){return I('a.unk',{fields:FIELDS.map(fn).join(', '),scan:I('a.ch5')})});return}
  show(itp,false,true);scrollBoard()}

/* ===================== vigilancia automática ===================== */
var found=scanAll();
function renderWatch(list){
  var w=$('watch');w.textContent='';H('h3',null,w,I('a.wt'));
  H('p',{'class':'sub'},w,I('a.ws'));
  if(!list.length){H('p',{'class':'ok'},w,I('a.wok'));return}
  var ul=H('ul',{'class':'alist'},w);
  list.forEach(function(an,i){var li=H('li',null,ul),b=H('button',{type:'button','class':'al'},li);
    var pct=(an.a.act/an.a.ex-1)*100;
    b.innerHTML='<span class="dot'+(i>0?' mid':'')+'"></span><span>'+I('a.wi',{m:an.m.Nm,f:fn(an.f),p:spc(pct,0),d:dateLabel(an.a.start,an.m),i:f0(an.a.impact)})+'</span><span class="go">'+I('a.wgo')+'</span>';
    b.addEventListener('click',function(){openAnomaly(an,false,true);scrollBoard()})})}

function renderChips(){var chips=$('ask-chips');chips.textContent='';for(var j=1;j<=6;j++)(function(c){var b=H('button',{type:'button'},chips,c);b.addEventListener('click',function(){$('ask-q').value=c;ask(c)})})(I('a.ch'+j))}
renderChips();
$('ask-f').addEventListener('submit',function(e){e.preventDefault();ask($('ask-q').value)});

renderWatch(found);
if(found.length)openAnomaly(found[0],true,false);

/* al cambiar de idioma se vuelve a dibujar lo que está en pantalla, sin volver a interpretar el texto escrito */
H3L.on(function(){
  texts();renderChips();renderWatch(found);
  if(!LAST)return;
  if(LAST.msg){message(LAST.msg);return}
  var itp=LAST.itp;
  if(!LAST.auto&&itp.t!==''){var P=plan(itp);itp.q=I('a.q',{nm:P.m.nm,f:itp.fields.length?andJoin(itp.fields.map(fn)):I('a.all')})}
  else itp.q=I('a.q',{nm:MET[itp.metric].nm,f:fn(itp.fields[0])});
  show(itp,LAST.auto,false)});
window.H3LAsk={ask:ask,scan:scanAll,analyze:analyze,search:search};
})();
