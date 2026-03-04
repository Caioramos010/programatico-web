import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import SpeechBubble from "../../components/SpeechBubble";
import { mascotEnterVariants } from "../../hooks/useMascotAnimation";
import { Base } from "../../components/mascot";

export default function OnboardingWelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-6 font-fredoka">
      {/* Texts */}
      <div className="text-center max-w-xs">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
          Seja bem-vindo ao programático
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Sua jornada para se tornar um desenvolvedor de verdade começa agora,
          com foco total na prática.
        </p>
      </div>

      {/* Speech Bubble (above the mascot, not overlapping) */}
      <SpeechBubble tailPosition="bottom-center" className="max-w-[220px]">
        <p className="text-sm text-[#293046] font-medium leading-snug text-center">
          Eu sou a Gina e vou te ajudar nessa missão!
        </p>
      </SpeechBubble>

      {/* Mascot — spring pop-in entrance */}
      <motion.div
        variants={mascotEnterVariants}
        initial="initial"
        animate="animate"
        className="w-48 sm:w-56 -mt-4"
      >
        <Base className="w-full h-auto" />
      </motion.div>

      {/* CTA */}
      <Button
        variant="neutral"
        onClick={() => navigate("/onboarding/nivel")}
      >
        Prepare-se para a jornada
      </Button>
    </div>
  );
}
