// frontend/src/api.js

// Base URL of backend — fallback to localhost for local dev
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function handleResponse(res) {
  if (!res.ok) {
    // try parse error JSON, otherwise include status text
    const err = await res.json().catch(() => ({}));
    const message = err.message || err.error || res.statusText || "Request failed";
    const e = new Error(message);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

// =============================
// Auth APIs
// =============================

// Register new user
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// Login
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// Request password reset (sends reset email)
// NOTE: backend route is /api/auth/forgot-password
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// Reset password (using token sent in email)
export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });
  return handleResponse(res);
}

const API = { registerUser, loginUser, requestPasswordReset, resetPassword };
export default API;
