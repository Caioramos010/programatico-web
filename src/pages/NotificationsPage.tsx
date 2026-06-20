import { useEffect, useMemo, useState } from "react";
import { Bell, Search } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import NotificationCard, {
  type NotificationItem,
} from "../components/notifications/NotificationCard";
import { mapNotificationResponses, notificationService } from "../services/notificationService";

type NotificationFilter = "todas" | "nao-lidas" | "lidas";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("todas");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((data) => setNotifications(mapNotificationResponses(data)))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((item) => !item.read).length;
    const read = total - unread;
    return { total, unread, read };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return notifications.filter((item) => {
      if (activeFilter === "nao-lidas" && item.read) return false;
      if (activeFilter === "lidas" && !item.read) return false;
      if (!normalizedSearch) return true;

      return [item.title, item.message].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [activeFilter, notifications, searchTerm]);

  function markAsRead(id: string) {
    notificationService
      .markAsRead(Number(id))
      .then((updated) => {
        const mapped = mapNotificationResponses([updated])[0];
        setNotifications((prev) => prev.map((item) => (item.id === id ? mapped : item)));
      })
      .catch(() => undefined);
  }

  function markAllAsRead() {
    notificationService
      .markAllAsRead()
      .then(() => {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      })
      .catch(() => undefined);
  }

  function deleteNotification(id: string) {
    notificationService
      .deleteNotification(Number(id))
      .then(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => undefined);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 md:px-8 md:py-8 font-fredoka">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6 md:gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-yellow-300 fill-yellow-300" />
            <h1 className="text-3xl font-semibold text-white">{"Notifica\u00e7\u00f5es"}</h1>
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

        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            {"N\u00c3O LIDAS"} ({counts.unread})
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
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar notificação"
              aria-label="Buscar notificação"
              className="pl-10 pr-4 py-3"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 md:gap-5">
          {isLoading ? (
            <div className="rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] px-6 py-8 text-center text-[var(--color-text-muted)]">
              Carregando notificações...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] px-6 py-8 text-center text-[var(--color-text-muted)]">
              {"Nenhuma notifica\u00e7\u00e3o nesta aba."}
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
