import { expect, test } from "@playwright/test";

test("loads the schedule page and renders calendar UI", async ({ page }) => {
  await page.goto("/schedule");

  await expect(page).toHaveURL(/\/schedule$/);

  // Verifica se renderiza o título
  await expect(
    page.getByRole("heading", { name: /Agenda|Schedule/i }),
  ).toBeVisible();

  // Verifica se o kpi 'Agendadas' / 'Scheduled' aparece
  await expect(page.locator("text=/Agendadas|Scheduled/i")).toBeVisible();

  // Verifica a presença do calendário (classe rbc-calendar é padrão do react-big-calendar)
  await expect(page.locator(".rbc-calendar")).toBeVisible();

  // O dataset demo tem "Manutenção Preventiva" agendada para amanhã,
  // que aparece no grid de /schedule como um evento do calendário
  await expect(
    page.locator(".rbc-event", { hasText: /Manutenção Preventiva/i }),
  ).toBeVisible();
});
