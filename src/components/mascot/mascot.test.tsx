import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Base from "./Base";
import Excited from "./Excited";
import Sad from "./Sad";
import Thinking from "./Thinking";

describe("mascot components", () => {
  it.each([
    ["Base", Base],
    ["Excited", Excited],
    ["Sad", Sad],
    ["Thinking", Thinking],
  ] as const)("renderiza %s", (_name, Component) => {
    const { container } = render(<Component className="w-10 h-10" />);
    expect(container.firstChild).toBeTruthy();
  });
});
