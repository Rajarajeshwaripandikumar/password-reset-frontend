// frontend/src/api.js
// Hardened API helper for auth flows.
// Set REACT_APP_API_URL to your backend base (e.g. https://password-reset-backend-nn1u.onrender.com)
// Fallback is http://localhost:5000 for local dev.

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/** Toggle true for extra console logs during debugging */
const DEBUG = false;
function logRequest(method, url, body) {
  if (!DEBUG) return;
  console.log(`[API] ${method} ${url}`, body ?? "");
}

async function parseBodySafely(res) {
  const ct = res.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      return await res.json();
    } else {
      // Return text for non-json responses (404 HTML pages, etc.)
      const text = await res.text();
      return text || null;
    }
  } catch (err) {
    // Could not parse body (empty or bad JSON)
    return null;
  }
}

async function handleResponse(res) {
  const body = await parseBodySafely(res);

  if (!res.ok) {
    let message = "Request failed";
    if (body) {
      if (typeof body === "object") {
        message = body.message || body.error || JSON.stringify(body);
      } else {
        message = String(body);
      }
    } else {
      message = res.statusText || `HTTP ${res.status}`;
    }
    const e = new Error(message);
    e.status = res.status;
    e.rawBody = body;
    throw e;
  }

  // Success: return parsed body (object or text) or null
  return body;
}

/* ========= Auth API functions ========= */

// Register
export async function registerUser(userData) {
  const url = `${API_BASE_URL}/api/auth/register`;
  logRequest("POST", url, userData);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// Login
export async function loginUser(email, password) {
  const url = `${API_BASE_URL}/api/auth/login`;
  logRequest("POST", url, { email });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// Request password reset (forgot password)
export async function requestPasswordReset(email) {
  if (!email) throw new Error("Email is required");
  const url = `${API_BASE_URL}/api/auth/forgot-password`;
  logRequest("POST", url, { email });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// Reset password (token-in-path). If your backend expects token-in-body, modify accordingly.
export async function resetPassword(token, newPassword) {
  if (!token) throw new Error("Token is required");
  if (!newPassword) throw new Error("Password is required");
  const url = `${API_BASE_URL}/api/auth/reset-password/${encodeURIComponent(token)}`;
  logRequest("POST", url, { password: newPassword });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });
  return handleResponse(res);
}

// If you prefer default object export:
const API = { registerUser, loginUser, requestPasswordReset, resetPassword };
export default API;
