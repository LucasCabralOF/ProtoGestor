import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("shows the public landing page for unauthenticated visitors", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("marketing-home")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Organize sua operacao de servicos em um so lugar",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("marketing-cta-primary")).toHaveAttribute(
    "href",
    "/signup",
  );
});

test("renders the public pricing page with the featured operation plan", async ({
  page,
}) => {
  await page.goto("/pricing");

  await expect(page.getByTestId("marketing-pricing")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Planos simples para quem quer sair do improviso",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("pricing-page-plan-operation")).toBeVisible();
  await expect(page.getByTestId("pricing-page-plan-founders")).toBeVisible();
});

test("protects private routes when there is no active session", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("card-login-card")).toBeVisible();
});
