import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-bg-primary)] font-fredoka">
      <h1 className="text-7xl font-bold text-[var(--color-text-primary)]">
        404
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)]">
        Página não encontrada
      </p>
      <Button variant="white" onClick={() => navigate("/")}>
        Voltar ao início
      </Button>
    </div>
  );
}
