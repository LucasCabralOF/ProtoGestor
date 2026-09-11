import { z } from "zod";

// ==========================================
// 1. Tipos de Base / Domínio
// ==========================================
export type ThemeKey = "light" | "dark";
export type LocaleKey = "pt-BR" | "en";
export type OrgRoleKey = "owner" | "admin" | "member";

export type AppSettings = {
  theme: ThemeKey;
  locale: LocaleKey;
};

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string | null;
  role: OrgRoleKey;
  plan?: string | null;
  trialEndsAt?: Date | null;
};

export type User = {
  id: string;
  name: string;
  email?: string | null;
  role?: "admin" | "user";
};

export type ServiceOrderStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "canceled";

export type AppointmentStatus = "scheduled" | "done" | "canceled";

export type RecurrenceRule = "none" | "weekly" | "biweekly" | "monthly";

export type AddressInput = {
  city?: string | null;
  line1: string;
  line2?: string | null;
  postalCode?: string | null;
  state?: string | null;
};

// ==========================================
// 2. Schemas Zod Compartilhados
// ==========================================
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "draft",
    "scheduled",
    "in_progress",
    "completed",
    "canceled",
  ]),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["scheduled", "done", "canceled"]),
});

// ==========================================
// 3. Utilitários de Domínio
// ==========================================
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replaceAll(/\D/g, "");
  if (!digits) return "";

  if (digits.length >= 12 && digits.startsWith("55")) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function buildWhatsAppUrl(
  phone: string | null | undefined,
  message?: string,
): string | null {
  const sanitized = sanitizePhone(phone);
  if (!sanitized) return null;

  const baseUrl = `https://wa.me/${sanitized}`;
  if (message?.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }

  return baseUrl;
}

export function formatFullAddress(address?: AddressInput | null): string {
  if (!address || !address.line1) return "";
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  if (address.city) {
    parts.push(
      address.state ? `${address.city} - ${address.state}` : address.city,
    );
  }
  if (address.postalCode) parts.push(`CEP: ${address.postalCode}`);
  return parts.join(", ");
}

export function buildGoogleMapsUrl(
  address?: AddressInput | null,
): string | null {
  const full = formatFullAddress(address);
  if (!full) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
}

export function buildWazeUrl(address?: AddressInput | null): string | null {
  const full = formatFullAddress(address);
  if (!full) return null;
  return `https://waze.com/ul?q=${encodeURIComponent(full)}&navigate=yes`;
}
