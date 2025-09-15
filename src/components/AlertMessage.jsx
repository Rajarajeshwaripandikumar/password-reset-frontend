import React, { useEffect } from "react";

export default function AlertMessage({ type = "info", message, autoCloseMs }) {
  const [visible, setVisible] = React.useState(!!message);

  useEffect(() => {
    if (message) setVisible(true);
    if (autoCloseMs && message) {
      const t = setTimeout(() => setVisible(false), autoCloseMs);
      return () => clearTimeout(t);
    }
  }, [message, autoCloseMs]);

  if (!message || !visible) return null;

  const cls = {
    success: "alert-success",
    danger: "alert-danger",
    info: "alert-info",
    warning: "alert-warning"
  }[type] || "alert-info";

  return (
    <div className={`alert ${cls} mt-3`} role="alert">
      {message}
    </div>
  );
}
