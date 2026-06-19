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
  valueClassName = "text-[var(--color-text-primary)]",
}: ReviewStatCardProps) {
  return (
    <article className="rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-4 py-3 md:px-5 md:py-4">
      <p className="text-base text-[var(--color-text-muted)]">{title}</p>
      <p className={["mt-1 text-4xl font-medium leading-none", valueClassName].join(" ")}>{value}</p>
      <p className="mt-2 text-base text-[var(--color-text-muted)]">{subtitle}</p>
    </article>
  );
}
