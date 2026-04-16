"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createPrivateAction } from "@/actions/safeActions";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import {
  buildUniqueOrganizationSlug,
  slugifyOrganizationName,
} from "@/lib/org-slug";
import prisma from "@/lib/prisma";
import { ACTIVE_ORG_COOKIE } from "@/utils/constants";

const ACTIVE_ORG_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const createOrganizationAction = createPrivateAction()
  .inputSchema(
    z.object({
      name: z.string().trim().min(2).max(80),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    try {
      await getTenantContext(ctx.session.user.id);
      throw new Error("USER_ALREADY_HAS_ORGANIZATION");
    } catch (error) {
      if (!isNoOrgError(error)) {
        throw error;
      }
    }

    const trimmedName = parsedInput.name.trim();
    const baseSlug = slugifyOrganizationName(trimmedName);

    const created = await prisma.$transaction(async (tx) => {
      const similarSlugs = await tx.organization.findMany({
        where: {
          slug: {
            startsWith: baseSlug,
          },
        },
        select: {
          slug: true,
        },
      });

      const slug = buildUniqueOrganizationSlug(
        baseSlug,
        similarSlugs.flatMap((organization) =>
          organization.slug ? [organization.slug] : [],
        ),
      );

      const organization = await tx.organization.create({
        data: {
          name: trimmedName,
          slug,
          memberships: {
            create: {
              role: "owner",
              userId: ctx.session.user.id,
            },
          },
        },
        select: {
          id: true,
          slug: true,
        },
      });

      return organization;
    });

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, created.id, {
      maxAge: ACTIVE_ORG_COOKIE_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
    });

    return {
      id: created.id,
      ok: true as const,
      slug: created.slug,
    };
  });
