import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PraticarPage from "./PraticarPage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

describe("PraticarPage", () => {
  it("lista modos e navega", () => {
    render(
      <MemoryRouter>
        <PraticarPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("ERROS")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /erros/i }));
    expect(navigate).toHaveBeenCalledWith("/praticar/erros");
  });
});
