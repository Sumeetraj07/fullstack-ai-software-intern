"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Toasts() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-55 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = "text-blue-400";
        let bgColor = "bg-slate-800 border-blue-500/30";

        if (toast.type === "success") {
          Icon = CheckCircle;
          iconColor = "text-emerald-400";
          bgColor = "bg-slate-800 border-emerald-500/30";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-rose-400";
          bgColor = "bg-slate-800 border-rose-500/30";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-2xl text-white ${bgColor} transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 fade-in duration-200`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`h-5 w-5 ${iconColor} shrink-0`} />
              <p className="text-sm font-medium text-slate-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
