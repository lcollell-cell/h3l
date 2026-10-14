#!/usr/bin/env python3
"""Actualiza data/market.json (EIA) y data/news.json (IEA y Oil & Gas Journal).

Regla de oro: NUNCA inventar. Si una fuente falla o no se puede interpretar,
se conserva el archivo anterior tal cual. Solo librería estándar.
Variable de entorno requerida para precios: EIA_API_KEY (gratis en https://www.eia.gov/opendata/).
"""
import json, os, re, sys, urllib.request, urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DATA = os.path.join(ROOT, 'data')
UA = 'Mozilla/5.0 (compatible; H3L-data-bot/1.0; +https://www.h3lglobalenergy.com)'

def get(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode('utf-8', 'replace')

def save(name, obj):
    path = os.path.join(DATA, name)
    old = None
    try: old = json.load(open(path, encoding='utf-8'))
    except Exception: pass
    cmp_old = dict(old or {}); cmp_new = dict(obj)
    cmp_old.pop('checked', None); cmp_new.pop('checked', None)
    if cmp_old == cmp_new and old is not None:
        print(name, ': sin cambios'); return
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1); f.write('\n')
    print(name, ': actualizado')

# ───────────── Precios EIA ─────────────
def eia_series(key, route, series_id):
    q = [('api_key', key), ('frequency', 'daily'), ('data[0]', 'value'),
         ('facets[series][]', series_id), ('sort[0][column]', 'period'),
         ('sort[0][direction]', 'desc'), ('length', '5')]
    url = 'https://api.eia.gov/v2/%s/data/?%s' % (route, urllib.parse.urlencode(q))
    rows = json.loads(get(url))['response']['data']
    rows = [(r['period'], float(r['value'])) for r in rows if r.get('value') not in (None, '')]
    rows.sort(reverse=True)
    if len(rows) < 2: raise ValueError('pocos datos para ' + series_id)
    return rows[0], rows[1]

def update_market():
    key = os.environ.get('EIA_API_KEY', '').strip()
    if not key:
        print('EIA_API_KEY no definida: se conservan los precios anteriores'); return
    out = {}
    for name, route, sid in (('brent', 'petroleum/pri/spt', 'RBRTE'),
                             ('wti', 'petroleum/pri/spt', 'RWTC'),
                             ('gas', 'natural-gas/pri/fut', 'RNGWHHD')):
        (d1, v1), (d0, v0) = eia_series(key, route, sid)
        out[name] = {'v': round(v1, 2), 'prev': round(v0, 2), 'date': d1}
    out['date'] = max(out[k]['date'] for k in ('brent', 'wti', 'gas'))
    out['source'] = 'EIA — U.S. Energy Information Administration (api.eia.gov)'
    out['checked'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
    for k in ('brent', 'wti', 'gas'):           # validación de rangos razonables
        v = out[k]['v']
        if not (1 < v < 400): raise ValueError('valor fuera de rango: %s=%s' % (k, v))
    save('market.json', out)

# ───────────── Noticias ─────────────
def parse_feed(xml_text, source, limit=6):
    root = ET.fromstring(xml_text)
    items = []
    for it in list(root.iter('item')) + list(root.iter('{http://www.w3.org/2005/Atom}entry')):
        def t(tag):
            e = it.find(tag) if it.find(tag) is not None else it.find('{http://www.w3.org/2005/Atom}' + tag)
            return (e.text or '').strip() if e is not None and e.text else ''
        title = unescape(t('title')); link = t('link')
        if not link:
            le = it.find('{http://www.w3.org/2005/Atom}link')
            link = le.get('href') if le is not None else ''
        raw = t('pubDate') or t('updated') or t('published')
        try:
            dt = parsedate_to_datetime(raw) if 'T' not in raw else datetime.fromisoformat(raw.replace('Z', '+00:00'))
        except Exception:
            continue
        if title and link:
            items.append({'source': source, 'title': title, 'url': link, 'date': dt.date().isoformat()})
    return items[:limit]

def discover_feed(page_url, html_text):
    m = re.search(r'<link[^>]+type=["\']application/(?:rss|atom)\+xml["\'][^>]*>', html_text, re.I)
    if not m: return None
    h = re.search(r'href=["\']([^"\']+)', m.group(0))
    return urllib.parse.urljoin(page_url, h.group(1)) if h else None

# Respaldo por HTML: titular + fecha "Oct. 12, 2026" / "13 October 2026" cerca del enlace
MES = {m: i for i, m in enumerate(['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'], 1)}
def to_iso(txt):
    m = re.search(r'(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})', txt) 
    if m: return '%s-%02d-%02d' % (m.group(3), MES.get(m.group(2).lower()[:3], 0), int(m.group(1)))
    m = re.search(r'([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})', txt)
    if m: return '%s-%02d-%02d' % (m.group(3), MES.get(m.group(1).lower()[:3], 0), int(m.group(2)))
    return None

def parse_html(html_text, base, source, link_re, limit=6):
    items, seen = [], set()
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html_text, re.S | re.I):
        href, inner = m.group(1), m.group(2)
        url = urllib.parse.urljoin(base, href)
        if not re.search(link_re, url) or url in seen: continue
        title = unescape(re.sub(r'<[^>]+>', ' ', inner)); title = re.sub(r'\s+', ' ', title).strip()
        if len(title) < 25: continue
        ctx = html_text[m.end(): m.end() + 400] + html_text[max(0, m.start() - 400): m.start()]
        iso = to_iso(unescape(re.sub(r'<[^>]+>', ' ', ctx)))
        if not iso or iso.endswith('-00'): continue
        seen.add(url); items.append({'source': source, 'title': title, 'url': url, 'date': iso})
    return items[:limit]

SOURCES = [
    ('IEA', 'https://www.iea.org/news', r'iea\.org/(news|commentaries)/[a-z0-9-]{15,}'),
    ('Oil & Gas Journal', 'https://www.ogj.com', r'ogj\.com/.+/news/\d+/[a-z0-9-]+'),
]

def fetch_source(name, url, link_re):
    html_text = get(url)
    items = []
    feed = discover_feed(url, html_text)
    if feed:
        try: items = parse_feed(get(feed), name)
        except Exception as e: print(name, 'feed falló:', e)
    if len(items) < 2:
        items = parse_html(html_text, url, name, link_re)
    return items

def update_news():
    allitems = []
    for name, url, link_re in SOURCES:
        try:
            got = fetch_source(name, url, link_re)
            print(name, ':', len(got), 'titulares'); allitems += got[:4]
        except Exception as e:
            print(name, 'falló:', e)
    allitems = [i for i in allitems if re.match(r'\d{4}-\d{2}-\d{2}$', i['date'])]
    allitems.sort(key=lambda i: i['date'], reverse=True)
    allitems = allitems[:6]
    if len(allitems) < 4:
        print('Menos de 4 titulares válidos: se conservan las noticias anteriores'); return
    save('news.json', {'items': allitems,
                       'checked': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ')})

if __name__ == '__main__':
    os.makedirs(DATA, exist_ok=True)
    for fn in (update_market, update_news):
        try: fn()
        except Exception as e: print(fn.__name__, 'falló:', repr(e), file=sys.stderr)
