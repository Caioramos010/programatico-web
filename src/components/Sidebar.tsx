import { type SVGProps, type ReactElement } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  Pin,
  Crown,
  User,
  Settings,
  Notification,
  LogOut,
} from "./icons";
import { useAuthStore } from "../stores/authStore";
import { isActiveRoot } from "../lib/subscription";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface NavItem {
  label: string;
  icon: IconComponent;
  path: string;
  premium?: boolean;
  rootMember?: boolean;
}

const premiumGradientClasses =
  "bg-gradient-to-r from-[var(--color-premium-dark)] to-[var(--color-premium)] text-white transition-all duration-200 hover:brightness-110";

const premiumShine = (
  <span
    aria-hidden
    className="absolute top-0 left-[-75%] h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none group-hover:animate-shine"
  />
);

const baseMainNav: NavItem[] = [
  { label: "APRENDER", icon: Home, path: "/aprender" },
  { label: "PRATICAR", icon: Book, path: "/praticar" },
  { label: "REVISAR", icon: Pin, path: "/revisar" },
];

const premiumNavFree: NavItem = {
  label: "SEJA ROOT",
  icon: Crown,
  path: "/seja-root",
  premium: true,
};

const premiumNavRoot: NavItem = {
  label: "ROOT",
  icon: Crown,
  path: "/root",
  premium: true,
  rootMember: true,
};

const bottomNav: NavItem[] = [
  { label: "PERFIL", icon: User, path: "/perfil" },
  { label: "CONFIGURAÇÕES", icon: Settings, path: "/configuracoes" },
  { label: "NOTIFICAÇÕES", icon: Notification, path: "/notificacoes" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const mainNav = [
    ...baseMainNav,
    isActiveRoot(user) ? premiumNavRoot : premiumNavFree,
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderItem = ({ label, icon: Icon, path, premium, rootMember }: NavItem) => {
    const isActive = pathname.startsWith(path);

    if (premium) {
      return (
        <NavLink
          key={path}
          to={path}
          className={[
            "relative overflow-hidden group",
            "flex items-center gap-3 w-full cursor-pointer",
            "px-3 py-2.5 rounded-xl",
            "font-fredoka font-medium text-base",
            premiumGradientClasses,
            isActive && rootMember ? "ring-2 ring-white/40" : "",
          ].join(" ")}
        >
          {premiumShine}
          <Icon className="w-5 h-5 shrink-0" />
          <span className={rootMember ? "font-bold uppercase tracking-wider" : undefined}>
            {label}
          </span>
        </NavLink>
      );
    }

    return (
      <NavLink
        key={path}
        to={path}
        className={[
          "flex items-center gap-3 w-full cursor-pointer",
          "px-3 py-2.5 rounded-xl",
          "font-fredoka font-medium text-base",
          "transition-all duration-200",
          isActive
            ? "bg-[var(--color-accent)] text-white"
            : "text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]",
        ].join(" ")}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span>{label}</span>
      </NavLink>
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
        {[
          ...mainNav.filter((i) => !i.premium),
          mainNav.find((i) => i.premium)!,
          bottomNav[0],
        ].map(({ label, icon: Icon, path, premium, rootMember }) => {
            const isActive = pathname.startsWith(path);
            if (premium) {
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={[
                    "relative overflow-hidden group",
                    "flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5",
                    "px-2 py-1.5 cursor-pointer rounded-xl",
                    premiumGradientClasses,
                    isActive && rootMember ? "ring-2 ring-white/40" : "",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span
                    className={[
                      "relative text-[10px] leading-tight text-center",
                      rootMember ? "font-bold uppercase tracking-wide" : "font-medium",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={path}
                to={path}
                className={[
                  "flex flex-1 min-w-0 flex-col items-center gap-0.5 px-1 py-1 cursor-pointer",
                  "transition-colors duration-200",
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:text-white",
                ].join(" ")}
              >
                <Icon className="w-5 h-5 fill-current" />
                <span className="text-[10px] leading-tight font-medium">{label}</span>
              </NavLink>
            );
          })}
      </nav>

      {/* ── Desktop: sidebar lateral fixa ── */}
      <aside
        className={[
          "hidden md:flex",
          "fixed left-0 top-0 z-50 h-screen w-60",
          "flex-col",
          "bg-[var(--color-bg-card)] border-r-2 border-[var(--color-accent)]",
          "font-fredoka",
        ].join(" ")}
      >
        <div className="px-6 py-6 border-b border-[var(--color-gray-border)]">
          <h1 className="font-gloria text-2xl text-white">programático</h1>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {mainNav.map(renderItem)}
        </nav>

        <nav className="px-3 py-4 border-t border-[var(--color-gray-border)] flex flex-col gap-1">
          {bottomNav.map(renderItem)}
          <button
            onClick={handleLogout}
            className={[
              "flex items-center gap-3 w-full cursor-pointer",
              "px-3 py-2.5 rounded-xl",
              "font-fredoka font-medium text-base",
              "transition-all duration-200",
              "text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]",
            ].join(" ")}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>ENCERRAR SESSÃO</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
