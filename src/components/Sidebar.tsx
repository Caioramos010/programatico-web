import { type SVGProps, type ReactElement, useState } from "react";
import {
  Home,
  Book,
  Pin,
  Calendar,
  Crown,
  User,
  Settings,
  Notification,
} from "./icons";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface NavItem {
  label: string;
  icon: IconComponent;
  path: string;
  premium?: boolean;
}

const mainNav: NavItem[] = [
  { label: "APRENDER", icon: Home, path: "/aprender" },
  { label: "PRATICAR", icon: Book, path: "/praticar" },
  { label: "REVISAR", icon: Pin, path: "/revisar" },
  { label: "MISSÕES", icon: Calendar, path: "/missoes" },
  { label: "SEJA ROOT", icon: Crown, path: "/seja-root", premium: true },
];

const bottomNav: NavItem[] = [
  { label: "PERFIL", icon: User, path: "/perfil" },
  { label: "CONFIGURAÇÕES", icon: Settings, path: "/configuracoes" },
  { label: "NOTIFICAÇÕES", icon: Notification, path: "/notificacoes" },
];

export default function Sidebar() {
  const [active, setActive] = useState("/aprender");

  const renderItem = ({ label, icon: Icon, path, premium }: NavItem) => {
    const isActive = active === path;

    if (premium) {
      return (
        <button
          key={path}
          onClick={() => setActive(path)}
          className={[
            "flex items-center gap-3 w-full cursor-pointer",
            "py-4 px-5",
            "font-fredoka font-medium text-[18px] leading-[100%]",
            "bg-gradient-to-r from-[var(--color-premium-dark)] to-[var(--color-premium)]",
            "text-white",
            "transition-all duration-200",
            "hover:brightness-110",
          ].join(" ")}
        >
          <Icon className="w-6 h-6 shrink-0" />
          <span>{label}</span>
        </button>
      );
    }

    return (
      <button
        key={path}
        onClick={() => setActive(path)}
        className={[
          "flex items-center gap-3 w-full cursor-pointer",
          "py-4 px-5",
          "font-fredoka font-medium text-[18px] leading-[100%]",
          "transition-all duration-200",
          isActive
            ? "text-white bg-[var(--color-bg-card-inner)] border-l-4 border-[var(--color-accent)] pl-4"
            : "text-[var(--color-text-muted)] border-l-4 border-transparent hover:text-white hover:bg-white/5",
        ].join(" ")}
      >
        <Icon className="w-6 h-6 shrink-0" />
        <span>{label}</span>
      </button>
    );
  };

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
        {[...mainNav.filter((i) => !i.premium), ...bottomNav.slice(0, 1)].map(
          ({ label, icon: Icon, path }) => {
            const isActive = active === path;
            return (
              <button
                key={path}
                onClick={() => setActive(path)}
                className={[
                  "flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer",
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
          }
        )}
      </nav>

      {/* ── Desktop: sidebar lateral fixa ── */}
      <aside
        className={[
          "hidden md:flex",
          "fixed left-0 top-0 z-50 h-screen w-64",
          "flex-col",
          "bg-[var(--color-bg-card)] border-r-2 border-[var(--color-accent)]",
          "font-fredoka",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-8 px-5">
          <h1 className="font-gloria text-4xl text-white">Programático</h1>
        </div>

        {/* Navegação principal */}
        <nav className="flex flex-col gap-1 w-full pt-3">
          {mainNav.map(renderItem)}
        </nav>

        {/* Espaçador */}
        <div className="flex-1" />

        {/* Navegação inferior */}
        <nav className="flex flex-col gap-1 w-full pb-6">
          {bottomNav.map(renderItem)}
        </nav>
      </aside>
    </>
  );
}

