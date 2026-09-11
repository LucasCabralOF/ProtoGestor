import { updateOrderStatusSchema } from "@protogestor/shared";
import { type NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { orgId } = await getTenantContext();
    const { id: serviceOrderId } = await context.params;

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_STATUS", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const updated = await prisma.serviceOrder.updateMany({
      where: {
        id: serviceOrderId,
        orgId,
      },
      data: {
        status: parsed.data.status,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "SERVICE_ORDER_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      serviceOrderId,
      status: parsed.data.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
