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
    <article className="h-full rounded-xl border border-[#31466e] bg-[#273153] p-4 md:p-5">
      <h3 className="text-lg text-white">Taxa de acerto por assunto</h3>

      <div className="mt-4 flex h-[240px] flex-col justify-center gap-5">
        {data.map((item) => (
          <div key={item.assunto} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-3">
            <p className="text-base text-white whitespace-nowrap">{item.assunto}</p>

            <div className="h-4 w-full">
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
                    background={{ fill: "#3a4665", radius: 999 }}
                    fill={item.color}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="flex h-4 items-center text-base leading-none text-[#8fa3cc]">{item.percentual}%</p>
          </div>
        ))}
      </div>
    </article>
  );
}
