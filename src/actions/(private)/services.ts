"use server";

import { z } from "zod";
import { actionClient } from "@/actions/safe";
import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

const ServiceStatusSchema = z.enum([
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "canceled",
]);

const BaseServiceSchema = z.object({
  title: z.string().min(2, "Título é obrigatório"),
  description: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  status: ServiceStatusSchema.default("draft"),
  valueInput: z.string().optional().nullable(),
  appointmentDate: z.string().optional().nullable(),
  appointmentStartTime: z.string().optional().nullable(),
  appointmentEndTime: z.string().optional().nullable(),
  locationText: z.string().optional().nullable(),
  clearAppointment: z.boolean().optional(),
});

const APPOINTMENT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const APPOINTMENT_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const MIN_APPOINTMENT_DATE = "2000-01-01";
const MAX_APPOINTMENT_DATE = "2100-12-31";

function normalizeNullable(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function parseCurrencyToCents(value: string | null | undefined): number {
  const normalized = normalizeNullable(value);
  if (!normalized) return 0;

  const cleaned = normalized
    .replaceAll("R$", "")
    .replaceAll(/\s+/g, "")
    .replaceAll(".", "")
    .replace(",", ".");

  const amount = Number(cleaned);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("INVALID_SERVICE_VALUE");
  }

  return Math.round(amount * 100);
}

function appointmentStatusFromServiceStatus(
  status: z.infer<typeof ServiceStatusSchema>,
): "scheduled" | "done" | "canceled" {
  if (status === "completed") return "done";
  if (status === "canceled") return "canceled";
  return "scheduled";
}

function assertAppointmentDate(value: string): string {
  if (
    !APPOINTMENT_DATE_REGEX.test(value) ||
    value < MIN_APPOINTMENT_DATE ||
    value > MAX_APPOINTMENT_DATE
  ) {
    throw new Error("APPOINTMENT_INVALID_DATE");
  }

  return value;
}

function assertAppointmentTime(value: string): string {
  if (!APPOINTMENT_TIME_REGEX.test(value)) {
    throw new Error("APPOINTMENT_INVALID_TIME");
  }

  return value;
}

function buildAppointmentWindow(input: {
  appointmentDate?: string | null;
  appointmentEndTime?: string | null;
  appointmentStartTime?: string | null;
  locationText?: string | null;
}) {
  const appointmentDate = normalizeNullable(input.appointmentDate);
  const appointmentStartTime = normalizeNullable(input.appointmentStartTime);
  const appointmentEndTime = normalizeNullable(input.appointmentEndTime);
  const locationText = normalizeNullable(input.locationText);

  const hasAnyAppointmentField =
    !!appointmentDate ||
    !!appointmentStartTime ||
    !!appointmentEndTime ||
    !!locationText;

  if (!hasAnyAppointmentField) {
    return null;
  }

  if (!appointmentDate || !appointmentStartTime || !appointmentEndTime) {
    throw new Error("APPOINTMENT_INCOMPLETE");
  }

  const validDate = assertAppointmentDate(appointmentDate);
  const validStartTime = assertAppointmentTime(appointmentStartTime);
  const validEndTime = assertAppointmentTime(appointmentEndTime);

  const startsAt = new Date(`${validDate}T${validStartTime}:00-03:00`);
  const endsAt = new Date(`${validDate}T${validEndTime}:00-03:00`);

  if (
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    endsAt <= startsAt
  ) {
    throw new Error("APPOINTMENT_INVALID_RANGE");
  }

  return {
    startsAt,
    endsAt,
    locationText,
  };
}

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
      select: { id: true },
    });

    if (!order) {
      throw new Error("SERVICE_NOT_FOUND");
    }

    await prisma.$transaction([
      prisma.serviceOrder.update({
        where: { id: parsedInput.id },
        data: { status: parsedInput.status },
      }),
      prisma.appointment.updateMany({
        where: {
          orgId,
          serviceOrderId: parsedInput.id,
        },
        data: {
          status: appointmentStatusFromServiceStatus(parsedInput.status),
        },
      }),
    ]);

    return { ok: true as const };
  });
