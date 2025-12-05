// كتبته مخصص لك (نسخة خفيفة)
import { createContext, useContext } from "react";

export interface ToastMessage {
  title?: string;
  description?: string;
}

export const ToastContext = createContext<(msg: ToastMessage) => void>(() => {});

export const useToast = () => {
  const ctx = useContext(ToastContext);
  return { toast: ctx };
};
