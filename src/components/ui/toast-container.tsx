"use client";

import React from "react";
import { useToastStore } from "@/lib/store/toast-store";
import { X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm min-w-[300px] animate-in slide-in-from-right ${
            toast.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : toast.type === "error" 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
