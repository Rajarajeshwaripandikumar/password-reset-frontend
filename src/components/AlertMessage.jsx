// src/components/AlertMessage.jsx
import React from "react";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

/**
 * Walmart-style alert message component
 * Props: { type: "success" | "danger" | "info", message: string }
 */
export default function AlertMessage({ type = "info", message = "" }) {
  if (!message) return null;

  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50 border-green-200 text-green-700",
    },
    danger: {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50 border-red-200 text-red-700",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200 text-blue-700",
    },
  };

  const { icon, bg } = styles[type] || styles.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-sm ${bg} animate-fadeIn`}
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <p className="text-sm font-medium leading-snug">{message}</p>
    </div>
  );
}
