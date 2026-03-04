import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../../stores/adminAuthStore";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    const loginPath = isAdminSubdomain ? "/login" : "/admin/login";
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
