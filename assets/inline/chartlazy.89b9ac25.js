(function(){
  var st=0,q=[];
  window.h3lChart=function(cb){
    if(window.Chart){cb&&cb();return;}
    if(cb)q.push(cb);
    if(st)return;
    st=1;
    var s=document.createElement('script');
    s.src='assets/vendor/chart.umd.min.js';
    s.onload=function(){var c=q.splice(0);for(var i=0;i<c.length;i++){try{c[i]();}catch(e){console.error(e);}}};
    s.onerror=function(){st=0;q.length=0;};
    document.head.appendChild(s);
  };
})();
