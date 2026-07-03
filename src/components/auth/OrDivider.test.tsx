import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import OrDivider from "./OrDivider";

describe("OrDivider", () => {
  it("renderiza texto OU", () => {
    render(<OrDivider />);
    expect(screen.getByText("OU")).toBeInTheDocument();
  });
});
