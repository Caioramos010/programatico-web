import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  pageVariants,
  mascotEnterVariants,
} from "../../hooks/useMascotAnimation";
import { Excited } from "../../components/mascot";
import { useAuthStore } from "../../stores/authStore";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { authService } from "../../services/authService";
import type { NivelHabilidade } from "../../stores/authStore";

const LEVEL_MAP: Record<string, NivelHabilidade> = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

export default function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { level, reset } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!user || !level) {
      navigate("/aprender");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const nivelHabilidade = LEVEL_MAP[level];
      const updated = await authService.atualizarPerfil(user.id, { nivelHabilidade });
      updateUser(updated);
      reset();
      navigate("/aprender");
    } catch {
      setError("Erro ao salvar preferências. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6 font-fredoka"
    >
      {/* Texts */}
      <div className="text-center max-w-xs">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
          Pratique agora
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          É um prazer ter você conosco, comece a estudar agora mesmo!
        </p>
      </div>

      {/* Mascot */}
      <motion.div
        variants={mascotEnterVariants}
        initial="initial"
        animate="animate"
        className="w-48 sm:w-56 relative"
      >
        <Excited className="w-full h-auto" />
      </motion.div>

      {error && (
        <p className="text-sm text-[var(--color-error-heart)]">{error}</p>
      )}

      {/* CTA */}
      <Button variant="neutral" onClick={handleStart} disabled={loading}>
        {loading ? "Salvando..." : "Comece agora"}
      </Button>
    </motion.div>
  );
}
