import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

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
  // نقرأ من localStorage مرة واحدة فقط عند أول render
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window === "undefined") {
      return { token: null, email: null };
    }

    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedEmail = localStorage.getItem(EMAIL_KEY);

      if (storedToken && storedEmail) {
        return { token: storedToken, email: storedEmail };
      }

      return { token: null, email: null };
    } catch {
      // لو صار خطأ في localStorage (حجب، private mode...) نرجع حالة فاضية
      return { token: null, email: null };
    }
  });

  const login = (token: string, email: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(EMAIL_KEY, email);
    } catch {
      // تجاهل أخطاء localStorage بصمت
    }

    setAuth({ token, email });
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);
    } catch {
      // تجاهل أخطاء localStorage
    }

    setAuth({ token: null, email: null });
  };

  const value: AuthContextValue = {
    token: auth.token,
    email: auth.email,
    isAuthenticated: !!auth.token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
