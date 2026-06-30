import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewLevelProgressChart from "./ReviewLevelProgressChart";

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

describe("ReviewLevelProgressChart", () => {
  it("calcula e exibe progresso entre níveis", () => {
    render(<ReviewLevelProgressChart currentLevel={3} currentXp={50} nextLevelXp={200} />);

    expect(screen.getByText("Nível 3")).toBeInTheDocument();
    expect(screen.getByText("Nível 4")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("limita progresso entre 0 e 100", () => {
    const { rerender } = render(
      <ReviewLevelProgressChart currentLevel={1} currentXp={500} nextLevelXp={100} />,
    );
    expect(screen.getByText("100%")).toBeInTheDocument();

    rerender(<ReviewLevelProgressChart currentLevel={1} currentXp={-10} nextLevelXp={100} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
