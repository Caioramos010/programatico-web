import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

/**
 * Wraps public auth routes (login, registro, etc.).
 * Redirects authenticated users away so they can't see these pages again.
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  if (isAuthenticated) {
    const fallback = user?.nivelHabilidade ? "/aprender" : "/onboarding";
    return <Navigate to={from ?? fallback} replace />;
  }

  return <>{children}</>;
}
