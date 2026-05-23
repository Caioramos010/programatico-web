import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { bubbleVariants } from "../hooks/useMascotAnimation";

type TailPosition = "bottom-left" | "bottom-center" | "bottom-right";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Where the triangular tail points */
  tailPosition?: TailPosition;
  /** Extra classes on the outer wrapper */
  className?: string;
}

const tailPositionClasses: Record<TailPosition, string> = {
  "bottom-left": "left-6",
  "bottom-center": "left-1/2 -translate-x-1/2",
  "bottom-right": "right-6",
};

export default function SpeechBubble({
  children,
  tailPosition = "bottom-center",
  className = "",
}: SpeechBubbleProps) {
  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className={`relative bg-white rounded-2xl px-5 py-3 shadow-lg ${className}`}
    >
      {children}

      {/* Tail */}
      <div
        className={`absolute -bottom-2 w-4 h-4 bg-white rotate-45 rounded-sm ${tailPositionClasses[tailPosition]}`}
      />
    </motion.div>
  );
}
