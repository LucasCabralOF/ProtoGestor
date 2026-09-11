"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient } from "@/actions/safe";
import { requireOrgId } from "@/lib/auth-tenant";
import { parseCurrencyInputToCents } from "@/lib/finance-utils";
import prisma from "@/lib/prisma";

const TransactionTypeSchema = z.enum(["income", "expense"]);

const CreateTransactionSchema = z.object({
  accountId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  contactId: z.string().optional().nullable(),
  description: z.string().min(2, "Descrição é obrigatória"),
  dueAt: z.string().optional().nullable(),
  paidNow: z.boolean().default(false),
  type: TransactionTypeSchema.default("income"),
  valueInput: z.string().min(1, "Valor é obrigatório"),
});

export const markTransactionPaidAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const tx = await prisma.transaction.findFirst({
      where: { id: parsedInput.id, orgId },
      select: { id: true, status: true },
    });

    if (!tx) {
      throw new Error("TRANSACTION_NOT_FOUND");
    }

    await prisma.transaction.update({
      where: { id: parsedInput.id },
      data: {
        status: "paid",
        paidAt: new Date(),
      },
    });

    revalidatePath("/finance");
    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { ok: true as const };
  });

export const cancelTransactionAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const tx = await prisma.transaction.findFirst({
      where: { id: parsedInput.id, orgId },
      select: { id: true },
    });

    if (!tx) {
      throw new Error("TRANSACTION_NOT_FOUND");
    }

    await prisma.transaction.update({
      where: { id: parsedInput.id },
      data: {
        status: "canceled",
      },
    });

    revalidatePath("/finance");
    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { ok: true as const };
  });

export const createTransactionAction = actionClient
  .inputSchema(CreateTransactionSchema)
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();
    const amountCents = parseCurrencyInputToCents(parsedInput.valueInput);

    if (amountCents <= 0) {
      throw new Error("INVALID_AMOUNT");
    }

    let dueDate: Date | null = null;
    if (parsedInput.dueAt && /^\d{4}-\d{2}-\d{2}$/.test(parsedInput.dueAt)) {
      dueDate = new Date(`${parsedInput.dueAt}T12:00:00-03:00`);
    } else {
      dueDate = new Date();
    }

    const isPaid = parsedInput.paidNow;
    const now = new Date();

    const created = await prisma.transaction.create({
      data: {
        orgId,
        type: parsedInput.type,
        status: isPaid ? "paid" : "pending",
        amountCents,
        description: parsedInput.description.trim(),
        dueAt: dueDate,
        paidAt: isPaid ? now : null,
        accountId: parsedInput.accountId || null,
        categoryId: parsedInput.categoryId || null,
        contactId: parsedInput.contactId || null,
      },
      select: { id: true },
    });

    revalidatePath("/finance");
    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { ok: true as const, id: created.id };
  });
