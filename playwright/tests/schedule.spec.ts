import { expect, test } from "@playwright/test";

test("loads the schedule page and renders base UI", async ({ page }) => {
  await page.goto("/schedule");

  await expect(page).toHaveURL(/\/schedule$/);
  
  // Verifica se renderiza o título (pode ser regex amplo para abranger locales)
  await expect(
    page.getByRole("heading", { name: /Agenda|Schedule/i })
  ).toBeVisible();

  // Verifica se o kpi 'Agendadas' / 'Scheduled' aparece
  await expect(page.locator("text=/Agendadas|Scheduled/i")).toBeVisible();

  // O dataset demo tem "Manutenção Preventiva" agendada para amanhã, 
  // que aparece no grid de /schedule
  await expect(page.locator("text=/Manutenção Preventiva/i")).toBeVisible();
});
