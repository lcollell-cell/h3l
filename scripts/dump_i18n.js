// Vuelca los diccionarios de la portada (v2/i18n.js + v2/lang-index.js) como JSON, sin navegador.
// Lo usa scripts/build_idiomas.py. Uso: node scripts/dump_i18n.js > diccionario.json
const vm = require('vm'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'v2');
const el = () => ({ style: {}, setAttribute() {}, appendChild() {}, addEventListener() {}, querySelectorAll: () => [], classList: { add() {}, remove() {} } });
const doc = { createElement: el, head: el(), documentElement: el(), addEventListener() {}, querySelectorAll: () => [], getElementById: () => null, readyState: 'loading' };
const win = { document: doc, navigator: { language: 'es' }, localStorage: { getItem: () => null, setItem() {} }, location: { search: '', href: 'https://x/' }, addEventListener() {}, console };
win.window = win;
const ctx = vm.createContext(Object.assign(win, { document: doc, navigator: win.navigator, localStorage: win.localStorage, location: win.location, URLSearchParams, URL, console }));
for (const f of ['i18n.js', 'lang-index.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const H3L = ctx.window.H3L, out = {};
for (const l of H3L.L) { H3L.lang = l; out[l] = {}; for (const k of H3L.keys('es')) out[l][k] = H3L.t(k); }
process.stdout.write(JSON.stringify(out));
