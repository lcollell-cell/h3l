-- H3L · Suscripción de cursos (NO ACTIVO: ejecutar solo al pasar del modo simulación al cobro real).
-- Base D1 del Worker (binding DB). Los datos de tarjeta nunca se guardan: los maneja la pasarela.
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,              -- uuid
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,               -- nombre o razón social (para la factura)
  country TEXT NOT NULL,
  tax_id TEXT,                      -- CUIT / VAT / EIN del comprador
  address TEXT,
  created_at TEXT NOT NULL
);
-- Un acceso por curso. source: 'free' (hasta 3 por cuenta) o 'paid' (USD 20 cada uno).
CREATE TABLE IF NOT EXISTS entitlements (
  account_id TEXT NOT NULL REFERENCES accounts(id),
  course_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('free','paid')),
  order_id TEXT,
  granted_at TEXT NOT NULL,
  PRIMARY KEY (account_id, course_id)
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,              -- id propio (H3L-AAAA-NNNN)
  account_id TEXT NOT NULL REFERENCES accounts(id),
  course_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,    -- 2000 = USD 20,00
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,             -- 'pending' | 'paid' | 'refunded' | 'failed'
  provider TEXT NOT NULL,           -- pasarela elegida
  provider_ref TEXT UNIQUE,         -- id de la operación en la pasarela (idempotencia del webhook)
  invoice_no TEXT,                  -- nº de factura ARCA (CAE) una vez emitida
  invoice_cae TEXT,
  created_at TEXT NOT NULL,
  paid_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_account ON orders(account_id);
