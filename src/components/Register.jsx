// src/components/Register.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import validator from "validator";
import API from "../api"; // expects API.registerUser({ email, password })
import AlertMessage from "./AlertMessage";

const isValidEmail = (value) => {
  if (!value) return false;
  return validator.isEmail(value, { allow_utf8_local_part: false });
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPwd, setShowPwd] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!alert.message) return;
    const t = setTimeout(() => setAlert({ type: "", message: "" }), 6000);
    return () => clearTimeout(t);
  }, [alert]);

  const emailValid = isValidEmail(email.trim());
  const passwordValid = password.length >= 6;

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setAlert({ type: "", message: "" });

    if (!emailValid) {
      setAlert({ type: "danger", message: "Please enter a valid email address." });
      return;
    }
    if (!passwordValid) {
      setAlert({ type: "danger", message: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const res = await API.registerUser({ email: email.trim(), password });
      setAlert({ type: "success", message: res?.message || "Registered successfully." });
      setEmail("");
      setPassword("");
      setTouched({ email: false, password: false });

      // navigate to login after brief delay so user can see the alert
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const message =
        err?.message ||
        (err?.response && (err.response.data?.message || JSON.stringify(err.response.data))) ||
        "Registration failed";
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
            <UserPlus className="w-5 h-5 text-[#0071DC]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Create account</h1>
            <p className="text-sm text-slate-500">Sign up to access the dashboard and features.</p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="space-y-4" aria-describedby="register-alert">
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
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC] ${
                touched.email && !emailValid ? "border-red-200" : "border-slate-200"
              }`}
              aria-invalid={touched.email && !emailValid}
            />
            {touched.email && !emailValid && (
              <div className="mt-1 text-xs text-red-600">Please enter a valid email address (e.g. you@example.com).</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 focus:border-[#0071DC] ${
                  touched.password && !passwordValid ? "border-red-200" : "border-slate-200"
                }`}
                aria-invalid={touched.password && !passwordValid}
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
            {touched.password && !passwordValid && (
              <div className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</div>
            )}

            {password && (
              <div className="mt-2 text-xs text-slate-500">
                Tip: use at least 8 characters with letters and numbers for stronger passwords.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !emailValid || !passwordValid}
            className={`w-full py-2 rounded-xl font-medium transition-all ${
              loading || !emailValid || !passwordValid
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
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-4" id="register-alert" aria-live="polite">
          <AlertMessage {...alert} />
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0071DC] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
