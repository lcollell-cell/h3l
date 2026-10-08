/* Consulta en lenguaje natural + vigilancia de anomalías (motor local de demostración).
   Recuperación BM25 sobre documentos de ejemplo, ajuste de tendencia por regresión, detección de desvíos
   y armado de tableros. Desarrollado por Leandro Collell. */
(function(){'use strict';
var V=window.VZ;if(!V)return;
var $=V.$,H=V.H,fmt=V.fmt,sgn=V.sgn,reduce=V.reduce;
function f0(n){return fmt(n,0)}function f1(n){return fmt(n,1)}
function B(s){return '<b>'+s+'</b>'}
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
var MES=['Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep'];
var OB={Norte:2.1,Sur:1.7,Costa:1.6,Altiplano:1.3,Valle:1.5},EB={Norte:35,Sur:22,Costa:17,Altiplano:20,Valle:10.5};
var opex={},emis={};FIELDS.forEach(function(f){opex[f]=[];emis[f]=[];for(var i=0;i<12;i++){var o=OB[f]*(1+.002*i)*(1+.025*gauss()),e=EB[f]*(1+.02*gauss());
  if(f==='Valle'&&i>=10)o*=(i===10?1.24:1.31);if(f==='Sur'&&i>=9)e*=(i===9?1.20:i===10?1.24:1.27);opex[f].push(o);emis[f].push(e)}});
var MET={
 prod:{id:'prod',nm:'producción',Nm:'Producción',unit:'bopd',daily:true,k:20,adv:-1,data:prod,board:'operativo',boardNm:'Operativo',win:60,def:30},
 opex:{id:'opex',nm:'costo operativo',Nm:'Costo operativo',unit:'MM USD/mes',daily:false,k:3,adv:1,data:opex,board:'tactico',boardNm:'Táctico',win:12,def:3},
 emis:{id:'emis',nm:'emisiones',Nm:'Emisiones',unit:'kt CO₂e/mes',daily:false,k:3,adv:1,data:emis,board:'transicion',boardNm:'Transición',win:12,def:3}};

/* ===================== documentos y recuperación (BM25) ===================== */
var DOCS=[
 {id:'OP-014',t:'Respuesta a caídas de producción',x:'Si un campo cae 10 % o más en 5 días sin cambio de choke, verificar primero la compresión y el suministro eléctrico, luego las bombas de fondo y los pozos con paradas. Priorizar las intervenciones con repago de 45 días o menos.',act:'Verificar compresión y energía del campo y programar primero los pozos con repago de 45 días o menos.'},
 {id:'OP-021',t:'Pozos parados y bombas',x:'Un pozo con una caída superior a 40 % entre dos controles se considera con falla de bomba o de energía hasta demostrar lo contrario. Se abre la orden de trabajo en 24 horas.',act:'Abrir órdenes de trabajo en 24 horas para los pozos con caída mayor a 40 %.'},
 {id:'ING-007',t:'Declinación esperada (Arps)',x:'La producción esperada se estima ajustando la declinación a los meses estables previos. Un desvío mayor a tres desviaciones estándar durante cinco días o más no se explica por la declinación natural del campo.'},
 {id:'OP-033',t:'Compresión de gas',x:'Una restricción de compresión reduce la producción de gas asociado y puede obligar a cerrar pozos con alta relación gas-petróleo. Revisar la disponibilidad de los compresores.'},
 {id:'FIN-012',t:'Control de costos operativos',x:'Un gasto mensual de campo que supera 15 % lo esperado durante dos meses seguidos exige revisar contratos y consumo de energía antes del cierre siguiente.',act:'Revisar los contratos de servicio y el consumo de energía del campo antes del próximo cierre mensual.'},
 {id:'FIN-019',t:'Contratos de servicio',x:'Los contratos con ajuste por indexación se revisan cada trimestre. Los desvíos suelen venir de tarifas por día de equipo y de horas extra.'},
 {id:'FIN-021',t:'Energía en campo',x:'El consumo eléctrico del bombeo es la mayor parte del gasto de energía. Ajustar horarios y revisar equipos de bombeo sobredimensionados reduce el costo.'},
 {id:'AMB-004',t:'Venteo y quema',x:'Un aumento sostenido de emisiones de más de 10 % en un campo se atribuye primero a venteo o quema por falla de compresión o de recuperación de gas.',act:'Revisar la recuperación de gas de venteo y las fugas de metano (LDAR) del campo.'},
 {id:'AMB-009',t:'Detección y reparación de fugas',x:'Los programas de detección y reparación de fugas reducen emisiones de metano con costo negativo. Se recomienda una campaña de inspección cuando hay desvíos.'},
 {id:'AMB-012',t:'Precio interno del carbono',x:'Para evaluar medidas de reducción se usa un precio interno de 45 USD por tonelada de CO₂e.'},
 {id:'RES-003',t:'Clasificación de reservas',x:'Las reservas 1P, 2P y 3P son volúmenes comercialmente recuperables con distinto grado de certeza. Los recursos contingentes pasan a reservas cuando se cumplen sus condiciones, entre ellas la decisión de inversión.'},
 {id:'RES-008',t:'Revisión por caída de producción',x:'Una caída persistente de producción se evalúa antes del cierre anual de reservas, porque puede cambiar la declinación usada en las reservas 2P.'},
 {id:'INV-002',t:'Criterio de inversión',x:'Los proyectos se ordenan por valor presente neto dividido por capex y se financian en ese orden hasta agotar el presupuesto.'},
 {id:'GOB-001',t:'Aprobación y registro',x:'Toda recomendación requiere aprobación humana y deja registro de la fecha, los datos, las fuentes y la versión del cálculo.'}];
var STOP={de:1,la:1,el:1,los:1,las:1,un:1,una:1,que:1,en:1,y:1,o:1,por:1,para:1,con:1,del:1,al:1,se:1,es:1,a:1,lo:1,su:1,sus:1,mas:1,hay:1,como:1,cuanto:1,cual:1,cuales:1};
function norm(s){var t=s.toLowerCase();try{t=t.normalize('NFD').replace(/[̀-ͯ]/g,'')}catch(e){}return t}
function stem(w){return w.length>4?w.replace(/(es|s)$/,''):w}
function tok(s){return norm(s).replace(/[^a-z0-9ñ ]+/g,' ').split(/\s+/).filter(function(w){return w&&!STOP[w]}).map(stem)}
var IDX=DOCS.map(function(d){var t=tok(d.t+' '+d.x),tf={};t.forEach(function(w){tf[w]=(tf[w]||0)+1});return {d:d,tf:tf,len:t.length}}),AVG=IDX.reduce(function(a,x){return a+x.len},0)/IDX.length,DF={};
IDX.forEach(function(x){for(var w in x.tf)DF[w]=(DF[w]||0)+1});
function search(q,n){var qt=tok(q),res=IDX.map(function(x){var s=0;qt.forEach(function(w){var f=x.tf[w];if(!f)return;var idf=Math.log(1+(IDX.length-DF[w]+.5)/(DF[w]+.5));s+=idf*f*2.5/(f+1.5*(.25+.75*x.len/AVG))});return {d:x.d,s:s}}).filter(function(r){return r.s>0}).sort(function(a,b){return b.s-a.s});return res.slice(0,n||3)}

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

/* ===================== interpretación de la consulta ===================== */
function detectMetric(t){
  if(/emision|co2|co₂|venteo|quema|carbono|flaring|metano/.test(t))return 'emis';
  if(/costo|gasto|opex|lifting|presupuesto operativo|energia|contrato/.test(t))return 'opex';
  if(/produc|barril|bopd|caudal|pozo|cayo|bajo la prod/.test(t))return 'prod';
  return null}
function interpret(q){
  var t=norm(q),r={q:q,t:t,metric:detectMetric(t),fields:[],N:null,mode:'trend',other:null};
  FIELDS.forEach(function(f){if(t.indexOf(norm(f))>=0)r.fields.push(f)});
  var m=t.match(/(\d+)\s*(dia|semana|mes)/);if(m){var n=+m[1];r.N=m[2]==='dia'?n:m[2]==='semana'?n*7:n;r.Nunit=m[2]}
  if(/por que|porque|causa|anomal|problema|cayo|bajo|subio|aumento|desvio|raro|que paso|alerta/.test(t))r.mode='diag';
  if(/compar|versus|contra| vs /.test(t)||r.fields.length>1)r.mode='compare';
  if(/anomal|alerta|vigilancia|donde hay|que esta mal/.test(t)&&!r.fields.length&&!r.metric)r.mode='scan';
  if(/reserva|1p|2p|3p|contingente|prms/.test(t))r.other='reservas';
  else if(/proyecto|inversion|vpn|vpi|capex|brent|financiar/.test(t))r.other='estrategico';
  return r}

/* ===================== armado del tablero ===================== */
function dateLabel(i,m){if(!m.daily)return MES[i];var d=new Date(2026,9,8);d.setDate(d.getDate()-(TODAY-i));return d.getDate()+'/'+(d.getMonth()+1)}
function wellsData(){var a=analyze(MET.prod,prod.Costa),before=0,after=0;
  /* tasa del campo sin la caída, comparada antes y después */
  var base=mean(prod.Costa.slice(AN0-14,AN0-1)),nowBase=a.ex;
  return WELLS.map(function(w){var b=w[1]*base,af=w[1]*(1-w[2])*nowBase;return {id:w[0],before:b,after:af,lost:Math.max(0,b-af)}})}

function plan(itp){
  var m=MET[itp.metric],single=itp.fields.length===1,fields=itp.fields.length?itp.fields:null,focus=single?itp.fields[0]:null;
  var N=itp.N||m.def;if(!m.daily&&itp.Nunit==='dia')N=Math.max(1,Math.round(N/30));if(!m.daily&&itp.Nunit==='semana')N=Math.max(1,Math.round(N/4));
  N=Math.max(m.daily?3:1,Math.min(N,m.daily?45:5));
  var per={};FIELDS.forEach(function(f){var s=m.data[f],cur=mean(s.slice(s.length-N)),prev=mean(s.slice(s.length-2*N,s.length-N)),an=analyze(m,s);per[f]={cur:cur,prev:prev,chg:(cur/prev-1)*100,a:an}});
  var tot=totalSeries(m),totA=analyze(m,tot);
  var cand=(single?[focus]:(fields||[])).slice();
  var main;if(single)main={name:focus,s:m.data[focus],a:per[focus].a};else if(fields&&fields.length>1)main=null;else main={name:'Todos los campos',s:tot,a:totA};
  /* si no se nombró un campo, el foco es el campo con mayor anomalía de esta métrica */
  var worst=FIELDS.filter(function(f){return per[f].a.anomalous}).sort(function(a,b){return per[b].a.impact-per[a].a.impact})[0]||null;
  return {m:m,itp:itp,N:N,per:per,tot:tot,totA:totA,main:main,single:single,focus:focus,worst:worst,fields:fields}}

function legendHTML(l){return l.map(function(x){return '<span><i'+(x.ln?' class="ln"':'')+' style="background:'+x.c+(x.dot?';border-radius:50%':'')+'"></i>'+x.t+'</span>'}).join('')}
function tableHTML(t){return '<table><thead><tr>'+t.head.map(function(x){return '<th scope="col">'+x+'</th>'}).join('')+'</tr></thead><tbody>'+t.rows.map(function(r){return '<tr>'+r.map(function(c,i){return (i===0?'<th scope="row" style="font-weight:600;color:var(--ink)">':'<td>')+c+(i===0?'</th>':'</td>')}).join('')+'</tr>'}).join('')+'</tbody></table>'}

function build(P,auto){
  var m=P.m,itp=P.itp,focusName=P.single?P.focus:(P.worst&&!(P.fields&&P.fields.length>1)?P.worst:null);
  var shown=P.single?P.focus:(P.fields&&P.fields.length>1?P.fields.join(' y '):(focusName||'todos los campos'));
  var mainA,mainS,mainName;
  if(P.single){mainA=P.per[P.focus].a;mainS=m.data[P.focus];mainName=P.focus}
  else if(P.fields&&P.fields.length>1){mainA=null;mainS=null;mainName=shown}
  else if(focusName){mainA=P.per[focusName].a;mainS=m.data[focusName];mainName=focusName}
  else{mainA=P.totA;mainS=P.tot;mainName='Todos los campos'}
  var N=P.N,unitN=m.daily?'días':(N===1?'mes':'meses');
  var hits=search(itp.q+' '+({prod:'producción caída pozos compresión bombas declinación',opex:'costo gasto contratos energía',emis:'emisiones venteo fugas metano carbono'})[m.id]+(mainA&&mainA.anomalous?' desvío anomalía':''),3);
  var an=mainA&&mainA.anomalous,actDoc=hits.filter(function(h){return h.d.act})[0];
  var cards=[],read=[],kpis=[];
  /* ① evolución */
  var win=m.win,n=(mainS||m.data[FIELDS[0]]).length,from=Math.max(0,n-win),xs=[],i;for(i=from;i<n;i++)xs.push(dateLabel(i,m));
  var nx=xs.length,tk=m.daily?[0,10,20,30,40,50,nx-1]:[0,2,4,6,8,10,11];
  cards.push({title:m.Nm+' de '+mainName+': real contra esperado',sub:(m.daily?'Últimos '+win+' días. ':'Últimos 12 meses. ')+m.unit+'. La banda es el rango esperado según la tendencia previa.',
    legend:mainA?[{c:C.blue,t:'Real',ln:1},{c:C.gd,t:'Esperado',ln:1},{c:'rgba(42,120,214,.25)',t:'Rango esperado (±2σ)'}]:P.fields.map(function(f,j){return {c:[C.blue,C.orange,C.gd][j%3],t:f,ln:1}}),
    draw:function(h,lb){
      if(mainA){var s=mainS.slice(from),a=mainA,st=a.start>=0&&a.start>=from?a.start-from:-1;
        V.line(h,{label:lb,x:xs,xTicks:tk,tipFmt:m.daily?f0:f1,yFmt:m.daily?f0:f1,h:280,r:46,
          vlines:an&&st>=0?[{i:st,label:'Inicio del desvío',dx:-5,anchor:'end'}]:[],
          bands:[{lo:a.lo.slice(from),hi:a.hi.slice(from),c:C.blue,op:.12,name:'Rango esperado'}],
          series:[{name:'Esperado',c:C.gd,w:1.5,dash:'5 4',pts:a.exp.slice(from)},{name:'Real',c:C.blue,w:2.5,pts:s,end:m.daily?f0(s[s.length-1]):f1(s[s.length-1]),endAnchor:'start',endDy:4}]})}
      else{V.line(h,{label:lb,x:xs,xTicks:tk,tipFmt:m.daily?f0:f1,yFmt:m.daily?f0:f1,h:280,r:46,yMin:0,series:P.fields.map(function(f,j){var s=m.data[f].slice(from);return {name:f,c:[C.blue,C.orange,C.gd][j%3],w:2.25,pts:s,end:m.daily?f0(s[s.length-1]):f1(s[s.length-1]),endAnchor:'start',endDy:4}})})}},
    table:(function(){var rows=[],step=m.daily?10:1,fl=mainA?[mainName]:P.fields;for(var j=nx-1;j>=0;j-=step){var ix=from+j;rows.push([xs[j]].concat(fl.map(function(f){return f0((mainA?mainS:m.data[f])[ix]*(m.daily?1:10)/(m.daily?1:10))})))}
      if(!m.daily)rows=rows.map(function(r){return [r[0]].concat(r.slice(1).map(function(c,jj){var f=fl[jj];return f1((mainA?mainS:m.data[f])[from+xs.indexOf(r[0])])}))});return {head:['Fecha'].concat(fl.map(function(f){return f+' ('+m.unit+')'})),rows:rows}})(),wide:true});
  /* ② dónde se concentra */
  var order=FIELDS.slice().sort(function(a,b){var pa=P.per[a],pb=P.per[b];return m.adv*(pb.chg-pa.chg)});
  cards.push({title:'Qué campos cambiaron',sub:'Variación de los últimos '+N+' '+unitN+' contra los '+N+' anteriores. Naranja: cambio adverso fuera de lo esperado.',
    legend:[{c:C.orange,t:'Adverso y fuera de lo esperado'},{c:C.gm,t:'Dentro de lo esperado'}],
    draw:function(h,lb){V.barsH(h,{label:lb,rows:order.map(function(f){var p=P.per[f],hot=p.a.anomalous;return {label:f,value:Math.abs(p.chg),color:hot?C.orange:C.gm,text:sgn(p.chg,1)+' %',tip:[{k:'Ahora',v:(m.daily?f0(p.cur):f1(p.cur))+' '+m.unit},{k:'Antes',v:(m.daily?f0(p.prev):f1(p.prev))+' '+m.unit},{k:'Desvío vs esperado',v:sgn(p.a.badZ*m.adv,1)+' σ'}]}}),max:Math.max(5,Math.max.apply(null,order.map(function(f){return Math.abs(P.per[f].chg)}))*1.1),d:1,unit:'Variación',lw:92,r:62,tickFmt:function(x){return fmt(x,0)+' %'}})},
    table:{head:['Campo','Ahora','Antes','Variación'],rows:order.map(function(f){var p=P.per[f];return [f,m.daily?f0(p.cur):f1(p.cur),m.daily?f0(p.prev):f1(p.prev),sgn(p.chg,1)+' %']})}});
  /* ③ qué lo explica */
  var wellsOn=m.id==='prod'&&mainName==='Costa';
  if(wellsOn){var W=wellsData().sort(function(a,b){return b.lost-a.lost});
    cards.push({title:'Qué pozos explican la caída en Costa',sub:'bopd perdidos por pozo, comparando antes y después del desvío.',legend:[{c:C.orange,t:'Pozo con caída'},{c:C.gm,t:'Sin cambio'}],
      draw:function(h,lb){V.barsH(h,{label:lb,rows:W.map(function(w){return {label:w.id,value:w.lost,color:w.lost>5?C.orange:C.gm,text:w.lost>5?'−'+f0(w.lost)+' bopd':'sin cambio',tip:[{k:'Antes',v:f0(w.before)+' bopd'},{k:'Ahora',v:f0(w.after)+' bopd'}]}}),max:Math.max.apply(null,W.map(function(w){return w.lost}))*1.1,unit:'bopd',lw:56,r:84})},
      table:{head:['Pozo','Antes (bopd)','Ahora (bopd)'],rows:W.map(function(w){return [w.id,f0(w.before),f0(w.after)]})}})}
  else{var imp=FIELDS.map(function(f){return {f:f,v:P.per[f].a.impact}}).sort(function(a,b){return b.v-a.v});
    cards.push({title:'Cuánto cuesta cada desvío',sub:'Impacto estimado, en miles de USD por mes. Donde no hay desvío, cero.',legend:[{c:C.orange,t:'Con desvío'},{c:C.gm,t:'Sin desvío'}],
      draw:function(h,lb){V.barsH(h,{label:lb,rows:imp.map(function(r){var hot=P.per[r.f].a.anomalous;return {label:r.f,value:hot?r.v:0,color:hot?C.orange:C.gm,text:hot?f0(r.v)+' mil USD':'sin desvío',tip:[{k:'Impacto estimado',v:f0(P.per[r.f].a.impact)+' mil USD/mes'}]}}),max:Math.max(50,imp[0].v*1.1),unit:'mil USD/mes',lw:92,r:84})},
      table:{head:['Campo','Impacto (mil USD/mes)'],rows:imp.map(function(r){return [r.f,P.per[r.f].a.anomalous?f0(r.v):'0']})}})}
  /* indicadores */
  var curv=mainA?mainA.act:mean(P.tot.slice(P.tot.length-(m.daily?7:1))),dev=mainA?mainA.badZ*m.adv:null;
  var chgMain=mainA?(mainName==='Todos los campos'?(function(){var s=P.tot,c=mean(s.slice(s.length-N)),p=mean(s.slice(s.length-2*N,s.length-N));return (c/p-1)*100})():P.per[mainName].chg):null;
  kpis=[{l:(m.daily?'Producción de ':m.Nm+' de ')+mainName,v:mainA?(m.daily?f0(curv):f1(curv)):'—',u:m.unit,d:m.daily?'Promedio de los últimos 7 días':'Último mes cerrado'},
    {l:'Cambio contra el período previo',v:mainA?sgn(chgMain,1)+' %':'—',u:'',d:'Últimos '+N+' '+unitN+' contra los '+N+' anteriores'},
    {l:'Desvío contra lo esperado',v:mainA?sgn(dev,1):'—',u:'σ',d:an?'<span class="bad">Fuera de lo esperado</span> (límite: 3,5 σ)':'Dentro de lo esperado'},
    {l:'Impacto estimado',v:an?f0(mainA.impact):'0',u:'mil USD/mes',d:an?'Desde hace '+mainA.pers+' '+(m.daily?'días':'meses'):'Sin anomalía en este campo'}];
  /* lectura integrada */
  var worstTxt=order[0];
  if(mainA){var a=mainA;
    read.push({n:1,h:an?(m.Nm+' de '+B(mainName)+' está '+B(sgn(m.daily?(a.act/a.ex-1)*100:(a.act/a.ex-1)*100,1)+' %')+' respecto de lo esperado desde '+B(dateLabel(a.start,m))+'. El desvío ya dura '+B(a.pers+' '+(m.daily?'días':'meses'))+' y no se explica por la declinación natural.'):(m.Nm+' de '+B(mainName)+' sigue la tendencia esperada: el desvío actual es de '+B(sgn(mainA.badZ*m.adv,1)+' σ')+', dentro del rango normal.')})}
  else read.push({n:1,h:'Se comparan '+B(P.fields.join(' y '))+' en el mismo período.'});
  var hot=FIELDS.filter(function(f){return P.per[f].a.anomalous});
  read.push({n:2,h:hot.length?('El cambio se concentra en '+B(hot.join(', '))+'. '+(hot.length<FIELDS.length?'Los otros '+(FIELDS.length-hot.length)+' campos se mantienen dentro de lo esperado.':'')):('Ningún campo muestra un desvío fuera de lo esperado en '+m.nm+'. El mayor cambio es '+B(worstTxt+' ('+sgn(P.per[worstTxt].chg,1)+' %)')+'.')});
  if(wellsOn&&an){var Wd=wellsData().filter(function(w){return w.lost>5}).sort(function(a,b){return b.lost-a.lost}),lost=Wd.reduce(function(s,w){return s+w.lost},0);
    read.push({n:3,h:B(Wd.length+' pozos')+' ('+Wd.map(function(w){return w.id}).join(' y ')+') explican '+B(f0(lost/ (mainA.gap||1)*100)+' %')+' de la caída: '+B(f0(lost)+' bopd')+' menos que antes. El resto de los pozos del campo no cambió.'})}
  else if(an){read.push({n:3,h:'El impacto estimado es de '+B(f0(mainA.impact)+' mil USD por mes')+' ('+({opex:'sobre lo esperado en el mes',emis:'valuado al precio interno del carbono de '+CARBON+' USD/t',prod:'valuado con netback de '+NETBACK+' USD/bbl'})[m.id]+').'})}
  else read.push({n:3,h:'No hace falta actuar: se vigila de manera continua y el Vigía avisa si el desvío supera 3,5 σ durante varios períodos.'});
  /* decisión */
  var dec;
  if(an){var act=actDoc?actDoc.d.act:'Revisar las causas del desvío con el responsable del campo.';
    dec={what:act,big:f0(mainA.impact),u:'mil USD por mes en riesgo',cap:'Desde el '+dateLabel(mainA.start,m)+' lleva '+mainA.pers+' '+(m.daily?'días':'meses')+' fuera de lo esperado.',
      gains:[(m.id==='prod'?'Recuperable: '+B('hasta '+f0(mainA.gap)+' bopd')+' si se corrige la causa.':'Corregir la causa lleva el valor de vuelta a '+B(f1(mainA.ex)+' '+m.unit)+'.'),'Fuente de la acción: '+B(actDoc?actDoc.d.id:'GOB-001')+'. Queda registro de datos, fuentes y versión del cálculo.'],board:m.board,boardNm:m.boardNm}}
  else dec={what:'Seguir con la vigilancia. No se detecta una causa que justifique una intervención.',big:sgn(chgMain==null?0:chgMain,1),u:'% contra el período previo',cap:'El Vigía vuelve a revisar cuando entren nuevos datos.',gains:['Sin impacto económico estimado.','Para decidir sobre inversiones, abra el tablero '+m.boardNm+'.'],board:m.board,boardNm:m.boardNm,none:true};
  return {title:itp.q,metric:m,cards:cards,kpis:kpis,read:read,dec:dec,hits:hits,mainName:mainName,an:an,N:N,unitN:unitN,auto:auto,P:P,mainA:mainA}}

/* ===================== presentación ===================== */
var out=$('ask-out'),token=0;
function renderBoard(R,animated){
  var tag=R.auto?'Armado automáticamente por el Vigía':'Armado a su consulta';
  out.textContent='';var box=H('div',{'class':'out',id:'ask-board',tabindex:'-1'},out);
  H('div',{'class':'tag'},box,tag);H('h3',{'class':'q'},box,R.auto?R.autoTitle:R.title);
  var u=H('p',{'class':'understood'},box);u.innerHTML='Entendí: '+B(R.metric.nm)+' · '+B(R.mainName)+' · '+B('últimos '+R.N+' '+R.unitN)+' · '+B(R.auto?'diagnóstico de anomalía':R.P.itp.mode==='compare'?'comparación':R.P.itp.mode==='diag'?'diagnóstico':'tendencia');
  var pipe=H('div',{'class':'pipe'},box),log=H('ul',{'class':'log','aria-label':'Pasos de los agentes'},pipe);
  var m=R.metric,a=R.mainA,P=R.P,hits=R.hits;
  var steps=[
   {who:'Orquestador',t:'Interpreté la consulta y elegí '+B(m.nm)+' de '+B(R.mainName)+' como tema. Asigné la búsqueda, el cálculo y la revisión.',src:'Reglas de interpretación y campos conocidos.'},
   {who:'Recuperador',t:'Busqué en '+DOCS.length+' documentos y recuperé '+hits.length+' pasajes: '+hits.map(function(h){return h.d.id}).join(', ')+'.',src:'Búsqueda por relevancia (BM25) sobre documentos de demostración.'},
   {who:'Analista',t:a?('Ajusté la tendencia con '+(a.n-m.k)+' '+(m.daily?'días':'meses')+' previos y comparé los últimos '+m.k+': desvío de '+B(sgn(a.badZ*m.adv,1)+' σ')+(R.an?', con inicio el '+dateLabel(a.start,m)+'.':'.')):'Comparé los campos pedidos en el mismo período.',src:'Regresión sobre '+(m.daily?'el logaritmo de la producción':'la serie mensual')+'; anomalía si el desvío adverso supera 3,5 σ.'},
   {who:'Auditor',t:'Controlé los datos: serie completa, sin faltantes ni valores fuera de rango'+(R.an?'; el desvío persiste '+B(a.pers+' '+(m.daily?'días':'meses'))+', no es un dato aislado.':'.'),src:'Regla aplicada: un desvío cuenta solo si se mantiene varios períodos.'},
   {who:'Redactor',t:'Armé '+R.cards.length+' gráficos, la lectura integrada y la recomendación con sus fuentes. Falta la aprobación de una persona.',src:'Registro: fecha, datos, fuentes y versión del cálculo.'}];
  var mount=function(){renderBody(box,R)};
  function line(s,done){var li=H('li',null,log);li.className=done?'':'run';li.innerHTML='<div class="who"><i class="st"></i>'+s.who+'</div><div>'+(done?s.t+'<em>'+s.src+'</em>':'Trabajando…')+'</div>';return li}
  if(!animated||reduce){steps.forEach(function(s){line(s,true)});mount();return}
  var tk=++token,i=0;(function next(){if(tk!==token)return;if(i>=steps.length){mount();return}var s=steps[i],li=line(s,false);setTimeout(function(){if(tk!==token)return;li.className='';li.innerHTML='<div class="who"><i class="st"></i>'+s.who+'</div><div>'+s.t+'<em>'+s.src+'</em></div>';i++;next()},420)})()}
function renderBody(box,R){
  var k=H('div',{'class':'kpis'},box);R.kpis.forEach(function(x){var d=H('div',{'class':'kpi'},k);d.innerHTML='<div class="l">'+x.l+'</div><div class="v">'+x.v+(x.u?'<small>'+x.u+'</small>':'')+'</div><div class="d">'+x.d+'</div>'});
  var bd=H('div',{'class':'board'},box),ch=H('div',{'class':'charts'},bd),aside=H('aside',{'class':'aside','aria-label':'Lectura integrada y decisión'},bd),cardEls=[];
  R.cards.forEach(function(c,i){var card=H('article',{'class':'card'+(c.wide?' wide':'')},ch),h=H('div',{'class':'ch'},card);H('span',{'class':'badge','aria-hidden':'true'},h,String(i+1));var t=H('div',null,h);H('h3',null,t,c.title);H('p',null,t,c.sub);
    var tv=H('button',{'class':'tv',type:'button','aria-pressed':'false'},h,'Tabla'),plot=H('div',{'class':'plot'},card),tb=H('div',{'class':'tbl'},card);tb.innerHTML=tableHTML(c.table);tb.hidden=true;
    var lg=H('div',{'class':'legend'},card);lg.innerHTML=legendHTML(c.legend);
    var o={c:c,plot:plot,tb:tb,card:card};cardEls.push(o);
    tv.addEventListener('click',function(){var on=tb.hidden;tb.hidden=!on;plot.hidden=on;tv.textContent=on?'Gráfico':'Tabla';tv.setAttribute('aria-pressed',on?'true':'false');V.hideTip();if(!on)draw(o)});
    card.addEventListener('mouseenter',function(){hl(i+1,true)});card.addEventListener('mouseleave',function(){hl(i+1,false)})});
  function draw(o){try{o.c.draw(o.plot,o.c.title)}catch(e){o.plot.textContent='No se pudo dibujar este gráfico.';if(window.console)console.error(e)}}
  function hl(n,on){cardEls.forEach(function(o,i){o.card.classList.toggle('hl',on&&i+1===n)});[].forEach.call(olEl.children,function(li){li.classList.toggle('hl',on&&+li.getAttribute('data-n')===n)})}
  var rd=H('section',{'class':'read'},aside);H('h3',null,rd,'Lectura integrada');H('p',{'class':'sub'},rd,'Cada número remite al gráfico del mismo número.');
  var olEl=H('ol',null,rd);R.read.forEach(function(r){var li=H('li',{'data-n':r.n,tabindex:'0'},olEl);H('span',{'class':'badge','aria-hidden':'true'},li,String(r.n));H('span',null,li).innerHTML=r.h;
    li.addEventListener('mouseenter',function(){hl(r.n,true)});li.addEventListener('mouseleave',function(){hl(r.n,false)});li.addEventListener('focus',function(){hl(r.n,true)});li.addEventListener('blur',function(){hl(r.n,false)})});
  var sc=H('section',{'class':'srcs'},aside),sh=H('h3',null,sc,'Fuentes consultadas'),sl=H('ul',{'class':'src'},sc);R.hits.forEach(function(h){var li=H('li',null,sl);li.innerHTML='<span class="sc">'+fmt(h.s,1)+'</span><b>'+h.d.id+'</b> · '+h.d.t+'<br>'+h.d.x.slice(0,140)+(h.d.x.length>140?'…':'')});
  var dc=H('section',{'class':'dec'},aside),d=R.dec;
  dc.innerHTML='<h3>'+(d.none?'Conclusión del tablero':'Acción que sugiere el tablero')+'</h3><p class="what">'+d.what+'</p><div class="hero"><span class="big">'+d.big+'</span><span class="u">'+d.u+'</span></div><p class="cap">'+d.cap+'</p><ul class="gain">'+d.gains.map(function(g){return '<li>'+g+'</li>'}).join('')+'</ul><div class="row"><button type="button" class="btn lite" data-a="ok">'+(d.none?'Registrar revisión':'Enviar a aprobación')+'</button><button type="button" class="btn sec" data-a="go">Ver el tablero '+d.boardNm+'</button></div><p class="note">Datos de demostración. Una persona aprueba; los agentes no ejecutan cambios.</p>';
  dc.querySelector('[data-a=ok]').addEventListener('click',function(){var b=this;b.disabled=true;b.textContent=d.none?'Revisión registrada':'Enviado a aprobación';dc.querySelector('.note').textContent='Registro (demo): fecha '+new Date().toLocaleDateString('es-AR')+', datos y fuentes usados, versión del cálculo y responsable.'});
  dc.querySelector('[data-a=go]').addEventListener('click',function(){if(window.H3LBoards)window.H3LBoards.open(d.board)});
  cardEls.forEach(draw);
  var rs;window.addEventListener('resize',function(){clearTimeout(rs);rs=setTimeout(function(){cardEls.forEach(function(o){if(o.tb.hidden&&document.body.contains(o.plot))draw(o)})},160)});
}

/* ===================== consulta del usuario ===================== */
function openAnomaly(an,auto,animated){var itp={q:'¿Qué pasó con '+an.m.nm+' en '+an.f+'?',t:'',metric:an.m.id,fields:[an.f],N:an.m.def,mode:'diag'};var P=plan(itp),R=build(P,auto);if(auto)R.autoTitle='Anomalía detectada: '+an.m.nm+' en '+an.f;renderBoard(R,animated);return R}
function message(html){out.textContent='';var b=H('div',{'class':'out'},out);var p=H('p',{'class':'understood'},b);p.innerHTML=html}
function ask(q){
  q=q.trim();if(!q)return;var itp=interpret(q);
  if(itp.mode==='scan'){var all=scanAll();if(all.length){openAnomaly(all[0],false,true);return}message('No se detectaron anomalías en producción, costos ni emisiones.');return}
  if(itp.other&&!itp.metric){var id=itp.other;message('Esa consulta se resuelve en el tablero '+B(id==='reservas'?'Reservas':'Estratégico')+'. Lo abro más abajo.');if(window.H3LBoards)setTimeout(function(){window.H3LBoards.open(id)},350);return}
  if(!itp.metric){message('No pude identificar qué quiere verificar. Pruebe con la <b>producción</b>, los <b>costos</b> o las <b>emisiones</b> de un campo (Norte, Sur, Costa, Altiplano o Valle), o con «¿Dónde hay anomalías?».');return}
  var P=plan(itp),R=build(P,false);renderBoard(R,true);var el=$('ask-board');if(el&&el.scrollIntoView){try{el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}catch(e){}}}

/* ===================== vigilancia automática ===================== */
function renderWatch(list){
  var w=$('watch');w.textContent='';H('h3',null,w,'Vigilancia automática');
  H('p',{'class':'sub'},w,'El Vigía revisa producción, costos y emisiones de los cinco campos cada vez que entran datos.');
  if(!list.length){H('p',{'class':'ok'},w,'Sin anomalías en los últimos datos.');return}
  var ul=H('ul',{'class':'alist'},w);
  list.forEach(function(an,i){var li=H('li',null,ul),b=H('button',{type:'button','class':'al'},li);
    var pct=(an.a.act/an.a.ex-1)*100;
    b.innerHTML='<span class="dot'+(i>0?' mid':'')+'"></span><span><b>'+an.m.Nm+' · '+an.f+'</b>: '+sgn(pct,0)+' % contra lo esperado<small>Desde el '+dateLabel(an.a.start,an.m)+' · impacto estimado '+f0(an.a.impact)+' mil USD/mes</small></span><span class="go">Abrir tablero</span>';
    b.addEventListener('click',function(){openAnomaly(an,false,true);var el=$('ask-board');if(el&&el.scrollIntoView){try{el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}catch(e){}}})})}

var CH=['¿Por qué bajó la producción de Costa?','Costos de Valle de los últimos 3 meses','Emisiones por campo, últimos 3 meses','Compará la producción de Norte y Sur','¿Dónde hay anomalías?','¿Qué reservas puedo reportar?'];
var chips=$('ask-chips');CH.forEach(function(c){var b=H('button',{type:'button'},chips,c);b.addEventListener('click',function(){$('ask-q').value=c;ask(c)})});
$('ask-f').addEventListener('submit',function(e){e.preventDefault();ask($('ask-q').value)});

var found=scanAll();renderWatch(found);
if(found.length)openAnomaly(found[0],true,false);
window.H3LAsk={ask:ask,scan:scanAll,analyze:analyze,search:search};
})();
