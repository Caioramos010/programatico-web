import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface SubjectAccuracyItem {
  assunto: string;
  percentual: number;
  color: string;
}

interface ReviewSubjectAccuracyProps {
  data: SubjectAccuracyItem[];
}

export default function ReviewSubjectAccuracy({ data }: ReviewSubjectAccuracyProps) {
  return (
    <article className="h-full rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-4 md:p-5">
      <h3 className="text-lg text-[var(--color-text-primary)]">Taxa de acerto por assunto</h3>

      <div
        className={[
          "mt-4 flex max-h-[280px] flex-col gap-4 overflow-y-auto pr-2",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:rounded-full",
          "[&::-webkit-scrollbar-track]:bg-[#182132]",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-[#31425f]",
          "[&::-webkit-scrollbar-thumb:hover]:bg-[#3b4f72]",
        ].join(" ")}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#31425f #182132",
        }}
      >
        {data.length === 0 && (
          <p className="text-base text-[var(--color-text-muted)]">Sem dados ainda.</p>
        )}
        {data.map((item) => (
          <div
            key={item.assunto}
            className="grid grid-cols-[minmax(120px,220px)_minmax(0,1fr)_48px] items-center gap-3"
          >
            <p
              className="min-w-0 truncate text-base text-[var(--color-text-primary)]"
              title={item.assunto}
            >
              {item.assunto}
            </p>

            <div className="min-w-0">
              <div className="h-4 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[item]}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  barCategoryGap={0}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="assunto" hide />
                  <Bar
                    dataKey="percentual"
                    radius={[999, 999, 999, 999]}
                    barSize={8}
                    background={{ fill: "var(--color-gray-border)", radius: 999 }}
                    fill={item.color}
                  />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>

            <p className="text-right text-base leading-none text-[var(--color-text-muted)]">
              {item.percentual}%
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
