// src/actions/safeActions.ts
"use server";

import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  // Aqui você pode padronizar como lida com erros
  handleServerError(e) {
    return { message: e instanceof Error ? e.message : "Erro" };
  }
});

export function createPublicAction() {
  return actionClient;
}

// (Opcional) exigindo auth
export function createPrivateAction() {
  return actionClient.use(async ({ next }) => {
    // aqui você checa sessão, etc.
    return next();
  });
}