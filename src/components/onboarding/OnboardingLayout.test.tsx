import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { useAuthStore } from "../../stores/authStore";

const sampleUser = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: null as null,
};

function renderLayout(initialPath = "/onboarding") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<p>Onboarding child</p>} />
        </Route>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/aprender" element={<p>Aprender</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("OnboardingLayout", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("redireciona visitante para home", () => {
    renderLayout();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renderiza outlet para usuário sem nível", () => {
    useAuthStore.getState().login("token", sampleUser);
    renderLayout();
    expect(screen.getByText("Onboarding child")).toBeInTheDocument();
  });

  it("redireciona usuário com nível para aprender", () => {
    useAuthStore.getState().login("token", {
      ...sampleUser,
      nivelHabilidade: "BEGINNER",
    });
    renderLayout();
    expect(screen.getByText("Aprender")).toBeInTheDocument();
  });
});
