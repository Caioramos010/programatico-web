import { useEffect, useState } from "react";
import SettingsCheckbox from "../components/SettingsCheckbox";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_SETTING_OPTIONS,
  settingsService,
  type NotificationPreferenceKey,
  type NotificationPreferences,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getNotificationPreferences()
      .then((notificationData) => {
        if (cancelled) return;
        setPrefs(notificationData);
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

  return (
    <div className="max-w-3xl px-6 py-8 md:px-10 md:py-10 font-fredoka">
      <h1 className="mb-10 text-3xl font-bold text-white md:text-4xl">Configurações</h1>

      {loading ? (
        <p className="text-lg text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <section className="flex flex-col gap-8">
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
      )}

      {error ? (
        <p className="mt-6 text-base text-[var(--color-error-heart)]">{error}</p>
      ) : null}
      {saving ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">Salvando...</p>
      ) : null}
    </div>
  );
}
