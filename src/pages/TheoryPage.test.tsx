import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TheoryPage from "./TheoryPage";

const mockGetTheory = vi.hoisted(() => vi.fn());

vi.mock("../services/learnService", () => ({
  learnService: { getTheory: mockGetTheory },
}));

describe("TheoryPage", () => {
  beforeEach(() => {
    mockGetTheory.mockResolvedValue({
      moduleId: 1,
      moduleTitle: "Introdução",
      pages: [{ id: 1, title: "Página 1", description: null, order: 1, blocks: [] }],
    });
  });

  it("carrega conteúdo teórico", async () => {
    render(
      <MemoryRouter initialEntries={["/modulos/1/teorico"]}>
        <Routes>
          <Route path="/modulos/:moduloId/teorico" element={<TheoryPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Introdução")).toBeInTheDocument();
    });
  });
});
