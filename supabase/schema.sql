-- ════════════════════════════════════════════════════════════════════
-- BABUINOS INC — todo el esquema de Supabase, en un solo pegue
--
-- Correr en el SQL Editor del proyecto (cuenta PERSONAL). Es idempotente:
-- se puede correr varias veces sin dañar nada.
--
-- Sirve para montar un proyecto nuevo desde cero. Después de crearlo hay que
-- actualizar en DOS lados:
--   · local  → .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
--   · Vercel → las mismas dos env vars del proyecto babuinos-inc (production)
-- ════════════════════════════════════════════════════════════════════

-- ── 1. Pedidos ──────────────────────────────────────────────────────
-- Lo que escribe POST /api/checkout (best-effort: si falla, la venta sigue
-- por WhatsApp igual). Las columnas tienen que llamarse EXACTAMENTE así:
-- PostgREST no ignora columnas desconocidas, falla el insert completo.
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  customer_name text,
  phone         text,
  city          text,
  note          text,
  items         jsonb
);

-- ── 2. Club Babuinos (lista de espera) ──────────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text unique
);

-- ── 3. Tallaje real, editable en /admin ─────────────────────────────
-- Una fila por pieza y talla:
--   · fila que NO existe → esa talla no existe para la pieza (no se muestra)
--   · stock = 0          → existe pero agotada (sale tachada)
--   · stock = n          → n unidades, y el carrito no deja pedir más
-- Mientras una pieza no tenga filas, la tienda usa el tallaje provisional
-- de src/lib/products.ts (TALLAS_STD), así que nada se rompe.
create table if not exists public.product_stock (
  product_id text        not null,
  size       text        not null,
  stock      integer     not null default 0 check (stock >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_id, size)
);

-- ── Seguridad ───────────────────────────────────────────────────────
-- Todo entra por el servidor con la service role, que salta RLS. RLS prendido
-- y SIN políticas = desde el navegador no se lee ni se escribe nada.
alter table public.orders        enable row level security;
alter table public.waitlist      enable row level security;
alter table public.product_stock enable row level security;

-- ── Comprobar ───────────────────────────────────────────────────────
-- select count(*) from public.orders;
-- select count(*) from public.waitlist;
-- select product_id, size, stock from public.product_stock order by 1, 2;
