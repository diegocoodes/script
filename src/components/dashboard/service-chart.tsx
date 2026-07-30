"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ServiceChart({
  data,
}: {
  data: Array<{ day: string; entradas: number; concluidas: number }>;
}) {
  return (
    <figure>
      <div
        className="h-[260px] w-full"
        role="img"
        aria-label="Gráfico comparando entradas e serviços concluídos na semana"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="entradas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066ff" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="concluidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b8a9" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#00b8a9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8edf4" strokeDasharray="4 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #dce3ed",
                boxShadow: "0 12px 30px rgb(15 23 42 / 0.08)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="entradas"
              name="Entradas"
              stroke="#0066ff"
              strokeWidth={2.5}
              fill="url(#entradas)"
            />
            <Area
              type="monotone"
              dataKey="concluidas"
              name="Concluídas"
              stroke="#00b8a9"
              strokeWidth={2.5}
              fill="url(#concluidas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        Fluxo diário de equipamentos recebidos e serviços concluídos.
      </figcaption>
    </figure>
  );
}
