import { expect, test } from "@playwright/test";

test("loads the seeded dashboard for the authenticated demo user", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: /Bem-vindo,\s*Admin!/ }),
  ).toBeVisible();
  await expect(page.getByText("Receita mensal")).toBeVisible();
  await expect(page.getByText(/^R\$\s*12\.450,00$/)).toBeVisible();
  await expect(page.getByText("Clientes ativos")).toBeVisible();
  await expect(
    page.getByText("Novo cliente cadastrado: Maria Souza"),
  ).toBeVisible();
  await expect(
    page.getByText("Manutenção Preventiva", { exact: true }),
  ).toBeVisible();
});

test("redirects the authenticated home route to dashboard", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: /Bem-vindo,\s*Admin!/ }),
  ).toBeVisible();
});
