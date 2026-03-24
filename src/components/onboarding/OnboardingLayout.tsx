import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function OnboardingLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
