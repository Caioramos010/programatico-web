import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewSubjectAccuracy from "./ReviewSubjectAccuracy";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  XAxis: () => null,
  YAxis: () => null,
  Bar: () => null,
}));

describe("ReviewSubjectAccuracy", () => {
  it("renderiza assuntos e percentuais", () => {
    render(
      <ReviewSubjectAccuracy
        data={[
          { assunto: "Variáveis", percentual: 80, color: "#5aa4ff" },
          { assunto: "Funções", percentual: 60, color: "#7bdcb5" },
        ]}
      />,
    );

    expect(screen.getByText("Taxa de acerto por assunto")).toBeInTheDocument();
    expect(screen.getByText("Variáveis")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getAllByTestId("bar-chart")).toHaveLength(2);
  });
});
