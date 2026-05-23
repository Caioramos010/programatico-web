import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ActionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
}

export default function ActionCard({
  title,
  description,
  icon,
  selected = false,
  className = "",
  ...rest
}: ActionCardProps) {
  return (
    <button
      className={[
        "flex items-center gap-4 w-full p-4 rounded-xl text-left",
        "font-fredoka",
        "border-2 transition-all duration-200 ease-in-out",
        "cursor-pointer select-none",
        "hover:-translate-y-0.5 hover:shadow-lg",
        selected
          ? "bg-[var(--color-quiz-btn-hover)] border-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]"
          : "bg-[var(--color-quiz-btn)] border-[var(--color-quiz-btn-hover)] hover:bg-[var(--color-quiz-btn-hover)]",
        className,
      ].join(" ")}
      {...rest}
    >
      <span
        className={[
          "flex shrink-0 items-center justify-center",
          "h-12 w-12 rounded-lg text-xl",
          selected
            ? "bg-[var(--color-accent)] text-white"
            : "bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)]",
          "transition-colors duration-200",
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] truncate">
          {title}
        </span>
        <span className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-snug line-clamp-3">
          {description}
        </span>
      </div>

      {selected && (
        <span className="ml-auto shrink-0 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-accent-light)]" />
      )}
    </button>
  );
}
