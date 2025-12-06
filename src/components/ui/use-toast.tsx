import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type ToastVariant = "default" | "success" | "error";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastInternal extends ToastOptions {
  id: number;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...options, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const getVariantClasses = (variant: ToastVariant = "default") => {
    switch (variant) {
      case "success":
        return "border-emerald-200 bg-emerald-50 text-emerald-900";
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      default:
        return "border-slate-200 bg-white text-slate-900";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Container */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-72 rounded-xl border shadow-xl px-4 py-3 text-sm animate-slide-in ${getVariantClasses(
              t.variant
            )}`}
          >
            {t.title && (
              <p className="font-semibold leading-snug">{t.title}</p>
            )}
            {t.description && (
              <p className="mt-1 text-xs opacity-80 leading-snug">
                {t.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
