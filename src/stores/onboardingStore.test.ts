import { describe, expect, it } from "vitest";
import { useOnboardingStore } from "./onboardingStore";

describe("onboardingStore", () => {
  it("setLevel e reset alteram estado", () => {
    useOnboardingStore.getState().reset();
    expect(useOnboardingStore.getState().level).toBeNull();

    useOnboardingStore.getState().setLevel("intermediate");
    expect(useOnboardingStore.getState().level).toBe("intermediate");

    useOnboardingStore.getState().reset();
    expect(useOnboardingStore.getState().level).toBeNull();
  });
});
