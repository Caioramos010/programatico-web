import { useEffect, useState } from "react";
import { paymentService, type PaymentHistoryItem } from "../services/paymentService";
import { parseApiError } from "../utils/parseApiError";

type Variant = "profile" | "root";

interface PaymentHistorySectionProps {
  variant?: Variant;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusLabel(status: PaymentHistoryItem["status"]): string {
  switch (status) {
    case "PAID":
      return "Pago";
    case "PENDING":
      return "Pendente";
    case "FAILED":
      return "Falhou / Expirado";
    case "REFUNDED":
      return "Reembolsado";
    default:
      return status;
  }
}

function methodLabel(method: PaymentHistoryItem["method"]): string {
  switch (method) {
    case "PIX":
      return "PIX";
    case "CARD":
      return "Cartão";
    default:
      return "—";
  }
}

export default function PaymentHistorySection({ variant = "profile" }: PaymentHistorySectionProps) {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentService
      .getHistory()
      .then(setItems)
      .catch((err) => setError(parseApiError(err).formError ?? "Não foi possível carregar o histórico."))
      .finally(() => setLoading(false));
  }, []);

  const isRoot = variant === "root";

  return (
    <section className="flex w-full flex-col gap-3">
      <h3
        className={[
          "text-lg font-semibold",
          isRoot ? "text-white" : "text-white",
        ].join(" ")}
      >
        Histórico de pagamentos
      </h3>

      {loading ? (
        <p className={isRoot ? "text-white/80 text-base" : "text-[var(--color-text-muted)] text-base"}>
          Carregando...
        </p>
      ) : error ? (
        <p className="text-base text-[var(--color-error-heart)]">{error}</p>
      ) : items.length === 0 ? (
        <p className={isRoot ? "text-white/80 text-base" : "text-[var(--color-text-muted)] text-base"}>
          Nenhum pagamento registrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={[
                "rounded-xl border px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
                isRoot
                  ? "border-white/15 bg-black/25"
                  : "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)]",
              ].join(" ")}
            >
              <div className="flex flex-col gap-0.5">
                <span className={isRoot ? "text-white font-semibold text-base" : "text-white font-semibold text-base"}>
                  {formatAmount(item.amount)}
                </span>
                <span className={isRoot ? "text-white/75 text-sm" : "text-[var(--color-text-muted)] text-sm"}>
                  {formatDate(item.createdAt)} · {methodLabel(item.method)}
                </span>
              </div>
              <span
                className={[
                  "text-sm font-semibold uppercase tracking-wide self-start sm:self-center",
                  item.status === "PAID"
                    ? isRoot
                      ? "text-emerald-300"
                      : "text-[var(--color-accent-light)]"
                    : isRoot
                      ? "text-white/80"
                      : "text-[var(--color-text-muted)]",
                ].join(" ")}
              >
                {statusLabel(item.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
