import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

/**
 * Wraps public auth routes (login, registro, etc.).
 * Redirects authenticated users away so they can't see these pages again.
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  if (isAuthenticated) {
    return <Navigate to={onboardingCompleted ? "/app" : "/onboarding"} replace />;
  }

  return <>{children}</>;
}
