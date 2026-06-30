import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SuccessPage from "./SuccessPage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

describe("SuccessPage", () => {
  it("renderiza estado customizado e navega no CTA", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/sucesso",
            state: {
              title: "Senha redefinida",
              message: "Tudo certo",
              ctaLabel: "Ir para login",
              ctaTo: "/login",
            },
          },
        ]}
      >
        <Routes>
          <Route path="/sucesso" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Senha redefinida")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ir para login/i }));
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
