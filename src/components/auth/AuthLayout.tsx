import { X } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  variant?: "user" | "admin";
  adminBadge?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  variant = "user",
  adminBadge = false,
  onClose,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={
        variant === "admin"
          ? {
              background:
                "linear-gradient(to bottom right, var(--color-admin-bg-start), var(--color-admin-bg-end))",
            }
          : { background: "var(--color-bg-primary)" }
      }
    >
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          aria-label="Fechar"
        >
          <X size={24} strokeWidth={2} />
        </button>
      )}

      {/* Glass card */}
      <div
        className="w-full max-w-[400px] mx-4 rounded-2xl p-8 shadow-xl"
        style={{
          background: "var(--color-login-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--color-login-border)",
        }}
      >
        <h1
          className={[
            "text-3xl font-semibold text-center text-[var(--color-text-primary)]",
            adminBadge ? "mb-1" : subtitle ? "mb-2" : "mb-6",
          ].join(" ")}
        >
          {title}
        </h1>

        {adminBadge && (
          <p
            className={[
              "text-base font-semibold uppercase tracking-widest text-[var(--color-premium)] text-center",
              subtitle ? "mb-4" : "mb-6",
            ].join(" ")}
          >
            Administrador
          </p>
        )}

        {subtitle && (
          <p className="text-base text-[var(--color-text-secondary)] text-center mb-6 leading-relaxed">
            {subtitle}
          </p>
        )}

        {children}

        {footer}
      </div>
    </div>
  );
}
