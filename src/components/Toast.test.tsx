import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ToastContainer from "./Toast";
import { dismiss, getSnapshot, toast } from "./toast/toastBus";

describe("ToastContainer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    while (getSnapshot().length > 0) {
      dismiss(getSnapshot()[0].id);
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza toast ativo e permite fechar manualmente", () => {
    toast.success("Operação concluída");
    render(<ToastContainer />);

    expect(screen.getByRole("status")).toHaveTextContent("Operação concluída");

    fireEvent.click(screen.getByRole("button", { name: /fechar notificação/i }));
    expect(getSnapshot()).toHaveLength(0);
  });
});
