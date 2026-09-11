import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  AUTH_TOKEN: "@protogestor/auth_token",
  ACTIVE_ORG_ID: "@protogestor/active_org_id",
  API_BASE_URL: "@protogestor/api_base_url",
} as const;

export async function getStoredAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
}

export async function setStoredAuthToken(token: string | null): Promise<void> {
  try {
    if (token) {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    }
  } catch {
    // Ignore storage failure
  }
}

export async function getStoredActiveOrgId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.ACTIVE_ORG_ID);
  } catch {
    return null;
  }
}

export async function setStoredActiveOrgId(
  orgId: string | null,
): Promise<void> {
  try {
    if (orgId) {
      await AsyncStorage.setItem(KEYS.ACTIVE_ORG_ID, orgId);
    } else {
      await AsyncStorage.removeItem(KEYS.ACTIVE_ORG_ID);
    }
  } catch {
    // Ignore storage failure
  }
}

export async function getStoredApiBaseUrl(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.API_BASE_URL);
  } catch {
    return null;
  }
}

export async function setStoredApiBaseUrl(url: string | null): Promise<void> {
  try {
    if (url) {
      await AsyncStorage.setItem(KEYS.API_BASE_URL, url);
    } else {
      await AsyncStorage.removeItem(KEYS.API_BASE_URL);
    }
  } catch {
    // Ignore storage failure
  }
}
