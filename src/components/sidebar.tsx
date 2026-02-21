import { type SVGProps, type ReactElement, useState } from "react";
import { Home, Pin, User } from "./icons";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface NavItem {
  label: string;
  icon: IconComponent;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Aprender", icon: Home, path: "/aprender" },
  { label: "Missões", icon: Pin, path: "/missoes" },
  { label: "Perfil", icon: User, path: "/perfil" },
];

export default function Sidebar() {
  const [active, setActive] = useState("/aprender");

  return (
    <>
      {/* ── Mobile: barra inferior fixa ── */}
      <nav
        className={[
          "fixed bottom-0 left-0 z-50 w-full",
          "flex items-center justify-around",
          "bg-[var(--color-bg-card)] border-t border-[var(--color-gray-border)]",
          "py-2 font-fredoka",
          "md:hidden",
        ].join(" ")}
      >
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = active === path;
          return (
            <button
              key={path}
              onClick={() => setActive(path)}
              className={[
                "flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer",
                "transition-colors duration-200",
                isActive
                  ? "text-[var(--color-accent)] border-t-4 border-[var(--color-accent)] -mt-1"
                  : "text-[var(--color-text-muted)] border-t-4 border-transparent -mt-1 hover:text-white",
              ].join(" ")}
            >
              <Icon className="w-6 h-6 fill-current" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Desktop: sidebar lateral fixa ── */}
      <aside
        className={[
          "hidden md:flex",
          "fixed left-0 top-0 z-50 h-screen w-20 lg:w-56",
          "flex-col items-center lg:items-stretch",
          "bg-[var(--color-bg-card)] border-r border-[var(--color-gray-border)]",
          "py-6 font-fredoka",
        ].join(" ")}
      >
        {/* Logo / Título */}
        <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-5 gap-2">
          <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-wide hidden lg:block">
            PROGRAMÁTICO
          </span>
          <span className="text-lg font-bold text-[var(--color-text-primary)] lg:hidden">P</span>
        </div>

        {/* Itens de navegação */}
        <nav className="flex flex-col gap-1 w-full flex-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = active === path;
            return (
              <button
                key={path}
                onClick={() => setActive(path)}
                className={[
                  "flex items-center gap-3 w-full cursor-pointer",
                  "py-3 px-3 lg:px-5",
                  "transition-all duration-200",
                  "justify-center lg:justify-start",
                  isActive
                    ? [
                        "text-[var(--color-accent)]",
                        "border-l-4 border-[var(--color-accent)]",
                        "bg-[var(--color-quiz-btn-hover)]",
                      ].join(" ")
                    : [
                        "text-[var(--color-text-muted)]",
                        "border-l-4 border-transparent",
                        "hover:text-white hover:bg-white/5",
                      ].join(" "),
                ].join(" ")}
              >
                <Icon className="w-6 h-6 fill-current shrink-0" />
                <span className="text-sm font-medium hidden lg:block">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
