import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.nivelHabilidade) {
    return <Navigate to="/onboarding" replace />;
  }

  return children ?? <Outlet />;
}
