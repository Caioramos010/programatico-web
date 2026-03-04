import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Leaf, Atom, Globe } from "lucide-react";
import Button from "../../components/Button";
import {
  pageVariants,
  mascotEnterVariants,
} from "../../hooks/useMascotAnimation";
import { Thinking } from "../../components/mascot";

const levels = [
  { id: "beginner",     label: "Iniciante",    Icon: Leaf  },
  { id: "intermediate", label: "Intermediário", Icon: Atom  },
  { id: "advanced",     label: "Avançado",     Icon: Globe },
] as const;

type Level = (typeof levels)[number]["id"];

export default function OnboardingNivelPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Level | null>(null);

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
          Nível de habilidade
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Para começar, vamos definir o seu nível de experiência em lógica de
          programação.
        </p>
      </div>

      {/* Mascot */}
      <motion.div
        variants={mascotEnterVariants}
        initial="initial"
        animate="animate"
        className="w-44 sm:w-52 relative"
      >
        <Thinking className="w-full h-auto" />
      </motion.div>

      {/* Level cards */}
      <div className="flex gap-3">
        {levels.map(({ id, label, Icon }) => {
          const isSelected = selected === id;
          return (
            <motion.button
              key={id}
              onClick={() => setSelected(id)}
              whileTap={{ scale: 0.95 }}
              className={[
                "flex flex-col items-center gap-2 px-5 py-5 rounded-2xl border-2 transition-colors cursor-pointer",
                "text-sm font-medium",
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] hover:border-white/40 hover:text-white",
              ].join(" ")}
            >
              <Icon size={28} />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Next — appears when level chosen */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 8 }}
        transition={{ duration: 0.25 }}
      >
        <Button
          variant="neutral"
          disabled={!selected}
          onClick={() => selected && navigate("/onboarding/conclusao")}
        >
          Continuar
        </Button>
      </motion.div>
    </motion.div>
  );
}
