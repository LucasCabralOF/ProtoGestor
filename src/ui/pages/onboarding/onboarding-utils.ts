/**
 * Utilitários puros para o wizard de onboarding.
 *
 * Separados do componente para permitir teste unitário independente
 * e reutilização no componente de checklist do dashboard.
 */

export type OnboardingStep1Data = {
  name: string;
  segment: string;
};

export type OnboardingStep2Data = {
  clientCount: string;
  tool: string;
};

export type OnboardingWizardData = {
  step1: Partial<OnboardingStep1Data>;
  step2: Partial<OnboardingStep2Data>;
  /** Nome da organização criada (preenchido após submit do step 1) */
  createdOrgName?: string;
};

export const ONBOARDING_SEGMENT_IDS = [
  "maintenance",
  "hvac",
  "cleaning",
  "gardens",
  "facilities",
  "tech",
  "other",
] as const;

export const ONBOARDING_CLIENT_COUNT_IDS = ["few", "medium", "many"] as const;

export const ONBOARDING_TOOL_IDS = [
  "whatsapp",
  "spreadsheet",
  "paper",
  "other",
] as const;

/**
 * Valida os campos do step 1 (nome da empresa e segmento).
 * Retorna lista de field names com erro — vazia significa válido.
 */
export function validateStep1(data: Partial<OnboardingStep1Data>): string[] {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length < 2) errors.push("name");
  if (!data.segment) errors.push("segment");
  return errors;
}

/**
 * Valida os campos do step 2 (faixa de clientes e ferramenta atual).
 * Step 2 é client-only — nenhum dado é enviado ao servidor.
 */
export function validateStep2(data: Partial<OnboardingStep2Data>): string[] {
  const errors: string[] = [];
  if (!data.clientCount) errors.push("clientCount");
  if (!data.tool) errors.push("tool");
  return errors;
}

/**
 * Determina se a conta é nova e deve exibir o checklist de ativação.
 * Recebe o total de contatos com role "customer" — vindo do server.
 */
export function isNewAccount(contactCount: number): boolean {
  return contactCount === 0;
}
