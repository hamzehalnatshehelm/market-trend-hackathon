import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

const TOKEN_KEY =
  (import.meta.env.VITE_TOKEN_STORAGE_KEY as string) || "authToken";
const EMAIL_KEY = "authEmail";

interface AuthState {
  token: string | null;
  email: string | null;
}

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedEmail = localStorage.getItem(EMAIL_KEY);
      return {
        token: storedToken,
        email: storedEmail,
      };
    } catch {
      return { token: null, email: null };
    }
  });

  const login = (token: string, email: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, email);
    setAuth({ token, email });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setAuth({ token: null, email: null });
  };

  // 🟦 تسجيل خروج تلقائي عند الدخول إلى login أو register
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      logout();
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        email: auth.email,
        isAuthenticated: !!auth.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
