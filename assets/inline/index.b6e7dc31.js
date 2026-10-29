/* Calculadoras por flujo: pestañas, marcos incrustados y enlaces entre vistas */
(function(){
  function frame(t){return document.getElementById(t==='flujo'?'calcFrameFlujo':'calcFrameApp');}
  window.calcTab=function(t,hash){
    var tabs=['flujo','app','clasicas'];
    if(tabs.indexOf(t)<0)t='flujo';
    document.querySelectorAll('#calcTabs .calc-tab-btn').forEach(function(b){var on=b.getAttribute('data-ctab')===t;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');b.setAttribute('tabindex',on?'0':'-1');});
    document.getElementById('calcPanelFlujo').hidden=t!=='flujo';
    document.getElementById('calcPanelApp').hidden=t!=='app';
    document.getElementById('calcPanelClasicas').hidden=t!=='clasicas';
    if(t==='flujo'||t==='app'){
      var f=frame(t),src=f.getAttribute('data-src');
      if(!f.getAttribute('src'))f.setAttribute('src',src+(t==='app'&&hash?'#'+hash:''));
      else if(t==='app'&&hash){try{f.contentWindow.location.hash=hash;}catch(e){f.setAttribute('src',src+'#'+hash);}}
    }
  };
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=document.getElementById('calcModal');if(m&&m.classList.contains('open')&&typeof closeModal==='function')closeModal();}});
  var tabsEl=document.getElementById('calcTabs');
  if(tabsEl)tabsEl.addEventListener('keydown',function(e){
    var order=['flujo','app','clasicas'],cur=document.querySelector('#calcTabs .calc-tab-btn.active'),i=order.indexOf(cur&&cur.getAttribute('data-ctab')),n=-1;
    if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;
    if(n<0)return;e.preventDefault();calcTab(order[n]);var b=document.querySelector('#calcTabs [data-ctab="'+order[n]+'"]');if(b)b.focus();
  });
  window.addEventListener('message',function(e){
    if(e.origin!==location.origin||!e.data||!e.data.h3l)return;
    var d=e.data;
    if(d.h3l==='height'&&d.frame==='flujo'&&typeof d.h==='number'&&d.h>0&&d.h<20000){document.getElementById('calcFrameFlujo').style.height=Math.max(d.h,400)+'px';return;}
    if(d.h3l==='tool'&&/^[A-Za-z0-9._-]+$/.test(d.hash||''))calcTab('app',d.hash);
    else if(d.h3l==='goto'){
      var q=new URLSearchParams(d.query||''),g=q.get('go');
      if(g&&/^[a-z-]+$/.test(g)&&document.getElementById('section-'+g)){
        goSection(g);
        if(g==='calculators')calcTab(q.get('tab')||'flujo');
      }
    }
  });
  /* ?go=calculators&tab=clasicas|app|flujo y entrada directa a la sección */
  try{
    var q=new URLSearchParams(location.search),t=q.get('tab');
    if(t&&q.get('go')==='calculators')window.addEventListener('load',function(){setTimeout(function(){calcTab(t);},300);});
  }catch(e){}
  var orig=window.goSection;
  if(typeof orig==='function'){window.goSection=function(id){orig.apply(this,arguments);if(id==='calculators'){var f=frame('flujo');if(!document.getElementById('calcPanelFlujo').hidden&&!f.getAttribute('src'))calcTab('flujo');}};}
})();
