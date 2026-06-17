import { type ReactNode } from "react";

interface ReviewInfoPanelProps {
  title: string;
  children: ReactNode;
}

export default function ReviewInfoPanel({ title, children }: ReviewInfoPanelProps) {
  return (
    <article className="rounded-xl border border-[#31466e] bg-[#273153] p-4 md:p-5">
      <h3 className="text-lg text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}
