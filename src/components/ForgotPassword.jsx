// src/components/ForgotPassword.jsx
import React, { useState, useEffect, useRef } from "react";
import API from "../api"; // expects requestPasswordReset(email)
import AlertMessage from "./AlertMessage";
import { Mail } from "lucide-react";

/**
 * Walmart/District-styled ForgotPassword component
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // autofocus input for convenience
    inputRef.current?.focus();
  }, []);

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
      const successMessage =
        (res && (res.message || res.success || res.data?.message)) ||
        "Password reset link has been sent to your email.";
      setAlert({ type: "success", message: successMessage });
      setSent(true);
      setEmail("");
    } catch (err) {
      const message =
        err?.rawBody?.message || err?.message || `Error sending reset link (status ${err?.status || "unknown"})`;
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!alert.message) return;
    const t = setTimeout(() => setAlert({ type: "", message: "" }), 6000);
    return () => clearTimeout(t);
  }, [alert]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_6px_20px_rgba(2,6,23,0.12)] p-6"
        style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[rgba(0,113,220,0.08)]">
            <Mail className="w-5 h-5 text-[#0071DC]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Forgot Password</h1>
            <p className="text-sm text-slate-500">Enter your email and we'll send a reset link.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} aria-describedby="forgot-desc">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              ref={inputRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC]"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || sent}
              placeholder="you@example.com"
              aria-invalid={!!(alert.type === "danger")}
              aria-describedby={alert.message ? "alert-message" : undefined}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-xl font-medium transition-all ${
              loading || sent
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-[#0071DC] hover:bg-[#0654BA] text-white shadow-[0_4px_10px_rgba(6,84,186,0.12)]"
            }`}
            disabled={loading || sent}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending...
              </span>
            ) : sent ? (
              "Link Sent"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-4" id="alert-message">
          {/* AlertMessage handles empty message => null */}
          <AlertMessage {...alert} />
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Tip: Check your mail(Junk/Spam Folder)
          We'll send a secure link to your email to reset your password. The link is valid for a limited time.
        </div>
      </div>
    </div>
  );
}
