// src/components/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import API from "../api"; // expects requestPasswordReset
import AlertMessage from "./AlertMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({ type: "danger", message: "Please enter a valid email address." });
      return;
    }
    setLoading(true);

    try {
      const res = await API.requestPasswordReset(email);
      setAlert({ type: "success", message: (res && (res.message || res.success)) || "Password reset link has been sent." });
      setSent(true);
      setEmail("");
    } catch (err) {
      const message = err?.rawBody?.message || err?.message || `Error sending reset link (status ${err?.status || "unknown"})`;
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.message) {
      const t = setTimeout(() => setAlert({ type: "", message: "" }), 6000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  return (
    <div className="form-center">
      <div className="auth-card">
        <h1 className="h1-hero">Forgot Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || sent}
              placeholder="you@example.com"
            />
          </div>

          <button className="btn btn-accent w-100" disabled={loading || sent}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Sending...
              </>
            ) : sent ? (
              "Link Sent"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <AlertMessage {...alert} />
        <div className="footer-note">
          We'll send a secure link to your email to reset your password.
        </div>
      </div>
    </div>
  );
}
