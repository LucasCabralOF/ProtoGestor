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
      name: "Saia do WhatsApp e organize seus serviços de verdade",
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
      name: "Escolha como você quer mudar sua rotina",
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
