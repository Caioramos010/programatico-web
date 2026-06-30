import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RoundedDropdown from "./RoundedDropdown";

describe("RoundedDropdown", () => {
  it("abre menu, seleciona opção e fecha", () => {
    const onChange = vi.fn();
    render(
      <RoundedDropdown
        value="A"
        options={["A", "B", "C"]}
        onChange={onChange}
        buttonClassName="btn"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /a/i }));
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("B");
    expect(screen.queryByRole("button", { name: "C" })).not.toBeInTheDocument();
  });

  it("fecha ao clicar fora", () => {
    render(
      <div>
        <RoundedDropdown
          value="A"
          options={["A", "B"]}
          onChange={vi.fn()}
          buttonClassName="dropdown-trigger"
        />
        <button type="button">fora</button>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "fora" }));
    expect(screen.queryByRole("button", { name: "B" })).not.toBeInTheDocument();

    fireEvent.click(document.querySelector(".dropdown-trigger")!);
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "fora" }));
    expect(screen.queryByRole("button", { name: "B" })).not.toBeInTheDocument();
  });
});
