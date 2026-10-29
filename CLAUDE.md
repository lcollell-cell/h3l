# H3L Global Energy: reglas de trabajo del repositorio

## Ambientes

- **Desarrollo y prueba: GitHub.** Todo cambio se hace en la rama `develop`. Esa rama se publica en GitHub Pages (URL de prueba) para que el dueño la revise.
- **Produccion: Cloudflare.** Cloudflare despliega solo desde la rama `main` en https://www.h3lglobalenergy.com. El dominio no se sirve desde GitHub Pages.

## Reglas

1. Nunca hacer commit ni push directo a `main` sin que el dueño lo apruebe en el chat. Los cambios pasan por `develop` y luego por merge (o pull request) a `main`.
2. El workflow `.github/workflows/update-data.yml` actualiza `data/` en `main` todos los dias habiles. Es la unica excepcion permitida. Antes de trabajar, traer esos cambios a `develop` con `git merge origin/main`.
3. No tocar `CNAME` ni la configuracion de dominio sin instruccion expresa.
4. No incluir nombres de los socios en el sitio ni en el brochure.
5. El contenido (noticias, eventos, precios, cifras) debe ser real y verificado. No inventar ni simular. Lo que sea demo debe decir que es ejemplo.
6. Los textos del sitio estan en 4 idiomas (es, en, fr, pt): todo cambio de texto se hace en los cuatro.
7. Al cerrar una version para registro (INPI o DNDA), crear un tag con fecha en `main` (por ejemplo `registro-AAAA-MM`).

## Archivos de infraestructura

- `wrangler.jsonc` y `.assetsignore`: configuracion del despliegue en Cloudflare.
- `_headers`: encabezados de seguridad de produccion. Mantener la CSP alineada con las etiquetas meta de las paginas. La CSP usa `script-src 'self'` (sin `'unsafe-inline'` para bloques `<script>`; solo se permiten los atributos `onclick=` con `script-src-attr`): no agregar scripts en linea, ponerlos en archivos `.js` (los bloques que habia estan en `assets/inline/`, con el hash en el nombre; si se edita uno, renombrarlo con el hash nuevo para evitar cache).
- `src/worker.js` y `src/report.js`: Worker de estadisticas. Recibe eventos anonimos en `/api/collect` (los envia `assets/h3l-stats.js`, sin cookies), los guarda en D1 (`h3l-stats`) y cada dia a las 08:00 (Argentina) manda por mail el reporte del dia anterior. El mail se envia con Resend (plan gratuito, 100 por dia): secreto `RESEND_API_KEY`, dominio verificado en Resend. Destinatario y remitente: variables `REPORT_TO` y `REPORT_FROM` en `wrangler.jsonc`. Si algun dia se pasa a Workers Paid, se puede volver al binding `send_email` de Cloudflare (el codigo lo usa si no hay `RESEND_API_KEY`; ahi `allowed_destination_addresses` debe ser igual a `REPORT_TO`).
- `assets/h3l-stats.js` esta incluido en `index.html`, `v2/index.html`, `v2/reservas.html` y `v2/dashboards.html`. Para excluir un navegador propio: abrir el sitio con `?h3l-notrack=1`. Para marcar un navegador del equipo (socios, dueño) como interno: abrir el sitio con `?h3l-equipo=1` (`=0` para quitar la marca). Esas visitas se guardan con el prefijo `interno|` en `host`, no entran en las cifras públicas y el reporte las resume en la sección "Tráfico del equipo" (métricas `interno_*`).
- Prueba del reporte en produccion: definir el secreto `REPORT_KEY` y hacer `POST /api/report-test` con el encabezado `x-report-key` (agregar `?preview=1` para ver el HTML sin enviar).
- Historial y base local: cada reporte guarda sus metricas en la tabla `metrics` de D1 (no vence a los 90 dias), adjunta el CSV `h3l_metricas_AAAA-MM-DD.csv` al mail y se puede bajar con `GET /api/export?from=&to=` (encabezado `x-report-key`, igual que `report-test`). `tools/importar_metricas.py` arma la base SQLite en la computadora del dueño (desde los CSV o con `--descargar`). Los `.sqlite` y los CSV no se suben al repo.

## Idiomas y videos

- **Portadas por idioma:** `/es/`, `/en/`, `/fr/` y `/pt/` son archivos generados (no editar a mano). Salen de `v2/index.html` y de los textos de `v2/lang-index.js` con `python3 scripts/build_idiomas.py` (necesita Node y `pip install beautifulsoup4`). Correrlo cada vez que cambie alguno de esos dos archivos y subir tambien las carpetas generadas y `sitemap.xml`. Cada una lleva canonical propio y hreflang es/en/fr/pt y x-default (`/es/`); la raiz y `v2/` tienen canonical `/es/`. `python3 scripts/build_idiomas.py --check` verifica que las portadas esten al dia (correrlo antes de pasar a main). `index.html` (raiz) redirige a `/{idioma}/` segun el idioma guardado o del navegador, salvo con `?go=` o `?stay`. `v2/` queda como plantilla (su canonical apunta a `/es/`).
- **Videos:** `VIDEO_BASE` en `assets/site.js` indica de donde salen los mp4 (vacio = `media/`). Para usar el bucket R2: subirlos con `tools/subir_videos_r2.py` y correr `python3 scripts/configurar_videos.py https://media.h3lglobalenergy.com/` (fija la direccion y habilita ese origen en `media-src` de la CSP en todos los archivos). Volver a local: `--local`. Los mp4 ya NO estan en el repo (viven en el bucket R2 `h3l-media`; el historial de git conserva las versiones viejas). Guardar una copia de los originales fuera del repo: para subir o reemplazar videos usar `tools/subir_videos_r2.py --bucket h3l-media --carpeta RUTA`. `configurar_videos.py --local` ya no sirve salvo que se restauren los mp4 en `media/`. Los posters (jpg) se sirven siempre desde `media/`. Si se reemplaza un video, subir con el mismo nombre y pasar `--version N`.
