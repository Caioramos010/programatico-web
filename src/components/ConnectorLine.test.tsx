import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ConnectorLine from "./ConnectorLine";

describe("ConnectorLine", () => {
  it("renderiza svg", () => {
    const { container } = render(<ConnectorLine active />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
