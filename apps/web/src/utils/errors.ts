const ERROR_MESSAGES: Record<string, string> = {
  APPOINTMENT_INCOMPLETE:
    "Para agendar a primeira visita, preencha data, início e fim.",
  APPOINTMENT_INVALID_DATE:
    "Informe uma data válida entre 2000 e 2100 para o agendamento.",
  APPOINTMENT_INVALID_RANGE:
    "O horário final da visita precisa ser maior que o horário inicial.",
  APPOINTMENT_INVALID_TIME:
    "Informe horários válidos no formato HH:mm para o agendamento.",
  CLIENT_NOT_FOUND: "Cliente não encontrado.",
  CUSTOMER_NOT_FOUND: "O cliente selecionado não foi encontrado.",
  INVALID_SERVICE_VALUE: "Informe um valor válido para o serviço.",
  NO_ORG: "Nenhuma organização ativa foi encontrada para este usuário.",
  SERVICE_NOT_FOUND: "Serviço não encontrado.",
  UNAUTHENTICATED: "Sua sessão expirou. Faça login novamente.",
  UNAUTHORIZED: "Sua sessão expirou. Faça login novamente.",
  UNKNOWN_ERROR: "Ocorreu um erro inesperado.",
};

function getRawErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error.trim() || null;
  }

  if (error instanceof Error) {
    return error.message.trim() || null;
  }

  if (typeof error === "object") {
    const record = error as Record<string, unknown>;

    const serverError = record.serverError;
    if (typeof serverError === "string" && serverError.trim()) {
      return serverError.trim();
    }

    const message = record.message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return null;
}

export function resolveErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado.",
): string {
  const raw = getRawErrorMessage(error);
  if (!raw) return fallback;

  return ERROR_MESSAGES[raw] ?? raw;
}
