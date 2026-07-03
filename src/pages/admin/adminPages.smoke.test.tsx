import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminTrilhasPage from "./AdminTrilhasPage";
import AdminUsuariosPage from "./AdminUsuariosPage";
import AdminMissoesPage from "./AdminMissoesPage";
import AdminModulosPage from "./AdminModulosPage";
import AdminAtividadesPage from "./AdminAtividadesPage";
import AdminTeoricaPaginasPage from "./AdminTeoricaPaginasPage";
import AdminTeoricaPage from "./AdminTeoricaPage";
import AdminLoginPage from "./AdminLoginPage";
import AdminLoginVerificationPage from "./AdminLoginVerificationPage";
import AdminResetPasswordPage from "./AdminResetPasswordPage";
import AdminNewPasswordPage from "./AdminNewPasswordPage";

const adminServiceMock = vi.hoisted(() => ({
  getDashboard: vi.fn().mockResolvedValue({
    totalUsers: 10,
    activeSessions: 2,
    totalModules: 5,
    growthPercent: 12,
  }),
  listarTrilhas: vi.fn().mockResolvedValue([]),
  listarModulos: vi.fn().mockResolvedValue([]),
  listarExercicios: vi.fn().mockResolvedValue([]),
  listarMissoes: vi.fn().mockResolvedValue([]),
  listarUsuarios: vi.fn().mockResolvedValue([]),
  listarPaginas: vi.fn().mockResolvedValue([]),
  listarContentBlocksPorPagina: vi.fn().mockResolvedValue([]),
}));

const mockIniciarLogin = vi.hoisted(() => vi.fn());

vi.mock("../../services/adminService", () => ({
  adminService: adminServiceMock,
}));

vi.mock("../../services/authService", () => ({
  authService: {
    iniciarLogin: mockIniciarLogin,
    confirmarLogin: vi.fn(),
    solicitarRedefinicao: vi.fn(),
    novaSenha: vi.fn(),
  },
}));

describe("admin pages smoke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("AdminDashboardPage", async () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  it("AdminTrilhasPage", async () => {
    render(
      <MemoryRouter>
        <AdminTrilhasPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Trilhas")).toBeInTheDocument();
    });
  });

  it("AdminUsuariosPage", async () => {
    render(
      <MemoryRouter>
        <AdminUsuariosPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Usuários")).toBeInTheDocument();
    });
  });

  it("AdminMissoesPage", async () => {
    render(
      <MemoryRouter>
        <AdminMissoesPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Missões")).toBeInTheDocument();
    });
  });

  it("AdminModulosPage", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/trilhas/1/modulos"]}>
        <Routes>
          <Route path="/admin/trilhas/:trilhaId/modulos" element={<AdminModulosPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Módulos")).toBeInTheDocument();
    });
  });

  it("AdminAtividadesPage", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/modulos/2/atividades"]}>
        <Routes>
          <Route path="/admin/modulos/:moduloId/atividades" element={<AdminAtividadesPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Atividades")).toBeInTheDocument();
    });
  });

  it("AdminTeoricaPaginasPage", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/modulos/2/conteudo"]}>
        <Routes>
          <Route path="/admin/modulos/:moduloId/conteudo" element={<AdminTeoricaPaginasPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Páginas")).toBeInTheDocument();
    });
  });

  it("AdminTeoricaPage", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/paginas/3/conteudo"]}>
        <Routes>
          <Route path="/admin/paginas/:paginaId/conteudo" element={<AdminTeoricaPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Teórica")).toBeInTheDocument();
    });
  });

  it("AdminLoginPage", () => {
    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("AdminLoginVerificationPage", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/admin/login/verificacao",
            state: { emailOuUsername: "admin@test.com", senha: "Senha@123" },
          },
        ]}
      >
        <Routes>
          <Route path="/admin/login/verificacao" element={<AdminLoginVerificationPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText(/código do e-mail/i)).toBeInTheDocument();
  });

  it("AdminResetPasswordPage", () => {
    render(
      <MemoryRouter>
        <AdminResetPasswordPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Redefinir senha")).toBeInTheDocument();
  });

  it("AdminNewPasswordPage", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/admin/redefinir-senha/nova",
            state: { codigo: "123456", email: "admin@test.com" },
          },
        ]}
      >
        <Routes>
          <Route path="/admin/redefinir-senha/nova" element={<AdminNewPasswordPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText(/nova senha/i)).toBeInTheDocument();
  });
});
