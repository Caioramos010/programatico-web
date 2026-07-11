import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformancePoint {
  day: string;
  acertos: number;
  erros: number;
}

interface ReviewPerformanceChartProps {
  data: PerformancePoint[];
}

export default function ReviewPerformanceChart({ data }: ReviewPerformanceChartProps) {
  return (
    <article className="h-full rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-4 md:p-5">
      <h3 className="text-lg text-[var(--color-text-primary)]">Desempenho</h3>

      {data.length === 0 ? (
        <p className="mt-4 text-base text-[var(--color-text-muted)]">Sem dados ainda.</p>
      ) : (
        <div className="mt-4 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-gray-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-text-muted)" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} stroke="var(--color-text-muted)" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-card)",
                  border: "1px solid var(--color-gray-border)",
                  borderRadius: 12,
                  color: "var(--color-text-primary)",
                }}
                labelStyle={{ color: "var(--color-text-muted)" }}
              />
              <Legend wrapperStyle={{ color: "var(--color-accent-light)" }} />
              <Line
                type="monotone"
                dataKey="acertos"
                name="Acertos"
                stroke="var(--color-success)"
                strokeWidth={3}
                dot={{ r: 4.5, fill: "var(--color-success)" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="erros"
                name="Erros"
                stroke="var(--color-premium)"
                strokeWidth={3}
                dot={{ r: 4.5, fill: "var(--color-premium)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
