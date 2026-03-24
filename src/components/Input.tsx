import { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  darkBackground?: boolean;
}

export default function Input({
  type,
  error,
  darkBackground: _dark,
  className = "",
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1 w-full font-fredoka">
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={[
            "w-full px-4 py-3 rounded-xl",
            "bg-[var(--color-login-glass)] text-white",
            "border",
            "placeholder:uppercase placeholder:text-xs placeholder:tracking-widest placeholder:text-white/50",
            "outline-none focus:bg-white/15",
            "transition-all duration-200",
            isPassword ? "pr-12" : "",
            error
              ? "border-[var(--color-error-heart)] focus:border-[var(--color-error-heart)]"
              : "border-white/40 focus:border-white/80",
            className,
          ].join(" ")}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[var(--color-error-heart)] pl-1 overflow-hidden"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
