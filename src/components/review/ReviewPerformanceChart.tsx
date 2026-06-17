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
    <article className="h-full rounded-xl border border-[#31466e] bg-[#273153] p-4 md:p-5">
      <h3 className="text-lg text-white">Desempenho por dia</h3>

      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#3d4968" vertical={false} />
            <XAxis dataKey="day" stroke="#8d9ab8" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} stroke="#8d9ab8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#142748",
                border: "1px solid #31466e",
                borderRadius: 12,
                color: "#fff",
              }}
              labelStyle={{ color: "#a7b5d7" }}
            />
            <Legend wrapperStyle={{ color: "#5aa4ff" }} />
            <Line
              type="monotone"
              dataKey="acertos"
              name="Acertos"
              stroke="#5aa4ff"
              strokeWidth={3}
              dot={{ r: 4.5, fill: "#5aa4ff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="erros"
              name="Erros"
              stroke="#f27584"
              strokeWidth={3}
              dot={{ r: 4.5, fill: "#f27584" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
