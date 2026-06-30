import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TrackBar from "./TrackBar";

const track = {
  id: 1,
  title: "Fundamentos",
  description: "Base",
  icon: null,
  modules: [],
  completedPercentage: 40,
  totalModules: 5,
  completedModules: 2,
};

describe("TrackBar", () => {
  it("mostra skeleton quando loading", () => {
    const { container } = render(<TrackBar track={null} loading />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("mostra título e progresso", () => {
    render(<TrackBar track={track} />);
    expect(screen.getByText("Fundamentos")).toBeInTheDocument();
    expect(screen.getByText("40% completo")).toBeInTheDocument();
    expect(screen.getByText("2/5")).toBeInTheDocument();
  });
});
