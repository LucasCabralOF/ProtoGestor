// src/actions/(private)/clients.ts
"use server";

import { z } from "zod";
import { actionClient } from "@/actions/safe";
import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

const ContactTypeSchema = z.enum(["person", "company"]);

const BaseClientSchema = z.object({
  type: ContactTypeSchema.default("person"),
  name: z.string().min(2, "Nome é obrigatório"),
  legalName: z.string().optional().nullable(),
  document: z.string().optional().nullable(),
  email: z.string().email("E-mail inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),

  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
});

export const createClientAction = actionClient
  .schema(BaseClientSchema)
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const created = await prisma.$transaction(async (tx) => {
      const c = await tx.contact.create({
        data: {
          orgId,
          type: parsedInput.type,
          name: parsedInput.name.trim(),
          legalName: parsedInput.legalName?.trim() || null,
          document: parsedInput.document?.trim() || null,
          email: parsedInput.email?.trim().toLowerCase() || null,
          phone: parsedInput.phone?.trim() || null,
          whatsapp: parsedInput.whatsapp?.trim() || null,
          notes: parsedInput.notes?.trim() || null,
          isActive: true,
          roles: {
            create: {
              orgId,
              role: "customer",
            },
          },
        },
        select: { id: true },
      });

      const hasAddress = Boolean(parsedInput.addressLine1?.trim());
      if (hasAddress) {
        await tx.address.create({
          data: {
            orgId,
            contactId: c.id,
            label: parsedInput.type === "company" ? "Empresa" : "Principal",
            line1: parsedInput.addressLine1?.trim(),
            line2: parsedInput.addressLine2?.trim() || null,
            city: parsedInput.city?.trim() || null,
            state: parsedInput.state?.trim() || null,
            postalCode: parsedInput.postalCode?.trim() || null,
            country: "BR",
            isPrimary: true,
          },
        });
      }

      return c;
    });

    return { ok: true as const, id: created.id };
  });

export const updateClientAction = actionClient
  .schema(
    BaseClientSchema.extend({
      id: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    await prisma.$transaction(async (tx) => {
      const exists = await tx.contact.findFirst({
        where: { id: parsedInput.id, orgId },
        select: { id: true },
      });

      if (!exists) {
        throw new Error("CLIENT_NOT_FOUND");
      }

      await tx.contact.update({
        where: { id: parsedInput.id },
        data: {
          type: parsedInput.type,
          name: parsedInput.name.trim(),
          legalName: parsedInput.legalName?.trim() || null,
          document: parsedInput.document?.trim() || null,
          email: parsedInput.email?.trim().toLowerCase() || null,
          phone: parsedInput.phone?.trim() || null,
          whatsapp: parsedInput.whatsapp?.trim() || null,
          notes: parsedInput.notes?.trim() || null,
        },
        select: { id: true },
      });

      const line1 = parsedInput.addressLine1?.trim() || "";
      const wantsAddress = line1.length > 0;

      const primary = await tx.address.findFirst({
        where: { orgId, contactId: parsedInput.id, isPrimary: true },
        select: { id: true },
      });

      if (!wantsAddress) {
        return;
      }

      if (primary) {
        await tx.address.update({
          where: { id: primary.id },
          data: {
            line1,
            line2: parsedInput.addressLine2?.trim() || null,
            city: parsedInput.city?.trim() || null,
            state: parsedInput.state?.trim() || null,
            postalCode: parsedInput.postalCode?.trim() || null,
          },
        });
      } else {
        await tx.address.create({
          data: {
            orgId,
            contactId: parsedInput.id,
            label: parsedInput.type === "company" ? "Empresa" : "Principal",
            line1,
            line2: parsedInput.addressLine2?.trim() || null,
            city: parsedInput.city?.trim() || null,
            state: parsedInput.state?.trim() || null,
            postalCode: parsedInput.postalCode?.trim() || null,
            country: "BR",
            isPrimary: true,
          },
        });
      }
    });

    return { ok: true as const };
  });

export const setClientActiveAction = actionClient
  .schema(
    z.object({
      id: z.string().min(1),
      isActive: z.boolean(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const c = await prisma.contact.findFirst({
      where: { id: parsedInput.id, orgId },
      select: { id: true },
    });

    if (!c) {
      throw new Error("CLIENT_NOT_FOUND");
    }

    await prisma.contact.update({
      where: { id: parsedInput.id },
      data: { isActive: parsedInput.isActive },
    });

    return { ok: true as const };
  });
