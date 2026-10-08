/* H3L · los cinco tableros de decisión, con textos en es/en/fr/pt (ver lang-dash.js, lang-b12.js, lang-b345.js).
   Desarrollado por Leandro Collell. */
(function(){'use strict';
var V=window.VZ,$=V.$,H=V.H,fmt=V.fmt,sgn=V.sgn,reduce=V.reduce;
var C={blue:'var(--blue)',orange:'var(--orange)',red:'var(--red)',gm:'var(--gray-mark)',gd:'var(--gray-dark)',ink:'var(--ink-2)',o1:'var(--ord-1)',o2:'var(--ord-2)',o3:'var(--ord-3)'};
function I(k,v){return H3L.t(k,v)}
function f0(n){return fmt(n,0)}function f1(n){return fmt(n,1)}function f2(n){return fmt(n,2)}
function PS(){return H3L.nf.pct.replace(' ',' ')}
function pc(n,d){return fmt(n,d)+PS()}
function spc(n,d){return sgn(n,d)+PS()}
function B(s){return '<b>'+s+'</b>'}
function sum(a,fn){return a.reduce(function(t,x){return t+fn(x)},0)}
function idx(a,x){return a.indexOf(x)>=0}
function heads(k){return I(k).split('|')}
function fn(id){return I('f.'+id)}
function andJoin(a){return a.join(I('c.and'))}
function meta(p){return B(I('m.dec'))+' '+I(p+'.who')+' · '+B(I('m.freq'))+' '+I(p+'.fr')+' · '+B(I('m.crit'))+' '+I(p+'.cr',arguments[1])}
function dayLbl(d){return d<0?'−'+(-d)+' '+I('c.dayU'):d===0?I('c.today'):'+'+d+' '+I('c.dayU')}
function ag(who,key,vars,srcVars){return {who:who,t:I(key,vars),src:I(key+'s',srcVars||vars)}}

/* =====================================================================
   1 · ESTRATÉGICO — ¿Qué proyectos financiamos con el presupuesto?
   ===================================================================== */
function board1(){
  var BUD=120,K={base:0.034,dec:0.026},MU=I('c.musd');
  var P=[
    {id:'A',cap:18,npv:41},{id:'B',cap:35,npv:56},{id:'C',cap:22,npv:24},{id:'D',cap:30,npv:18},
    {id:'E',cap:28,npv:21},{id:'F',cap:26,npv:52},{id:'G',cap:24,npv:20},{id:'H',cap:15,npv:11}];
  P.forEach(function(p){p.n=I('b1.n'+p.id);p.s=I('b1.s'+p.id);p.ss=I('b1.ss'+p.id)});
  var by={};P.forEach(function(p){p.vpi=p.npv/p.cap;by[p.id]=p});
  var order=P.slice().sort(function(a,b){return b.vpi-a.vpi});
  var planIds=['D','E','B','C'],decIds=[],acc=0;
  order.forEach(function(p){if(acc+p.cap<=BUD){decIds.push(p.id);acc+=p.cap}});
  function tot(ids){var c=sum(ids,function(i){return by[i].cap}),n=sum(ids,function(i){return by[i].npv});return {ids:ids,cap:c,npv:n,vpi:n/c}}
  var S={base:tot(planIds),dec:tot(decIds)};
  var out=planIds.filter(function(i){return !idx(decIds,i)}),inn=decIds.filter(function(i){return !idx(planIds,i)});
  var outNpv=sum(out,function(i){return by[i].npv}),inNpv=sum(inn,function(i){return by[i].npv});
  var outCap=sum(out,function(i){return by[i].cap});
  var gain=S.dec.npv-S.base.npv,gainPct=gain/S.base.npv*100;
  function npvAt(sc,pr){return S[sc].npv*(1+K[sc]*(pr-70))}
  var low=sum(planIds.filter(function(i){return by[i].vpi<1}),function(i){return by[i].cap});
  var weak=planIds.filter(function(i){return by[i].vpi<1}).sort(function(a,b){return by[a].vpi-by[b].vpi});
  var NPV=I('x.npv'),PI=I('x.pi');
  return {
    id:'estrategico',tab:I('b1.tab'),short:I('b1.short'),
    q:I('b1.q',{bud:BUD}),
    meta:meta('b1'),
    view:function(sc){var s=S[sc];return {
      kpis:[
        {l:I('b1.k1'),f:f0,u:MU,bn:S.base.npv,dn:S.dec.npv,good:'up',sub:I('b1.k1s',{bud:BUD})},
        {l:I('b1.k2'),f:f0,u:MU,bn:S.base.cap,dn:S.dec.cap,good:'none',sub:I('b1.k2s',{bud:BUD})},
        {l:I('b1.k3'),f:f2,u:'',bn:S.base.vpi,dn:S.dec.vpi,good:'up',sub:I('b1.k3s')},
        {l:I('b1.k4'),f:f0,u:I('b1.k4u',{n:P.length}),bn:S.base.ids.length,dn:S.dec.ids.length,good:'none',sub:I('b1.k4s',{n:P.length})}],
      charts:[
        {title:I('b1.c1t'),sub:I('b1.c1s'),
         legend:[{c:C.blue,t:I('c.fund')},{c:C.gm,t:I('c.nofund')}],
         draw:function(h,lb){V.barsH(h,{label:lb,rows:order.map(function(p){var on=idx(s.ids,p.id);return {label:p.n,value:p.vpi,color:on?C.blue:C.gm,text:f2(p.vpi),tip:[{k:PI,v:f2(p.vpi)},{k:'Capex',v:f0(p.cap)+' '+MU},{k:NPV,v:f0(p.npv)+' '+MU},{k:I('b1.status'),v:on?I('c.fund'):I('c.nofund')}]}}),max:2.4,d:2,unit:PI,ref:{value:1,label:I('b1.ref',{v:f1(1)})},lw:150,r:40,tickFmt:f1})},
         table:{head:heads('b1.t1h'),rows:order.map(function(p){return [p.n,f0(p.cap),f0(p.npv),f2(p.vpi),idx(s.ids,p.id)?I('c.fund'):I('c.nofund')]})}},
        {title:I('b1.c2t'),sub:I('b1.c2s'),
         legend:[{c:C.blue,t:I('b1.add')},{c:C.red,t:I('b1.sub')}],
         draw:function(h,lb){var st=[{kind:'total',label:I('c.plan'),short:I('c.planS'),value:S.base.npv,text:f0(S.base.npv)}];
           out.forEach(function(i){st.push({label:I('b1.out',{n:by[i].s}),short:by[i].ss,value:-by[i].npv,text:sgn(-by[i].npv,0)})});
           inn.forEach(function(i){st.push({label:I('b1.in',{n:by[i].s}),short:by[i].ss,value:by[i].npv,text:sgn(by[i].npv,0)})});
           st.push({kind:'total',label:I('c.dec'),short:I('c.final'),value:S.dec.npv,text:f0(S.dec.npv)});
           V.waterfall(h,{label:lb,steps:st,unit:MU,h:270})},
         table:{head:heads('b1.t2h'),rows:[[I('c.plan'),f0(S.base.npv)]].concat(out.map(function(i){return [I('b1.out',{n:by[i].n}),sgn(-by[i].npv,0)]})).concat(inn.map(function(i){return [I('b1.in',{n:by[i].n}),sgn(by[i].npv,0)]})).concat([[I('c.dec'),f0(S.dec.npv)]])}},
        {title:I('b1.c3t'),sub:I('b1.c3s'),
         legend:[{c:C.red,t:I('b1.unf')},{c:C.blue,t:I('b1.fav')}],
         draw:function(h,lb){var N=s.npv,k=K[sc];V.tornado(h,{label:lb,unit:MU,d:0,rows:[
           {label:I('b1.r1'),low:-k*15*N,high:k*15*N},
           {label:I('b1.r2'),low:-0.15*s.cap*0.9,high:0.15*s.cap*0.9},
           {label:I('b1.r3'),low:-0.09*N,high:0.07*N},
           {label:I('b1.r4'),low:-0.08*N,high:0.10*N}]})},
         table:{head:heads('b1.t3h'),rows:(function(){var N=s.npv,k=K[sc],t=I('b1.t3r').split('|');return [[t[0],sgn(-k*15*N,0),sgn(k*15*N,0)],[t[1],sgn(-0.15*s.cap*0.9,0),sgn(0.15*s.cap*0.9,0)],[t[2],sgn(-0.09*N,0),sgn(0.07*N,0)],[t[3],sgn(-0.08*N,0),sgn(0.10*N,0)]]})()}},
        {title:I('b1.c4t'),sub:I('b1.c4s'),
         legend:[{c:C.gd,t:I('c.plan'),ln:1},{c:C.blue,t:I('c.dec'),ln:1}],
         draw:function(h,lb){var x=[],a=[],d=[];for(var p=45;p<=90;p+=5){x.push(String(p));a.push(npvAt('base',p));d.push(npvAt('dec',p))}
           V.line(h,{label:lb,x:x,xTicks:[0,2,4,6,8],xTitle:'Brent, USD/bbl',yMin:0,vlines:[{i:5,label:I('b1.assume')}],tipFmt:function(n){return f0(n)+' '+I('c.mm')},
             series:[{name:I('c.plan'),c:C.gd,w:sc==='base'?2.5:1.75,op:sc==='base'?1:.5,pts:a,end:f0(a[a.length-1]),endDy:16},{name:I('c.dec'),c:C.blue,w:sc==='dec'?2.5:1.75,op:sc==='dec'?1:.5,pts:d,end:f0(d[d.length-1])}],h:270,r:30})},
         table:{head:heads('b1.t4h'),rows:[45,50,55,60,70,80,90].map(function(p){return [String(p),f0(npvAt('base',p)),f0(npvAt('dec',p))]})}}],
      read:[
        {n:1,h:I('b1.rd1',{one:f1(1),a:by[weak[0]].n,va:f2(by[weak[0]].vpi),b:by[weak[1]].n,vb:f2(by[weak[1]].vpi),low:f0(low)})},
        {n:2,h:I('b1.rd2',{oc:f0(outCap),n:inn.length,ip:f0(inNpv),op:f0(outNpv),g:sgn(gain,0)})},
        {n:3,h:I('b1.rd3',{v:f0(K[sc]*15*s.npv)})},
        {n:4,h:I('b1.rd4',{a:f0(npvAt('base',55)),b:f0(npvAt('dec',55)),c:f0(npvAt('base',50)),d:f0(npvAt('dec',50))})}]}},
    dec:{what:I('b1.dwhat',{out:andJoin(out.map(function(i){return by[i].n})),'in':inn.map(function(i){return by[i].n}).join(', ')}),
      big:sgn(gain,0),u:I('b1.du',{p:spc(gainPct,0)}),cap:I('b1.dcap',{bud:BUD,a:f0(S.base.cap),b:f0(S.dec.cap)}),
      gains:[I('b1.dg1',{a:f2(S.base.vpi),b:f2(S.dec.vpi)}),I('b1.dg2',{a:f0(npvAt('dec',50)),b:f0(npvAt('base',50))}),I('b1.dg3')],
      note:I('b1.note')},
    agents:function(){return [
      ag(0,'b1.a1',{w:weak.length,n:planIds.length,one:f1(1),list:andJoin(weak.map(function(i){return by[i].n+' ('+f2(by[i].vpi)+')'}))}),
      ag(1,'b1.a2',{n:P.length,bud:BUD,o:out.length,i:inn.length,a:f0(S.base.npv),b:f0(S.dec.npv)}),
      ag(2,'b1.a3'),
      {who:3,t:I('b1.a4'),src:I('ag.doc')}]}
  };
}

/* =====================================================================
   2 · OPERATIVO — ¿Qué pozos intervenimos esta semana?
   ===================================================================== */
function board2(){
  var NB=38,META=9000,P0=8300,DEC=0.0012,LIM=45;
  var W=[
    {id:'P-18',c:'elec',g:110,k:40,day:2},{id:'P-22',c:'elec',g:60,k:35,day:3},
    {id:'P-12',c:'pump',g:95,k:85,day:5},{id:'P-07',c:'pump',g:80,k:85,day:7},{id:'P-31',c:'pump',g:60,k:70,day:9},
    {id:'P-27',c:'stim',g:50,k:220,day:0},{id:'P-03',c:'comp',g:70,k:400,day:0}];
  var CN={pump:I('b2.cpump'),elec:I('b2.celec'),stim:I('b2.cstim'),comp:I('b2.ccomp')};
  W.forEach(function(w){w.pb=w.k*1000/(w.g*NB);w.sel=w.pb<=LIM});
  var sel=W.filter(function(w){return w.sel}),G=sum(sel,function(w){return w.g}),K=sum(sel,function(w){return w.k});
  var pbAll=K*1000/(G*NB),month=G*NB*30/1000,gap0=META-P0;
  function base(d){return P0*(1-DEC*d)}
  function dec(d){return base(d)+sum(sel,function(w){return d>=w.day?w.g:0})}
  var b14=Math.round(base(14)),d14=Math.round(dec(14)),gB=META-b14,gD=META-d14;
  var cause=function(c){return sum(W.filter(function(w){return w.c===c}),function(w){return w.g})},rec=function(c){return sum(sel.filter(function(w){return w.c===c}),function(w){return w.g})};
  var loss=[[I('b2.lpump'),'pump'],[I('b2.lelec'),'elec'],[I('b2.lcomp'),'comp'],[I('b2.lstim'),'stim']].map(function(r){return {l:r[0],c:r[1],v:cause(r[1]),r:rec(r[1])}});
  loss.push({l:I('b2.ldecl'),c:'decl',v:gap0-sum(loss,function(r){return r.v}),r:0});
  var real=[];for(var k=0;k<=14;k++){var v=8520-16*k+Math.round(12*Math.sin(k*1.7));v+=({9:-260,10:-340,11:-200,12:-60})[k]||0;real.push(k===14?P0:v)}
  var xs=[],rPts=[],bPts=[],dPts=[],mPts=[];
  for(var i=0;i<=28;i++){var d=i-14;xs.push(dayLbl(d));rPts.push(i<=14?real[i]:null);bPts.push(i>=14?Math.round(base(d)):null);dPts.push(i>=14?Math.round(dec(d)):null);mPts.push(META)}
  var pbSorted=W.slice().sort(function(a,b){return a.pb-b.pb}),maxPb=Math.max.apply(null,sel.map(function(w){return w.pb})),minSlow=Math.min.apply(null,W.filter(function(w){return !w.sel}).map(function(w){return w.pb}));
  var restOther=loss[2].v+loss[3].v,KU=I('v.kusd'),DU=I('c.dayU');
  return {
    id:'operativo',tab:I('b2.tab'),short:I('b2.short'),
    q:I('b2.q'),
    meta:meta('b2',{lim:LIM}),
    view:function(sc){var on=sc==='dec';return {
      kpis:[
        {l:I('b2.k1'),f:f0,u:'bopd',bn:b14,dn:d14,good:'up',sub:I('b2.k1s',{v:f0(P0)})},
        {l:I('b2.k2'),f:f0,u:'bopd',bn:gB,dn:gD,good:'down',sub:I('b2.k2s',{v:f0(META)})},
        {l:I('b2.k3'),f:f0,u:KU,bn:0,dn:K,good:'none',sub:I('b2.k3s')},
        {l:I('b2.k4'),tb:'—',td:I('b2.k4v',{v:f0(pbAll)}),sub:I('b2.k4s'),dsub:I('b2.k4d',{nb:NB})}],
      charts:[
        {wide:1,title:I('b2.c1t'),sub:I('b2.c1s'),
         legend:[{c:C.ink,t:I('c.real'),ln:1},{c:C.gd,t:I('c.plan'),ln:1},{c:C.blue,t:I('b2.withI'),ln:1},{c:C.gd,t:I('c.target'),ln:1,dash:1}],
         draw:function(h,lb){V.line(h,{label:lb,x:xs,xTicks:[0,7,14,21,28],yMin:7900,yMax:9100,vlines:[{i:14,label:I('c.today')}],tipFmt:f0,h:270,r:46,
           series:[{name:I('c.target'),c:C.gd,w:1.25,dash:'2 4',pts:mPts},{name:I('c.real'),c:C.ink,w:2,pts:rPts},
             {name:I('c.plan'),c:C.gd,w:on?1.75:2.5,op:on?.55:1,dash:'6 4',pts:bPts,end:f0(b14),endDy:16,endAnchor:'start'},
             {name:I('b2.withI'),c:C.blue,w:on?2.5:1.75,op:on?1:.45,pts:dPts,end:f0(d14),endAnchor:'start'}]})},
         table:{head:heads('b2.t1h'),rows:[0,3,5,7,9,14].map(function(d){return [d===0?I('c.today'):'+'+d+' '+DU,f0(base(d)),f0(dec(d))]})}},
        {title:I('b2.c2t'),sub:I('b2.c2s'),
         legend:[{c:C.blue,t:I('b2.rec')},{c:C.gm,t:I('b2.lost')}],
         draw:function(h,lb){V.stackH(h,{label:lb,rh:50,lw:120,r:70,max:260,totalFmt:function(t){return f0(t)+' bopd'},
           rows:loss.map(function(r){var rc=on?r.r:0,segs=[];if(rc>0)segs.push({k:I('b2.recS'),v:rc,c:C.blue,text:f0(rc),tc:'#fff',tip:[{k:I('b2.recS'),v:f0(rc)+' bopd',c:C.blue},{k:I('b2.cause'),v:r.l}]});if(r.v-rc>0)segs.push({k:I('b2.lost'),v:r.v-rc,c:C.gm,text:f0(r.v-rc),tc:'#0E1A2B',tip:[{k:I('b2.lost'),v:f0(r.v-rc)+' bopd',c:C.gm},{k:I('b2.cause'),v:r.l}]});return {label:r.l,segs:segs}})})},
         table:{head:heads('b2.t2h'),rows:loss.map(function(r){return [r.l,f0(r.v),on?f0(r.r):'0']})}},
        {title:I('b2.c3t'),sub:I('b2.c3s',{nb:NB}),
         legend:[{c:C.blue,t:I('b2.in',{lim:LIM})},{c:C.gm,t:I('b2.defer')}],
         draw:function(h,lb){V.barsH(h,{label:lb,rows:pbSorted.map(function(w){return {label:w.id+' · '+CN[w.c],value:w.pb,color:w.sel?C.blue:C.gm,text:f0(w.pb)+' '+DU,tip:[{k:I('b2.payin'),v:f0(w.pb)+' '+I('b2.days').toLowerCase()},{k:I('b2.contrib'),v:'+'+f0(w.g)+' bopd'},{k:I('b2.invest'),v:f0(w.k)+' '+KU}]}}),max:160,unit:I('b2.days'),ref:{value:LIM,label:I('b2.limit',{lim:LIM})},lw:130,r:44})},
         table:{head:heads('b2.t3h'),rows:pbSorted.map(function(w){return [w.id,CN[w.c],'+'+f0(w.g),f0(w.k),f0(w.pb)]})}}],
      read:[
        {n:1,h:I('b2.rd1',{p:f0(P0),g:f0(gap0),g14:f0(gB)})},
        {n:2,h:I('b2.rd2',{pc:pc(G/gap0*100,0),a:loss[0].v,b:loss[1].v,g:f0(G)})},
        {n:3,h:I('b2.rd3',{n:sel.length,d:Math.ceil(maxPb),m:Math.floor(minSlow/30)})}]}},
    dec:{what:I('b2.dwhat',{n:sel.length}),
      big:'+'+f0(G),u:I('b2.du',{d:Math.max.apply(null,sel.map(function(w){return w.day}))}),cap:I('b2.dcap',{k:f0(K),m:f0(month)}),
      gains:[I('b2.dg1',{d:f0(pbAll)}),I('b2.dg2',{a:f0(gB),b:f0(gD)}),I('b2.dg3',{a:f0(gap0-G),b:f0(restOther),c:f0(loss[4].v)})],
      note:I('b2.note',{nb:NB})},
    agents:function(){return [
      ag(0,'b2.a1',{p:f0(P0),g:f0(gap0)}),
      ag(1,'b2.a2',{n:W.length,s:sel.length,lim:LIM,g:f0(G),k:f0(K)},{nb:NB,d:pc(DEC*100,2)}),
      ag(2,'b2.a3'),
      ag(3,'b2.a4')]}
  };
}

/* =====================================================================
   3 · TÁCTICO — ¿Cómo cerramos el año dentro del presupuesto?
   ===================================================================== */
function board3(){
  var BUD=96,MB=8,M=I('c.months').split('|'),MU=I('c.musd');
  var real=[8.0,8.2,8.1,8.5,8.6,8.5,8.8,8.9,8.8],fc=[8.9,8.9,8.9],dc=[7.7,7.0,6.3];
  var ytd=sum(real,function(x){return x}),totB=ytd+sum(fc,function(x){return x}),totD=ytd+sum(dc,function(x){return x});
  var over=[{l:I('b3.lEn'),s:I('b3.sEn'),v:2.9},{l:I('b3.lWo'),s:I('b3.sWo'),v:2.6},{l:I('b3.lCo'),s:I('b3.sCo'),v:2.1},{l:I('b3.lQu'),s:I('b3.sQu'),v:-0.5}];
  var acts=[{l:I('b3.lCo'),s:I('b3.sCo'),v:1.5},{l:I('b3.lEn'),s:I('b3.sEn'),v:2.0},{l:I('b3.lWo'),s:I('b3.sWo'),v:2.2}];
  var ovB=sum(over,function(o){return o.v}),sv=sum(acts,function(a){return a.v}),ovD=ovB-sv;
  var F=[{id:'Valle',b:19.6,d:16.9},{id:'Costa',b:17.9,d:15.1},{id:'Sur',b:15.8,d:13.9},{id:'Altiplano',b:13.1,d:13.1},{id:'Norte',b:12.4,d:12.4}],OBJ=14;
  F.forEach(function(x){x.n=fn(x.id)});
  var avgB=sum(F,function(x){return x.b})/F.length,avgD=sum(F,function(x){return x.d})/F.length;
  var budL=[],rL=[],pL=[],dL=[],bandLo=[],bandHi=[],wid=[0,.3,.5,.7];
  for(var i=0;i<12;i++){budL.push(MB);rL.push(i<=8?real[i]:null);pL.push(i>=8?(i===8?real[8]:fc[i-9]):null);dL.push(i>=8?(i===8?real[8]:dc[i-9]):null);bandLo.push(i>=8?pL[i]-wid[i-8]:null);bandHi.push(i>=8?pL[i]+wid[i-8]:null)}
  var above=F.filter(function(x){return x.b>OBJ});
  return {
    id:'tactico',tab:I('b3.tab'),short:I('b3.short'),
    q:I('b3.q'),
    meta:meta('b3'),
    view:function(sc){var on=sc==='dec';return {
      kpis:[
        {l:I('b3.k1'),f:f1,u:MU,bn:totB,dn:totD,good:'down',sub:I('b3.k1s',{v:f1(BUD)})},
        {l:I('b3.k2'),f:function(n){return spc(n,1)},u:'',bn:ovB/BUD*100,dn:ovD/BUD*100,good:'down',nopct:1,sub:I('b3.k2s')},
        {l:I('b3.k3'),f:f1,u:MU,bn:0,dn:sv,good:'none',sub:I('b3.k3s')},
        {l:I('b3.k4'),f:f1,u:'USD/bbl',bn:avgB,dn:avgD,good:'down',sub:I('b3.k4s',{v:f1(OBJ)})}],
      charts:[
        {wide:1,title:I('b3.c1t'),sub:I('b3.c1s'),
         legend:[{c:C.red,t:I('b3.var')},{c:C.blue,t:I('b3.act')}],
         draw:function(h,lb){var st=over.map(function(o){return {label:o.l,short:o.s,value:o.v,text:sgn(o.v,1),color:o.v>0?C.red:C.blue}});
           st.push({kind:'total',label:I('b3.pvar'),short:I('b3.pvarS'),value:ovB,text:sgn(ovB,1)});
           if(on){acts.forEach(function(a){st.push({label:a.l,short:a.s,value:-a.v,text:sgn(-a.v,1),color:C.blue,tip:[{k:I('b3.save'),v:f1(a.v)+' '+MU}]})});st.push({kind:'total',label:I('b3.dvar'),short:I('c.final'),value:ovD,text:sgn(ovD,1)})}
           V.waterfall(h,{label:lb,steps:st,unit:MU,h:250})},
         table:{head:heads('b3.t1h'),rows:over.map(function(o){return [I('b3.vsuf',{l:o.l}),sgn(o.v,1)]}).concat([[I('b3.pvar'),sgn(ovB,1)]]).concat(on?acts.map(function(a){return [I('b3.asuf',{l:a.l}),sgn(-a.v,1)]}).concat([[I('b3.dvar'),sgn(ovD,1)]]):[])}},
        {title:I('b3.c2t'),sub:I('b3.c2s'),
         legend:[{c:C.blue,t:I('b3.atT')},{c:C.orange,t:I('b3.abT')}],
         draw:function(h,lb){V.barsH(h,{label:lb,rows:F.map(function(x){var v=on?x.d:x.b;return {label:x.n,value:v,color:v>OBJ?C.orange:C.blue,text:f1(v),tip:[{k:I('b3.today'),v:f1(x.b)+' USD/bbl'},{k:I('c.dec'),v:f1(x.d)+' USD/bbl'}]}}),max:22,d:1,unit:'USD/bbl',ref:{value:OBJ,label:I('b3.ref',{v:f1(OBJ)})},lw:88,r:40})},
         table:{head:heads('b3.t2h'),rows:F.map(function(x){return [x.n,f1(x.b),f1(x.d)]})}},
        {title:I('b3.c3t'),sub:I('b3.c3s'),
         legend:[{c:C.gd,t:I('b3.budget'),ln:1},{c:C.ink,t:I('c.real'),ln:1},{c:C.orange,t:I('c.plan'),ln:1},{c:C.blue,t:I('c.dec'),ln:1}],
         draw:function(h,lb){V.line(h,{label:lb,x:M,xTicks:h.clientWidth<360?[0,2,4,6,8,10]:[0,1,2,3,4,5,6,7,8,9,10,11],yMin:5,yMax:10,tipFmt:f1,h:260,r:34,
           bands:[{lo:bandLo,hi:bandHi,c:C.orange,op:on?.07:.16,name:I('b3.band')}],
           series:[{name:I('b3.budget'),c:C.gd,w:1.25,dash:'3 4',pts:budL},{name:I('c.real'),c:C.ink,w:2,pts:rL},
             {name:I('c.plan'),c:C.orange,w:on?1.75:2.5,op:on?.6:1,dash:'6 4',pts:pL,end:f1(fc[2]),endDy:-10},
             {name:I('c.dec'),c:C.blue,w:on?2.5:1.75,op:on?1:.45,pts:dL,end:f1(dc[2]),endDy:18}]})},
         table:{head:heads('b3.t3h'),rows:M.map(function(m,i){return [m,f1(MB),rL[i]!=null?f1(rL[i]):'—',i>=9?f1(fc[i-9]):'—',i>=9?f1(dc[i-9]):'—']})}}],
      read:[
        {n:1,h:I('b3.rd1',{a:f1(totB),b:f1(ovB),c:pc(ovB/BUD*100,1),e:sgn(over[0].v,1),w:sgn(over[1].v,1),k:sgn(over[2].v,1)})},
        {n:2,h:I('b3.rd2',{n:above.length,o:f1(OBJ),list:above.map(function(x){return x.n+' '+f1(x.b)}).join(', ')})},
        {n:3,h:I('b3.rd3',{a:f1(fc[0]),b:f1(dc[2])})}]}},
    dec:{what:I('b3.dwhat'),
      big:sgn(-sv,1),u:I('b3.du'),cap:I('b3.dcap',{a:spc(ovB/BUD*100,1),b:spc(ovD/BUD*100,1),c:f1(totD)}),
      gains:[I('b3.dg1',{a:sgn(-acts[0].v,1),b:sgn(-acts[1].v,1),c:sgn(-acts[2].v,1)}),I('b3.dg2',{s:F[2].n,a:f1(F[2].d),v:F[0].n,c:F[1].n,o:f1(OBJ)}),I('b3.dg3')],
      note:I('b3.note')},
    agents:function(){return [
      ag(0,'b3.a1',{a:f1(ytd),b:f1(ytd-MB*9)}),
      ag(1,'b3.a2',{a:f1(totB),b:f1(totD)}),
      ag(2,'b3.a3'),
      {who:3,t:I('b3.a4'),src:I('ag.doc')}]}
  };
}

/* =====================================================================
   4 · RESERVAS — ¿Qué podemos reportar y qué falta para reclasificar?
   ===================================================================== */
function board4(){
  var FL=[{id:'Norte',a:14.2,b:21.5,c:30.1},{id:'Sur',a:9.8,b:15.0,c:22.4},{id:'Costa',a:6.1,b:10.4,c:16.9},{id:'Altiplano',a:11.9,b:16.8,c:23.0}];
  FL.forEach(function(x){x.n=fn(x.id)});
  var CT=[{f:'Costa',n:fn('Costa')+' · '+I('b4.ph2'),v:8.5,need:I('b4.needFid'),mv:true},{f:'Altiplano',n:fn('Altiplano')+' · '+I('b4.infill'),v:4.1,need:I('b4.needFid'),mv:true},{f:'Sur',n:fn('Sur')+' · '+I('b4.pilot'),v:3.2,need:I('b4.needPil'),mv:false}];
  var PROD=4.0,YU=I('c.yearU');
  function tot(k,sc){return sum(FL,function(x){return x[k]})+(sc==='dec'?sum(CT.filter(function(c){return c.mv}),function(c){return c.v}):0)}
  var moved=sum(CT.filter(function(c){return c.mv}),function(c){return c.v}),cont=sum(CT,function(c){return c.v});
  var p2b=tot('b','base'),p2d=tot('b','dec'),p1=tot('a','base'),p3b=tot('c','base');
  var mvNames=andJoin(CT.filter(function(c){return c.mv}).map(function(c){return c.n}));
  /* declinación hiperbólica de Norte: mismo punto de partida, distinta velocidad de caída */
  var Q0=6000,BE=0.8,HOR=20,STEP=0.5;
  function q(D,t){return Q0/Math.pow(1+BE*D*t,1/BE)}
  function remain(D){var s=0;for(var m=0;m<HOR*12;m++){s+=q(D,(m+.5)/12)*365/12}return s/1e6}
  function solve(T){var lo=0.001,hi=3;for(var i=0;i<60;i++){var mid=(lo+hi)/2;if(remain(mid)>T)lo=mid;else hi=mid}return (lo+hi)/2}
  var D1=solve(FL[0].a),D2=solve(FL[0].b),D3=solve(FL[0].c);
  function tl(t){var a=Math.abs(t),s=a%1?fmt(a,1):fmt(a,0);return t<0?'−'+s+' '+YU:t===0?I('c.today'):'+'+s+' '+YU}
  var xs=[],c1=[],c2=[],c3=[],hist=[];
  for(var i=0;i<=46;i++){var t=-3+i*STEP;xs.push(tl(t));
    if(t>=0){c1.push(q(D1,t));c2.push(q(D2,t));c3.push(q(D3,t))}else{c1.push(null);c2.push(null);c3.push(null)}
    var hf={0:1.85,2:1.5,4:1.2,6:1}[i];hist.push(hf?Q0*hf*(1+0.015*Math.sin(i*2.3)):null)}
  hist[6]=Q0;
  var MB_='MMbbl';
  return {
    id:'reservas',tab:I('b4.tab'),short:I('b4.short'),
    q:I('b4.q'),
    meta:meta('b4'),
    view:function(sc){var on=sc==='dec';return {
      kpis:[
        {l:I('b4.k1'),f:f1,u:MB_,bn:p2b,dn:p2d,good:'up',sub:I('b4.k1s',{a:f1(p1),b:f1(p3b)})},
        {l:I('b4.k2'),tb:f1(p1),tu:MB_,td:f1(p1),sub:I('b4.k2s'),dsub:I('b4.k2d')},
        {l:I('b4.k3'),f:f1,u:I('b4.k3u'),bn:p2b/PROD,dn:p2d/PROD,good:'up',sub:I('b4.k3s',{v:f1(PROD)})},
        {l:I('b4.k4'),f:f1,u:MB_,bn:cont,dn:cont-moved,good:'down',sub:I('b4.k4s')}],
      charts:[
        {title:I('b4.c1t'),sub:I('b4.c1s'),
         legend:[{c:C.o3,t:I('b4.l1')},{c:C.o2,t:I('b4.l2')},{c:C.o1,t:I('b4.l3')}],
         draw:function(h,lb){V.stackH(h,{label:lb,rh:56,lw:80,r:50,max:32,d:1,totalFmt:f1,rows:FL.map(function(x){var add=on?sum(CT.filter(function(c){return c.mv&&c.f===x.id}),function(c){return c.v}):0,b=x.b+add,c=x.c+add;
           return {label:x.n,segs:[{k:'1P',v:x.a,c:C.o3,text:f1(x.a),tc:'#fff',tip:[{k:'1P',v:f1(x.a)+' '+MB_,c:C.o3},{k:I('b4.cum2'),v:f1(b)+' '+MB_},{k:I('b4.cum3'),v:f1(c)+' '+MB_}]},
             {k:'2P',v:b-x.a,c:C.o2,text:f1(b-x.a),tc:'#0E1A2B',tip:[{k:'1P',v:f1(x.a)+' '+MB_},{k:I('b4.cum2'),v:f1(b)+' '+MB_,c:C.o2},{k:I('b4.cum3'),v:f1(c)+' '+MB_}]},
             {k:'3P',v:c-b,c:C.o1,text:f1(c-b),tc:'#0E1A2B',tip:[{k:'1P',v:f1(x.a)+' '+MB_},{k:I('b4.cum2'),v:f1(b)+' '+MB_},{k:I('b4.cum3'),v:f1(c)+' '+MB_,c:C.o1}]}]}})})},
         table:{head:heads('b4.t1h'),rows:FL.map(function(x){var add=on?sum(CT.filter(function(c){return c.mv&&c.f===x.id}),function(c){return c.v}):0;return [x.n,f1(x.a),f1(x.b+add),f1(x.c+add)]})}},
        {title:I('b4.c2t'),sub:I('b4.c2s'),
         legend:[{c:C.blue,t:I('b4.dInv')},{c:C.gm,t:I('b4.dTec')}],
         draw:function(h,lb){V.barsH(h,{label:lb,rows:CT.map(function(c){var gone=on&&c.mv;return {label:c.n,value:gone?0:c.v,color:c.mv?C.blue:C.gm,text:gone?I('b4.to2p'):f1(c.v)+' · '+c.need,tip:[{k:I('b4.vol2c'),v:f1(c.v)+' '+MB_},{k:I('b4.cond'),v:c.mv?I('b4.condFid'):I('b4.condPil')}]}}),max:9,d:1,unit:MB_,lw:110,r:100})},
         table:{head:heads('b4.t2h'),rows:CT.map(function(c){return [c.n,f1(c.v),on&&c.mv?I('b4.appr'):c.need]})}},
        {wide:1,title:I('b4.c3t',{f:FL[0].n}),sub:I('b4.c3s'),
         legend:[{c:C.ink,t:I('b4.realP'),dot:1},{c:C.o3,t:'1P',ln:1},{c:C.o2,t:'2P',ln:1},{c:C.o1,t:'3P',ln:1}],
         draw:function(h,lb){V.line(h,{label:lb,x:xs,xTicks:[0,6,16,26,36,46],yMin:0,tipFmt:f0,h:270,r:20,vlines:[{i:6,label:I('c.today')}],
           bands:[{lo:c1,hi:c3,c:C.o2,op:.14,name:I('b4.band')}],
           series:[{name:'3P',c:C.o1,w:2,pts:c3},{name:'2P',c:C.o2,w:2.5,pts:c2},{name:'1P',c:C.o3,w:2,pts:c1}],
           dots:[{name:I('c.real'),c:C.ink,pts:hist,r:3.5}]})},
         table:{head:heads('b4.t3h'),rows:[0,1,2,5,10,20].map(function(t){return [t===0?I('c.today'):'+'+t,f0(q(D1,t)),f0(q(D2,t)),f0(q(D3,t))]})}}],
      read:[
        {n:1,h:I('b4.rd1',{a:f1(p2b),b:f1(p1),f:FL[2].n,r:f1(FL[2].c/FL[2].a)})},
        {n:2,h:I('b4.rd2',{a:f1(cont),b:f1(moved),list:mvNames,s:fn('Sur')})},
        {n:3,h:I('b4.rd3',{f:FL[0].n,q:f0(Q0),a:f1(FL[0].a),c:f1(FL[0].c),h:HOR,b:f1(FL[0].b)})}]}},
    dec:{what:I('b4.dwhat',{list:mvNames}),
      big:'+'+f1(moved),u:I('b4.du',{p:pc(moved/p2b*100,1)}),cap:I('b4.dcap',{a:f1(p2b),b:f1(p2d),c:f1(p2b/PROD),d:f1(p2d/PROD)}),
      gains:[I('b4.dg1'),I('b4.dg2',{s:fn('Sur'),v:f1(CT[2].v)}),I('b4.dg3')],
      note:I('b4.note')},
    agents:function(){return [
      ag(0,'b4.a1',{a:f1(cont),b:f1(moved)}),
      ag(1,'b4.a2',{a:f1(p2b),b:f1(p2d),c:f1(p2b/PROD),d:f1(p2d/PROD),h:HOR}),
      ag(2,'b4.a3',{s:fn('Sur')}),
      ag(3,'b4.a4')]}
  };
}

/* =====================================================================
   5 · TRANSICIÓN — ¿Con qué medidas cumplimos la meta de emisiones?
   ===================================================================== */
function board5(){
  var PRICE=45,TARGET=400,BASE=1250,KY=I('v.ktyr');
  var Mx=[{id:'M1',a:85,c:-18},{id:'M2',a:120,c:-6},{id:'M3',a:60,c:4},{id:'M4',a:95,c:22},{id:'M5',a:70,c:38},{id:'M6',a:140,c:74}];
  Mx.forEach(function(m){m.l=I('b5.m'+m.id.slice(1))});
  var SET={base:['M4','M5','M6'],dec:['M1','M2','M3','M4','M5']};
  function pick(sc){return Mx.filter(function(m){return idx(SET[sc],m.id)})}
  function st(sc){var ms=pick(sc),a=sum(ms,function(m){return m.a}),cost=sum(ms,function(m){return m.a*m.c});return {a:a,cost:cost/1000,per:cost/a,t:[sum(ms.filter(function(m){return m.c<=0}),function(m){return m.a}),sum(ms.filter(function(m){return m.c>0&&m.c<=25}),function(m){return m.a}),sum(ms.filter(function(m){return m.c>25}),function(m){return m.a})]}}
  var S={base:st('base'),dec:st('dec')};
  var ramp=[0,.1,.3,.5,.75,.9,1],yrs=[2024,2025,2026,2027,2028,2029,2030];
  function path(a){return ramp.map(function(r){return BASE-a*r})}
  var save=S.base.cost-S.dec.cost,free=sum(Mx.filter(function(m){return m.c<=0}),function(m){return m.a}),freeSave=-sum(Mx.filter(function(m){return m.c<=0}),function(m){return m.a*m.c})/1000;
  var m6=Mx[5],MU=I('c.musd');
  return {
    id:'transicion',tab:I('b5.tab'),short:I('b5.short'),
    q:I('b5.q'),
    meta:meta('b5',{p:PRICE}),
    view:function(sc){var s=S[sc],on=sc==='dec';return {
      kpis:[
        {l:I('b5.k1'),f:f0,u:I('b5.k1u'),bn:S.base.a,dn:S.dec.a,good:'up',sub:I('b5.k1s',{v:f0(TARGET)})},
        {l:I('b5.k2'),tb:S.base.a>=TARGET?I('b5.yes'):I('b5.no'),td:S.dec.a>=TARGET?I('b5.yes'):I('b5.no'),sub:I('b5.k2s',{v:f0(TARGET-S.base.a)}),dsub:I('b5.k2d',{v:f0(S.dec.a-TARGET)})},
        {l:I('b5.k3'),f:f1,u:MU,bn:S.base.cost,dn:S.dec.cost,good:'down',sub:I('b5.k3s')},
        {l:I('b5.k4'),f:f1,u:'USD/t',bn:S.base.per,dn:S.dec.per,good:'down',sub:I('b5.k4s',{p:PRICE})}],
      charts:[
        {wide:1,title:I('b5.c1t'),sub:I('b5.c1s'),
         legend:[{c:C.blue,t:I('b5.run')},{c:C.gm,t:I('b5.norun')}],
         key:Mx.map(function(m){return m.id+' '+m.l}).join(' · '),
         draw:function(h,lb){V.macc(h,{label:lb,price:PRICE,priceLabel:I('b5.price',{p:PRICE}),h:280,items:Mx.map(function(m){return {id:m.id,label:m.l,abate:m.a,cost:m.c,sel:idx(SET[sc],m.id)}})})},
         table:{head:heads('b5.t1h'),rows:Mx.map(function(m){return [m.id+' '+m.l,f0(m.a),sgn(m.c,0),idx(SET[sc],m.id)?I('b5.yes'):I('b5.no')]})}},
        {title:I('b5.c2t'),sub:I('b5.c2s'),
         legend:[{c:C.o3,t:I('b5.l1')},{c:C.o2,t:I('b5.l2')},{c:C.o1,t:I('b5.l3')}],
         draw:function(h,lb){var nm={base:I('c.plan'),dec:I('c.dec')},kk=[I('b5.k1n'),I('b5.k2n'),I('b5.k3n')],cc=[C.o3,C.o2,C.o1],tc=['#fff','#0E1A2B','#0E1A2B'];
           V.stackH(h,{label:lb,rh:60,lw:84,r:62,max:460,ref:{value:TARGET,label:I('b5.ref',{v:f0(TARGET)})},totalFmt:function(t){return f0(t)+' kt'},rows:['base','dec'].map(function(k){return {label:nm[k],segs:S[k].t.map(function(v,i){return v>0?{k:kk[i],v:v,c:cc[i],text:f0(v),tc:tc[i],tip:[{k:kk[i],v:f0(v)+' '+KY,c:cc[i]},{k:I('b5.tot',{n:nm[k]}),v:f0(S[k].a)+' '+KY}]}:null}).filter(Boolean)}})})},
         table:{head:heads('b5.t2h'),rows:['base','dec'].map(function(k){return [k==='base'?I('c.plan'):I('c.dec')].concat(S[k].t.map(f0)).concat([f0(S[k].a)])})}},
        {title:I('b5.c3t'),sub:I('b5.c3s'),
         legend:[{c:C.gd,t:I('b5.nomeas'),ln:1},{c:C.gd,t:I('c.plan'),ln:1},{c:C.blue,t:I('c.dec'),ln:1},{c:C.ink,t:I('b5.t30'),dot:1}],
         draw:function(h,lb){var tg=yrs.map(function(y,i){return i===yrs.length-1?BASE-TARGET:null});
           V.line(h,{label:lb,x:yrs.map(String),xTicks:h.clientWidth<360?[0,2,4,6]:[0,1,2,3,4,5,6],yMin:700,yMax:1300,tipFmt:f0,h:260,r:34,
             series:[{name:I('b5.nomeas'),c:C.gd,w:1.5,dash:'3 4',pts:yrs.map(function(){return BASE}),end:f0(BASE),endDy:-10},
               {name:I('c.plan'),c:C.gd,w:on?1.75:2.5,op:on?.55:1,pts:path(S.base.a),end:f0(BASE-S.base.a),endDy:-10},
               {name:I('c.dec'),c:C.blue,w:on?2.5:1.75,op:on?1:.45,pts:path(S.dec.a),end:f0(BASE-S.dec.a),endDy:18}],
             dots:[{name:I('b5.t30'),c:C.ink,pts:tg,r:5}]})},
         table:{head:heads('b5.t3h'),rows:yrs.map(function(y,i){return [String(y),f0(BASE),f0(path(S.base.a)[i]),f0(path(S.dec.a)[i])]})}}],
      read:[
        {n:1,h:I('b5.rd1',{a:f0(free),s:f1(freeSave),c:f0(m6.c),p:PRICE})},
        {n:2,h:I('b5.rd2',{a:f0(S.base.a),t:f0(TARGET),b:f0(S.dec.a)})},
        {n:3,h:I('b5.rd3',{a:f0(BASE-S.base.a),d:f0(BASE-S.base.a-(BASE-TARGET)),m:f0(BASE-TARGET),b:f0(BASE-S.dec.a)})}]}},
    dec:{what:I('b5.dwhat',{c:f0(m6.c)}),
      big:f1(save),u:I('b5.du'),cap:I('b5.dcap',{a:f1(S.base.cost),b:f1(S.dec.cost),c:f1(S.base.per),d:f1(S.dec.per)}),
      gains:[I('b5.dg1',{a:f0(S.dec.a),t:f0(TARGET)}),I('b5.dg2'),I('b5.dg3')],
      note:I('b5.note',{b:f0(BASE)})},
    agents:function(){return [
      ag(0,'b5.a1',{a:f0(S.base.a),t:f0(TARGET),c:f0(m6.c),p:PRICE}),
      ag(1,'b5.a2',{n:Mx.length,a:f0(S.dec.a),b:f1(S.dec.cost),c:f1(S.base.cost)}),
      ag(2,'b5.a3'),
      ag(3,'b5.a4')]}
  };
}

/* =====================================================================
   Interfaz
   ===================================================================== */
function build(){return [board1(),board2(),board3(),board4(),board5()]}
var BOARDS=build();
var cur=0,sc='base',tblOn={},runTok=0,cards=[];
var WHO=['vig','ana','aud','red'];

function kpiHTML(k){
  var on=sc==='dec',v,u=k.u||'',sub;
  if(k.tb!=null){v=on?k.td:k.tb;u=k.tu||'';sub=on?(k.dsub||''):k.sub}
  else{var n=on?k.dn:k.bn;v=k.f(n);
    if(!on)sub=k.sub;
    else{sub=I('u.vs',{v:k.f(k.bn)});
      if(k.bn!==0&&!k.nopct){var p=(k.dn-k.bn)/Math.abs(k.bn)*100,good=k.good==='none'?'':((p>0)===(k.good==='up')?'up':'dn');sub+=' <span class="'+good+'">'+spc(p,0)+'</span>'}
      else if(k.nopct){var gd=((k.dn-k.bn)>0)===(k.good==='up')?'up':'dn';sub+=' <span class="'+gd+'">'+sgn(k.dn-k.bn,1)+' '+I('u.pts')+'</span>'}
      else if(k.bn===0){sub=I('u.before0')}}}
  return '<div class="l">'+k.l+'</div><div class="v">'+v+(u?'<small>'+u+'</small>':'')+'</div><div class="d">'+sub+'</div>';
}
function renderKpis(view){var box=$('kpis');box.textContent='';view.kpis.forEach(function(k){H('div',{'class':'kpi'},box).innerHTML=kpiHTML(k)})}

function legendHTML(l){return l.map(function(x){return '<span><i'+(x.ln?' class="ln"':'')+' style="background:'+x.c+(x.dot?';border-radius:50%':'')+(x.dash?';opacity:.6':'')+'"></i>'+x.t+'</span>'}).join('')}
function tableHTML(t){return '<table><thead><tr>'+t.head.map(function(x){return '<th scope="col">'+x+'</th>'}).join('')+'</tr></thead><tbody>'+t.rows.map(function(r){return '<tr>'+r.map(function(c,i){return (i===0?'<th scope="row" style="font-weight:600;color:var(--ink)">':'<td>')+c+(i===0?'</th>':'</td>')}).join('')+'</tr>'}).join('')+'</tbody></table>'}

function drawCards(){
  cards.forEach(function(c){
    if(c.tbl.hidden===false)return;
    try{c.spec.draw(c.plot,c.spec.title)}catch(e){c.plot.textContent=I('v.fail');if(window.console)console.error(e)}
  });
}
function tvLabel(i){return tblOn[i]?I('v.chart'):I('u.table')}
function renderCharts(view){
  var box=$('charts');box.textContent='';cards=[];
  view.charts.forEach(function(spec,i){
    var card=H('article',{'class':'card'+(spec.wide?' wide':''),'data-n':i+1},box);
    var ch=H('div',{'class':'ch'},card);
    H('span',{'class':'badge','aria-hidden':'true'},ch,String(i+1));
    var t=H('div',null,ch);H('h3',null,t,spec.title);H('p',null,t,spec.sub);
    var tv=H('button',{'class':'tv',type:'button','aria-pressed':tblOn[i]?'true':'false'},ch,tvLabel(i));
    var plot=H('div',{'class':'plot'},card),tbl=H('div',{'class':'tbl'},card);tbl.innerHTML=tableHTML(spec.table);
    var lg=H('div',{'class':'legend'},card);lg.innerHTML=legendHTML(spec.legend);
    if(spec.key){var kd=H('div',{'class':'legend'},card);kd.textContent=spec.key}
    var o={spec:spec,plot:plot,tbl:tbl,card:card,tv:tv};cards.push(o);
    plot.hidden=!!tblOn[i];tbl.hidden=!tblOn[i];
    tv.addEventListener('click',function(){tblOn[i]=!tblOn[i];plot.hidden=tbl.hidden=false;if(tblOn[i])plot.hidden=true;else tbl.hidden=true;tv.textContent=tvLabel(i);tv.setAttribute('aria-pressed',tblOn[i]?'true':'false');V.hideTip();if(!tblOn[i])drawCards()});
    card.addEventListener('mouseenter',function(){setHL(i+1,true)});card.addEventListener('mouseleave',function(){setHL(i+1,false)});
  });
  drawCards();
}
function setHL(n,on){
  cards.forEach(function(c,i){c.card.classList.toggle('hl',on&&i+1===n)});
  var lis=$('read').children;for(var i=0;i<lis.length;i++)lis[i].classList.toggle('hl',on&&+lis[i].getAttribute('data-n')===n);
}
function renderRead(view){
  var ol=$('read');ol.textContent='';
  view.read.forEach(function(r){var li=H('li',{'data-n':r.n,tabindex:'0'},ol);H('span',{'class':'badge','aria-hidden':'true'},li,String(r.n));var p=H('span',null,li);p.innerHTML=r.h;
    li.addEventListener('mouseenter',function(){setHL(r.n,true)});li.addEventListener('mouseleave',function(){setHL(r.n,false)});
    li.addEventListener('focus',function(){setHL(r.n,true)});li.addEventListener('blur',function(){setHL(r.n,false)})});
}
function renderDec(){
  var d=BOARDS[cur].dec,el=$('dec');
  el.innerHTML='<h3>'+I('u.decH')+'</h3><p class="what">'+d.what+'</p><div class="hero"><span class="big">'+d.big+'</span><span class="u">'+d.u+'</span></div><p class="cap">'+d.cap+'</p><ul class="gain">'+d.gains.map(function(g){return '<li>'+g+'</li>'}).join('')+'</ul><div class="row"><button type="button" class="btn lite" id="apply"></button></div><p class="note">'+d.note+'</p>';
  var a=$('apply');a.textContent=sc==='dec'?I('u.back'):I('u.see');
  a.addEventListener('click',function(){setScenario(sc==='dec'?'base':'dec')});
}
function renderAll(){
  var B_=BOARDS[cur],view=B_.view(sc);
  $('bq').textContent=B_.q;$('bmeta').innerHTML=B_.meta;
  renderKpis(view);renderCharts(view);renderRead(view);renderDec();
  $('sc-base').setAttribute('aria-pressed',sc==='base');$('sc-dec').setAttribute('aria-pressed',sc==='dec');
}
function setScenario(s){if(s===sc)return;sc=s;V.hideTip();renderAll()}

function renderTabs(){
  var box=$('tabs');box.textContent='';
  BOARDS.forEach(function(b,i){
    var t=H('button',{type:'button',role:'tab',id:'tab-'+b.id,'aria-selected':i===cur?'true':'false','aria-controls':'main',tabindex:i===cur?'0':'-1','class':'tab'},box);
    H('b',null,t,b.tab);H('span',null,t,b.short);
    t.addEventListener('click',function(){selectBoard(i,true)});
    t.addEventListener('keydown',function(e){var n=null;if(e.key==='ArrowRight')n=(i+1)%BOARDS.length;else if(e.key==='ArrowLeft')n=(i+BOARDS.length-1)%BOARDS.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=BOARDS.length-1;if(n!=null){e.preventDefault();selectBoard(n,true);$('tab-'+BOARDS[n].id).focus()}});
  });
}
function selectBoard(i,push){
  cur=i;sc='base';tblOn={};resetAgents();renderTabs();renderAll();
  if(push){try{history.replaceState(null,'','#'+BOARDS[i].id)}catch(e){}}
  var t=$('tab-'+BOARDS[i].id);if(t&&t.scrollIntoView&&t.offsetParent){try{var box=$('tabs');if(box.scrollWidth>box.clientWidth)box.scrollLeft=t.offsetLeft-16}catch(e){}}
}

/* ---------------- agentes ---------------- */
function resetAgents(){runTok++;$('log').textContent='';$('gate').className='';$('gate').textContent='';var r=$('run');r.disabled=false;r.textContent=I('u.run')}
function renderRoster(){var box=$('roster');box.textContent='';WHO.forEach(function(w){var d=H('div',{'class':'ag'},box);H('b',null,d,I('ag.'+w));d.appendChild(document.createTextNode(I('ag.'+w+'R')))})}
function logLine(li,s,done){var w=WHO[s.who];li.className=done?'':'run';li.innerHTML='<div class="who"><i class="st"></i>'+I('ag.'+w)+'</div><div>'+(done?s.t+'<em>'+s.src+'</em>':I('ag.'+w+'W'))+'</div>'}
function runAgents(){
  var tok=++runTok,steps=BOARDS[cur].agents(),log=$('log'),gate=$('gate'),btn=$('run'),i=0;
  log.textContent='';gate.className='';gate.textContent='';btn.disabled=true;btn.textContent=I('u.running');
  function next(){
    if(tok!==runTok)return;
    if(i>=steps.length){finish();return}
    var s=steps[i],li=H('li',null,log);logLine(li,s,false);
    setTimeout(function(){if(tok!==runTok)return;logLine(li,s,true);i++;next()},reduce?120:950);
  }
  function finish(){
    btn.disabled=false;btn.textContent=I('u.again');
    gate.className='gate';
    gate.innerHTML='<span>'+I('u.gate')+'</span><span style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn pri" id="ok">'+I('u.ok')+'</button><button type="button" class="btn ghost" id="no">'+I('u.no')+'</button></span>';
    $('ok').addEventListener('click',function(){
      if(tok!==runTok)return;
      var now=new Date(),stamp;try{stamp=now.toLocaleDateString(H3L.loc)}catch(e){stamp=now.toISOString().slice(0,10)}
      gate.innerHTML='<span>'+I('u.approved',{d:stamp})+'</span>';
      setScenario('dec');
      var sec=$('charts');if(sec&&sec.scrollIntoView&&!reduce){try{$('main').scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}}
    });
    $('no').addEventListener('click',function(){if(tok!==runTok)return;gate.innerHTML='<span>'+I('u.returned')+'</span>'});
  }
  next();
}

/* ---------------- arranque ---------------- */
function init(){
  var ln=$('langNav');if(ln)ln.appendChild(H3L.select({}));
  H3L.apply();
  renderRoster();
  $('sc-base').addEventListener('click',function(){setScenario('base')});
  $('sc-dec').addEventListener('click',function(){setScenario('dec')});
  $('run').addEventListener('click',runAgents);
  var h=(location.hash||'').replace('#',''),start=0;BOARDS.forEach(function(b,i){if(b.id===h)start=i});
  selectBoard(start,false);
  var lw=window.innerWidth,tm=null;
  window.addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(function(){if(Math.abs(window.innerWidth-lw)<2)return;lw=window.innerWidth;V.hideTip();drawCards()},160)});
  window.addEventListener('hashchange',function(){var h=(location.hash||'').replace('#','');BOARDS.forEach(function(b,i){if(b.id===h&&i!==cur)selectBoard(i,false)})});
  /* al cambiar de idioma se reconstruyen los tableros conservando el que se está viendo, el escenario y las tablas abiertas */
  H3L.on(function(){
    V.hideTip();BOARDS=build();renderRoster();renderTabs();renderAll();resetAgents();
  });
}
init();
window.H3LBoards={open:function(id){BOARDS.forEach(function(b,i){if(b.id===id)selectBoard(i,true)});var p=$('pick');if(p&&p.scrollIntoView){try{p.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}catch(e){}}}};
})();
