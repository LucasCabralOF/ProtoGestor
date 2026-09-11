import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId, org, organizations } = await getTenantContext();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      user,
      activeOrg: org,
      organizations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
