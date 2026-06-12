import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import Button from "../components/Button";
import NotificationCard, {
  type NotificationItem,
} from "../components/notifications/NotificationCard";
import { mapNotificationResponses, notificationService } from "../services/notificationService";

type NotificationFilter = "todas" | "nao-lidas" | "lidas";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("todas");

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((data) => setNotifications(mapNotificationResponses(data)))
      .catch(() => setNotifications([]));
  }, []);

  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((item) => !item.read).length;
    const read = total - unread;
    return { total, unread, read };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "nao-lidas") return notifications.filter((item) => !item.read);
    if (activeFilter === "lidas") return notifications.filter((item) => item.read);
    return notifications;
  }, [activeFilter, notifications]);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 md:px-8 md:py-8 font-fredoka">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6 md:gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-yellow-300 fill-yellow-300" />
            <h1 className="text-3xl font-semibold text-white">Notificações</h1>
          </div>

          <Button
            type="button"
            variant="neutral"
            onClick={markAllAsRead}
            disabled={counts.unread === 0}
            className="px-4 py-2 rounded-xl border-b-2 normal-case tracking-normal text-base"
          >
            Marcar todas como lidas
          </Button>
        </header>

        <section className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("todas")}
            className={[
              "px-3 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors cursor-pointer",
              activeFilter === "todas"
                ? "bg-sky-700 text-white"
                : "bg-[var(--color-gray-border)] text-white/90 hover:bg-[#475782]",
            ].join(" ")}
          >
            TODAS ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("nao-lidas")}
            className={[
              "px-3 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors cursor-pointer",
              activeFilter === "nao-lidas"
                ? "bg-sky-700 text-white"
                : "bg-[var(--color-gray-border)] text-white/90 hover:bg-[#475782]",
            ].join(" ")}
          >
            NÃO LIDAS ({counts.unread})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("lidas")}
            className={[
              "px-3 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors cursor-pointer",
              activeFilter === "lidas"
                ? "bg-sky-700 text-white"
                : "bg-[var(--color-gray-border)] text-white/90 hover:bg-[#475782]",
            ].join(" ")}
          >
            LIDAS ({counts.read})
          </button>
        </section>

        <section className="flex flex-col gap-4 md:gap-5">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] px-6 py-8 text-center text-[var(--color-text-muted)]">
              Nenhuma notificação nesta aba.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <NotificationCard key={item.id} item={item} onMarkAsRead={markAsRead} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
