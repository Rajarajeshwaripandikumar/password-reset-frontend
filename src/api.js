// frontend/src/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/** toggle to true while debugging to see outgoing URLs/payloads */
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
      // if text/html or empty, return raw text (useful for 404 pages from hosting)
      const text = await res.text();
      return text || null;
    }
  } catch (err) {
    // parsing failed (empty body or bad JSON)
    return null;
  }
}

async function handleResponse(res) {
  const body = await parseBodySafely(res);

  if (!res.ok) {
    // try to extract a friendly message
    let message = "Request failed";
    if (body) {
      // if body is an object containing message/error, prefer that
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

  // success: return parsed JSON object if available, otherwise return null / text
  return body;
}

/* Auth APIs */

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

// Request password reset
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

// Reset password (token in path)
export async function resetPassword(token, newPassword) {
  if (!token) throw new Error("Token is required");
  const url = `${API_BASE_URL}/api/auth/reset-password/${token}`;
  logRequest("POST", url, { password: newPassword });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });
  return handleResponse(res);
}

const API = { registerUser, loginUser, requestPasswordReset, resetPassword };
export default API;
