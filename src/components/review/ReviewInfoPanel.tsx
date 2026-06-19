import { type ReactNode } from "react";

interface ReviewInfoPanelProps {
  title: string;
  children: ReactNode;
}

export default function ReviewInfoPanel({ title, children }: ReviewInfoPanelProps) {
  return (
    <article className="rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-4 md:p-5">
      <h3 className="text-lg text-[var(--color-text-primary)]">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}
