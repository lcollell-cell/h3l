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
- `_headers`: encabezados de seguridad de produccion. Mantener la CSP alineada con las etiquetas meta de las paginas.
- `src/worker.js` y `src/report.js`: Worker de estadisticas. Recibe eventos anonimos en `/api/collect` (los envia `assets/h3l-stats.js`, sin cookies), los guarda en D1 (`h3l-stats`) y cada dia a las 08:00 (Argentina) manda por mail el reporte del dia anterior. Destinatario y remitente: variables `REPORT_TO` y `REPORT_FROM` en `wrangler.jsonc` (mantener `allowed_destination_addresses` igual a `REPORT_TO`).
- `assets/h3l-stats.js` esta incluido en `index.html`, `v2/index.html`, `v2/reservas.html` y `v2/dashboards.html`. Para excluir un navegador propio: abrir el sitio con `?h3l-notrack=1`. Para marcar un navegador del equipo (socios, dueño) como interno: abrir el sitio con `?h3l-equipo=1` (`=0` para quitar la marca). Esas visitas se guardan con el prefijo `interno|` en `host`, no entran en las cifras públicas y el reporte las resume en la sección "Tráfico del equipo" (métricas `interno_*`).
- Prueba del reporte en produccion: definir el secreto `REPORT_KEY` y hacer `POST /api/report-test` con el encabezado `x-report-key` (agregar `?preview=1` para ver el HTML sin enviar).
- Historial y base local: cada reporte guarda sus metricas en la tabla `metrics` de D1 (no vence a los 90 dias), adjunta el CSV `h3l_metricas_AAAA-MM-DD.csv` al mail y se puede bajar con `GET /api/export?from=&to=` (encabezado `x-report-key`, igual que `report-test`). `tools/importar_metricas.py` arma la base SQLite en la computadora del dueño (desde los CSV o con `--descargar`). Los `.sqlite` y los CSV no se suben al repo.
