import { describe, expect, it } from "vitest";
import { bubbleVariants, mascotEnterVariants, pageVariants } from "./useMascotAnimation";

describe("useMascotAnimation variants", () => {
  it("pageVariants define estados initial, animate e exit", () => {
    expect(pageVariants.initial).toMatchObject({ opacity: 0, y: 20 });
    expect(pageVariants.animate).toMatchObject({ opacity: 1, y: 0 });
    expect(pageVariants.exit).toMatchObject({ opacity: 0 });
  });

  it("mascotEnterVariants usa scale e delay", () => {
    expect(mascotEnterVariants.initial).toMatchObject({ scale: 0.92 });
    expect(mascotEnterVariants.animate).toMatchObject({ scale: 1 });
  });

  it("bubbleVariants define pop-in do balão", () => {
    expect(bubbleVariants.initial).toMatchObject({ opacity: 0, scale: 0.7 });
    expect(bubbleVariants.animate).toMatchObject({ opacity: 1, scale: 1 });
  });
});
