import { useEffect, useState } from "react";
import BackupCodesModal from "../components/BackupCodesModal";
import SettingsCheckbox from "../components/SettingsCheckbox";
import TotpSettingsSection from "../components/TotpSettingsSection";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_SECURITY_PREFERENCES,
  NOTIFICATION_SETTING_OPTIONS,
  settingsService,
  type NotificationPreferenceKey,
  type NotificationPreferences,
  type SecurityPreferences,
  type TotpStatus,
} from "../services/settingsService";
import { useSettingsStore } from "../stores/settingsStore";
import { parseApiError } from "../utils/parseApiError";

function withAllDisabled(disabled: boolean): NotificationPreferences {
  return {
    disableUpdateNotifications: disabled,
    disableDaystreakNotifications: disabled,
    disableMissionNotifications: disabled,
    disableSubscriptionNotifications: disabled,
    disableEmailNotifications: disabled,
    disableAllNotifications: disabled,
  };
}

export default function SettingsPage() {
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [security, setSecurity] = useState<SecurityPreferences>(DEFAULT_SECURITY_PREFERENCES);
  const [totpStatus, setTotpStatus] = useState<TotpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodesToShow, setBackupCodesToShow] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      settingsService.getNotificationPreferences(),
      settingsService.getSecurityPreferences(),
      settingsService.getTotpStatus(),
    ])
      .then(([notificationData, securityData, totpData]) => {
        if (cancelled) return;
        setPrefs(notificationData);
        setSecurity(securityData);
        setTotpStatus(totpData);
        setNotifications(notificationData);
      })
      .catch((err) => {
        if (cancelled) return;
        const { formError } = parseApiError(err);
        setError(formError ?? "Não foi possível carregar as configurações.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setNotifications]);

  const persist = async (next: NotificationPreferences) => {
    setSaving(true);
    setError(null);
    try {
      const saved = await settingsService.updateNotificationPreferences(next);
      setPrefs(saved);
      setNotifications(saved);
    } catch (err) {
      const { formError } = parseApiError(err);
      setError(formError ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: NotificationPreferenceKey, checked: boolean) => {
    const next: NotificationPreferences = {
      ...prefs,
      [key]: checked,
      disableAllNotifications: false,
    };
    setPrefs(next);
    void persist(next);
  };

  const handleDisableAll = (checked: boolean) => {
    const next = checked ? withAllDisabled(true) : { ...prefs, disableAllNotifications: false };
    setPrefs(next);
    void persist(next);
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    const previous = security;
    const next = { ...security, twoFactorEnabled: enabled };
    setSecurity(next);
    setSavingSecurity(true);
    setError(null);
    settingsService
      .updateSecurityPreferences(next)
      .then((saved) => {
        setSecurity(saved);
        if (saved.backupCodes?.length) {
          setBackupCodesToShow(saved.backupCodes);
        }
      })
      .catch((err) => {
        const { formError } = parseApiError(err);
        setError(formError ?? "Não foi possível salvar.");
        setSecurity(previous);
      })
      .finally(() => setSavingSecurity(false));
  };

  return (
    <div className="max-w-3xl px-6 py-8 md:px-10 md:py-10 font-fredoka">
      <h1 className="mb-10 text-3xl font-bold text-white md:text-4xl">Configurações</h1>

      {loading ? (
        <p className="text-lg text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Segurança</h2>
            <SettingsCheckbox
              id="two-factor-enabled"
              label="Verificação em duas etapas no login"
              checked={security.twoFactorEnabled}
              disabled={savingSecurity}
              onChange={handleTwoFactorToggle}
            />
            <p className="pl-[4.75rem] text-sm text-[var(--color-text-muted)] leading-snug">
              Quando ativada, exige um segundo fator após a senha (e-mail ou app autenticador).
              {security.backupCodesRemaining > 0 ? (
                <> Códigos de backup restantes: {security.backupCodesRemaining}.</>
              ) : null}
            </p>
            <TotpSettingsSection
              totpStatus={totpStatus}
              onStatusChange={setTotpStatus}
              onBackupCodesGenerated={setBackupCodesToShow}
              onSecurityRefresh={() => {
                settingsService.getSecurityPreferences().then(setSecurity).catch(() => {});
              }}
            />
          </section>

          <section className="flex flex-col gap-8 border-t border-[var(--color-gray-border)] pt-8">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Notificações</h2>
          {NOTIFICATION_SETTING_OPTIONS.map(({ key, label, hint }) => (
            <div key={key} className="flex flex-col gap-1">
              <SettingsCheckbox
                id={key}
                label={label}
                checked={prefs[key]}
                disabled={prefs.disableAllNotifications || saving}
                onChange={(checked) => handleToggle(key, checked)}
              />
              {hint ? (
                <p className="pl-[4.75rem] text-sm text-[var(--color-text-muted)] leading-snug">{hint}</p>
              ) : null}
            </div>
          ))}

          <div className="mt-2 border-t border-[var(--color-gray-border)] pt-8">
            <SettingsCheckbox
              id="disable-all"
              label="Desativar todas as notificações"
              checked={prefs.disableAllNotifications}
              disabled={saving}
              onChange={handleDisableAll}
            />
          </div>
          </section>
        </div>
      )}

      {error ? (
        <p className="mt-6 text-base text-[var(--color-error-heart)]">{error}</p>
      ) : null}
      {backupCodesToShow ? (
        <BackupCodesModal
          codes={backupCodesToShow}
          onDismiss={() => setBackupCodesToShow(null)}
        />
      ) : null}
      {saving ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">Salvando...</p>
      ) : null}
    </div>
  );
}
