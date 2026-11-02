# Suscripción a Cursos Online H3L (2 cursos gratis + USD 25 por curso)

**Estado: SIMULACIÓN.** No hay cobro ni factura real. Todo lo que se ve en `cursos/suscripcion.html` es de ejemplo y queda en el navegador de quien lo prueba.

## Regla comercial implementada
- Cada cuenta elige **2 cursos gratis** (se confirman una sola vez).
- Cada curso adicional se desbloquea por **USD 25** (pago único, acceso permanente).
- Sin simulación activa, **todos los cursos siguen abiertos**. La simulación se activa en `suscripcion.html` (botón) o con `?demo=1`; se apaga con `?demo=0`.

## Cómo mostrarla a los socios
1. Abrir `…/cursos/suscripcion.html` y pulsar **Activar simulación**.
2. Paso 1: cargar cuenta y datos de facturación (nombre o razón social, email, país, identificación fiscal, domicilio).
3. Paso 2: elegir 2 cursos gratis y confirmar. En el catálogo aparecen las etiquetas *Gratis* / *USD 25* / *Desbloqueado*, y un curso bloqueado muestra la pantalla de acceso.
4. Paso 3: desbloquear otro curso. Tarjeta de prueba `4242 4242 4242 4242` (aprobada); terminada en `0002` simula un rechazo. No se envía ningún dato de tarjeta a ningún lado.
5. Paso 4: ver o descargar el **comprobante de ejemplo** (sin valor fiscal).
6. *Borrar datos de la simulación* deja todo en cero para repetir la demo.

## Flujo real (cuando se active)
1. Cuenta (email + datos de facturación) guardada en el servidor (D1: `sql/billing.sql`).
2. Los 2 cursos gratis se registran como `entitlements` con `source='free'` (máximo 2, `grantFree` en `src/billing.js`).
3. Al desbloquear un curso se crea una orden `pending` y se redirige al **checkout alojado de la pasarela** (los datos de tarjeta nunca pasan por el sitio).
4. La pasarela avisa por **webhook firmado**; el servidor verifica la firma (`verifySignature`), comprueba que **monto y moneda coincidan** y recién ahí habilita el curso (`onPaid`, idempotente por `provider_ref`).
5. Se envía el comprobante al comprador y se emite la **factura electrónica de ARCA** (ver abajo); se guardan nº y CAE en `orders`.
6. El acceso queda ligado a la cuenta (no al navegador), válido en todos sus dispositivos.

`src/billing.js` y `sql/billing.sql` están escritos y probados con datos simulados (firma, límite de 2 gratis, monto distinto, pago duplicado), pero **no están conectados** a `src/worker.js` ni a `wrangler.jsonc`.

## Cómo cobrar y facturar correctamente (investigación, a validar con el contador)
- **Stripe:** según una comparativa de 2026, una empresa argentina **no puede abrir cuenta directa** y necesita una sociedad en EE. UU. (LLC) ([develop Argentina](https://developargentina.com/comparativas/stripe-vs-mercadopago-vs-todoPago-2026)).
- **Mercado Pago:** orientado a ventas locales en pesos; sirve si se vende a compradores argentinos, no como cobro principal en USD a clientes del exterior (misma fuente).
- **Merchant of Record (p. ej. Lemon Squeezy):** cobra al comprador, se ocupa de los impuestos de venta del exterior y paga a H3L; su documentación lista a **Argentina entre los países con pago por transferencia bancaria** ([Lemon Squeezy](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)). Es el candidato más simple para empezar. Su comisión publicada ronda el 5 % + USD 0,50 por venta (verificar en su sitio antes de decidir). **Paddle** es la alternativa similar: no verifiqué si paga a cuentas argentinas.
- **Factura en Argentina:** si el servicio se usa en el exterior corresponde **Factura E (exportación de servicios)**: sin IVA, con CUIT, clave fiscal nivel 3, servicio *Comprobantes en línea* y un punto de venta habilitado para exportación; el tipo de cambio es el del Banco Nación del día hábil anterior (RG 5616/2024) ([Contablix](https://contablix.ar/blog/factura-e-exportacion-servicios-2026)). Lo exportado cuenta para los ingresos brutos y, si H3L es monotributista, para el tope de categoría. Los bancos y proveedores de pago informan las acreditaciones a ARCA, por lo que **cada cobro debe quedar respaldado por un comprobante**. Hay también reglas de ingreso y liquidación de divisas: el plazo es de 20 días hábiles.
- **A definir con el contador:** a quién se factura cuando interviene un Merchant of Record (al comprador final o a la plataforma), tratamiento de compradores locales (IVA), y alta de un punto de venta de exportación. Hay servicios que automatizan la Factura E por API; conviene evaluarlos una vez elegida la pasarela.

## Lista de verificación para activar el cobro real
- [ ] Elegir pasarela y crear la cuenta de H3L (datos fiscales reales).
- [ ] Contador: esquema de facturación y punto de venta de exportación.
- [ ] Secretos de Cloudflare: clave de la API y secreto del webhook de la pasarela.
- [ ] Aplicar `sql/billing.sql` en D1; enrutar `/api/checkout`, `/api/webhook` y `/api/me` en `src/worker.js` usando `src/billing.js`.
- [ ] Login de cuenta (enlace por email) para ligar el acceso a la persona.
- [ ] Cambiar `subs.js` de `localStorage` a los endpoints y quitar los rótulos de simulación.
- [ ] Textos legales: términos, política de reembolsos, privacidad y datos fiscales del vendedor en el comprobante.
- [ ] Probar con el modo de prueba de la pasarela y con un pago real de monto mínimo.
- [ ] Aprobación del dueño en el chat antes de pasar a `main`.
