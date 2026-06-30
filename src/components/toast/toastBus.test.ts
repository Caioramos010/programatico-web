import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dismiss, getSnapshot, subscribe, toast } from "./toastBus";

describe("toastBus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    while (getSnapshot().length > 0) {
      dismiss(getSnapshot()[0].id);
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("push adiciona toast e notifica listeners", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    toast.success("Salvo!");

    expect(getSnapshot()).toHaveLength(1);
    expect(getSnapshot()[0]).toMatchObject({ message: "Salvo!", variant: "success" });
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("dismiss remove toast após timeout", () => {
    toast.info("Aviso");
    const id = getSnapshot()[0].id;

    vi.advanceTimersByTime(3500);

    expect(getSnapshot().find((t) => t.id === id)).toBeUndefined();
  });

  it("dismiss manual remove imediatamente", () => {
    toast.error("Falhou");
    const id = getSnapshot()[0].id;
    dismiss(id);
    expect(getSnapshot()).toHaveLength(0);
  });
});
