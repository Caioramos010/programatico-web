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
import { learnService } from "../../services/learnService";
import type { NivelHabilidade } from "../../stores/authStore";

const LEVEL_MAP: Record<string, NivelHabilidade> = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

const NIVEL_INICIAL: Record<string, number> = {
  beginner: 0,
  intermediate: 10,
  advanced: 20,
};

const NIVEL_EXPLICACAO: Record<string, string> = {
  beginner:
    "Vamos do comecinho: você aprende os fundamentos um módulo de cada vez, sem pular nada.",
  intermediate:
    "Os 10 primeiros módulos já entram como concluídos no seu mapa — você começa direto no módulo 11 e pode revisitar os anteriores quando quiser.",
  advanced:
    "Os 20 primeiros módulos já entram como concluídos no seu mapa — você começa direto no módulo 21 e pode revisitar os anteriores quando quiser.",
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
      await learnService.aplicarNivelamento(nivelHabilidade);
      updateUser({ ...user, nivelHabilidade });
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
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
          {level
            ? `Você vai começar no nível ${NIVEL_INICIAL[level]}!`
            : "Pratique agora"}
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
          {level
            ? NIVEL_EXPLICACAO[level]
            : "É um prazer ter você conosco, comece a estudar agora mesmo!"}
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
        <p className="text-base text-[var(--color-error-heart)]">{error}</p>
      )}

      {/* CTA */}
      <Button variant="neutral" onClick={handleStart} disabled={loading}>
        {loading ? "Salvando..." : "Comece agora"}
      </Button>
    </motion.div>
  );
}
