import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "../../stores/adminAuthStore";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = isAdminSubdomain ? "/login" : "/admin/login";
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={loginPath} replace state={{ from }} />;
  }

  return <>{children}</>;
}
