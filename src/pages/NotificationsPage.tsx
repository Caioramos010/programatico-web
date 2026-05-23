import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import Button from "../components/Button";
import NotificationCard, {
  type NotificationItem,
} from "../components/notifications/NotificationCard";

type NotificationFilter = "todas" | "nao-lidas" | "lidas";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Nova trilha desbloqueada",
    message: "Você desbloqueou mais uma trilha.",
    time: "há 5 minutos",
    kind: "trilha",
    read: false,
  },
  {
    id: "2",
    title: "Exercício concluído",
    message: "Parabéns! você completou o exercício “Fluxo Lógico”.",
    time: "há 15 minutos",
    kind: "exercicio",
    read: false,
  },
  {
    id: "3",
    title: "Nova missão disponível",
    message: "Uma nova missão diária está disponível para você.",
    time: "há 40 minutos",
    kind: "missao",
    read: false,
  },
  {
    id: "4",
    title: "Missão concluída",
    message: "Você completou a missão “Resolver 5 exercícios”.",
    time: "há 2 horas",
    kind: "missao",
    read: true,
  },
  {
    id: "5",
    title: "Novo conteúdo teórico",
    message: "Adicionamos uma nova página de conteúdo em Lógica.",
    time: "há 1 dia",
    kind: "trilha",
    read: true,
  },
  {
    id: "6",
    title: "Recompensa recebida",
    message: "Você ganhou XP por completar seus estudos de hoje.",
    time: "há 2 dias",
    kind: "exercicio",
    read: true,
  },
  {
    id: "7",
    title: "Sequência mantida",
    message: "Excelente! sua sequência diária foi mantida.",
    time: "há 3 dias",
    kind: "missao",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("todas");

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
