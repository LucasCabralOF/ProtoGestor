import { z } from "zod";

export const ServiceStatusSchema = z.enum([
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "canceled",
]);

export const BaseServiceSchema = z.object({
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

export const APPOINTMENT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const APPOINTMENT_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
export const MIN_APPOINTMENT_DATE = "2000-01-01";
export const MAX_APPOINTMENT_DATE = "2100-12-31";

export function normalizeNullable(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function parseCurrencyToCents(value: string | null | undefined): number {
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

export function appointmentStatusFromServiceStatus(
  status: z.infer<typeof ServiceStatusSchema>,
): "scheduled" | "done" | "canceled" {
  if (status === "completed") return "done";
  if (status === "canceled") return "canceled";
  return "scheduled";
}

export function assertAppointmentDate(value: string): string {
  if (
    !APPOINTMENT_DATE_REGEX.test(value) ||
    value < MIN_APPOINTMENT_DATE ||
    value > MAX_APPOINTMENT_DATE
  ) {
    throw new Error("APPOINTMENT_INVALID_DATE");
  }

  return value;
}

export function assertAppointmentTime(value: string): string {
  if (!APPOINTMENT_TIME_REGEX.test(value)) {
    throw new Error("APPOINTMENT_INVALID_TIME");
  }

  return value;
}

export function buildAppointmentWindow(input: {
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
