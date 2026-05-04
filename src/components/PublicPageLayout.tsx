import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-fredoka bg-bg-primary">
      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto w-full">
        <Link
          to="/"
          className="text-2xl font-gloria text-white tracking-wide hover:opacity-80 transition-opacity"
        >
          PROGRAMÁTICO
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-base text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Início
        </Link>
      </header>

      {/* ── Content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3 py-8 border-t border-gray-border">
        <span className="text-lg font-gloria text-white tracking-wide">
          PROGRAMÁTICO
        </span>
        <div className="flex gap-6 text-lg text-[var(--color-text-secondary)]">
          <Link to="/sobre" className="hover:text-white transition-colors">
            Sobre
          </Link>
          <Link to="/termos" className="hover:text-white transition-colors">
            Termos
          </Link>
          <Link to="/privacidade" className="hover:text-white transition-colors">
            Privacidade
          </Link>
        </div>
        <p className="text-lg text-[var(--color-text-secondary)]">
          © 2026 Programático. Aprenda programação de forma divertida.
        </p>
      </footer>
    </div>
  );
}
