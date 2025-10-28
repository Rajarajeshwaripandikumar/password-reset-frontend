// src/components/Login.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import API from "../api"; // expects API.loginUser(email, password)
import AlertMessage from "./AlertMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!alert.message) return;
    const t = setTimeout(() => setAlert({ type: "", message: "" }), 6000);
    return () => clearTimeout(t);
  }, [alert]);

  const submit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await API.loginUser(email, password);
      setAlert({ type: "success", message: res?.message || "Logged in successfully." });

      // small delay for UX (let alert show), then navigate home
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      const message =
        err?.message ||
        (err?.response && (err.response.data?.message || JSON.stringify(err.response.data))) ||
        "Login failed";
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
            <LogIn className="w-5 h-5 text-[#0071DC]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500">Use your account to access the dashboard.</p>
          </div>
        </div>

        <form onSubmit={submit} aria-describedby="login-alert" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC]"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-slate-700 focus:outline-none"
                tabIndex={0}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-medium transition-all ${
              loading
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-[#0071DC] hover:bg-[#0654BA] text-white shadow-[0_4px_10px_rgba(6,84,186,0.12)]"
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
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4" id="login-alert" aria-live="polite">
          <AlertMessage {...alert} />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <div>
            Forgot your password?{" "}
            <Link to="/forgot-password" className="text-[#0071DC] hover:underline">
              Reset it
            </Link>
          </div>
          <div>
            <Link to="/register" className="text-[#0071DC] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
