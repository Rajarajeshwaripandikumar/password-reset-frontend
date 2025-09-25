// src/components/AlertMessage.jsx
import React from "react";

/**
 * Simple alert message component.
 * Props: { type: "success" | "danger" | "", message: string }
 */
export default function AlertMessage({ type = "", message = "" }) {
  if (!message) return null;

  const base = "alert p-2 my-3";
  const cls =
    type === "success"
      ? `${base} alert-success`
      : type === "danger"
      ? `${base} alert-danger`
      : `${base} alert-info`;

  return (
    <div role="alert" className={cls}>
      {message}
    </div>
  );
}
