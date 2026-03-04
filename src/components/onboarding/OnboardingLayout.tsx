import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

export default function OnboardingLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
