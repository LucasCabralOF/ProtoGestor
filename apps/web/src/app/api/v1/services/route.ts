import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { orgId } = await getTenantContext();

    const orders = await prisma.serviceOrder.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            qty: true,
            unitPriceCents: true,
          },
        },
      },
    });

    return NextResponse.json({
      total: orders.length,
      orders: orders.map((ord) => ({
        id: ord.id,
        code: `OS #${ord.id.slice(-4).toUpperCase()}`,
        title: ord.title,
        status: ord.status,
        clientName: ord.customer?.name || "Cliente Avulso",
        totalCents: ord.valueCents,
        valueFormatted: (ord.valueCents / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        items: ord.items.map((i) => i.title),
        notes: ord.description || undefined,
        createdAt: ord.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
