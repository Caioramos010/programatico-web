import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

/**
 * Wraps public auth routes (login, registro, etc.).
 * Redirects authenticated users away so they can't see these pages again.
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (isAuthenticated) {
    return <Navigate to={user?.nivelHabilidade ? "/app" : "/onboarding"} replace />;
  }

  return <>{children}</>;
}
