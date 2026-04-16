import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate demo user", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByTestId("card-login-card")).toBeVisible();
  await page.getByTestId("input-login-email").fill("demo@local.dev");
  await page.getByTestId("password-login-password").fill("Demo@1234");
  await page.getByTestId("button-login-submit").click();

  await page.waitForURL("**/dashboard");
  await expect(
    page.getByRole("heading", { name: /Bem-vindo,\s*Admin!/ }),
  ).toBeVisible();

  await page.context().storageState({ path: authFile });
});
