import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TotpSettingsSection from "./TotpSettingsSection";

const mockSetupTotp = vi.hoisted(() => vi.fn());
const mockActivateTotp = vi.hoisted(() => vi.fn());
const mockDeactivateTotp = vi.hoisted(() => vi.fn());

vi.mock("../services/settingsService", () => ({
  settingsService: {
    setupTotp: mockSetupTotp,
    activateTotp: mockActivateTotp,
    deactivateTotp: mockDeactivateTotp,
  },
}));

describe("TotpSettingsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("não renderiza quando totpStatus é null", () => {
    const { container } = render(
      <TotpSettingsSection
        totpStatus={null}
        onStatusChange={vi.fn()}
        onSecurityRefresh={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("inicia configuração e exibe QR code", async () => {
    mockSetupTotp.mockResolvedValue({
      secret: "SECRET-KEY",
      qrCodeDataUrl: "data:image/png;base64,abc",
    });

    render(
      <TotpSettingsSection
        totpStatus={{ totpEnabled: false, twoFactorEnabled: true }}
        onStatusChange={vi.fn()}
        onSecurityRefresh={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /configurar autenticador/i }));

    await waitFor(() => {
      expect(screen.getByAltText("QR code TOTP")).toBeInTheDocument();
    });
    expect(screen.getByText("SECRET-KEY")).toBeInTheDocument();
  });

  it("ativa TOTP e notifica códigos de backup", async () => {
    const onStatusChange = vi.fn();
    const onBackupCodesGenerated = vi.fn();

    mockSetupTotp.mockResolvedValue({
      secret: "SECRET-KEY",
      qrCodeDataUrl: "data:image/png;base64,abc",
    });
    mockActivateTotp.mockResolvedValue({
      totpEnabled: true,
      twoFactorEnabled: true,
      backupCodes: ["CODE-1", "CODE-2"],
    });

    render(
      <TotpSettingsSection
        totpStatus={{ totpEnabled: false, twoFactorEnabled: true }}
        onStatusChange={onStatusChange}
        onSecurityRefresh={vi.fn()}
        onBackupCodesGenerated={onBackupCodesGenerated}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /configurar autenticador/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/código de 6 dígitos/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/código de 6 dígitos/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /confirmar e ativar/i }));

    await waitFor(() => {
      expect(mockActivateTotp).toHaveBeenCalledWith("123456");
    });
    expect(onStatusChange).toHaveBeenCalled();
    expect(onBackupCodesGenerated).toHaveBeenCalledWith(["CODE-1", "CODE-2"]);
  });

  it("desativa TOTP quando já está ativo", async () => {
    const onStatusChange = vi.fn();
    mockDeactivateTotp.mockResolvedValue({
      totpEnabled: false,
      twoFactorEnabled: true,
    });

    render(
      <TotpSettingsSection
        totpStatus={{ totpEnabled: true, twoFactorEnabled: true }}
        onStatusChange={onStatusChange}
        onSecurityRefresh={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/código do app para desativar/i), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByRole("button", { name: /desativar autenticador/i }));

    await waitFor(() => {
      expect(mockDeactivateTotp).toHaveBeenCalledWith("654321");
    });
    expect(onStatusChange).toHaveBeenCalled();
  });
});
