import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchMe,
  getApiBaseUrl,
  loginTechnician,
  setApiBaseUrl,
  setMobileApiConfig,
} from "./api";
import {
  getStoredActiveOrgId,
  getStoredApiBaseUrl,
  getStoredAuthToken,
  setStoredActiveOrgId,
  setStoredApiBaseUrl,
  setStoredAuthToken,
} from "./storage";

export type AuthUser = {
  id: string;
  name: string;
  email: string | null;
};

export type AuthOrg = {
  id: string;
  name: string;
  slug?: string | null;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  activeOrg: AuthOrg | null;
  organizations: AuthOrg[];
  isAuthenticated: boolean;
  isLoading: boolean;
  apiBaseUrl: string;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  selectOrg: (orgId: string) => Promise<void>;
  changeApiBaseUrl: (url: string) => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function MobileAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeOrg, setActiveOrg] = useState<AuthOrg | null>(null);
  const [organizations, setOrganizations] = useState<AuthOrg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiBaseUrl, setApiBaseUrlState] = useState(getApiBaseUrl());

  const refreshMe = useCallback(async () => {
    try {
      const meData = await fetchMe();
      setUser(meData.user);
      setActiveOrg(meData.activeOrg);
      setOrganizations(meData.organizations);
      if (meData.activeOrg?.id) {
        await setStoredActiveOrgId(meData.activeOrg.id);
        setMobileApiConfig({ orgId: meData.activeOrg.id });
      }
    } catch {
      // Offline ou token inválido
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      try {
        const storedUrl = await getStoredApiBaseUrl();
        if (storedUrl) {
          setApiBaseUrl(storedUrl);
          setApiBaseUrlState(storedUrl);
        }

        const token = await getStoredAuthToken();
        const orgId = await getStoredActiveOrgId();

        if (token) {
          setMobileApiConfig({ authToken: token, orgId });
          await refreshMe();
        }
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [refreshMe]);

  const login = async (email: string, pass: string) => {
    const res = await loginTechnician(email, pass);
    if (res.token) {
      await setStoredAuthToken(res.token);
      setMobileApiConfig({ authToken: res.token });
      await refreshMe();
    }
  };

  const logout = async () => {
    await setStoredAuthToken(null);
    await setStoredActiveOrgId(null);
    setMobileApiConfig({ authToken: null, orgId: null });
    setUser(null);
    setActiveOrg(null);
    setOrganizations([]);
  };

  const selectOrg = async (orgId: string) => {
    await setStoredActiveOrgId(orgId);
    setMobileApiConfig({ orgId });
    await refreshMe();
  };

  const changeApiBaseUrl = async (url: string) => {
    setApiBaseUrl(url);
    setApiBaseUrlState(url);
    await setStoredApiBaseUrl(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeOrg,
        organizations,
        isAuthenticated: !!user,
        isLoading,
        apiBaseUrl,
        login,
        logout,
        selectOrg,
        changeApiBaseUrl,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMobileAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useMobileAuth must be used within a MobileAuthProvider");
  }
  return context;
}
