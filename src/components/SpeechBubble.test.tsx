import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SpeechBubble from "./SpeechBubble";

describe("SpeechBubble", () => {
  it("renderiza children", () => {
    render(<SpeechBubble>Mensagem da Gina</SpeechBubble>);
    expect(screen.getByText("Mensagem da Gina")).toBeInTheDocument();
  });
});
