/* H3L · Revisión de reservas PD — datos, cálculo y controles de consistencia.
   Todo corre en el navegador: los archivos no se envían a ningún servidor.
   Desarrollado por Leandro Collell. */
(function(){'use strict';
var DAY=30.4;
/* supuestos editables (el tablero los muestra y los guarda en el registro de evidencia) */
var P={price:70,roy:.12,vc:12,fixed:18000,wo:450,tol:15,win:12,disc:.10,hz:240,priceBase:70};

function netback(price){return price*(1-P.roy)-P.vc}
function qEL(price){var nb=netback(price);return nb>0?P.fixed/(DAY*nb):Infinity}

/* ---------- ajuste de declinación exponencial por mínimos cuadrados sobre ln(q) ---------- */
function fit(pts){
  var n=pts.length;if(n<6)return null;
  var sx=0,sy=0,sxx=0,sxy=0,xl=pts[n-1].x,i,p,x,y;
  for(i=0;i<n;i++){p=pts[i];x=p.x-xl;y=Math.log(p.q);sx+=x;sy+=y;sxx+=x*x;sxy+=x*y}
  var den=n*sxx-sx*sx;if(den===0)return null;
  var b=(n*sxy-sx*sy)/den,a=(sy-b*sx)/n,ssr=0,sst=0,ym=sy/n;
  for(i=0;i<n;i++){p=pts[i];x=p.x-xl;y=Math.log(p.q);var f=a+b*x;ssr+=(y-f)*(y-f);sst+=(y-ym)*(y-ym)}
  return {q0:Math.exp(a),D:Math.max(-b,0.002),r2:sst>0?Math.max(0,1-ssr/sst):1,n:n,xl:xl}}
/* volumen remanente (Mbbl) hasta el límite económico o el horizonte */
function rem(q0,D,qel){if(!(q0>qel))return 0;var t=Math.log(q0/qel)/D,T=Math.min(t,P.hz);return q0*(1-Math.exp(-D*T))/D*DAY/1000}
/* valor presente (USD MM) del flujo del pozo con la declinación dada */
function npv(q0,D,price){var nb=netback(price),s=0,m,q,cf;if(nb<=0)return 0;
  for(m=0;m<P.hz;m++){q=q0*Math.exp(-D*(m+.5));cf=q*DAY*nb-P.fixed;if(cf<0)break;s+=cf/Math.pow(1+P.disc,(m+.5)/12)}
  return s/1e6}

/* ---------- análisis del conjunto de pozos ---------- */
function analyze(ds,price){
  price=price==null?P.price:price;var qel=qEL(price),lastX=ds.lastX,res=[];
  ds.wells.forEach(function(w){
    var s=w.series,pts=s.filter(function(p){return p.q>0&&p.x>lastX-P.win}),f=fit(pts),o={id:w.id,field:w.field,booked:w.booked,series:s,qel:qel};
    var cum=0;s.forEach(function(p){cum+=p.q*DAY/1000});o.cum=cum;
    o.qLast=s.length?s[s.length-1].q:0;
    if(!f){o.fit=null;o.model=w.booked;o.rem=w.booked;o.npv=0;o.var=0;o.act='nodata';o.q0=o.qLast;o.D=0;o.r2=0;o.drop=null;res.push(o);return}
    o.fit=f;o.q0=f.q0;o.D=f.D;o.r2=f.r2;o.rem=rem(f.q0,f.D,qel);o.model=o.rem;o.npv=npv(f.q0,f.D,price);
    o.var=w.booked>0?(o.model-w.booked)/w.booked*100:0;
    /* caída súbita: tendencia previa a los últimos 3 meses vs. caudal real reciente */
    o.drop=null;
    var ptsA=s.filter(function(p){return p.q>0&&p.x<=lastX-3&&p.x>lastX-3-P.win}),fa=fit(ptsA);
    if(fa){var qPred=fa.q0*Math.exp(-fa.D*(lastX-fa.xl)),last2=s.filter(function(p){return p.x>=lastX-1}),act=last2.length?last2.reduce(function(a,p){return a+p.q},0)/last2.length:0;
      if(act<0.75*qPred&&qPred>qel){var gain=rem(qPred,fa.D,qel)-o.rem,gn=npv(qPred,fa.D,price)-o.npv;
        o.drop={ratio:act/qPred,qPred:qPred,D:fa.D,gain:Math.max(0,gain),gainNpv:Math.max(0,gn),roi:Math.max(0,gn)*1000/P.wo}}}
    if(w.booked>0&&o.q0<=qel)o.act='limit';
    else if(o.drop&&o.drop.roi>=1.5)o.act='fix';
    else if(o.var<-P.tol)o.act='down';
    else if(o.var>P.tol)o.act='up';
    else o.act='ok';
    res.push(o)});
  var fields={},tot={booked:0,model:0,npv:0,q0:0,over:0,exp0:0,exp1:0,rep1:0,gain:0,gainNpv:0,nFix:0,n:res.length};
  res.forEach(function(o){var F=fields[o.field]||(fields[o.field]={id:o.field,booked:0,model:0,n:0,down:0,limit:0,fix:0,up:0,ok:0,nodata:0,exp:0});
    F.booked+=o.booked;F.model+=o.model;F.n++;F[o.act]++;
    var e0=Math.max(0,o.booked-o.model);F.exp+=(o.act==='down'||o.act==='limit')?e0:0;
    tot.booked+=o.booked;tot.model+=o.model;tot.npv+=o.npv;tot.q0+=o.q0;
    tot.exp0+=e0;if(o.act==='down'||o.act==='limit')tot.over+=e0;
    var rep=(o.act==='down'||o.act==='limit')?o.model:o.booked,eff=o.act==='fix'?o.model+o.drop.gain:o.model;
    tot.rep1+=rep;tot.exp1+=Math.max(0,rep-eff);
    if(o.act==='fix'){tot.gain+=o.drop.gain;tot.gainNpv+=o.drop.gainNpv;tot.nFix++}});
  tot.rp=tot.q0>0?tot.model/(tot.q0*365/1000):0;
  /* puente: registrado → modelo → con plan */
  var br={down:0,limit:0,fix:0,up:0,ok:0,nodata:0};
  res.forEach(function(o){br[o.act]+=o.model-o.booked});
  return {wells:res,fields:Object.keys(fields).map(function(k){return fields[k]}),tot:tot,bridge:br,price:price,qel:qel,lastX:lastX}}

/* ---------- datos de demostración (deterministas) ---------- */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){var u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
var DEMO_LAST=2026*12+8,DEMO_N=36;
function demo(){
  var r=rng(20261008),F=[['CA','Cerro Azul'],['BV','Bajo Verde'],['LA','Loma Alta']];
  var special={'CA-03':{f:1.32},'CA-05':{f:1.25},'CA-07':{f:1.40},'BV-02':{drop:.55},'LA-04':{drop:.6},'LA-06':{qi:30,D:.03,booked:5.5},'BV-05':{f:.78},'LA-02':{f:.74}};
  var wells=[];
  F.forEach(function(fd){for(var k=1;k<=8;k++){
    var id=fd[0]+'-'+(k<10?'0':'')+k,sp=special[id]||{},qi=sp.qi||Math.round(380+r()*440),D=sp.D||(0.026+r()*0.016),series=[];
    for(var i=0;i<DEMO_N;i++){var q=qi*Math.exp(-D*i)*(1+gauss(r)*0.03);series.push({x:DEMO_LAST-DEMO_N+1+i,q:Math.max(1,Math.round(q*10)/10)})}
    var pts=series.filter(function(p){return p.x>DEMO_LAST-P.win}),f=fit(pts),model=rem(f.q0,f.D,qEL(P.priceBase)),
      booked=sp.booked!=null?sp.booked:Math.round(model*(sp.f||(0.93+r()*0.14))*10)/10;
    if(sp.drop){for(var j=series.length-3;j<series.length;j++)series[j].q=Math.round(series[j].q*sp.drop*10)/10}
    wells.push({id:id,field:fd[1],booked:booked,series:series})}});
  return {wells:wells,lastX:DEMO_LAST,source:'demo'}}

/* ---------- CSV ---------- */
function ym(x){var y=Math.floor(x/12),m=x%12+1;return y+'-'+(m<10?'0':'')+m}
function toCSV(ds){var L=['well,field,month,oil_bbl_d,booked_pd_mbbl'];
  ds.wells.forEach(function(w){w.series.forEach(function(p){L.push([w.id,w.field,ym(p.x),p.q,w.booked].join(','))})});return L.join('\n')}
function templateCSV(){return ['well,field,month,oil_bbl_d,booked_pd_mbbl','POZO-01,Mi Campo,2026-01,420.5,38.0','POZO-01,Mi Campo,2026-02,411.2,38.0','POZO-01,Mi Campo,2026-03,402.9,38.0','POZO-02,Mi Campo,2026-01,300.0,24.5','POZO-02,Mi Campo,2026-02,294.1,24.5','POZO-02,Mi Campo,2026-03,288.0,24.5'].join('\n')}
/* variante con errores sembrados, para mostrar qué detectan los controles */
function badCSV(){var L=toCSV(demo()).split('\n'),out=[L[0]],i;
  for(i=1;i<L.length;i++)out.push(L[i]);
  out[5]=out[5].replace(/,[\d.]+,([\d.]+)$/,',n/d,$1');
  out[40]=out[40].replace(/,[\d.]+,([\d.]+)$/,',-45,$1');
  out.push(out[60]);
  out.splice(101,2);
  out[200]=out[200].replace(/,([\d.]+),([\d.]+)$/,function(m,a,b){return ','+(parseFloat(a)*8).toFixed(1)+','+b});
  out[310]=out[310].replace(/,[\d.]+$/,',99.9');
  out[420]=out[420].replace(/,\d{4}-\d{2},/,',2026-13,');
  return out.join('\n')}

function pcsv(t){t=t.replace(/^﻿/,'');var first=t.split(/\r?\n/,1)[0]||'';
  var d=[';','\t',','].map(function(c){return [c,first.split(c).length]}).sort(function(a,b){return b[1]-a[1]})[0][0];
  var rows=[],row=[],f='',q=false,ln=1,i,c;
  for(i=0;i<t.length;i++){c=t.charAt(i);
    if(q){if(c==='"'){if(t.charAt(i+1)==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;
    else if(c===d){row.push(f);f=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t.charAt(i+1)==='\n')i++;row.push(f);f='';rows.push({n:ln,c:row});row=[];ln++}
    else f+=c}
  if(f!==''||row.length){row.push(f);rows.push({n:ln,c:row})}
  return rows.filter(function(r){return r.c.some(function(x){return String(x).trim()!==''})})}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
function num(s){s=String(s==null?'':s).trim().replace(/\s/g,'');if(s===''||/^(n\/?d|na|nan|null|-)$/i.test(s))return NaN;
  var c=s.indexOf(','),p=s.indexOf('.');
  if(c>=0&&p>=0){if(c>p)s=s.replace(/\./g,'').replace(',','.');else s=s.replace(/,/g,'')}
  else if(c>=0){if(/^-?\d{1,3}(,\d{3})+$/.test(s))s=s.replace(/,/g,'');else s=s.replace(',','.')}
  return /^-?\d*\.?\d+(e[-+]?\d+)?$/i.test(s)?parseFloat(s):NaN}
function pdate(s){s=String(s||'').trim();var m,y,mo;
  if((m=s.match(/^(\d{4})[-\/.](\d{1,2})(?:[-\/.]\d{1,2})?/))){y=+m[1];mo=+m[2]}
  else if((m=s.match(/^(\d{1,2})[-\/.](\d{4})$/))){mo=+m[1];y=+m[2]}
  else if((m=s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/))){mo=+m[2];y=+m[3]}
  else return null;
  if(mo<1||mo>12||y<1990||y>2100)return null;return y*12+mo-1}
var COLS=[['well',/^(pozo|well|puits|poco|uwi|well_?id|id_?pozo|nombre|name)/],['month',/^(mes|month|fecha|date|periodo|period|mois|data|dt)/],['booked',/(booked|reserv|registrad|^pd|pd_|mbbl)/],['field',/^(campo|field|yacimiento|champ|area|bloque|block|cuenca)/],['rate',/(oil|bopd|bpd|qo|caudal|rate|produccion|petroleo|production|prod|bbl|vazao|debit)/]];

/* ---------- controles de consistencia ---------- */
function validate(text,name){
  var rows=pcsv(text),checks=[],C=function(id,st,n,v){checks.push({id:id,st:st,n:n||0,v:v||{}})},out={name:name,rows:Math.max(0,rows.length-1),checks:checks,ds:null};
  if(rows.length<2){C('struct','fail',0,{miss:'well, month, oil_bbl_d, booked_pd_mbbl'});out.fail=1;return finish(out)}
  var head=rows[0].c.map(norm),col={},used={};
  COLS.forEach(function(cd){for(var i=0;i<head.length;i++){if(!used[i]&&cd[1].test(head[i])){col[cd[0]]=i;used[i]=1;return}}});
  var miss=['well','month','rate','booked'].filter(function(k){return col[k]==null}).map(function(k){return {well:'well',month:'month',rate:'oil_bbl_d',booked:'booked_pd_mbbl'}[k]});
  if(miss.length){C('struct','fail',miss.length,{miss:miss.join(', ')});return finish(out)}
  C('struct','ok',0);
  var bad=[],neg=[],bigs=[],dupKey={},dups=[],byW={},badD=[],bookBad=[],fieldOf={},multiF={},now=new Date(),nowX=now.getFullYear()*12+now.getMonth();
  rows.slice(1).forEach(function(r){var w=String(r.c[col.well]||'').trim(),x=pdate(r.c[col.month]),q=num(r.c[col.rate]),bk=num(r.c[col.booked]),fd=col.field!=null?String(r.c[col.field]||'').trim():'';
    if(!w){bad.push(r.n);return}
    if(x==null){badD.push(r.n);return}
    if(isNaN(q)){bad.push(r.n);return}
    if(q<0){neg.push(r.n);return}
    if(q>20000)bigs.push(r.n);
    var k=w+'|'+x;if(dupKey[k]){dups.push(r.n);return}dupKey[k]=1;
    var W=byW[w]||(byW[w]={id:w,field:fd||'—',booked:[],series:[]});
    if(fd){if(fieldOf[w]&&fieldOf[w]!==fd)multiF[w]=1;fieldOf[w]=fd;W.field=fd}
    if(isNaN(bk)||bk<0)bookBad.push(r.n);else W.booked.push(bk);
    W.series.push({x:x,q:q,n:r.n})});
  var tot=rows.length-1,badAll=bad.length+badD.length;
  C('types',badAll===0?'ok':(badAll/tot<0.02?'warn':'fail'),badAll,{ex:bad.concat(badD).slice(0,4).join(', ')});
  C('neg',neg.length?'fail':'ok',neg.length,{ex:neg.slice(0,4).join(', ')});
  C('dups',dups.length?'fail':'ok',dups.length,{ex:dups.slice(0,4).join(', ')});
  var wl=Object.keys(byW).map(function(k){return byW[k]}),gaps=0,gapW=[],zeros=0,spikes=0,spikeEx=[],shortW=[],incons=[],noBook=[],maxX=0;
  wl.forEach(function(W){W.series.sort(function(a,b){return a.x-b.x});var s=W.series,i;
    if(s.length){maxX=Math.max(maxX,s[s.length-1].x);var g=(s[s.length-1].x-s[0].x+1)-s.length;if(g>0){gaps+=g;gapW.push(W.id)}}
    s.forEach(function(p,i){if(p.q===0)zeros++;var nb=[];if(s[i-2])nb.push(s[i-2].q);if(s[i-1])nb.push(s[i-1].q);if(s[i+1])nb.push(s[i+1].q);if(s[i+2])nb.push(s[i+2].q);
      if(nb.length>=3){nb.sort(function(a,b){return a-b});var med=nb[Math.floor(nb.length/2)];if(med>0&&p.q>3*med){spikes++;if(spikeEx.length<3)spikeEx.push(W.id+' '+ym(p.x))}}});
    var recent=s.filter(function(p){return p.q>0&&p.x>maxX-P.win}).length;if(recent<6)shortW.push(W.id);
    var bs=W.booked,u=bs.filter(function(v,i){return bs.indexOf(v)===i});if(u.length>1)incons.push(W.id);
    if(!bs.length)noBook.push(W.id);W.bk=bs.length?bs[bs.length-1]:NaN});
  C('book',(noBook.length||bookBad.length)?'fail':'ok',noBook.length+bookBad.length,{ex:noBook.slice(0,4).join(', ')||bookBad.slice(0,4).join(', ')});
  C('bookc',incons.length?'warn':'ok',incons.length,{ex:incons.slice(0,4).join(', ')});
  C('gaps',gaps?'warn':'ok',gaps,{ex:gapW.slice(0,4).join(', ')});
  C('zeros',zeros?'warn':'ok',zeros);
  C('spikes',spikes?'warn':'ok',spikes,{ex:spikeEx.join(', ')});
  C('short',shortW.length?'warn':'ok',shortW.length,{ex:shortW.slice(0,4).join(', ')});
  C('field',Object.keys(multiF).length?'warn':'ok',Object.keys(multiF).length,{ex:Object.keys(multiF).slice(0,4).join(', ')});
  C('fresh',nowX-maxX>3?'warn':'ok',Math.max(0,nowX-maxX),{d:ym(maxX)});
  /* conjunto utilizable */
  var wells=wl.filter(function(W){return !isNaN(W.bk)&&W.series.length}).map(function(W){return {id:W.id,field:W.field,booked:W.bk,series:W.series}});
  out.nWells=wl.length;out.lastX=maxX;
  if(wells.length)out.ds={wells:wells,lastX:maxX,source:name||'file'};
  return finish(out)}
function finish(o){o.ok=0;o.warn=0;o.fail=0;o.checks.forEach(function(c){o[c.st]++});
  o.score=o.checks.length?Math.round(100*(o.ok+0.6*o.warn)/o.checks.length):0;o.usable=!!o.ds&&o.fail===0;return o}

/* huella SHA-256 (si el navegador la ofrece) */
function hash(buf){try{if(window.crypto&&crypto.subtle)return crypto.subtle.digest('SHA-256',buf).then(function(h){return Array.prototype.map.call(new Uint8Array(h),function(b){return('0'+b.toString(16)).slice(-2)}).join('')})}catch(e){}
  return Promise.resolve('')}

window.RES={P:P,DAY:DAY,netback:netback,qEL:qEL,fit:fit,rem:rem,npv:npv,analyze:analyze,demo:demo,toCSV:toCSV,templateCSV:templateCSV,badCSV:badCSV,validate:validate,hash:hash,ym:ym};
})();
