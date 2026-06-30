import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import {
  settingsService,
  type TotpSetup,
  type TotpStatus,
} from "../services/settingsService";
import { parseApiError } from "../utils/parseApiError";

interface TotpSettingsSectionProps {
  totpStatus: TotpStatus | null;
  onStatusChange: (status: TotpStatus) => void;
  onSecurityRefresh: () => void;
}

export default function TotpSettingsSection({
  totpStatus,
  onStatusChange,
  onSecurityRefresh,
}: TotpSettingsSectionProps) {
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [activationCode, setActivationCode] = useState("");
  const [deactivationCode, setDeactivationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await settingsService.setupTotp();
      setSetup(data);
      setActivationCode("");
    } catch (err) {
      const { formError } = parseApiError(err);
      setError(formError ?? "Não foi possível iniciar a configuração.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const status = await settingsService.activateTotp(activationCode.trim());
      onStatusChange(status);
      onSecurityRefresh();
      setSetup(null);
      setActivationCode("");
      setMessage("Autenticador ativado. No login, use o app em vez do e-mail.");
    } catch (err) {
      const { formError } = parseApiError(err);
      setError(formError ?? "Não foi possível ativar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivationCode.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const status = await settingsService.deactivateTotp(deactivationCode.trim());
      onStatusChange(status);
      onSecurityRefresh();
      setDeactivationCode("");
      setSetup(null);
      setMessage("Autenticador desativado. O login voltará a usar código por e-mail.");
    } catch (err) {
      const { formError } = parseApiError(err);
      setError(formError ?? "Não foi possível desativar.");
    } finally {
      setLoading(false);
    }
  };

  if (!totpStatus) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--color-gray-border)] pt-6 mt-2">
      <h3 className="text-lg font-semibold text-white">App autenticador (TOTP)</h3>
      <p className="text-sm text-[var(--color-text-muted)] leading-snug">
        Alternativa ao código por e-mail. Compatible com Google Authenticator, Authy e similares.
      </p>

      {totpStatus.totpEnabled ? (
        <div className="flex flex-col gap-3">
          <p className="text-base text-[var(--color-accent-light)]">Autenticador ativo no login.</p>
          <Input
            type="text"
            placeholder="Código do app para desativar"
            value={deactivationCode}
            onChange={(e) => setDeactivationCode(e.target.value)}
            maxLength={6}
          />
          <Button variant="neutral" disabled={loading} onClick={handleDeactivate}>
            {loading ? "Desativando..." : "Desativar autenticador"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {!setup ? (
            <Button variant="neutral" disabled={loading} onClick={handleStartSetup}>
              {loading ? "Gerando..." : "Configurar autenticador"}
            </Button>
          ) : (
            <>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Escaneie o QR code no app ou insira a chave manualmente:
              </p>
              <img
                src={setup.qrCodeDataUrl}
                alt="QR code TOTP"
                className="mx-auto w-48 h-48 rounded-xl bg-white p-2"
              />
              <p className="text-xs text-[var(--color-text-muted)] break-all text-center font-mono">
                {setup.secret}
              </p>
              <Input
                type="text"
                placeholder="Código de 6 dígitos do app"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                maxLength={6}
              />
              <Button variant="neutral" disabled={loading} onClick={handleActivate}>
                {loading ? "Ativando..." : "Confirmar e ativar"}
              </Button>
            </>
          )}
        </div>
      )}

      {message ? <p className="text-sm text-[var(--color-text-secondary)]">{message}</p> : null}
      {error ? <p className="text-sm text-[var(--color-error-heart)]">{error}</p> : null}
    </div>
  );
}
