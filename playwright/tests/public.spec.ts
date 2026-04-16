import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("redirects unauthenticated root access to login", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("card-login-card")).toBeVisible();
});

test("protects private routes when there is no active session", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("card-login-card")).toBeVisible();
});
