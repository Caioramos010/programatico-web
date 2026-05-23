interface ReviewStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  valueClassName?: string;
}

export default function ReviewStatCard({
  title,
  value,
  subtitle,
  valueClassName = "text-white",
}: ReviewStatCardProps) {
  return (
    <article className="rounded-xl border border-[#31466e] bg-[#273153] px-4 py-3 md:px-5 md:py-4">
      <p className="text-base text-[#a8b5d4]">{title}</p>
      <p className={["mt-1 text-4xl font-medium leading-none", valueClassName].join(" ")}>{value}</p>
      <p className="mt-2 text-base text-[#7f8db0]">{subtitle}</p>
    </article>
  );
}
