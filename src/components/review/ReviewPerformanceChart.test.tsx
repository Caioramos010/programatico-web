import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewPerformanceChart from "./ReviewPerformanceChart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Line: () => null,
}));

describe("ReviewPerformanceChart", () => {
  it("renderiza título e gráfico com dados", () => {
    render(
      <ReviewPerformanceChart
        data={[
          { day: "Seg", acertos: 8, erros: 2 },
          { day: "Ter", acertos: 6, erros: 4 },
        ]}
      />,
    );

    expect(screen.getByText("Desempenho por dia")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
