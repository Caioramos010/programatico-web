import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import AtivacaoPage from "./pages/AtivacaoPage";
import LoginVerificacaoPage from "./pages/LoginVerificacaoPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import NovaSenhaPage from "./pages/NovaSenhaPage";
// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLoginVerificacaoPage from "./pages/admin/AdminLoginVerificacaoPage";
import AdminRedefinirSenhaPage from "./pages/admin/AdminRedefinirSenhaPage";
import AdminNovaSenhaPage from "./pages/admin/AdminNovaSenhaPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

const isAdmin = window.location.hostname.startsWith("admin.");

function App() {
  if (isAdmin) {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/verificacao" element={<LoginVerificacaoPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        <Route path="/redefinir-senha/nova" element={<NovaSenhaPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/ativacao" element={<AtivacaoPage />} />
        <Route path="/" element={<Sidebar />} />
        {/* Admin routes (dev fallback) */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

