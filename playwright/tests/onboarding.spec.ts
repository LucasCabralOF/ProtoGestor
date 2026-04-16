import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("forces onboarding for a fresh signup and creates the first organization", async ({
  page,
}) => {
  const uniqueId = Date.now();
  const userName = `Usuário E2E ${uniqueId}`;
  const userEmail = `signup-e2e-${uniqueId}@local.dev`;
  const organizationName = `Organização E2E ${uniqueId}`;

  await page.goto("/signup");

  await page.getByTestId("input-signup-name").fill(userName);
  await page.getByTestId("input-signup-email").fill(userEmail);
  await page.getByTestId("password-signup-password").fill("Demo@1234");
  await page.getByTestId("button-signup-submit").click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByTestId("card-onboarding-card")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/onboarding$/);

  await page.getByTestId("input-onboarding-org-name").fill(organizationName);
  await page.getByTestId("button-onboarding-submit").click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", {
      name: new RegExp(`Bem-vindo,\\s*${userName}!`),
    }),
  ).toBeVisible();

  await page.goto("/settings");
  await expect(
    page.getByRole("main").getByText(organizationName, { exact: true }),
  ).toBeVisible();
});
