#!/usr/bin/env python3
"""Genera las portadas por idioma: /es/, /en/, /fr/ y /pt/ (cada una con su URL propia).

Parte de v2/index.html y de los diccionarios de v2/lang-index.js (via scripts/dump_i18n.js, necesita Node).
Cada pagina sale con el texto ya traducido en el HTML (no depende de JavaScript), titulo, descripcion,
Open Graph, canonical propio y hreflang completo. Tambien regenera sitemap.xml.

Uso: python3 scripts/build_idiomas.py [--check]  (--check solo verifica que las portadas esten al dia)        (volver a correrlo cada vez que cambie v2/index.html o v2/lang-index.js)
Requiere: pip install beautifulsoup4
"""
import json, re, subprocess, sys
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://www.h3lglobalenergy.com'
LANGS = ['es', 'en', 'fr', 'pt']
ABS = re.compile(r'^(?:[a-z][a-z0-9+.-]*:|//|/|#|\.{1,2}/|\?)', re.I)
OG_LOCALE = {'es': 'es_ES', 'en': 'en_US', 'fr': 'fr_FR', 'pt': 'pt_BR'}


def dictionaries():
    out = subprocess.run(['node', str(ROOT / 'scripts' / 'dump_i18n.js')], check=True, capture_output=True, text=True).stdout
    return json.loads(out)


def alternates(soup, lang):
    """Reemplaza el hreflang x-default por el juego completo de alternativas."""
    for t in soup.find_all('link', rel='alternate'):
        if t.get('hreflang'):
            t.decompose()
    canon = soup.find('link', rel='canonical')
    canon['href'] = f'{SITE}/{lang}/'
    anchor = canon
    for code, href in [(c, f'{SITE}/{c}/') for c in LANGS] + [('x-default', f'{SITE}/es/')]:
        tag = soup.new_tag('link', rel='alternate', hreflang=code, href=href)
        anchor.insert_after(tag)
        anchor = tag


def build(lang, src_html, D):
    d = D[lang]
    soup = BeautifulSoup(src_html, 'html.parser')
    soup.html['lang'] = lang
    for a_ in soup.select('a.logo[href="index.html"]'):
        a_['href'] = './'
    # Las rutas relativas de la plantilla (v2/...) se reescriben para /xx/ (sin <base>: asi tambien andan bajo /h3l/ en GitHub Pages).
    for tag in soup.find_all(True):
        for attr in ('href', 'src', 'poster'):
            if tag.get(attr) and not ABS.match(tag[attr]):
                tag[attr] = '../v2/' + tag[attr]
    for st in soup.find_all('style'):
        if st.string:
            st.string = re.sub(r"url\((?!['\"]?(?:data:|https?:|/|#|\.\./))", 'url(../v2/', st.string)
    for el in soup.select('[data-i18n]'):
        el.string = d[el['data-i18n']]
    for el in soup.select('[data-i18n-html]'):
        el.clear()
        el.append(BeautifulSoup(d[el['data-i18n-html']], 'html.parser'))
    for el in soup.select('[data-i18n-attr]'):
        for pair in el['data-i18n-attr'].split(';'):
            if ':' in pair:
                a, k = pair.split(':', 1)
                el[a] = d[k]
    title, desc = d['i.title'], d['i.desc']
    for sel, attr in [('meta[property="og:title"]', 'content'), ('meta[name="twitter:title"]', 'content')]:
        t = soup.select_one(sel)
        if t is not None and lang != 'es':
            t[attr] = title
    for sel in ['meta[property="og:description"]', 'meta[name="twitter:description"]']:
        t = soup.select_one(sel)
        if t is not None and lang != 'es':
            t['content'] = desc
    soup.select_one('meta[property="og:url"]')['content'] = f'{SITE}/{lang}/'
    soup.select_one('meta[property="og:locale"]')['content'] = OG_LOCALE[lang]
    alts = soup.select('meta[property="og:locale:alternate"]')
    others = [OG_LOCALE[c] for c in LANGS if c != lang]
    for t, v in zip(alts, others):
        t['content'] = v
    alternates(soup, lang)
    out = str(soup)
    return out.replace('<html', '<!-- ARCHIVO GENERADO por scripts/build_idiomas.py desde v2/index.html: no editar a mano. -->\n<html', 1)


def sitemap():
    pages = ['v2/reservas.html', 'v2/dashboards.html', 'calculadoras/app.html', 'calculadoras/flujo.html', 'privacidad.html']
    old = (ROOT / 'sitemap.xml').read_text(encoding='utf-8')
    dates = dict(re.findall(r'<loc>https://www\.h3lglobalenergy\.com/([^<]*)</loc><lastmod>([^<]*)</lastmod>', old))
    def git_date(*files):
        try:
            r = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', *files], cwd=ROOT, capture_output=True, text=True).stdout.strip()
            return r or date.today().isoformat()
        except Exception:
            return date.today().isoformat()
    from datetime import date
    today = git_date('v2/index.html', 'v2/lang-index.js', 'v2/i18n.js')
    rows = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for l in LANGS:
        rows.append(f'<url><loc>{SITE}/{l}/</loc><lastmod>{today}</lastmod>')
        for c in LANGS:
            rows.append(f'<xhtml:link rel="alternate" hreflang="{c}" href="{SITE}/{c}/"/>')
        rows.append(f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/es/"/></url>')
    for p in pages:
        rows.append(f'<url><loc>{SITE}/{p}</loc><lastmod>{dates.get(p, today)}</lastmod></url>')
    rows.append('</urlset>')
    (ROOT / 'sitemap.xml').write_text('\n'.join(rows) + '\n', encoding='utf-8')


def main():
    check = '--check' in sys.argv
    D = dictionaries()
    src = (ROOT / 'v2' / 'index.html').read_text(encoding='utf-8')
    bad = []
    for l in LANGS:
        out = ROOT / l / 'index.html'
        html = build(l, src, D)
        if check:
            if not out.exists() or out.read_text(encoding='utf-8') != html:
                bad.append(str(out.relative_to(ROOT)))
            continue
        out.parent.mkdir(exist_ok=True)
        out.write_text(html, encoding='utf-8')
        print('generado', out.relative_to(ROOT))
    if check:
        if bad:
            sys.exit('Desactualizadas (correr python3 scripts/build_idiomas.py): ' + ', '.join(bad))
        print('portadas por idioma al dia')
        return
    sitemap()
    print('sitemap.xml actualizado')


if __name__ == '__main__':
    sys.exit(main())
