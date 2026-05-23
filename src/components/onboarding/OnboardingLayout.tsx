import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function OnboardingLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.nivelHabilidade) {
    return <Navigate to="/aprender" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
