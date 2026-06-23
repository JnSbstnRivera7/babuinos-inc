import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Logo } from "@/components/ui/Logo";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel — Babuinos Inc", robots: { index: false } };

interface OrderItem {
  name?: string;
  colorway?: string;
  size?: string;
  qty?: number;
}
interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string | null;
  phone: string | null;
  city: string | null;
  note: string | null;
  items: OrderItem[] | null;
}
interface WaitRow {
  id: string;
  created_at: string;
  email: string;
}

function fmt(d: string) {
  try {
    return new Date(d).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return d;
  }
}

export default async function AdminPage() {
  const store = await cookies();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "babuinos2026";
  const authed = store.get("b_admin")?.value === ADMIN_PASSWORD;

  if (!authed) return <AdminLogin />;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = url && key ? createClient(url, key) : null;

  let orders: OrderRow[] = [];
  let waitlist: WaitRow[] = [];
  let dbError = "";

  if (supabase) {
    const [o, w] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(300),
      supabase.from("waitlist").select("*").order("created_at", { ascending: false }).limit(300),
    ]);
    if (o.error || w.error) dbError = o.error?.message || w.error?.message || "";
    orders = (o.data as OrderRow[]) ?? [];
    waitlist = (w.data as WaitRow[]) ?? [];
  } else {
    dbError = "Supabase no configurado (faltan variables de entorno).";
  }

  return (
    <main className="jungle-bg min-h-[100svh] px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-cream/10 pb-5">
          <div className="flex items-center gap-4">
            <Logo tone="cream" className="h-9 w-auto" />
            <span className="font-condensed text-2xl text-cream">Panel</span>
          </div>
          <a
            href="/api/admin/logout"
            className="font-mono rounded-md border border-cream/25 px-4 py-2 text-[0.65rem] font-bold tracking-[0.1em] text-cream/70 uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Salir
          </a>
        </header>

        {dbError && (
          <p className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            ⚠️ {dbError}
          </p>
        )}

        {/* stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="glass rounded-xl p-5">
            <div className="font-condensed text-4xl text-[var(--accent)]">{orders.length}</div>
            <div className="font-mono mt-1 text-[0.6rem] tracking-[0.14em] text-cream/55 uppercase">
              Pedidos (intentos)
            </div>
          </div>
          <div className="glass rounded-xl p-5">
            <div className="font-condensed text-4xl text-[var(--accent)]">{waitlist.length}</div>
            <div className="font-mono mt-1 text-[0.6rem] tracking-[0.14em] text-cream/55 uppercase">
              Club (waitlist)
            </div>
          </div>
        </div>

        {/* orders */}
        <h2 className="font-condensed mb-3 text-2xl text-cream">Pedidos</h2>
        <div className="overflow-x-auto rounded-xl border border-cream/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream/[0.06] text-cream/70">
                {["Fecha", "Cliente", "Teléfono", "Ciudad", "Productos", "Nota"].map((h) => (
                  <th key={h} className="font-mono px-4 py-3 text-[0.6rem] tracking-[0.1em] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-cream/40">
                    Aún no hay pedidos.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-t border-cream/10 text-cream/85">
                    <td className="px-4 py-3 whitespace-nowrap text-cream/55">{fmt(o.created_at)}</td>
                    <td className="px-4 py-3 font-semibold">{o.customer_name || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {o.phone ? (
                        <a className="text-[var(--accent)] hover:underline" href={`https://wa.me/${o.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                          {o.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">{o.city || "—"}</td>
                    <td className="px-4 py-3 text-cream/70">
                      {(o.items ?? [])
                        .map((it) => `${it.name ?? "?"}${it.size ? ` (T:${it.size})` : ""} x${it.qty ?? 1}`)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-cream/55">{o.note || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* waitlist */}
        <h2 className="font-condensed mb-3 mt-10 text-2xl text-cream">Club Babuinos</h2>
        <div className="overflow-x-auto rounded-xl border border-cream/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream/[0.06] text-cream/70">
                <th className="font-mono px-4 py-3 text-[0.6rem] tracking-[0.1em] uppercase">Correo</th>
                <th className="font-mono px-4 py-3 text-[0.6rem] tracking-[0.1em] uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-cream/40">
                    Aún no hay suscriptores.
                  </td>
                </tr>
              ) : (
                waitlist.map((w) => (
                  <tr key={w.id} className="border-t border-cream/10 text-cream/85">
                    <td className="px-4 py-3">{w.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-cream/55">{fmt(w.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
