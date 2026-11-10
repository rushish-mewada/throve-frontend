const API_URL = process.env.STOREFRONT_API_URL || "http://127.0.0.1:3001";
const SECRET_KEY = process.env.STOREFRONT_SECRET_KEY || "sk_throve_test_key";
const PUBLISHABLE_KEY = process.env.STOREFRONT_PUBLISHABLE_KEY || "pk_throve_test_key";

/**
 * Server-only fetcher for THROVE commerce API.
 * Never exposed to the browser.
 *
 * @param {string} endpoint
 * @param {RequestInit & { secret?: boolean }} [options]
 * @returns {Promise<any>}
 */
export async function fetchStorefront(endpoint, options = {}) {
  const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-key": PUBLISHABLE_KEY,
    ...(options.secret ? { Authorization: `Bearer ${SECRET_KEY}` } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error?.message || `Storefront request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Storefront backend request timed out. Please check backend connectivity.");
    }
    throw err;
  }
}

