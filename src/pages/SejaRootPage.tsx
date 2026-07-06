import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Clock, Activity, X } from "lucide-react";
import { toast } from "../components/toast/toastBus";
import { Crown } from "../components/icons";
import { paymentService } from "../services/paymentService";
import { useAuthStore } from "../stores/authStore";
import { isActiveRoot } from "../lib/subscription";

function FeatureCard({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/15 px-5 py-4",
        "bg-black/25 backdrop-blur-sm shadow-inner",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-fredoka font-semibold text-lg md:text-xl mb-3">{title}</h2>
          <ul className="space-y-2 text-white/90 font-fredoka font-normal text-base md:text-[1.05rem]">
            {items.map((line) => (
              <li key={line} className="flex gap-2 items-start">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SejaRootPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const checkoutUrlFromBuild = import.meta.env.VITE_ABACATE_PAY_CHECKOUT_URL as string | undefined;

  useEffect(() => {
    if (isActiveRoot(user)) {
      navigate("/root", { replace: true });
    }
  }, [user, navigate]);

  if (isActiveRoot(user)) {
    return null;
  }

  const openCheckout = (url: string) => {
    window.open(url.trim(), "_blank", "noopener,noreferrer");
  };

  const handleAssinar = async () => {
    const fromBuild = checkoutUrlFromBuild?.trim();
    if (fromBuild) {
      openCheckout(fromBuild);
      return;
    }

    setLoadingCheckout(true);
    try {
      const { url, billId } = await paymentService.getCheckoutUrl();
      if (billId?.trim()) {
        paymentService.savePendingBillId(billId);
      }
      if (url?.trim()) {
        openCheckout(url);
        return;
      }
      toast.info(
        "Pagamento não configurado. Defina ABACATEPAY_API_KEY e ABACATEPAY_PRODUCT_ID no .env."
      );
    } catch (err: unknown) {
      const mensagem =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "mensagem" in err.response.data &&
        typeof err.response.data.mensagem === "string"
          ? err.response.data.mensagem
          : "Não foi possível obter o link de pagamento. Tente novamente.";
      toast.error(mensagem);
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div
      className={[
        "relative min-h-screen w-full overflow-x-hidden",
        "bg-gradient-to-b from-[#7a5a0f] via-[#9a7212] to-[#a67c00]",
        "font-fredoka text-white",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => navigate("/aprender")}
        className={[
          "absolute top-4 right-4 z-10",
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-black/20 text-white hover:bg-black/35 transition-colors",
          "border border-white/20 cursor-pointer",
        ].join(" ")}
        aria-label="Fechar e voltar ao aprender"
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div className="mx-auto flex max-w-lg flex-col items-center px-5 pb-28 pt-16 md:pb-20 md:pt-20">
        <header className="mb-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <Crown
            className="h-16 w-16 shrink-0 drop-shadow-md md:h-20 md:w-20"
            aria-hidden
          />
          <p className="text-center text-lg font-bold uppercase tracking-wide text-white sm:text-left md:text-xl">
            Seja Root agora e obtenha:
          </p>
        </header>

        <div className="flex w-full flex-col gap-5">
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />}
            title="Tempo & qualidade de Estudo"
            items={["Práticas de Erros", "Práticas de Fixação"]}
          />
          <FeatureCard
            icon={
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb] shadow-md"
                aria-hidden
              >
                <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            }
            title="Experiência Root"
            items={["Sem anúncios", "Vidas infinitas"]}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center px-5 pb-6 pt-4 md:static md:mt-12 md:pb-0 md:pt-0">
          <button
            type="button"
            onClick={handleAssinar}
            disabled={loadingCheckout}
            className={[
              "w-full max-w-md rounded-2xl py-4 px-8",
              "bg-white text-[#1f2937] font-fredoka font-bold text-lg uppercase tracking-wider",
              "shadow-[0_4px_0_#d1d5db] hover:brightness-[1.02] active:translate-y-1 active:shadow-[0_1px_0_#d1d5db]",
              "transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loadingCheckout ? "Abrindo..." : "Assine agora!"}
          </button>
        </div>
      </div>
    </div>
  );
}
