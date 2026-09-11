"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPrivateAction } from "@/actions/safeActions";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

const UpdatePlanSchema = z.object({
  plan: z.enum(["starter", "pro", "enterprise"]),
});

export const updateOrganizationPlanAction = createPrivateAction()
  .inputSchema(UpdatePlanSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { orgId, org } = await getTenantContext(ctx.session.user.id);

    // Apenas owner ou admin podem alterar o plano da organização
    if (org.role !== "owner" && org.role !== "admin") {
      throw new Error(
        "PERMISSAO_NEGADA: Apenas o proprietário pode alterar a assinatura da empresa.",
      );
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: orgId },
      data: {
        plan: parsedInput.plan,
      },
      select: {
        id: true,
        name: true,
        plan: true,
      },
    });

    try {
      await prisma.activityLog.create({
        data: {
          orgId,
          userId: ctx.session.user.id,
          message: `O plano da empresa foi alterado para ${parsedInput.plan}.`,
          entityType: "Organization",
          entityId: orgId,
        },
      });
    } catch (_err) {
      // Falha de log não impede a transição de plano
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return {
      success: true as const,
      plan: updatedOrg.plan,
    };
  });
