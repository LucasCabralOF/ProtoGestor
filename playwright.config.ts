import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3101);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./playwright/tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "pt-BR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
  webServer: {
    command: "bash scripts/start-playwright-webserver.sh",
    env: {
      ...process.env,
      BETTER_AUTH_URL: baseURL,
      PLAYWRIGHT_PORT: String(port),
    },
    reuseExistingServer: false,
    stderr: "pipe",
    stdout: "pipe",
    timeout: 120_000,
    url: baseURL,
  },
});
