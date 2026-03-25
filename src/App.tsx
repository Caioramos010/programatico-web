import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ActivationPage from "./pages/ActivationPage";
import LoginVerificationPage from "./pages/LoginVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordCodePage from "./pages/ResetPasswordCodePage";
import NewPasswordPage from "./pages/NewPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

// Admin — lazy-loaded (only fetched on admin subdomain or /admin/* dev fallback)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminProtectedRoute = lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminLoginVerificationPage = lazy(() => import("./pages/admin/AdminLoginVerificationPage"));
const AdminResetPasswordPage = lazy(() => import("./pages/admin/AdminResetPasswordPage"));
const AdminNewPasswordPage = lazy(() => import("./pages/admin/AdminNewPasswordPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));

// Onboarding — lazy-loaded (only fetched during onboarding flow)
const OnboardingLayout = lazy(() => import("./components/onboarding/OnboardingLayout"));
const OnboardingWelcomePage = lazy(() => import("./pages/onboarding/OnboardingWelcomePage"));
const OnboardingLevelPage = lazy(() => import("./pages/onboarding/OnboardingLevelPage"));
const OnboardingCompletePage = lazy(() => import("./pages/onboarding/OnboardingCompletePage"));

const isAdmin = window.location.hostname.startsWith("admin.");

function App() {
  if (isAdmin) {
    return (
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/login/verificacao" element={<AdminLoginVerificationPage />} />
            <Route path="/redefinir-senha" element={<AdminResetPasswordPage />} />
            <Route path="/redefinir-senha/nova" element={<AdminNewPasswordPage />} />
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/login/verificacao" element={<GuestRoute><LoginVerificationPage /></GuestRoute>} />
          <Route path="/redefinir-senha" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
          <Route path="/redefinir-senha/codigo" element={<GuestRoute><ResetPasswordCodePage /></GuestRoute>} />
          <Route path="/redefinir-senha/nova" element={<GuestRoute><NewPasswordPage /></GuestRoute>} />
          <Route path="/registro" element={<GuestRoute><SignUpPage /></GuestRoute>} />
          <Route path="/ativacao" element={<GuestRoute><ActivationPage /></GuestRoute>} />
          {/* Main app (sidebar + content) */}
          <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/perfil" replace />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<OnboardingWelcomePage />} />
            <Route path="nivel" element={<OnboardingLevelPage />} />
            <Route path="conclusao" element={<OnboardingCompletePage />} />
          </Route>
          {/*
           * Admin routes — dev fallback for when not on admin.* subdomain.
           * In production, admin pages are served via admin.* only.
           */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/login/verificacao" element={<AdminLoginVerificationPage />} />
          <Route path="/admin/redefinir-senha" element={<AdminResetPasswordPage />} />
          <Route path="/admin/redefinir-senha/nova" element={<AdminNewPasswordPage />} />
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

