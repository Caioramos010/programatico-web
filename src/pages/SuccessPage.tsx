import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";

interface SuccessState {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SuccessState | null) ?? {};
  const title = state.title ?? "Tudo certo!";
  const message = state.message ?? "A operação foi concluída com sucesso.";
  const ctaLabel = state.ctaLabel ?? "Continuar";
  const ctaTo = state.ctaTo ?? "/";

  return (
    <AuthLayout title={title} subtitle={message} onClose={() => navigate("/")}>
      <div className="flex flex-col items-center gap-6">
        <CheckCircle2
          className="w-16 h-16 text-[var(--color-accent-light)]"
          strokeWidth={1.8}
        />
        <Button
          type="button"
          variant="white"
          className="w-full"
          onClick={() => navigate(ctaTo, { replace: true })}
        >
          {ctaLabel}
        </Button>
      </div>
    </AuthLayout>
  );
}
