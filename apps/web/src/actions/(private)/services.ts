"use server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  appointmentStatusFromServiceStatus,
  BaseServiceSchema,
  buildAppointmentWindow,
  normalizeNullable,
  parseCurrencyToCents,
  ServiceStatusSchema,
} from "@/actions/(private)/services-utils";
import { actionClient } from "@/actions/safe";
import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import { buildRecurrenceSuggestion } from "@/lib/recurrence-utils";

async function ensureCustomerBelongsToOrg(
  orgId: string,
  customerId: string | null | undefined,
): Promise<string | null> {
  const normalizedCustomerId = normalizeNullable(customerId);
  if (!normalizedCustomerId) return null;

  const customer = await prisma.contact.findFirst({
    where: {
      id: normalizedCustomerId,
      orgId,
      roles: {
        some: {
          orgId,
          role: "customer",
        },
      },
    },
    select: { id: true },
  });

  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  return customer.id;
}

export const createServiceAction = actionClient
  .inputSchema(BaseServiceSchema)
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();
    const customerId = await ensureCustomerBelongsToOrg(
      orgId,
      parsedInput.customerId,
    );
    const valueCents = parseCurrencyToCents(parsedInput.valueInput);
    const appointmentWindow = buildAppointmentWindow(parsedInput);

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.create({
        data: {
          orgId,
          title: parsedInput.title.trim(),
          description: normalizeNullable(parsedInput.description),
          customerId,
          status: parsedInput.status,
          valueCents,
        },
        select: { id: true },
      });

      if (appointmentWindow) {
        await tx.appointment.create({
          data: {
            orgId,
            serviceOrderId: order.id,
            startsAt: appointmentWindow.startsAt,
            endsAt: appointmentWindow.endsAt,
            locationText: appointmentWindow.locationText,
            status: appointmentStatusFromServiceStatus(parsedInput.status),
          },
        });
      }

      return order;
    });

    return { ok: true as const, id: created.id };
  });

export const updateServiceAction = actionClient
  .inputSchema(
    BaseServiceSchema.extend({
      id: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();
    const customerId = await ensureCustomerBelongsToOrg(
      orgId,
      parsedInput.customerId,
    );
    const valueCents = parseCurrencyToCents(parsedInput.valueInput);
    const appointmentWindow = buildAppointmentWindow(parsedInput);

    await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findFirst({
        where: {
          id: parsedInput.id,
          orgId,
        },
        include: {
          appointments: {
            orderBy: [{ startsAt: "desc" }],
            take: 1,
            select: { id: true },
          },
        },
      });

      if (!order) {
        throw new Error("SERVICE_NOT_FOUND");
      }

      await tx.serviceOrder.update({
        where: { id: parsedInput.id },
        data: {
          title: parsedInput.title.trim(),
          description: normalizeNullable(parsedInput.description),
          customerId,
          status: parsedInput.status,
          valueCents,
        },
      });

      const currentAppointment = order.appointments[0] ?? null;
      const nextAppointmentStatus = appointmentStatusFromServiceStatus(
        parsedInput.status,
      );

      if (appointmentWindow) {
        if (currentAppointment) {
          await tx.appointment.update({
            where: { id: currentAppointment.id },
            data: {
              startsAt: appointmentWindow.startsAt,
              endsAt: appointmentWindow.endsAt,
              locationText: appointmentWindow.locationText,
              status: nextAppointmentStatus,
            },
          });
        } else {
          await tx.appointment.create({
            data: {
              orgId,
              serviceOrderId: parsedInput.id,
              startsAt: appointmentWindow.startsAt,
              endsAt: appointmentWindow.endsAt,
              locationText: appointmentWindow.locationText,
              status: nextAppointmentStatus,
            },
          });
        }
      } else if (parsedInput.clearAppointment && currentAppointment) {
        await tx.appointment.delete({
          where: { id: currentAppointment.id },
        });
      } else {
        await tx.appointment.updateMany({
          where: {
            orgId,
            serviceOrderId: parsedInput.id,
          },
          data: {
            status: nextAppointmentStatus,
          },
        });
      }
    });

    return { ok: true as const };
  });

export const setServiceStatusAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
      status: ServiceStatusSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const order = await prisma.serviceOrder.findFirst({
      where: {
        id: parsedInput.id,
        orgId,
      },
      select: {
        id: true,
        title: true,
        valueCents: true,
        customerId: true,
        customer: {
          select: { id: true, name: true, phone: true, whatsapp: true },
        },
        appointments: {
          orderBy: [{ startsAt: "desc" }],
          take: 1,
          select: {
            startsAt: true,
            endsAt: true,
            locationText: true,
            recurrenceRule: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("SERVICE_NOT_FOUND");
    }

    await prisma.$transaction(async (tx) => {
      await tx.serviceOrder.update({
        where: { id: parsedInput.id },
        data: { status: parsedInput.status },
      });

      await tx.appointment.updateMany({
        where: {
          orgId,
          serviceOrderId: parsedInput.id,
        },
        data: {
          status: appointmentStatusFromServiceStatus(parsedInput.status),
        },
      });

      // Fechamento do Ciclo: Criação de conta a receber se a OS foi concluída com valor > 0
      if (parsedInput.status === "completed" && order.valueCents > 0) {
        const txDesc = `OS #${order.id.slice(-6).toUpperCase()} - ${order.title}`;
        const existingTx = await tx.transaction.findFirst({
          where: {
            orgId,
            description: txDesc,
          },
          select: { id: true },
        });

        if (!existingTx) {
          await tx.transaction.create({
            data: {
              orgId,
              type: "income",
              status: "pending",
              amountCents: order.valueCents,
              description: txDesc,
              contactId: order.customerId,
              dueAt: new Date(),
            },
          });
        }
      }
    });

    let suggestion = null;
    const lastApp = order.appointments[0] ?? null;
    if (
      parsedInput.status === "completed" &&
      lastApp &&
      lastApp.recurrenceRule !== "none"
    ) {
      suggestion = buildRecurrenceSuggestion({
        baseDate: lastApp.startsAt,
        recurrenceRule: lastApp.recurrenceRule,
        serviceOrderId: order.id,
        serviceTitle: order.title,
        customerId: order.customer?.id ?? null,
        customerName: order.customer?.name ?? null,
        customerPhone:
          order.customer?.whatsapp || order.customer?.phone || null,
        locationText: lastApp.locationText,
        startTime: format(lastApp.startsAt, "HH:mm"),
        endTime: format(lastApp.endsAt, "HH:mm"),
      });
    }

    revalidatePath("/services");
    revalidatePath("/finance");
    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { ok: true as const, suggestion };
  });
