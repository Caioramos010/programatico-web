import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

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
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </header>

      {/* ── Content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3 py-8 border-t border-gray-border">
        <span className="text-lg font-gloria text-white tracking-wide">
          PROGRAMÁTICO
        </span>
        <div className="flex gap-6 text-sm text-text-muted">
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
        <p className="text-xs text-text-muted">
          © 2026 Programático. Aprenda programação de forma divertida.
        </p>
      </footer>
    </div>
  );
}
