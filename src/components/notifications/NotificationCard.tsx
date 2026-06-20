import { Circle, Sparkles, Target, X } from "lucide-react";
import Button from "../Button";

export type NotificationKind = "trilha" | "exercicio" | "missao";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: NotificationKind;
  read: boolean;
}

function NotificationIcon({ kind }: { kind: NotificationKind }) {
  if (kind === "trilha") {
    return <Sparkles className="w-5 h-5 text-yellow-300" />;
  }
  if (kind === "missao") {
    return <Target className="w-5 h-5 text-white/90" />;
  }
  return <Circle className="w-4 h-4 fill-sky-400 text-sky-400" />;
}

interface NotificationCardProps {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({ item, onMarkAsRead, onDelete }: NotificationCardProps) {
  return (
    <article
      className={[
        "rounded-xl border border-transparent bg-[var(--color-bg-card-inner)] px-4 py-4 md:px-5",
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        item.read ? "opacity-85" : "opacity-100",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <NotificationIcon kind={item.kind} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
          <p className="text-2xl text-white/95">{item.message}</p>
          <span className="mt-1 text-base text-[var(--color-text-muted)]">{item.time}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 self-start md:self-center">
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-white/50 transition-colors hover:text-white cursor-pointer"
          aria-label={`Excluir notificação ${item.title}`}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <Button
          type="button"
          variant="neutral"
          onClick={() => onMarkAsRead(item.id)}
          disabled={item.read}
          className="normal-case tracking-normal text-base px-4 py-2 border-b-2 rounded-lg"
        >
          {item.read ? "Lida" : "Marcar como lida"}
        </Button>
      </div>
    </article>
  );
}
