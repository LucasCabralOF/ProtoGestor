"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createPublicAction } from "@/actions/safeActions";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Helpers ---------------------------------------------------------------------
async function getHeaders() {
  return await headers();
}

type CreateModel = {
  create: (args: unknown) => Promise<unknown>;
};

function getModel(client: unknown, key: string): CreateModel | null {
  if (!client || typeof client !== "object") return null;

  const record = client as Record<string, unknown>;
  const model = record[key];

  if (!model || typeof model !== "object") return null;

  const maybeCreate = (model as Record<string, unknown>)["create"];
  if (typeof maybeCreate !== "function") return null;

  return model as CreateModel;
}

async function provisionUser(userId: string) {
  // Se você tiver essas tabelas no schema, elas serão criadas.
  // Se não tiver, o código simplesmente ignora.
  const settings = getModel(prisma, "userSettings");
  const permissions = getModel(prisma, "userPermissions");

  if (settings) {
    await settings.create({ data: { userId } });
  }

  if (permissions) {
    await permissions.create({ data: { userId } });
  }
}

// -----------------------------------------------------------------------------
// SIGN IN
// -----------------------------------------------------------------------------
export const signIn = createPublicAction()
  .inputSchema(
    z.object({
      email: z.string().email(),
      pass: z.string().min(8),
      callbackURL: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const result = await auth.api.signInEmail({
      headers: await getHeaders(),
      body: {
        email: parsedInput.email,
        password: parsedInput.pass,
        callbackURL: parsedInput.callbackURL ?? "/dashboard",
      },
    });

    return result;
  });

// -----------------------------------------------------------------------------
// SIGN UP
// -----------------------------------------------------------------------------
export const signUp = createPublicAction()
  .inputSchema(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      pass: z.string().min(8),
      callbackURL: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const result = await auth.api.signUpEmail({
      headers: await getHeaders(),
      body: {
        name: parsedInput.name,
        email: parsedInput.email,
        password: parsedInput.pass,
        callbackURL: parsedInput.callbackURL ?? "/dashboard",
      },
    });

    const userId = result?.user?.id;
    if (!userId) {
      // Mantém simples; se você tiver ErrorAction, pode trocar por ele.
      throw new Error("USER_NOT_CREATED");
    }

    await provisionUser(userId);

    return result;
  });

// -----------------------------------------------------------------------------
// SIGN OUT
// -----------------------------------------------------------------------------
export const signOut = createPublicAction().action(async () => {
  const result = await auth.api.signOut({
    headers: await getHeaders(),
  });

  return result;
});