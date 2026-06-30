import { test, expect } from "@playwright/test";

test.describe("páginas públicas", () => {
  test("landing exibe marca e links de navegação", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("PROGRAMÁTICO").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /login/i })).toBeVisible();
  });

  test("login exibe formulário", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /entrar/i })).toBeVisible();
    await expect(page.getByPlaceholder("E-mail ou nome de usuário")).toBeVisible();
  });

  test("sobre, termos e privacidade carregam", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.getByText("PROGRAMÁTICO").first()).toBeVisible();

    await page.goto("/termos");
    await expect(page.getByRole("heading", { name: /termos de uso/i })).toBeVisible();

    await page.goto("/privacidade");
    await expect(page.getByRole("heading", { name: /política de privacidade/i })).toBeVisible();
  });

  test("rota inexistente exibe 404", async ({ page }) => {
    await page.goto("/rota-inexistente-xyz");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText("Página não encontrada")).toBeVisible();
  });
});

test.describe("admin", () => {
  test("login admin redireciona para formulário", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /entrar|login/i })).toBeVisible();
  });
});
