"use server";

import { z } from "zod";
import { actionClient } from "@/actions/safe";
import { requireOrgId } from "@/lib/auth-tenant";
import { buildRecurrenceDates } from "@/lib/schedule-utils";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const AppointmentStatusSchema = z.enum(["scheduled", "done", "canceled"]);
const RecurrenceRuleSchema = z.enum(["none", "weekly", "biweekly", "monthly"]);

const APPOINTMENT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const APPOINTMENT_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Constrói um par (startsAt, endsAt) a partir de strings de data/hora.
 * Lança erro descritivo se os valores forem inválidos.
 */
function buildDateWindow(date: string, startTime: string, endTime: string) {
  if (!APPOINTMENT_DATE_REGEX.test(date)) throw new Error("INVALID_DATE");
  if (!APPOINTMENT_TIME_REGEX.test(startTime)) throw new Error("INVALID_TIME");
  if (!APPOINTMENT_TIME_REGEX.test(endTime)) throw new Error("INVALID_TIME");

  const startsAt = new Date(`${date}T${startTime}:00-03:00`);
  const endsAt = new Date(`${date}T${endTime}:00-03:00`);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    throw new Error("INVALID_DATE");
  }
  if (endsAt <= startsAt) throw new Error("INVALID_TIME_RANGE");

  return { startsAt, endsAt };
}

const BaseAppointmentSchema = z.object({
  date: z.string().regex(APPOINTMENT_DATE_REGEX, "Data inválida"),
  startTime: z.string().regex(APPOINTMENT_TIME_REGEX, "Hora inválida"),
  endTime: z.string().regex(APPOINTMENT_TIME_REGEX, "Hora inválida"),
  locationText: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  serviceOrderId: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  recurrenceRule: RecurrenceRuleSchema.default("none"),
  // clampado em [1, 52] pelo buildRecurrenceDates
  recurrenceCount: z.number().int().min(1).max(52).default(1),
});

// ---------------------------------------------------------------------------
// createAppointmentAction
// ---------------------------------------------------------------------------

export const createAppointmentAction = actionClient
  .inputSchema(BaseAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const { startsAt, endsAt } = buildDateWindow(
      parsedInput.date,
      parsedInput.startTime,
      parsedInput.endTime,
    );

    const dates = buildRecurrenceDates(
      startsAt,
      endsAt,
      parsedInput.recurrenceRule,
      parsedInput.recurrenceCount,
    );

    // Valida serviceOrderId pertence à org quando fornecido
    const serviceOrderId = parsedInput.serviceOrderId?.trim() || null;
    if (serviceOrderId) {
      const order = await prisma.serviceOrder.findFirst({
        where: { id: serviceOrderId, orgId },
        select: { id: true },
      });
      if (!order) throw new Error("SERVICE_NOT_FOUND");
    }

    // Primeira ocorrência é a raiz; as demais recebem parentId apontando para ela
    await prisma.$transaction(async (tx) => {
      // Cria a raiz
      const root = await tx.appointment.create({
        data: {
          orgId,
          startsAt: dates[0].startsAt,
          endsAt: dates[0].endsAt,
          locationText: parsedInput.locationText?.trim() || null,
          notes: parsedInput.notes?.trim() || null,
          serviceOrderId,
          employeeId: parsedInput.employeeId?.trim() || null,
          recurrenceRule: parsedInput.recurrenceRule,
          recurrenceCount: dates.length,
        },
        select: { id: true },
      });

      // Cria as ocorrências restantes com parentId da raiz
      if (dates.length > 1) {
        await tx.appointment.createMany({
          data: dates.slice(1).map((d) => ({
            orgId,
            startsAt: d.startsAt,
            endsAt: d.endsAt,
            locationText: parsedInput.locationText?.trim() || null,
            notes: parsedInput.notes?.trim() || null,
            serviceOrderId,
            employeeId: parsedInput.employeeId?.trim() || null,
            recurrenceRule: parsedInput.recurrenceRule,
            recurrenceCount: dates.length,
            parentId: root.id,
          })),
        });
      }
    });

    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// updateAppointmentAction — edita apenas o appointment selecionado
// ---------------------------------------------------------------------------

export const updateAppointmentAction = actionClient
  .inputSchema(
    BaseAppointmentSchema.extend({
      id: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const existing = await prisma.appointment.findFirst({
      where: { id: parsedInput.id, orgId },
      select: { id: true },
    });
    if (!existing) throw new Error("APPOINTMENT_NOT_FOUND");

    const { startsAt, endsAt } = buildDateWindow(
      parsedInput.date,
      parsedInput.startTime,
      parsedInput.endTime,
    );

    const serviceOrderId = parsedInput.serviceOrderId?.trim() || null;
    if (serviceOrderId) {
      const order = await prisma.serviceOrder.findFirst({
        where: { id: serviceOrderId, orgId },
        select: { id: true },
      });
      if (!order) throw new Error("SERVICE_NOT_FOUND");
    }

    await prisma.appointment.update({
      where: { id: parsedInput.id },
      data: {
        startsAt,
        endsAt,
        locationText: parsedInput.locationText?.trim() || null,
        notes: parsedInput.notes?.trim() || null,
        serviceOrderId,
        employeeId: parsedInput.employeeId?.trim() || null,
      },
    });

    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// setAppointmentStatusAction
// ---------------------------------------------------------------------------

export const setAppointmentStatusAction = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
      status: AppointmentStatusSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    const { orgId } = await requireOrgId();

    const existing = await prisma.appointment.findFirst({
      where: { id: parsedInput.id, orgId },
      select: { id: true },
    });
    if (!existing) throw new Error("APPOINTMENT_NOT_FOUND");

    await prisma.appointment.update({
      where: { id: parsedInput.id },
      data: { status: parsedInput.status },
    });

    return { ok: true as const };
  });
