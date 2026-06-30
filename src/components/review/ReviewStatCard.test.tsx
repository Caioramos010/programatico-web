import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewStatCard from "./ReviewStatCard";

describe("ReviewStatCard", () => {
  it("renderiza título, valor e subtítulo", () => {
    render(
      <ReviewStatCard
        title="XP total"
        value="1.250"
        subtitle="Nível atual"
      />,
    );

    expect(screen.getByText("XP total")).toBeInTheDocument();
    expect(screen.getByText("1.250")).toBeInTheDocument();
    expect(screen.getByText("Nível atual")).toBeInTheDocument();
  });

  it("aplica classe customizada no valor", () => {
    render(
      <ReviewStatCard
        title="Acertos"
        value="85%"
        subtitle="Últimos 7 dias"
        valueClassName="text-green-400"
      />,
    );

    const value = screen.getByText("85%");
    expect(value.className).toContain("text-green-400");
  });
});
