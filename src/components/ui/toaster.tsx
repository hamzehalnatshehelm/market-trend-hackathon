import React, { useState, useCallback } from "react";
import { ToastContext, ToastMessage } from "./use-toast";

export const Toaster: React.FC = ({ children }: any) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((msg: ToastMessage) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed top-5 right-5 space-y-3 z-[9999]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-white shadow-xl border border-slate-200 rounded-lg px-4 py-3 w-72 animate-slide-in-right"
          >
            {msg.title && (
              <p className="font-semibold text-slate-900 text-sm">{msg.title}</p>
            )}
            {msg.description && (
              <p className="text-slate-600 text-xs mt-1">{msg.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
