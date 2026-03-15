const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = configuredBaseUrl.endsWith("/") ? configuredBaseUrl.slice(0, -1) : configuredBaseUrl;

const defaultHeaders = {
  "Content-Type": "application/json"
};

function withAuthHeaders(token) {
  return token
    ? {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`
      }
    : defaultHeaders;
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: defaultHeaders,
      ...options,
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: "Unexpected server response. Please confirm the API server is running." };

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The server took too long to respond. Please try again.");
    }

    if (error instanceof TypeError) {
      throw new Error("Unable to reach the server. Please confirm the API is running and reachable.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function calculatePaye(payload, token = "") {
  return request("/api/tax/paye", {
    headers: withAuthHeaders(token),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function calculateCompanyTax(payload, token = "") {
  return request("/api/tax/company", {
    headers: withAuthHeaders(token),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function sendContact(payload, token = "") {
  return request("/api/contact", {
    headers: withAuthHeaders(token),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getTaxAssumptions() {
  return request("/api/tax/assumptions");
}

export function getPricingPlans() {
  return request("/api/monetization/plans");
}

export function createSupportLead(payload, token = "") {
  return request("/api/monetization/request", {
    headers: withAuthHeaders(token),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function initializePaystackCheckout(payload, token = "") {
  return request("/api/monetization/checkout", {
    headers: withAuthHeaders(token),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function verifyPaystackCheckout(reference) {
  return request(`/api/monetization/verify?reference=${encodeURIComponent(reference)}`);
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

export function getAdminMonetization(token) {
  return request("/api/admin/monetization", {
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAccountDashboard(token) {
  return request("/api/account/dashboard", {
    headers: withAuthHeaders(token)
  });
}
