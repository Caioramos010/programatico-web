import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import AtivacaoPage from "./pages/AtivacaoPage";
import LoginVerificacaoPage from "./pages/LoginVerificacaoPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import NovaSenhaPage from "./pages/NovaSenhaPage";
import PerfilPage from "./pages/PerfilPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";

// Admin — lazy-loaded (only fetched on admin subdomain or /admin/* dev fallback)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminProtectedRoute = lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminLoginVerificacaoPage = lazy(() => import("./pages/admin/AdminLoginVerificacaoPage"));
const AdminRedefinirSenhaPage = lazy(() => import("./pages/admin/AdminRedefinirSenhaPage"));
const AdminNovaSenhaPage = lazy(() => import("./pages/admin/AdminNovaSenhaPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));

// Onboarding — lazy-loaded (only fetched during onboarding flow)
const OnboardingLayout = lazy(() => import("./components/onboarding/OnboardingLayout"));
const OnboardingWelcomePage = lazy(() => import("./pages/onboarding/OnboardingWelcomePage"));
const OnboardingNivelPage = lazy(() => import("./pages/onboarding/OnboardingNivelPage"));
const OnboardingConclusaoPage = lazy(() => import("./pages/onboarding/OnboardingConclusaoPage"));

const isAdmin = window.location.hostname.startsWith("admin.");

function App() {
  if (isAdmin) {
    return (
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/login/verificacao" element={<AdminLoginVerificacaoPage />} />
            <Route path="/redefinir-senha" element={<AdminRedefinirSenhaPage />} />
            <Route path="/redefinir-senha/nova" element={<AdminNovaSenhaPage />} />
            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/verificacao" element={<LoginVerificacaoPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/redefinir-senha/nova" element={<NovaSenhaPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/ativacao" element={<AtivacaoPage />} />
          {/* Main app (sidebar + content) */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/perfil" replace />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<OnboardingWelcomePage />} />
            <Route path="nivel" element={<OnboardingNivelPage />} />
            <Route path="conclusao" element={<OnboardingConclusaoPage />} />
          </Route>
          {/*
           * Admin routes — dev fallback for when not on admin.* subdomain.
           * In production, admin pages are served via admin.* only.
           */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/login/verificacao" element={<AdminLoginVerificacaoPage />} />
          <Route path="/admin/redefinir-senha" element={<AdminRedefinirSenhaPage />} />
          <Route path="/admin/redefinir-senha/nova" element={<AdminNovaSenhaPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

