"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createPublicAction } from "@/actions/safeActions";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function getHeaders() {
  return await headers();
}

type CreateModel = { create: (args: unknown) => Promise<unknown> };

function getModel(client: unknown, key: string): CreateModel | null {
  if (!client || typeof client !== "object") return null;
  const record = client as Record<string, unknown>;
  const model = record[key];
  if (!model || typeof model !== "object") return null;
  const maybeCreate = (model as Record<string, unknown>).create;
  if (typeof maybeCreate !== "function") return null;
  return model as CreateModel;
}

async function provisionUser(userId: string) {
  const settings = getModel(prisma, "userSettings");
  const permissions = getModel(prisma, "userPermissions");
  if (settings) await settings.create({ data: { userId } });
  if (permissions) await permissions.create({ data: { userId } });
}

export const signIn = createPublicAction()
  .inputSchema(
    z.object({
      email: z.email(),
      pass: z.string().min(8),
      callbackURL: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    return await auth.api.signInEmail({
      headers: await getHeaders(),
      body: {
        email: parsedInput.email,
        password: parsedInput.pass,
        callbackURL: parsedInput.callbackURL ?? "/dashboard",
      },
    });
  });

export const signUp = createPublicAction()
  .inputSchema(
    z.object({
      name: z.string().min(2),
      email: z.email(),
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
    if (!userId) throw new Error("USER_NOT_CREATED");

    await provisionUser(userId);
    return result;
  });

export const signOut = createPublicAction().action(async () => {
  return await auth.api.signOut({ headers: await getHeaders() });
});
