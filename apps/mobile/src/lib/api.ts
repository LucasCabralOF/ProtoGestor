import {
  type AppointmentStatus,
  type ServiceOrderStatus,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { Platform } from "react-native";

// No emulador Android, localhost da máquina host é 10.0.2.2
const DEFAULT_HOST =
  Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";

let activeBaseUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export function getApiBaseUrl(): string {
  return activeBaseUrl;
}

export function setApiBaseUrl(url: string) {
  activeBaseUrl = url.replace(/\/$/, "");
}

export type MobileApiConfig = {
  authToken?: string | null;
  orgId?: string | null;
};

let currentConfig: MobileApiConfig = {
  authToken: null,
  orgId: null,
};

export function getMobileApiConfig(): MobileApiConfig {
  return { ...currentConfig };
}

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

  const response = await fetch(`${activeBaseUrl}${endpoint}`, {
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

export type MobileServiceOrder = {
  id: string;
  code: string;
  title: string;
  clientName: string;
  status: ServiceOrderStatus;
  totalCents: number;
  valueFormatted: string;
  items: string[];
  notes?: string;
  createdAt: string;
};

export type MobileServiceOrdersResponse = {
  total: number;
  orders: MobileServiceOrder[];
};

export async function fetchServiceOrders(): Promise<MobileServiceOrdersResponse> {
  return apiFetch<MobileServiceOrdersResponse>("/api/v1/services");
}

export async function updateServiceOrderStatus(
  serviceOrderId: string,
  status: ServiceOrderStatus,
): Promise<{
  success: boolean;
  serviceOrderId: string;
  status: ServiceOrderStatus;
}> {
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

export async function loginTechnician(
  email: string,
  password: string,
): Promise<{
  token?: string;
  user?: { id: string; name: string; email: string };
}> {
  const res = await fetch(`${activeBaseUrl}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || err.error || `Falha no login: HTTP ${res.status}`,
    );
  }

  return res.json();
}
