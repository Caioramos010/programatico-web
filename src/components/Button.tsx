import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "neutral" | "success" | "error" | "white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    "bg-[var(--color-accent)]",
    "border-b-[var(--color-accent-dark,#0d4a3b)]",
    "hover:bg-[var(--color-accent-light)]",
    "text-white",
  ].join(" "),

  neutral: [
    "bg-[var(--color-gray-border)]",
    "border-b-[#2b3755]",
    "hover:bg-[#475782]",
    "text-white",
  ].join(" "),

  success: [
    "bg-[var(--color-success)]",
    "border-b-[#3d6933]",
    "hover:bg-[#65a554]",
    "text-white",
  ].join(" "),

  error: [
    "bg-[var(--color-error)]",
    "border-b-[#5e1113]",
    "hover:bg-[#a01e21]",
    "text-white",
  ].join(" "),

  white: [
    "bg-white",
    "border-b-[#d1d5db]",
    "hover:bg-gray-50",
    "text-gray-700",
    "shadow-md",
  ].join(" "),
};

export default function Button({
  variant = "primary",
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base = [
    "inline-flex items-center justify-center gap-2",
    "px-6 py-3",
    "rounded-xl",
    "font-fredoka font-semibold text-base uppercase tracking-wider",
    "border-b-4",
    "transition-all duration-150 ease-in-out",
    "select-none cursor-pointer",
    "active:translate-y-[2px] active:border-b-transparent",
  ].join(" ");

  const disabledStyles =
    "bg-[var(--color-gray-review)] border-b-[#8888884d] text-[var(--color-text-muted)] cursor-not-allowed opacity-60 active:translate-y-0 active:border-b-4";

  return (
    <button
      disabled={disabled}
      className={`${base} ${disabled ? disabledStyles : variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
