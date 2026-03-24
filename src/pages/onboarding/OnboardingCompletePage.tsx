import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  pageVariants,
  mascotEnterVariants,
} from "../../hooks/useMascotAnimation";
import { Excited } from "../../components/mascot";
import { useAuthStore } from "../../stores/authStore";

export default function OnboardingCompletePage() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    navigate("/app");
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

      {/* CTA */}
      <Button
        variant="neutral"
        onClick={handleStart}
      >
        Comece agora
      </Button>
    </motion.div>
  );
}
