import {
  type AppointmentStatus,
  type ServiceOrderStatus,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { Platform } from "react-native";

// No emulador Android, localhost da máquina host é 10.0.2.2
const DEFAULT_HOST =
  Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export type MobileApiConfig = {
  authToken?: string | null;
  orgId?: string | null;
};

let currentConfig: MobileApiConfig = {
  authToken: null,
  orgId: null,
};

export function setMobileApiConfig(config: Partial<MobileApiConfig>) {
  currentConfig = { ...currentConfig, ...config };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (currentConfig.authToken) {
    headers.set("Authorization", `Bearer ${currentConfig.authToken}`);
  }

  if (currentConfig.orgId) {
    headers.set("x-org-id", currentConfig.orgId);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export type TodayScheduleResponse = {
  date: string;
  total: number;
  appointments: Array<{
    id: string;
    status: AppointmentStatus;
    startsAt: string;
    endsAt: string;
    locationText: string | null;
    notes: string | null;
    employee: { id: string; name: string } | null;
    serviceOrder: {
      id: string;
      title: string;
      status: ServiceOrderStatus;
      customer: {
        id: string;
        name: string;
        phone: string | null;
        address: {
          line1: string;
          line2?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
        } | null;
      } | null;
    } | null;
  }>;
};

export async function fetchTodaySchedule(): Promise<TodayScheduleResponse> {
  return apiFetch<TodayScheduleResponse>("/api/v1/schedule/today");
}

export async function updateServiceOrderStatus(
  serviceOrderId: string,
  status: ServiceOrderStatus,
): Promise<{
  success: boolean;
  serviceOrderId: string;
  status: ServiceOrderStatus;
}> {
  // Valida com schema do pacote compartilhado antes de enviar
  const parsed = updateOrderStatusSchema.parse({ status });

  return apiFetch(`/api/v1/services/${serviceOrderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: parsed.status }),
  });
}

export async function fetchMe(): Promise<{
  user: { id: string; name: string; email: string | null } | null;
  activeOrg: { id: string; name: string; slug: string | null; role: string };
  organizations: Array<{ id: string; name: string; role: string }>;
}> {
  return apiFetch("/api/v1/me");
}
