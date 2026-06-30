import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "./AdminLayout";

describe("AdminLayout", () => {
  it("renderiza navegação admin", () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>,
    );

    expect(screen.getByText("programático")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Trilhas")).toBeInTheDocument();
  });
});
