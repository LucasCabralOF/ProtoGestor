// src/actions/safe.ts
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) return e.message;
    return "Erro inesperado";
  },
});
