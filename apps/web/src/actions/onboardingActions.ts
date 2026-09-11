"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createPrivateAction } from "@/actions/safeActions";
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
          plan: "starter",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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
          name: true,
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
      name: created.name,
      ok: true as const,
      slug: created.slug,
    };
  });

export const joinOrganizationAction = createPrivateAction()
  .inputSchema(
    z.object({
      codeOrSlug: z.string().trim().min(2).max(80),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const term = parsedInput.codeOrSlug.trim();

    const organization = await prisma.organization.findFirst({
      where: {
        OR: [
          { slug: term.toLowerCase() },
          { id: term },
          { name: { equals: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!organization) {
      throw new Error("ORGANIZATION_NOT_FOUND");
    }

    // Check if user is already a member
    const existing = await prisma.membership.findUnique({
      where: {
        orgId_userId: {
          orgId: organization.id,
          userId: ctx.session.user.id,
        },
      },
    });

    if (!existing) {
      await prisma.membership.create({
        data: {
          orgId: organization.id,
          userId: ctx.session.user.id,
          role: "member",
        },
      });
    }

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, organization.id, {
      maxAge: ACTIVE_ORG_COOKIE_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
    });

    return {
      id: organization.id,
      name: organization.name,
      ok: true as const,
      slug: organization.slug,
    };
  });
