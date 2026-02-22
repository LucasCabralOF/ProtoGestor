import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // se for mesma origem, pode omitir.
  // baseURL: "http://localhost:3001"
});
