import { expect, test } from "@playwright/test";

test("filters clients by querystring and status without breaking the list", async ({
  page,
}) => {
  await page.goto("/clients");

  await expect(page.getByRole("heading", { name: "Clientes" })).toBeVisible();

  const searchInput = page.getByTestId("input-clients-search");
  await searchInput.fill("Maria");

  await expect(page).toHaveURL(/\/clients\?q=Maria/);
  await expect(page.getByText("Maria Souza")).toBeVisible();
  await expect(page.getByText("João Silva")).toHaveCount(0);

  await searchInput.clear();
  await expect(page).toHaveURL(/\/clients$/);
  await page.getByTestId("select-clients-status").selectOption("inactive");

  await expect(page).toHaveURL(/status=inactive/);
  await expect(page.getByText("Nenhum cliente cadastrado")).toBeVisible();
});

test("creates a new client through the private flow", async ({ page }) => {
  const clientName = `Cliente E2E ${Date.now()}`;

  await page.goto("/clients");
  await page.getByTestId("button-clients-add").click();

  const dialog = page.getByRole("dialog", { name: "Adicionar cliente" });

  await expect(dialog).toBeVisible();
  await dialog
    .getByPlaceholder("Ex: João da Silva / ACME Ltda")
    .fill(clientName);
  await dialog
    .getByPlaceholder("cliente@email.com")
    .fill(`cliente-e2e-${Date.now()}@local.dev`);
  await dialog.getByRole("button", { name: "Salvar" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("table-clients-list")).toContainText(
    clientName,
  );
});
