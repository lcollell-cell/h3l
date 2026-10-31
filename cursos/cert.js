/* H3L · Cursos · certificado (canvas), código de verificación y enlaces para LinkedIn */
(function(){'use strict';var HC=window.HC;var C=HC.cert={};
var MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
C.norm=function(n){return String(n||'').replace(/\s+/g,' ').trim()};
C.hash=function(d){var s='H3L|'+d.c+'|'+C.norm(d.n).toLowerCase()+'|'+d.d+'|'+d.s+'|'+d.h;
  if(window.crypto&&crypto.subtle&&window.TextEncoder){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return('0'+x.toString(16)).slice(-2)}).join('').slice(0,10).toUpperCase()})}
  var h=2166136261,i;for(i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return Promise.resolve(('00000000'+(h>>>0).toString(16)).slice(-8).toUpperCase()+'00')};
C.code=function(d){return C.hash(d).then(function(x){return 'H3L-'+d.c.toUpperCase()+'-'+d.d.replace(/-/g,'')+'-'+x})};
C.base=function(){var p=location.pathname.replace(/[^\/]*$/,'');return location.origin+p};
C.verifyUrl=function(d,code){var q=new URLSearchParams({n:C.norm(d.n),c:d.c,d:d.d,s:d.s,h:d.h,id:code});return C.base()+'verificar.html?'+q.toString()};
C.linkedin=function(d,title,code){var dt=d.d.split('-');return 'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name='+encodeURIComponent(title+' — H3L Global Energy')+'&organizationName='+encodeURIComponent('H3L Global Energy')+'&issueYear='+dt[0]+'&issueMonth='+(+dt[1])+'&certUrl='+encodeURIComponent(C.verifyUrl(d,code))+'&certId='+encodeURIComponent(code)};
C.share=function(d,title,code){return 'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(C.verifyUrl(d,code))};
function fit(ctx,text,max,font,min){var sz=max;do{ctx.font=font.replace('{s}',sz);sz-=2}while(ctx.measureText(text).width>1180&&sz>min);return sz}
function wrapText(ctx,t,x,y,mw,lh){var w=t.split(' '),l='',lines=[];w.forEach(function(s){var tt=l?l+' '+s:s;if(ctx.measureText(tt).width>mw&&l){lines.push(l);l=s}else l=tt});if(l)lines.push(l);lines.forEach(function(s,i){ctx.fillText(s,x,y+i*lh)});return y+lines.length*lh}
C.draw=function(canvas,d,title,code,mods){var W=1754,H=1240,ctx=canvas.getContext('2d');canvas.width=W;canvas.height=H;
  return Promise.all([document.fonts?document.fonts.load('700 40px Montserrat'):0,document.fonts?document.fonts.load('500 24px Montserrat'):0,new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src='../LOGO_H3L.png'})]).then(function(r){var logo=r[2];
    ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b1a30');g.addColorStop(1,'#0f2a42');ctx.fillStyle=g;ctx.fillRect(0,0,150,H);ctx.fillStyle='#17755A';ctx.fillRect(150,0,12,H);
    ctx.save();ctx.translate(95,H-70);ctx.rotate(-Math.PI/2);ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='600 20px Montserrat, sans-serif';ctx.fillText('CURSOS ONLINE H3L · CAPACITACIÓN',0,0);ctx.restore();
    ctx.strokeStyle='#dfe5ee';ctx.lineWidth=3;ctx.strokeRect(210,50,W-260,H-100);
    if(logo){var lw=230,lh=lw*logo.height/logo.width;ctx.drawImage(logo,250,90,lw,lh)}
    ctx.textAlign='left';ctx.fillStyle='#17755A';ctx.font='700 26px Montserrat, sans-serif';ctx.fillText('CERTIFICADO DE FINALIZACIÓN',W-250-ctx.measureText('CERTIFICADO DE FINALIZACIÓN').width,150);
    ctx.fillStyle='#5b6b86';ctx.font='500 28px Montserrat, sans-serif';ctx.fillText('H3L Global Energy certifica que',250,370);
    var name=C.norm(d.n);var sz=fit(ctx,name,86,'700 {s}px Montserrat, sans-serif',40);ctx.fillStyle='#1B2944';ctx.font='700 '+(sz+2)+'px Montserrat, sans-serif';ctx.fillText(name,250,370+sz+28);
    ctx.fillStyle='#17755A';ctx.fillRect(250,370+sz+54,160,6);
    var y=370+sz+130;ctx.fillStyle='#5b6b86';ctx.font='500 28px Montserrat, sans-serif';ctx.fillText('completó y aprobó el curso online',250,y);
    ctx.fillStyle='#1B2944';ctx.font='700 50px Montserrat, sans-serif';y=wrapText(ctx,title,250,y+68,1230,62);
    var dt=d.d.split('-'),fecha=(+dt[2])+' de '+MES[+dt[1]-1]+' de '+dt[0];
    ctx.fillStyle='#33415c';ctx.font='500 26px Montserrat, sans-serif';y+=14;ctx.fillText('Fecha de emisión: '+fecha+'   ·   Carga horaria estimada: '+d.h+' h   ·   Examen final: '+d.s+' %',250,y);
    if(mods&&mods.length){ctx.fillStyle='#5b6b86';ctx.font='500 21px Montserrat, sans-serif';y+=44;var mt='Módulos: '+mods.join(' · ');while(ctx.measureText(mt).width>1020&&mt.length>10)mt=mt.slice(0,-2);if(mt.length<('Módulos: '+mods.join(' · ')).length)mt=mt.replace(/\s+$/,'')+'…';ctx.fillText(mt,250,y)}
    /* sello */
    var cx=W-380,cy=H-330;ctx.beginPath();ctx.arc(cx,cy,92,0,7);ctx.fillStyle='#17755A';ctx.fill();ctx.beginPath();ctx.arc(cx,cy,80,0,7);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='700 40px Montserrat, sans-serif';ctx.fillText('H3L',cx,cy+4);ctx.font='700 15px Montserrat, sans-serif';ctx.fillText('APROBADO',cx,cy+30);ctx.textAlign='left';
    ctx.fillStyle='#1B2944';ctx.font='700 22px Montserrat, sans-serif';ctx.fillText('Código de verificación: '+code,250,H-210);
    ctx.fillStyle='#5b6b86';ctx.font='500 18px Montserrat, sans-serif';var vu=C.verifyUrl(d,code);ctx.fillText('Verificar: '+(vu.length>120?C.base()+'verificar.html (con el enlace del certificado)':vu),250,H-176);
    ctx.font='500 17px Montserrat, sans-serif';wrapText(ctx,'Certificado de capacitación emitido por H3L Global Energy. Acredita la finalización de un curso online y no constituye una habilitación profesional ni una acreditación oficial.',250,H-134,1300,24);
    ctx.fillStyle='#17755A';ctx.font='700 19px Montserrat, sans-serif';ctx.fillText('info@h3lglobalenergy.com  ·  www.h3lglobalenergy.com',250,H-78)})};
})();
