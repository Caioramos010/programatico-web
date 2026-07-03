import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserStatsBar from "./UserStatsBar";

const stats = {
  totalXp: 1200,
  currentLives: 4,
  maxLives: 5,
  secondsUntilNextLife: null,
  secondsPerLife: 1800,
  unlimitedLives: false,
  currentStreak: 3,
  maxStreak: 10,
};

describe("UserStatsBar", () => {
  it("renderiza xp e vidas", () => {
    render(
      <MemoryRouter>
        <UserStatsBar stats={stats} />
      </MemoryRouter>,
    );

    expect(screen.getByText("1.200 XP")).toBeInTheDocument();
    expect(screen.getByText("4/5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
