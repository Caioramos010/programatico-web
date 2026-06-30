import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CorrectFeedback from "./FeedbackCorreto";

describe("CorrectFeedback", () => {
  it("renderiza assuntos e dispara onProceed", () => {
    const onProceed = vi.fn();
    render(
      <CorrectFeedback relatedTopics={["Arrays", "Loops"]} onProceed={onProceed} />,
    );

    expect(screen.getByText("Ótima resposta!")).toBeInTheDocument();
    expect(screen.getByText("Arrays")).toBeInTheDocument();
    expect(screen.getByText("Loops")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /prosseguir/i }));
    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
