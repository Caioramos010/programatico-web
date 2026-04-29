import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuthStore } from "../../stores/adminAuthStore";
import { LayoutDashboard, LogOut, Zap, Users, Target } from "lucide-react";
import ToastContainer from "../Toast";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const navLinks = [
  { to: `${basePath}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
  { to: `${basePath}/trilhas`, label: "Trilhas", icon: Zap },
  { to: `${basePath}/usuarios`, label: "Usuários", icon: Users },
  { to: `${basePath}/missoes`, label: "Missões", icon: Target },
];

export default function AdminLayout() {
  const logout = useAdminAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-primary)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-[var(--color-bg-card)] border-r-2 border-[var(--color-premium)]">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[var(--color-gray-border)]">
          <span className="font-gloria text-xl text-[var(--color-text-primary)]">
            programático
          </span>
          <span className="ml-2 inline-block text-[10px] font-semibold uppercase tracking-widest bg-[var(--color-premium)] text-[var(--color-bg-card)] rounded px-1.5 py-0.5 align-middle">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-premium)] text-[var(--color-bg-card)]"
                    : "text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[var(--color-gray-border)]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
