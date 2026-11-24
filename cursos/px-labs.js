/* H3L · Cursos · laboratorios del curso "Más allá de las reservas comprobadas" (pr2).
   Usan las reglas de px-model.js (verificadas con tools/verificar_pr2.py) y los helpers de widgets.js (HW._u).
   Todos los valores son de EJEMPLO con fines didácticos: no reemplazan una evaluación de reservas ni un informe a un regulador. */
(function(){'use strict';
var W=window.HW,U=W&&W._u,M=window.SPX;if(!W||!U||!M)return;
var sv=U.sv,nf=U.nf,mkui=U.mkui,lbl=U.lbl,wrap=U.wrap,src=U.src,TX=U.TX,GR=U.GR,GN=U.GN,AM=U.AM,BL=U.BL,RD=U.RD,VI=U.VI;
function ok(t){return '<strong style="color:'+GN+'">'+t+'</strong>'}
function bad(t){return '<strong style="color:'+RD+'">'+t+'</strong>'}
function rect(par,x,y,w,h,fill,stroke,on){return sv('rect',{x:x,y:y,width:w,height:h,rx:7,fill:fill,'fill-opacity':on?.35:.08,stroke:stroke,'stroke-width':on?2.6:1,'stroke-opacity':on?1:.45},par)}

/* ===== 1 · clasificador de madurez: ¿en qué clase y subclase cae el proyecto? ===== */
W.px_clas=function(box,p,api){
  var D=p.v||{};
  function d(k,v){return D[k]!=null?D[k]:v}
  var h=mkui(box,[
    {k:'disc',t:'chk',l:'Acumulación descubierta',v:d('disc',true)},
    {k:'tgt',l:'Si no está descubierta: objetivo',t:'sel',v:d('tgt','def'),o:[['def','Bien definido para perforar'],['poor','Mal definido, faltan datos'],['trend','Tendencia sin prospectos']]},
    {k:'tech',t:'chk',l:'Tecnología establecida para el proyecto',v:d('tech',true)},
    {k:'econ',t:'chk',l:'Economía positiva con las condiciones previstas',v:d('econ',true)},
    {k:'appr',t:'chk',l:'Aprobaciones razonablemente esperables',v:d('appr',false)},
    {k:'mkt',t:'chk',l:'Mercado y transporte razonablemente asegurados',v:d('mkt',false)},
    {k:'intent',t:'chk',l:'Intención firme de desarrollar',v:d('intent',false)},
    {k:'yrs',l:'Años hasta iniciar el desarrollo',min:0,max:10,step:.5,v:d('yrs',3),f:function(v){return nf(v,1)+' años'}},
    {k:'just',t:'chk',l:'Plazo mayor a cinco años justificado',v:d('just',false)},
    {k:'fase',l:'Si cumple todo: avance',t:'sel',v:d('fase','just'),o:[['just','Decisión de desarrollar tomada'],['impl','Aprobado, con fondos y obra en marcha'],['prod','Ya produce y vende']]},
    {k:'estado',l:'Si no cumple: estado del proyecto',t:'sel',v:d('estado','active'),o:[['active','Actividades en curso para justificarlo'],['hold','Detenido o con demora significativa'],['incomplete','Evaluación incompleta'],['none','Sin planes por bajo potencial']]}
  ],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var COLS=[['Reservas',GN,['En producción','Aprobado para desarrollo','Justificado para desarrollo']],['Recursos contingentes',AM,['Desarrollo pendiente','Desarrollo en espera','Desarrollo sin aclarar','Desarrollo no viable']],['Recursos prospectivos',BL,['Prospecto','Lead','Play']]];
  function draw(V){svg.innerHTML='';var r=M.classify(V);
    sv('rect',{x:0,y:0,width:640,height:360,fill:'rgba(10,30,50,.5)'},svg);
    COLS.forEach(function(c,i){var x=14+i*208,on=c[0]===r.cls;lbl(svg,x+95,26,c[0],c[1],12.5,'middle');
      c[2].forEach(function(s,j){var y=44+j*56,sel=on&&s===r.sub;rect(svg,x,y,190,46,c[1],c[1],sel);lbl(svg,x+95,y+28,s,sel?'#fff':TX,11.5,'middle')})});
    lbl(svg,14,300,'Pc: '+r.pc,TX,11.5);
    lbl(svg,14,322,r.cls==='Reservas'?'Cumple todos los criterios':r.missing.length?'Falta: '+r.missing.length+' criterio'+(r.missing.length>1?'s':''):'Sin criterios pendientes que evaluar',r.cls==='Reservas'?GN:AM,11.5);
    var o='<strong>'+r.cls+' · '+r.sub+'</strong>';
    if(r.cls==='Recursos contingentes')o+=' ('+(r.econ?'económicamente viable':'económicamente no viable')+')';
    o+='<br>'+r.why;
    if(r.missing&&r.missing.length)o+='<br>'+bad('Pendiente:')+' '+r.missing.join('; ')+'.';
    o+='<br>Chance de comercialidad: '+r.pc+'.';
    if(r.cls==='Reservas'&&V.fase==='just')o+='<br>Si el proyecto no avanza sin señales de aprobación, no debería quedar mucho tiempo en esta subclase.';
    h.out(o+src(h,'PRMS 2018 (SPE et al.) y sus FAQ de 2022; datos de ejemplo. Un proyecto no se divide entre reservas y contingentes.'))}
  draw(h.V)};

/* ===== 2 · desarrolladas no productivas: ¿gasto menor o significativo? ===== */
W.px_dnp=function(box,p,api){
  var D=p.v||{};
  function d(k,v){return D[k]!=null?D[k]:v}
  var h=mkui(box,[
    {k:'tipo',l:'Situación del volumen',t:'sel',v:d('tipo','shut'),o:[['shut','Pozo cerrado con intervalo abierto'],['bp','Zona detrás de la tubería (behind-pipe)'],['new','Ubicación sin pozo (hay que perforar)']]},
    {k:'pct',l:'Costo de reactivar o completar',min:5,max:100,step:1,v:d('pct',20),f:function(v){return v+' % de un pozo nuevo'}},
    {k:'thr',l:'Umbral de gasto menor de la compañía',min:10,max:50,step:1,v:d('thr',30),f:function(v){return v+' %'}},
    {k:'evid',t:'chk',l:'Evidencia de que el intervalo produce',v:d('evid',true)},
    {k:'mkt',t:'chk',l:'Mercado y conexión razonablemente esperables',v:d('mkt',true)}
  ],draw,{side:true,w:640,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var r=M.dnp(V);
    sv('rect',{x:0,y:0,width:640,height:340,fill:'rgba(10,30,50,.5)'},svg);
    var x0=40,w=560,X=function(pc){return x0+w*pc/100};
    lbl(svg,x0,36,'Costo frente al de un pozo nuevo (100 %)',TX,12);
    sv('rect',{x:x0,y:50,width:w,height:30,rx:6,fill:'rgba(122,162,255,.18)',stroke:BL},svg);lbl(svg,x0+w/2,70,'Pozo nuevo = 100 %',TX,11.5,'middle');
    var cost=V.tipo==='new'?100:V.pct;
    sv('rect',{x:x0,y:100,width:w*cost/100,height:30,rx:6,fill:cost>V.thr?'rgba(255,127,127,.35)':'rgba(95,209,164,.35)',stroke:cost>V.thr?RD:GN},svg);lbl(svg,x0+8,120,(V.tipo==='new'?'Perforar un pozo nuevo':'Reactivar o completar')+': '+cost+' %',TX,11.5);
    sv('rect',{x:X(M.THR_RANGE[0]),y:146,width:X(M.THR_RANGE[1])-X(M.THR_RANGE[0]),height:22,rx:4,fill:'rgba(232,161,90,.22)',stroke:AM,'stroke-opacity':.6},svg);lbl(svg,X(30),162,'umbrales de las compañías: 10 a 50 %',TX,10.5,'middle');
    sv('rect',{x:X(M.THR_COMMON[0]),y:170,width:X(M.THR_COMMON[1])-X(M.THR_COMMON[0]),height:14,rx:3,fill:'rgba(232,161,90,.45)'},svg);lbl(svg,X(30),196,'lo más común: 25 a 35 %',AM,10.5,'middle');
    sv('line',{x1:X(V.thr),x2:X(V.thr),y1:92,y2:176,stroke:VI,'stroke-width':2.4,'stroke-dasharray':'5 3'},svg);lbl(svg,X(V.thr),88,'umbral elegido '+V.thr+' %',VI,10.5,'middle');
    lbl(svg,x0,232,r.res,r.ok?GN:RD,14);
    h.out('<strong style="color:'+(r.ok?GN:RD)+'">'+r.res+'</strong><br>'+r.why+src(h,'PRMS 2018 y FAQ 3.10 de la SPE: no hay un porcentaje fijo; cada compañía define y documenta su umbral. Datos de ejemplo.'))}
  draw(h.V)};

/* ===== 3 · Pg, Pd y Pc: de la chance de descubrimiento a la de comercialidad ===== */
W.px_pc=function(box,p,api){
  var h=mkui(box,[
    {k:'disc',t:'chk',l:'Ya está descubierto (Pg = 1)',v:!!p.disc},
    {k:'pg',l:'Chance de descubrimiento (Pg)',min:5,max:90,step:1,v:p.pg||30,f:function(v){return v+' %'}},
    {k:'pd',l:'Chance de desarrollo (Pd)',min:5,max:100,step:1,v:p.pd||50,f:function(v){return v+' %'}},
    {k:'u2',l:'Volumen sin riesgo, mejor estimación',min:10,max:500,step:5,v:p.u2||200,f:function(v){return v+' MMbbl'}}
  ],draw,{side:true,w:640,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var r=M.pc({disc:V.disc,pg:V.pg/100,pd:V.pd/100,u1:V.u2*.5,u2:V.u2,u3:V.u2*1.8});
    sv('rect',{x:0,y:0,width:640,height:340,fill:'rgba(10,30,50,.5)'},svg);
    var rows=[['Pg',r.pg,BL],['Pd',r.pd,AM],['Pc = Pg × Pd',r.pc,GN]];
    rows.forEach(function(q,i){var y=44+i*64;lbl(svg,30,y+4,q[0],TX,12);sv('rect',{x:30,y:y+12,width:500,height:24,rx:5,fill:'rgba(255,255,255,.06)',stroke:GR},svg);sv('rect',{x:30,y:y+12,width:500*q[1],height:24,rx:5,fill:q[2],'fill-opacity':.55},svg);lbl(svg,538,y+30,nf(q[1]*100,1)+' %',q[2],12)});
    var cls=r.pc>=.9&&V.disc?'Compatible con reservas, si cumple todos los criterios de comercialidad':V.disc?'Recurso contingente: Pc = Pd':'Recurso prospectivo: Pc = Pg × Pd';
    lbl(svg,30,262,cls,V.disc&&r.pc>=.9?GN:AM,12);
    lbl(svg,30,290,'Volumen sin riesgo (mejor): '+nf(V.u2)+' MMbbl · multiplicado por Pc: '+nf(r.riskedBest,1)+' MMbbl (solo comparativo)',TX,11);
    h.out('Pc = '+ok(nf(r.pc*100,1)+' %')+'. '+(V.disc?'Con el descubrimiento hecho, Pg vale 1 y Pc es igual a Pd.':'Un prospecto tiene dos riesgos: descubrir y desarrollar.')+'<br>PRMS pide informar los volúmenes prospectivos <em>sin riesgo</em> (1U, 2U y 3U); si se informa un valor con riesgo, hay que informar también Pg, Pd y las cifras sin riesgo.'+src(h,'PRMS 2018 y FAQ 5.2 de la SPE; datos de ejemplo. El volumen multiplicado por Pc es una ayuda para comparar, no una cifra de reservas.'))}
  draw(h.V)};
})();
