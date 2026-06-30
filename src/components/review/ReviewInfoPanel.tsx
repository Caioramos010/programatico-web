import { type ReactNode } from "react";

interface ReviewInfoPanelProps {
  title: string;
  children: ReactNode;
  contentClassName?: string;
}

export default function ReviewInfoPanel({ title, children, contentClassName = "" }: ReviewInfoPanelProps) {
  return (
    <article className="flex h-[360px] min-h-0 flex-col rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-4 md:h-[380px] md:p-5">
      <h3 className="text-lg text-[var(--color-text-primary)]">{title}</h3>
      <div
        className={[
          "mt-4 min-h-0 flex-1 overflow-y-auto pr-2",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:rounded-full",
          "[&::-webkit-scrollbar-track]:bg-[#182132]",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-[#31425f]",
          "[&::-webkit-scrollbar-thumb:hover]:bg-[#3b4f72]",
          contentClassName,
        ].join(" ")}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#31425f #182132",
        }}
      >
        {children}
      </div>
    </article>
  );
}
