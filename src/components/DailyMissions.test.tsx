import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DailyMissions from "./DailyMissions";

describe("DailyMissions", () => {
  it("renderiza missões", () => {
    render(
      <DailyMissions
        missions={[
          {
            missionId: 1,
            title: "Complete 3 exercícios",
            type: "XP",
            currentProgress: 1,
            goal: 3,
            xpReward: 20,
            completed: false,
          },
        ]}
      />,
    );

    expect(screen.getByText("Complete 3 exercícios")).toBeInTheDocument();
    expect(screen.getByText("+20XP")).toBeInTheDocument();
  });
});
