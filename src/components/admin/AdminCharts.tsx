"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const GOLD = "#cda214";
const TEAL = "#00897f";
const PIE = ["#00897f", "#cda214", "#6b8035", "#8a6a3a", "#1b2f5c", "#b06a2c"];

const tooltipStyle = {
  background: "#14201c",
  border: "1px solid rgba(243,233,226,.2)",
  borderRadius: 10,
  color: "#f3e9e2",
  fontSize: 12,
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-mono mb-4 text-[0.62rem] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
        {title}
      </h3>
      <div className="h-56 w-full">{children}</div>
    </div>
  );
}

export function AdminCharts({
  byDay,
  topProducts,
  byCity,
}: {
  byDay: { date: string; pedidos: number }[];
  topProducts: { name: string; cantidad: number }[];
  byCity: { city: string; pedidos: number }[];
}) {
  return (
    <div className="mb-10 grid gap-5 lg:grid-cols-3">
      <Card title="Pedidos por día (14 días)">
        <ResponsiveContainer>
          <BarChart data={byDay} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,233,226,.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(243,233,226,.5)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "rgba(243,233,226,.5)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(205,162,20,.08)" }} />
            <Bar dataKey="pedidos" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Productos más pedidos">
        <ResponsiveContainer>
          <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "rgba(243,233,226,.7)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,137,127,.1)" }} />
            <Bar dataKey="cantidad" fill={TEAL} radius={[0, 4, 4, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Pedidos por ciudad">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={byCity} dataKey="pedidos" nameKey="city" innerRadius={42} outerRadius={72} paddingAngle={3} stroke="none">
              {byCity.map((_, i) => (
                <Cell key={i} fill={PIE[i % PIE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#f3e9e2" }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
