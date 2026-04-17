import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate demo user", async ({ request }) => {
  const response = await request.post("/api/auth/sign-in/email", {
    data: {
      email: "demo@local.dev",
      password: "Demo@1234",
      callbackURL: "/dashboard",
    },
  });

  expect(response.ok()).toBe(true);

  await request.storageState({ path: authFile });
});
