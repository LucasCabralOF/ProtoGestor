"use server";

import { z } from "zod";
import { createPrivateAction } from "@/actions/safeActions";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

export const addMemberAction = createPrivateAction()
  .inputSchema(
    z.object({
      email: z.string().trim().email(),
      name: z.string().trim().min(2).max(80),
      role: z.enum(["member", "admin"]).default("member"),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const { orgId, org } = await getTenantContext(ctx.session.user.id);

    // Somente owner e admin podem adicionar colaboradores
    if (org.role !== "owner" && org.role !== "admin") {
      throw new Error("PERMISSAO_NEGADA");
    }

    const email = parsedInput.email.toLowerCase();
    const name = parsedInput.name.trim();
    const role = parsedInput.role;

    let targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          email,
          name,
          emailVerified: false,
        },
      });
    }

    const existingMembership = await prisma.membership.findUnique({
      where: {
        orgId_userId: {
          orgId,
          userId: targetUser.id,
        },
      },
    });

    if (existingMembership) {
      throw new Error("USUARIO_JA_E_MEMBRO");
    }

    await prisma.membership.create({
      data: {
        orgId,
        userId: targetUser.id,
        role,
      },
    });

    return { ok: true as const };
  });

export const removeMemberAction = createPrivateAction()
  .inputSchema(
    z.object({
      membershipId: z.string().min(1),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const { orgId, org } = await getTenantContext(ctx.session.user.id);

    if (org.role !== "owner" && org.role !== "admin") {
      throw new Error("PERMISSAO_NEGADA");
    }

    const membership = await prisma.membership.findUnique({
      where: { id: parsedInput.membershipId },
    });

    if (!membership || membership.orgId !== orgId) {
      throw new Error("MEMBRO_NAO_ENCONTRADO");
    }

    if (membership.role === "owner") {
      const ownerCount = await prisma.membership.count({
        where: { orgId, role: "owner" },
      });
      if (ownerCount <= 1) {
        throw new Error("NAO_PODE_REMOVER_UNICO_DONO");
      }
    }

    await prisma.membership.delete({
      where: { id: parsedInput.membershipId },
    });

    return { ok: true as const };
  });

export const updateMemberRoleAction = createPrivateAction()
  .inputSchema(
    z.object({
      membershipId: z.string().min(1),
      role: z.enum(["member", "admin"]),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const { orgId, org } = await getTenantContext(ctx.session.user.id);

    if (org.role !== "owner") {
      throw new Error("APENAS_DONO_PODE_ALTERAR_PAPEIS");
    }

    const membership = await prisma.membership.findUnique({
      where: { id: parsedInput.membershipId },
    });

    if (!membership || membership.orgId !== orgId) {
      throw new Error("MEMBRO_NAO_ENCONTRADO");
    }

    await prisma.membership.update({
      where: { id: parsedInput.membershipId },
      data: { role: parsedInput.role },
    });

    return { ok: true as const };
  });
