/* H3L · Cursos · reglas y modelos del curso "Más allá de las reservas comprobadas" (pr2).
   Lógica pura (sin DOM) para que se pueda verificar con tools/verificar_pr2.py. Basada en PRMS 2018 (SPE et al.), sus preguntas frecuentes (FAQ, 2022)
   y la regla de la SEC de 2008. Todos los datos de los laboratorios son de EJEMPLO con fines didácticos: no reemplazan una evaluación de reservas. */
(function(root,fac){if(typeof module==='object'&&module.exports)module.exports=fac();else root.SPX=fac()})(this,function(){'use strict';
var M={};
/* ---------- clasificación por madurez del proyecto ----------
   i: {disc:bool, tgt:'def'|'poor'|'trend' (si no está descubierto),
       tech, econ, appr, mkt, intent: bool (criterios de comercialidad), yrs: años hasta iniciar el desarrollo, just: bool (plazo mayor justificado),
       fase:'prod'|'impl'|'just' (si cumple todo), estado:'active'|'hold'|'incomplete'|'none' (si es contingente)} */
M.CRIT=[['tech','tecnología establecida para el proyecto'],['econ','economía positiva con las condiciones previstas'],['appr','aprobaciones razonablemente esperables'],['mkt','mercado y transporte razonablemente asegurados'],['intent','intención firme de desarrollar en un plazo razonable']];
M.BENCH=5; /* años: referencia de PRMS para iniciar el desarrollo de reservas no desarrolladas (FAQ 4.7: puntos de referencia, no límite rígido) */
M.classify=function(i){
  var out={};
  if(!i.disc){
    out.cls='Recursos prospectivos';out.sub={def:'Prospecto',poor:'Lead',trend:'Play'}[i.tgt]||'Prospecto';out.pc='Pc = Pg × Pd';out.missing=[];
    out.why={def:'Es una acumulación potencial bien definida como objetivo de perforación.',poor:'Es una acumulación potencial todavía mal definida: necesita más datos para ser prospecto.',trend:'Es una tendencia geológica reconocida sin prospectos definidos: necesita más datos para llegar a lead o prospecto.'}[i.tgt];
    return out}
  var miss=[],k;
  M.CRIT.forEach(function(c){if(!i[c[0]])miss.push(c[1])});
  var timeOk=i.yrs<=M.BENCH||!!i.just;
  if(!timeOk)miss.push('plazo de inicio mayor a cinco años sin justificación');
  out.econ=!!i.econ;
  if(!miss.length){
    out.cls='Reservas';out.sub={prod:'En producción',impl:'Aprobado para desarrollo',just:'Justificado para desarrollo'}[i.fase]||'Justificado para desarrollo';out.pc='Pc de 90 % o más (Pg = 1; Pd de 90 % o más)';out.missing=[];
    out.why='Cumple los criterios de comercialidad: tecnología, economía, aprobaciones, mercado e intención firme dentro de un plazo razonable.';return out}
  out.cls='Recursos contingentes';out.missing=miss;out.pc='Pc = Pd, menor que 90 % (Pg = 1)';
  out.sub={active:'Desarrollo pendiente',hold:'Desarrollo en espera',incomplete:'Desarrollo sin aclarar',none:'Desarrollo no viable'}[i.estado]||'Desarrollo sin aclarar';
  out.why='Está descubierto, pero el proyecto no cumple todavía todos los criterios de comercialidad.';
  return out};
/* ---------- desarrolladas no productivas (cerrados y behind-pipe) ----------
   i: {tipo:'shut'|'bp'|'new', pct: costo de reactivar o completar como % del costo de un pozo nuevo, thr: umbral de la compañía en %, evid: bool, mkt: bool} */
M.THR_RANGE=[10,50];M.THR_COMMON=[25,35]; /* FAQ 3.10 de la SPE */
M.dnp=function(i){
  var r={};
  if(i.tipo==='new'){r.res='Reserva no desarrollada';r.ok=true;r.why='Hace falta perforar un pozo nuevo: es un gasto significativo por definición, y el volumen se evalúa como no desarrollado (con su plazo de cinco años de referencia).';return r}
  if(i.pct>i.thr){r.res='Reserva no desarrollada';r.ok=true;r.why='El costo de reactivar o completar supera el umbral que la compañía definió para un gasto menor: el volumen es no desarrollado.';return r}
  if(!i.evid){r.res='Sin evidencia suficiente';r.ok=false;r.why='El gasto es menor, pero falta evidencia de que el intervalo produce (ensayo, perfil o análogo según el criterio de la compañía). Sin ella no es reserva desarrollada: se informa en otra categoría o como contingente.';return r}
  if(!i.mkt){r.res='Recurso contingente en espera';r.ok=false;r.why='Sin expectativa razonable de contrato y conexión no se cumple el criterio de mercado: el proyecto es contingente (en espera) hasta resolverlo.';return r}
  r.res=i.tipo==='bp'?'Reserva desarrollada no productiva (behind-pipe)':'Reserva desarrollada no productiva (cerrada)';r.ok=true;
  r.why='El costo es menor frente a un pozo nuevo, hay evidencia de producibilidad y el mercado es razonablemente esperable.';return r};
/* ---------- chance de comercialidad ---------- */
M.pc=function(i){var pg=i.disc?1:i.pg,pd=i.pd,c=pg*pd;return{pg:pg,pd:pd,pc:c,riskedBest:c*i.u2,riskedLow:c*i.u1,riskedHigh:c*i.u3}};
/* ---------- sensibilidades ---------- */
M.exp=function(qi,D,qa){return{cum:(qi-qa)*365/D,t:Math.log(qi/qa)/D}};            /* qi, qa en bbl/d; D nominal 1/año; cum en bbl */
M.arps=function(qi,D,b,qa){if(b===0)return M.exp(qi,D,qa);return{cum:Math.pow(qi,b)/((1-b)*D)*(Math.pow(qi,1-b)-Math.pow(qa,1-b))*365,t:(Math.pow(qi/qa,b)-1)/(b*D)}};
M.declObs=function(q0,q1,years){return Math.log(q0/q1)/years};                     /* declinación nominal observada */
M.erfc=function(x){var z=Math.abs(x),t=1/(1+.5*z),r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));return x>=0?r:2-r};
M.pExceed=function(p50,sigma,x){var z=Math.log(x/p50)/sigma;return .5*M.erfc(z/Math.SQRT2)};   /* lognormal: probabilidad de superar x */
M.breakeven=function(invMM,margin){return invMM/margin};                              /* MMbbl = MMUSD / (USD/bbl) */
M.npv=function(eurMbbl,margin,invMM){return eurMbbl*margin/1000-invMM};
return M});
