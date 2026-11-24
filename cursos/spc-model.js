/* H3L · Cursos · modelos de cálculo del curso "Seguridad de procesos y control de pozos" (spc).
   Funciones puras, sin DOM, que usan los laboratorios (spc-labs.js) y que verifica tools/verificar_spc.py contra una
   implementación independiente. Unidades: control de pozos y cementación en unidades de campo (psi, ppg, ft, bbl);
   liberación de gas/líquido y corrosión de ductos en SI (kg, m, MPa, mm). Son modelos DIDÁCTICOS y simplificados;
   no reemplazan los procedimientos del operador ni un simulador certificado (IWCF / IADC WellSharp). */
(function(root){'use strict';
var M={};
var G=.052; /* psi por ft por ppg */
M.G=G;
M.hyd=function(mw,tvd){return G*mw*tvd};

/* ---------- hoja de control (kill sheet): fórmulas clásicas de control de pozo ---------- */
/* a: mw, tvd, sidpp, sicp, scr (presión a caudal reducido), gain (ganancia en piletas, bbl), ca (capacidad anular en la zona del influjo, bbl/ft),
      dpVol (volumen interior de la sarta, bbl), annVol (volumen anular, bbl), pump (bbl/embolada), shoeTvd, fg (gradiente de fractura en el zapato, ppg) */
M.kill=function(a){
  var kmw=a.mw+a.sidpp/(G*a.tvd),icp=a.sidpp+a.scr,fcp=a.scr*kmw/a.mw,pf=G*a.mw*a.tvd+a.sidpp,
      maasp=(a.fg-a.mw)*G*a.shoeTvd,h=a.gain/a.ca,gr=null,type='';
  if(h>0&&a.sicp>=a.sidpp){gr=G*a.mw-(a.sicp-a.sidpp)/h;type=gr<.25?'gas':(gr<=.4?'petróleo o mezcla':'agua salada')}
  return{kmw:kmw,icp:icp,fcp:fcp,pf:pf,maasp:maasp,h:h,grad:gr,type:type,
    sDP:a.dpVol/a.pump,sAnn:a.annVol/a.pump,pfrac:a.fg*G*a.shoeTvd,overMaasp:a.sicp>maasp};
};
/* presión de poro equivalente (ppg) a partir de la presión de formación */
M.eqPore=function(pf,tvd){return pf/(G*tvd)};

/* ---------- circulación de un influjo de gas con presión de fondo constante (burbuja única, gas ideal) ----------
   método: 'driller1' (1.ª circulación, lodo original), 'ww' (esperar y densificar) o 'driller2' (2.ª circulación, sin gas).
   Simplificaciones declaradas: pozo vertical, capacidad anular uniforme, un solo bolsón de gas isotérmico con z = 1,
   sin disolución en el lodo ni deslizamiento (slip), peso del gas con gradiente gg, presión de fondo constante igual a la de formación (sin margen). */
M.circ=function(a,method,n){
  n=n||240;var k=M.kill(a),D=a.tvd,ca=a.ca,gg=a.gg!=null?a.gg:.1,zs=a.shoeTvd,kmw=k.kmw,pf=k.pf,
      V0=method==='driller2'?0:a.gain,K=(pf-gg*(V0/ca)/2)*V0, /* moles de gas (p·V) conservados: el gain se mide a la presión media inicial de la burbuja */
      total=method==='driller1'?ca*D*1.15:(a.dpVol+ca*D),out=[],i;
  for(i=0;i<=n;i++){
    var Vp=total*i/n,Dd=Math.min(D,Vp/ca),hk=0,mk=a.mw;
    if(method==='ww'||method==='driller2'){hk=Math.min(D,Math.max(0,Vp-a.dpVol)/ca)}
    /* el lodo debajo del gas: kill en el fondo (hk) y lodo original encima */
    var hBelow=G*(a.mw*Math.max(0,Dd-hk)+kmw*Math.min(hk,Dd)),zb=Math.max(0,D-Dd),pbot=pf-hBelow,Lg=0,zt=zb,Pc,Psh,dpp;
    if(V0>0&&zb>0){
      var bq=pbot*ca,disc=bq*bq-2*gg*ca*K;
      Lg=disc>0?(bq-Math.sqrt(disc))/(gg*ca):zb;
      zt=zb-Lg;
      if(zt<0){Lg=zb;zt=0;Pc=pbot-gg*zb}else{Pc=pbot-gg*Lg-G*a.mw*zt}
    }else{
      /* sin gas en el anular: casing = presión de formación - columna de lodo (con la parte con kill mud) */
      Pc=Math.max(0,pf-G*(a.mw*Math.max(0,D-hk)+kmw*Math.min(hk,D)));zb=0;zt=0;Lg=0;
    }
    if(V0>0&&zb>0){
      if(zt>=zs)Psh=Pc+G*a.mw*zs;
      else if(zb>zs)Psh=Pc+G*a.mw*Math.max(zt,0)+gg*(zs-Math.max(zt,0));
      else Psh=pf-G*(a.mw*Math.max(0,(D-hk)-zs)+kmw*Math.min(hk,D-zs));
    }else{
      Psh=pf-G*(a.mw*Math.max(0,(D-hk)-zs)+kmw*Math.min(hk,Math.max(0,D-zs)));
    }
    if(method==='driller1')dpp=k.icp;
    else dpp=Vp<a.dpVol?k.icp+(k.fcp-k.icp)*Vp/a.dpVol:k.fcp;
    out.push({Vp:Vp,st:Vp/a.pump,pc:Pc,psh:Psh,dpp:dpp,zb:zb,zt:zt,Lg:Lg,hk:hk});
  }
  var mx=0,mxs=0,mxi=0,j;for(j=0;j<out.length;j++){if(out[j].pc>mx){mx=out[j].pc;mxi=j}if(out[j].psh>mxs)mxs=out[j].psh}
  return{pts:out,maxPc:mx,maxPcStrokes:out[mxi].st,maxPsh:mxs,frac:k.pfrac,lost:mxs>k.pfrac,kill:k};
};

/* ---------- cementación (unidades de campo) ---------- */
M.capIn=function(d){return d*d/1029.4};              /* bbl/ft de un diámetro interior (in) */
M.annCap=function(dh,dp){return (dh*dh-dp*dp)/1029.4}; /* bbl/ft entre pozo y cañería */
/* a: tvd, dh (hueco, in), dpo (OD cañería), dpi (ID cañería), mw, sp {rho,len}, lead {rho,len}, tail {rho,len}, excess (fracción), st (largo shoe track, ft),
      dispRho, pore (ppg eq.), frac (ppg eq.), fric (psi de fricción anular), pump (bbl/embolada), yield (ft3/sk) */
M.cement=function(a){
  var ca=M.annCap(a.dh,a.dpo),ci=M.capIn(a.dpi),fl=[['cola',a.tail],['lechada guía',a.lead],['espaciador',a.sp]],h=a.tvd,hyd=0,col=[],used=0,i;
  fl.forEach(function(f){var L=Math.min(h-used,f[1].len);hyd+=G*f[1].rho*L;col.push({n:f[0],rho:f[1].rho,len:L});used+=L});
  var rest=Math.max(0,h-used);hyd+=G*a.mw*rest;col.push({n:'lodo',rho:a.mw,len:rest});
  var hcsg=G*a.dispRho*(a.tvd-a.st)+G*a.tail.rho*a.st,rhoEq=hyd/(G*a.tvd),ecd=(hyd+a.fric)/(G*a.tvd),
      vol=ca*(a.tail.len+a.lead.len)*(1+a.excess),volST=ci*a.st,volDisp=ci*(a.tvd-a.st),
      margin=.5; /* margen de 0,5 ppg respecto de poro y fractura (ejemplo didáctico) */
  var okLow=rhoEq>=a.pore+margin*0.4,okHigh=ecd<=a.frac-margin*0.4;
  return{cols:col,hyd:hyd,rhoEq:rhoEq,ecd:ecd,dpU:hyd-hcsg,hcsg:hcsg,volCem:vol,volST:volST,volDisp:volDisp,stkDisp:volDisp/a.pump,
    sacks:vol*5.615/a.yield,okLow:okLow,okHigh:okHigh,ca:ca,ci:ci,bump:null};
};

/* ---------- prueba de presión negativa (unidades de campo) ----------
   a: pf (presión de formación en el fondo del pozo, psi), tvd, mw (lodo antes del desplazamiento), dispRho (fluido liviano), dispLen (ft de fluido liviano en la sarta y en el riser/kill line), leak (0 a 1: fracción de comunicación con la formación, 0 = barrera sana) */
M.negTest=function(a){
  var hydLight=G*a.dispRho*a.dispLen+G*a.mw*(a.tvd-a.dispLen),under=a.pf-hydLight,
      expectedBuild=a.leak*Math.max(0,under); /* presión que aparecería en superficie si la barrera comunica */
  return{hydLight:hydLight,underbalance:under,pBuild:expectedBuild};
};

/* ---------- pérdida de contención (SI) ----------
   a: fluid ('gas'|'liquid'), p (MPa manométrica), T (K), dHole (mm), cd, rho (kg/m3, líquidos), gamma, mw (kg/mol), z, inv (kg inventario), tDet (s), tIso (s) */
M.release=function(a){
  var A=Math.PI*Math.pow(a.dHole/1000,2)/4,Pa=101325,P1=a.p*1e6+Pa,W,choked=false;
  if(a.fluid==='liquid'){W=a.cd*A*Math.sqrt(2*a.rho*Math.max(0,a.p*1e6))}
  else{var g=a.gamma,crit=Math.pow((g+1)/2,g/(g-1));choked=P1/Pa>=crit;
    if(choked){W=a.cd*A*P1*Math.sqrt(g*a.mw/(a.z*8.314*a.T))*Math.pow(2/(g+1),(g+1)/(2*(g-1)))}
    else{var r=Pa/P1;W=a.cd*A*P1*Math.sqrt(2*a.mw/(a.z*8.314*a.T)*g/(g-1)*(Math.pow(r,2/g)-Math.pow(r,(g+1)/g)))}}
  var t=a.tDet+a.tIso,mass=Math.min(a.inv,W*t),mass1h=Math.min(a.inv,W*3600);
  return{A:A,W:W,choked:choked,mass:mass,t:t,limited:W*t>=a.inv,mass1h:mass1h};
};

/* ---------- corrosión: resistencia remanente (ASME B31G modificado, nivel 1) y vida remanente (SI) ----------
   a: D (mm), t (mm), smys (MPa), d (mm, profundidad), L (mm, longitud axial), F (factor de diseño), maop (MPa), cr (mm/año) */
M.b31g=function(a){
  var Sf=a.smys+68.95,z=a.L*a.L/(a.D*a.t),Mf=z<=50?Math.sqrt(1+.6275*z-.003375*z*z):.032*z+3.3,
      dt=a.d/a.t,burst=2*a.t*Sf/a.D,Pf=burst*(1-.85*dt)/(1-.85*dt/Mf),Ps=a.F*Pf,erf=a.maop/Ps,
      tmin=a.maop*a.D/(2*a.F*Sf); /* espesor mínimo para la presión, sin defecto */
  /* años hasta que el factor de reparación estimado llegue a 1 (profundidad crece con la tasa de corrosión) */
  var yr=0,lim=60,d2=a.d,Pf2=Pf,ok=erf<1;
  if(ok&&a.cr>0){
    for(yr=0;yr<=lim;yr+=.1){d2=a.d+a.cr*yr;if(d2>=a.t*.8){break}
      var dt2=d2/a.t,Pf3=burst*(1-.85*dt2)/(1-.85*dt2/Mf);if(a.maop/(a.F*Pf3)>=1)break}
    yr=Math.min(yr,lim);
  }else if(ok){yr=lim}else{yr=0}
  return{Sf:Sf,z:z,M:Mf,Pf:Pf,Ps:Ps,erf:erf,burst:burst,tmin:tmin,ratio:Pf/a.maop,yearsToLimit:yr,pass:erf<1,pint:a.cr>0?Math.max(0,yr/2):null};
};
/* velocidad de corrosión y vida remanente a partir de dos medidas de espesor */
M.remLife=function(t0,t1,years,tmin){var cr=(t0-t1)/years;return{cr:cr,life:cr>0?(t1-tmin)/cr:Infinity,interval:cr>0?Math.max(0,(t1-tmin)/cr/2):Infinity}};

/* ---------- LOPA (órdenes de magnitud) ---------- */
M.lopa=function(fi,pfds,target){var f=fi;pfds.forEach(function(p){f*=p});return{f:f,gap:f/target,sifPfd:f>target?target/f:1}};

root.SPM=M;
if(typeof module!=='undefined'&&module.exports)module.exports=M;
})(typeof window!=='undefined'?window:globalThis);
