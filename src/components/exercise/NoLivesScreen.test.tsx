import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NoLivesScreen from "./NoLivesScreen";

vi.mock("../mascot", () => ({
  Sad: () => <div data-testid="mascot-sad" />,
}));

describe("NoLivesScreen", () => {
  it("exibe mensagem e CTAs", () => {
    const onSubscribe = vi.fn();
    const onBack = vi.fn();

    render(<NoLivesScreen onSubscribe={onSubscribe} onBack={onBack} />);

    expect(screen.getByText("Suas vidas acabaram")).toBeInTheDocument();
    expect(screen.getByTestId("mascot-sad")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /assine agora/i }));
    expect(onSubscribe).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /talvez depois/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
