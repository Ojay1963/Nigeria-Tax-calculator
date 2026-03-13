const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json"
};

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: defaultHeaders,
    ...options,
    signal: controller.signal
  });

  window.clearTimeout(timeout);

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: "Unexpected server response." };

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function calculatePaye(payload) {
  return request("/api/tax/paye", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function calculateCompanyTax(payload) {
  return request("/api/tax/company", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function sendContact(payload) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getTaxAssumptions() {
  return request("/api/tax/assumptions");
}

export function registerAccount(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function verifyEmailToken(payload) {
  return request("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function resendVerificationEmail(payload) {
  return request("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginAccount(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCurrentUser(token) {
  return request("/api/auth/me", {
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAdminDashboard(token) {
  return request("/api/admin/dashboard", {
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`
    }
  });
}
