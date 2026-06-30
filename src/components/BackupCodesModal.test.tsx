import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import BackupCodesModal from "./BackupCodesModal";

describe("BackupCodesModal", () => {
  it("lista códigos e chama onDismiss", () => {
    const onDismiss = vi.fn();
    render(<BackupCodesModal codes={["ABC123", "DEF456"]} onDismiss={onDismiss} />);

    expect(screen.getByText("Códigos de recuperação")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("DEF456")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /já guardei/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("copia códigos para a área de transferência", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<BackupCodesModal codes={["ABC123", "DEF456"]} onDismiss={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /copiar todos/i }));

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("ABC123\nDEF456");
    });

    vi.unstubAllGlobals();
  });
});
