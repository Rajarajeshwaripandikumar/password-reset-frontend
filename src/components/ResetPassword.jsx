// src/components/ResetPassword.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff } from "lucide-react";
import API from "../api";
import AlertMessage from "./AlertMessage";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const pwdRef = useRef(null);

  useEffect(() => {
    // autofocus the password input for convenience
    pwdRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!alert.message) return;
    const t = setTimeout(() => setAlert({ type: "", message: "" }), 6000);
    return () => clearTimeout(t);
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!token) {
      setAlert({ type: "danger", message: "Invalid or missing token." });
      return;
    }
    if (!password || password.length < 6) {
      setAlert({ type: "danger", message: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const res = await API.resetPassword(token, password);
      const successMessage = (res && (res.message || res.success || res.data?.message)) || "Password has been reset.";
      setAlert({ type: "success", message: successMessage });
      setPassword("");
      // allow user to see the success alert, then redirect to login
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      // prefer structured server message, then fallback to generic message
      let message = "Error resetting password";
      if (err?.rawBody) {
        if (typeof err.rawBody === "object") {
          message = err.rawBody.message || err.rawBody.error || JSON.stringify(err.rawBody);
        } else if (typeof err.rawBody === "string" && err.rawBody.trim()) {
          message = err.rawBody;
        }
      } else if (err?.message) {
        message = err.message;
      }
      if (err?.status) message = `${message} (status ${err.status})`;
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_6px_20px_rgba(2,6,23,0.12)] p-6"
        style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[rgba(0,113,220,0.08)]">
            <Key className="w-5 h-5 text-[#0071DC]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Reset Password</h1>
            <p className="text-sm text-slate-500">Create a new password for your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} aria-describedby="reset-alert" className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                ref={pwdRef}
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC]"
                aria-invalid={password && password.length < 6}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && password.length < 6 && (
              <div className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-medium transition-all ${
              loading ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#0071DC] hover:bg-[#0654BA] text-white shadow-[0_4px_10px_rgba(6,84,186,0.12)]"
            }`}
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
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-4" id="reset-alert" aria-live="polite">
          <AlertMessage {...alert} />
        </div>
      </div>
    </div>
  );
}
