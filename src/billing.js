/* H3L · Suscripción de cursos: lógica del servidor para el cobro REAL. NO ESTÁ CONECTADA a src/worker.js ni a wrangler.jsonc
   (el sitio funciona hoy en modo simulación, ver cursos/subs.js y docs/SUSCRIPCION.md). Para activarla: elegir la pasarela, crear los secretos,
   aplicar sql/billing.sql y enrutar estas funciones desde worker.js (ver la lista de verificación en el documento).
   Las partes específicas de cada pasarela (URL de la API y formato del webhook) están aisladas en `provider` y deben confirmarse con su documentación. */

export const PRICE_CENTS = 2500, FREE_LIMIT = 2, CURRENCY = 'USD';

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
function safeEq(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

/* firma HMAC-SHA256 en hexadecimal del cuerpo crudo (formato habitual de los webhooks; confirmar con la pasarela elegida) */
export async function verifySignature(rawBody, signatureHex, secret) {
  if (!secret || !signatureHex) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)));
  return safeEq(mac, String(signatureHex).trim().toLowerCase());
}

/* cursos gratis: máximo FREE_LIMIT por cuenta, elegidos una sola vez */
export async function grantFree(env, accountId, courseIds) {
  const ids = [...new Set(courseIds)];
  const have = await env.DB.prepare("SELECT COUNT(*) n FROM entitlements WHERE account_id=?1 AND source='free'").bind(accountId).first();
  if ((have?.n || 0) + ids.length > FREE_LIMIT) return { ok: false, error: 'free_limit' };
  const now = new Date().toISOString();
  await env.DB.batch(ids.map((c) => env.DB.prepare("INSERT OR IGNORE INTO entitlements(account_id,course_id,source,granted_at) VALUES(?1,?2,'free',?3)").bind(accountId, c, now)));
  return { ok: true };
}

/* webhook de pago aprobado: idempotente por provider_ref. Devuelve la orden para emitir el comprobante y la factura */
export async function onPaid(env, { orderId, providerRef, amountCents, currency }) {
  const o = await env.DB.prepare('SELECT * FROM orders WHERE id=?1').bind(orderId).first();
  if (!o) return { ok: false, error: 'order_not_found' };
  if (o.status === 'paid') return { ok: true, duplicate: true, order: o };
  if (amountCents !== o.amount_cents || currency !== o.currency) return { ok: false, error: 'amount_mismatch' };   // nunca habilitar si el monto no coincide
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("UPDATE orders SET status='paid',provider_ref=?2,paid_at=?3 WHERE id=?1").bind(orderId, providerRef, now),
    env.DB.prepare("INSERT OR REPLACE INTO entitlements(account_id,course_id,source,order_id,granted_at) VALUES(?1,?2,'paid',?3,?4)").bind(o.account_id, o.course_id, orderId, now),
  ]);
  return { ok: true, order: { ...o, status: 'paid', paid_at: now } };
}

export async function entitlements(env, accountId) {
  const r = await env.DB.prepare('SELECT course_id, source FROM entitlements WHERE account_id=?1').bind(accountId).all();
  return r.results || [];
}
