import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
          React.createElement(prop, props, children),
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });
