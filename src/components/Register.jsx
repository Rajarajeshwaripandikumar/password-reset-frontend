import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import API from "../api"; // expects API.registerUser(...)
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
  const navigate = useNavigate();

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
      // Use the function exported from frontend/src/api.js
      const res = await API.registerUser({ email: email.trim(), password });
      // res is parsed JSON (e.g. { message: "User registered successfully" })
      setAlert({ type: "success", message: res.message || "Registered successfully" });
      setEmail("");
      setPassword("");
      setTouched({ email: false, password: false });

      // Optional: navigate to login after a short delay
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      // API.registerUser throws Error with message (see api.handleResponse)
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
    <div className="form-center">
      <div className="auth-card">
        <h1 className="h1-hero">Register</h1>

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${touched.email && !emailValid ? "is-invalid" : ""}`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@example.com"
            />
            {touched.email && !emailValid && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                Please enter a valid email address (e.g. you@example.com).
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${touched.password && !passwordValid ? "is-invalid" : ""}`}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            {touched.password && !passwordValid && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                Password must be at least 6 characters.
              </div>
            )}
          </div>

          <button className="btn btn-primary w-100" disabled={loading || !emailValid || !passwordValid} type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <AlertMessage {...alert} />
        <div className="footer-note">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
