(function(){
var L=['es','en','fr','pt'],KEY='h3l_notrack';
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lang(){var q=/[?&]lang=([a-z]{2})/.exec(location.search);if(q&&L.indexOf(q[1])>=0)return q[1];
  var s=get('h3l_lang');if(L.indexOf(s)>=0)return s;
  var n=(navigator.language||'es').slice(0,2);return L.indexOf(n)>=0?n:'es'}
function off(){return get(KEY)==='1'}
function refresh(){
  document.querySelectorAll('[data-opt]').forEach(function(box){
    var btn=box.querySelector('[data-optbtn]'),st=box.querySelector('.st');
    btn.textContent=off()?btn.getAttribute('data-t-on'):btn.getAttribute('data-t-off');
    st.textContent=off()?box.getAttribute('data-on'):box.getAttribute('data-off')});
}
function show(l){
  document.documentElement.lang=l;
  document.querySelectorAll('article[data-lang]').forEach(function(a){a.hidden=a.getAttribute('data-lang')!==l});
  document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-l')===l?'true':'false')});
  var t={es:'Privacidad y cookies',en:'Privacy and cookies',fr:'Confidentialité et cookies',pt:'Privacidade e cookies'}[l];
  document.title=t+' — H3L Global Energy';
}
document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){var l=b.getAttribute('data-l');set('h3l_lang',l);show(l)})});
document.querySelectorAll('[data-optbtn]').forEach(function(b){b.addEventListener('click',function(){
  try{if(off())localStorage.removeItem(KEY);else localStorage.setItem(KEY,'1')}catch(e){}refresh()})});
show(lang());refresh();
})();
