import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SettingsCheckbox from "./SettingsCheckbox";

describe("SettingsCheckbox", () => {
  it("dispara onChange ao marcar", () => {
    const onChange = vi.fn();
    render(
      <SettingsCheckbox
        id="notify"
        label="Receber e-mails"
        checked={false}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("fica desabilitado quando disabled é true", () => {
    render(
      <SettingsCheckbox
        id="notify"
        label="Receber e-mails"
        checked={false}
        disabled
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
