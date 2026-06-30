import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ConclusionScreen from "./ConclusaoScreen";

vi.mock("../mascot", () => ({
  Excited: () => <div data-testid="mascot-excited" />,
}));

describe("ConclusionScreen", () => {
  it("exibe estatísticas formatadas e continua", () => {
    const onContinue = vi.fn();
    render(
      <ConclusionScreen
        xpEarned={120}
        accuracy={85}
        durationSeconds={125}
        onContinue={onContinue}
      />,
    );

    expect(screen.getByText("Você conseguiu!")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("2:05")).toBeInTheDocument();
    expect(screen.getByText("120XP")).toBeInTheDocument();
    expect(screen.getByTestId("mascot-excited")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
