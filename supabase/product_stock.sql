-- ════════════════════════════════════════════════════════════════════
-- BABUINOS INC — tallaje real editable desde /admin
--
-- Pegar TAL CUAL en el SQL Editor del proyecto de Supabase (cuenta
-- personal). Se puede correr varias veces sin dañar nada.
--
-- Qué guarda: una fila por pieza y talla.
--   · fila que NO existe → esa talla no existe para la pieza (no se muestra)
--   · stock = 0          → existe pero agotada (sale tachada)
--   · stock = n          → n unidades, y el carrito no deja pedir más
--
-- Mientras una pieza no tenga filas, la tienda usa el tallaje provisional
-- de src/lib/products.ts (TALLAS_STD), así que nada se rompe.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.product_stock (
  product_id text        not null,
  size       text        not null,
  stock      integer     not null default 0 check (stock >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_id, size)
);

-- Solo el servidor entra (usa la service role, que salta RLS). RLS prendido y
-- SIN políticas = nadie puede leer ni escribir esto desde el navegador.
alter table public.product_stock enable row level security;

-- Comprobar:
--   select product_id, size, stock from public.product_stock order by 1, 2;
