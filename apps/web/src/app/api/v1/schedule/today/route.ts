import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { orgId } = await getTenantContext();

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    const appointments = await prisma.appointment.findMany({
      where: {
        orgId,
        startsAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startsAt: "asc" },
      include: {
        employee: {
          select: { id: true, name: true },
        },
        serviceOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                addresses: {
                  select: {
                    line1: true,
                    line2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      date: startOfDay.toISOString().slice(0, 10),
      total: appointments.length,
      appointments: appointments.map((apt) => ({
        id: apt.id,
        status: apt.status,
        startsAt: apt.startsAt.toISOString(),
        endsAt: apt.endsAt.toISOString(),
        locationText: apt.locationText,
        notes: apt.notes,
        employee: apt.employee,
        serviceOrder: apt.serviceOrder
          ? {
              id: apt.serviceOrder.id,
              title: apt.serviceOrder.title,
              status: apt.serviceOrder.status,
              customer: apt.serviceOrder.customer
                ? {
                    id: apt.serviceOrder.customer.id,
                    name: apt.serviceOrder.customer.name,
                    phone: apt.serviceOrder.customer.phone,
                    address: apt.serviceOrder.customer.addresses[0] ?? null,
                  }
                : null,
            }
          : null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
