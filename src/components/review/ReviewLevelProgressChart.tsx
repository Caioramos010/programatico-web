import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ReviewLevelProgressChartProps {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
}

export default function ReviewLevelProgressChart({
  currentLevel,
  currentXp,
  nextLevelXp,
}: ReviewLevelProgressChartProps) {
  const progress = Math.max(0, Math.min(100, Math.round((currentXp / nextLevelXp) * 100)));
  const data = [{ label: "progresso", percentual: progress }];

  return (
    <div className="w-full max-w-sm rounded-xl bg-[var(--color-bg-card)] px-3 py-3">
      <div className="flex items-center justify-between text-base">
        <span className="text-[var(--color-text-muted)]">Nível {currentLevel}</span>
        <span className="text-[var(--color-text-muted)]">Nível {currentLevel + 1}</span>
      </div>
      <div className="mt-2 h-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="label" hide />
            <Bar
              dataKey="percentual"
              radius={[999, 999, 999, 999]}
              barSize={10}
              background={{ fill: "var(--color-gray-border)", radius: 999 }}
              fill="var(--color-accent-light)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-base text-[var(--color-text-primary)]">{progress}%</p>
    </div>
  );
}
