/* H3L · consulta en lenguaje natural sobre la revisión de reservas PD.
   Interpreta la pregunta (es/en/fr/pt, con o sin tildes), consulta el análisis actual y responde con cifras, evidencia y fuentes.
   Es un intérprete de reglas que corre en el navegador (no un modelo de lenguaje). Desarrollado por Leandro Collell. */
(function(){'use strict';
function nz(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
var RX={
 over:/sobreestim|sobre.?regist|sobrevalor|sobrestim|optimis|overbook|overstat|overestim|over.?report|superestim|surestim|surevalu|surcot|mal regist|a la baja|downgrade|write.?down|downward|rebaix|revisar|revision|reviser|revisao|revise|riesgo|risk|risque|risco|auditor|recort|bajar|descontar/,
 fix:/intervenc|workover|repair|repar|recover|caida subita|caida brusca|subita|brusca|sudden|restaur|intervention|chute brutale|chute soudaine|queda subita|queda brusca|recuper/,
 limit:/limite econ|economic limit|abandon|marginal|limite d.?econ|limite economico|rentab|profitab|equilibri|break.?even|seuil|limite/,
 up:/subestim|upside|alza|potencial|underbook|underestim|sous.?estim|subregist|sub.?regist|oportunidad|opportunit|aumentar|subir|increase|augment|aumento/,
 price:/precio|price|prix|preco|brent|sensib|escenario|scenario|cenario|usd|us\$|dolar|dollar|\$/,
 life:/vida|r\/p|life|duree|duracao|horizonte|cuantos anos|how many years|years of|anos de/,
 data:/etaye|respaldo|reposent|comprov|justif|dato|soporte|calidad|support|data quality|verific|evidencia|evidence|document|fuente|source|qualite|dados|suporte|confiab|garant|control|valida|trazab|audit/,
 decision:/primero|primeiro|premier|first|decid|decis|recomend|que hago|que hacer|what should|should we|recommend|decide|conviene|que accion|devo|quoi faire|action|plan|prioridad|priorit|prioridade/,
 total:/total|cuanto|cuantas|how much|how many|combien|quanto|resumen|summary|resume|resumo|reservas pd|pd reserves|panorama|overview/
};
function has(k,q){return RX[k].test(q)}
function run(raw,ctx){
  var I=ctx.I,F=ctx.f,q=nz(raw),A=ctx.A(),P=ctx.P,out={q:raw,hl:[],rows:null,head:null,act:null,src:[]},i;
  var wellId=null,m=q.match(/\b([a-z]{2,4}-\d{1,3})\b/);if(m){var up=m[1].toUpperCase();A.wells.forEach(function(w){if(w.id.toUpperCase()===up)wellId=w.id})}
  var field=null;A.fields.forEach(function(f){if(q.indexOf(nz(f.id))>=0)field=f.id});
  var topN=null;m=q.match(/(?:top|primeros?|premiers?|principais|los|les|os|the)?\s*(\d{1,2})\s*(?:pozos|wells|puits|pocos|peores|worst|mayores|largest|principales|biggest|plus)/);if(m)topN=Math.min(24,+m[1]);
  var pm=q.match(/(?:^|[^\d.,])(\d{2,3})(?:[.,]\d+)?\s*(?:usd|us\$|\$|dolares|dollars|dolar|\/?bbl|por barril|per barrel|le baril)?/);
  var priceN=pm&&has('price',q)?+pm[1]:null;if(priceN&&(priceN<20||priceN>200))priceN=null;
  function inF(w){return !field||w.field===field}
  function pick(fn){var L=A.wells.filter(function(w){return inF(w)&&fn(w)});return L}
  var src=function(){var r=[I('r.src1',{f:ctx.srcName(),n:A.wells.length}),I('r.src2',{w:P.win}),I('r.src3',{p:F(A.price,0),f:F(P.fixed,0),r:F(P.roy*100,0),q:F(A.qel,1)})];return r};
  var MM=function(v){return F(v/1000,2)},Mb=function(v){return F(v,1)};
  function sortBy(L,fn){return L.slice().sort(function(a,b){return fn(a)-fn(b)})}
  function wrow(w){return [w.id,w.field,Mb(w.booked),Mb(w.model),(w.var>0?'+':'')+F(w.var,0)+' %',I('act.'+w.act)]}
  var WH=I('r.hW');
  /* —— pozo —— */
  if(wellId){var w=A.wells.filter(function(x){return x.id===wellId})[0];out.kind='well';out.hl=[w.id];out.sel=w.id;
    out.title=I('r.wellT',{w:w.id});
    var an=(1-Math.exp(-w.D*12))*100;
    out.html=I('r.well1',{w:w.id,f:w.field,q:F(w.q0,0),d:F(an,0),r:F(w.r2,2)})+' '+I('r.well2',{b:Mb(w.booked),m:Mb(w.model),v:(w.var>0?'+':'')+F(w.var,0)})+' '+I('r.act.'+w.act,{q:F(A.qel,1),g:w.drop?Mb(w.drop.gain):'',r:w.drop?F(w.drop.ratio*100,0):'',c:F(P.wo,0)});
    out.head=WH.split('|');out.rows=[wrow(w)];out.src=src();return out}
  /* —— precio —— */
  if(priceN&&!has('over',q)&&!has('fix',q)){var a2=ctx.setPrice(priceN),base=ctx.baseTotal();out.kind='price';out.title=I('r.priceT',{p:F(priceN,0)});
    var lim=a2.wells.filter(function(w){return w.act==='limit'}).map(function(w){return w.id});
    out.html=I('r.price1',{p:F(priceN,0),m:MM(a2.tot.model),d:(a2.tot.model>=base?'+':'−')+F(Math.abs(a2.tot.model-base)/base*100,1),b:F(P.priceBase,0),q:F(a2.qel,1)})+' '+(lim.length?I('r.price2',{n:lim.length,l:lim.join(', ')}):I('r.price3'));
    out.hl=lim;out.src=ctx.srcWith(a2);return out}
  /* —— campo —— */
  var iOver=has('over',q),iFix=has('fix',q),iLim=has('limit',q),iUp=has('up',q);
  if(iFix&&!iLim){var L=sortBy(pick(function(w){return w.drop}),function(w){return -w.drop.gain});if(topN)L=L.slice(0,topN);out.kind='fix';out.title=I('r.fixT');
    if(!L.length){out.html=I('r.fix0')}else{var g=0,v=0;L.forEach(function(w){g+=w.drop.gain;v+=w.drop.gainNpv});
      out.html=I('r.fix1',{n:L.length,g:Mb(g),v:F(v,1),c:F(P.wo,0),r:F(v*1000/(L.length*P.wo),0)});
      out.head=I('r.hF').split('|');out.rows=L.map(function(w){return [w.id,w.field,F(w.drop.ratio*100,0)+' %',Mb(w.drop.gain),F(w.drop.gainNpv,1),F(w.drop.roi,1)+'×']});out.hl=L.map(function(w){return w.id})}
    out.act={k:'apply',l:I('a.apply')};out.src=src();return out}
  if(iLim){var L2=sortBy(pick(function(w){return w.fit&&w.q0<=A.qel*1.3&&w.booked>0}),function(w){return w.q0});if(topN)L2=L2.slice(0,topN);out.kind='limit';out.title=I('r.limT');
    function be(w){return (P.fixed/(DAYc()*w.q0)+P.vc)/(1-P.roy)}
    function DAYc(){return ctx.DAY}
    out.html=L2.length?I('r.lim1',{n:L2.length,q:F(A.qel,1),p:F(A.price,0)}):I('r.lim0',{q:F(A.qel,1),p:F(A.price,0)});
    if(L2.length){out.head=I('r.hL').split('|');out.rows=L2.map(function(w){return [w.id,w.field,F(w.q0,1),Mb(w.booked),Mb(w.model),F(be(w),0)+' USD']});out.hl=L2.map(function(w){return w.id})}
    out.src=src();return out}
  if(iUp&&!iOver){var L3=sortBy(pick(function(w){return w.act==='up'}),function(w){return -(w.model-w.booked)});if(topN)L3=L3.slice(0,topN);out.kind='up';out.title=I('r.upT');
    var s3=0;L3.forEach(function(w){s3+=w.model-w.booked});
    out.html=L3.length?I('r.up1',{n:L3.length,v:Mb(s3),t:F(P.tol,0)}):I('r.up0');
    if(L3.length){out.head=WH.split('|');out.rows=L3.map(wrow);out.hl=L3.map(function(w){return w.id})}
    out.src=src();return out}
  if(iOver){var L4=sortBy(pick(function(w){return w.act==='down'||w.act==='limit'}),function(w){return -(w.booked-w.model)});if(topN)L4=L4.slice(0,topN);out.kind='over';out.title=I('r.overT');
    var s4=0;L4.forEach(function(w){s4+=w.booked-w.model});var nfix=pick(function(w){return w.act==='fix'}).length;
    out.html=L4.length?I('r.over1',{n:L4.length,v:Mb(s4),p:F(s4/A.tot.booked*100,1),w:L4[0].id,d:F(L4[0].var,0),t:F(P.tol,0)})+(nfix?' '+I('r.over2',{m:nfix}):''):I('r.over0',{t:F(P.tol,0)});
    if(L4.length){out.head=WH.split('|');out.rows=L4.map(wrow);out.hl=L4.map(function(w){return w.id})}
    out.act=L4.length?{k:'apply',l:I('a.apply')}:null;out.src=src();return out}
  if(has('life',q)){out.kind='life';out.title=I('r.lifeT');
    out.html=I('r.life1',{y:F(A.tot.rp,1),m:MM(A.tot.model),r:F(A.tot.q0,0)});
    out.head=I('r.hLife').split('|');out.rows=A.fields.map(function(f){var q0=0;A.wells.forEach(function(w){if(w.field===f.id)q0+=w.q0});return [f.id,Mb(f.model),F(q0,0),F(q0>0?f.model/(q0*365/1000):0,1)]});out.src=src();return out}
  if(has('data',q)){out.kind='data';out.title=I('r.dataT');var st=ctx.dataState();
    out.html=st.demo?I('r.data0'):I('r.data1',{f:st.name,ok:st.ok,w:st.warn,x:st.fail,s:st.score,a:st.att,t:st.req});
    out.act={k:'support',l:I('a.support')};out.src=src();return out}
  if(has('decision',q)){out.kind='decision';out.title=I('r.decT');var o=ctx.decision();
    out.html=I('r.dec1',{a:o.down,b:Mb(o.over),c:o.fix,g:Mb(o.gain),v:F(o.gainNpv,1),k:F(o.cost,0),u:o.up,x:Mb(o.upv)});out.hl=o.ids;
    out.act={k:'apply',l:I('a.apply')};out.src=src();return out}
  if(field){var Fd=A.fields.filter(function(f){return f.id===field})[0];out.kind='field';out.title=I('r.fieldT',{f:field});
    var dv=(Fd.model-Fd.booked)/Fd.booked*100;
    out.html=I('r.field1',{f:field,b:MM(Fd.booked),m:MM(Fd.model),d:(dv>0?'+':'')+F(dv,1),n:Fd.n,x:Fd.down+Fd.limit,y:Fd.fix,u:Fd.up});
    out.head=WH.split('|');out.rows=sortBy(A.wells.filter(function(w){return w.field===field&&w.act!=='ok'}),function(w){return w.var}).map(wrow);out.hl=out.rows.map(function(r){return r[0]});out.src=src();return out}
  if(has('total',q)||has('price',q)||q.length>0&&/reserva|reserve|pd\b/.test(q)){out.kind='total';out.title=I('r.totT');
    var T=A.tot;out.html=I('r.tot1',{b:MM(T.booked),m:MM(T.model),d:F((T.model-T.booked)/T.booked*100,1),o:MM(T.over),g:MM(T.gain),n:A.wells.length});
    out.head=I('r.hT').split('|');out.rows=A.fields.map(function(f){var d=(f.model-f.booked)/f.booked*100;return [f.id,MM(f.booked),MM(f.model),(d>0?'+':'')+F(d,1)+' %',String(f.down+f.limit+f.fix)]});out.src=src();return out}
  out.kind='none';out.title=I('r.noneT');out.html=I('r.none1');out.src=[];return out}
window.RESASK={run:run};
})();
