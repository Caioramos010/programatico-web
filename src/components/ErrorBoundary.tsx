import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg-primary)] font-fredoka text-center px-6">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Algo deu errado
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-md">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 rounded-xl bg-white text-[var(--color-bg-primary)] font-semibold hover:bg-white/90 transition-colors cursor-pointer"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
