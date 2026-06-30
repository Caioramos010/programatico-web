import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TrackMap from "./TrackMap";

const modules = [
  {
    id: 1,
    title: "Intro",
    type: "ACTIVITY" as const,
    order: 1,
    status: "UNLOCKED" as const,
    description: null,
    totalXp: 10,
  },
  {
    id: 2,
    title: "Teoria",
    type: "STUDY" as const,
    order: 2,
    status: "LOCKED" as const,
    description: null,
    totalXp: 5,
  },
];

describe("TrackMap", () => {
  it("abre popover e dispara onModuleClick ao começar", () => {
    const onModuleClick = vi.fn();
    render(
      <MemoryRouter>
        <TrackMap modules={modules} onModuleClick={onModuleClick} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /intro/i }));
    expect(screen.getByText("Intro")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /começar/i }));
    expect(onModuleClick).toHaveBeenCalledWith(modules[0]);
  });
});
