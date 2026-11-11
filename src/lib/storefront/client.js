import "server-only";
import { getStorefrontEnv } from "../../env.js";

/**
 * Server-only fetcher for standalone THROVE storefront-api (/v1).
 * Never exposed to the browser and contains zero static URL or key fallbacks.
 *
 * @param {string} endpoint
 * @param {RequestInit & { secret?: boolean }} [options]
 * @returns {Promise<any>}
 */
export async function fetchStorefront(endpoint, options = {}) {
  const env = getStorefrontEnv();
  const url = `${env.STOREFRONT_API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-key": env.STOREFRONT_PUBLISHABLE_KEY,
    ...(options.secret ? { Authorization: `Bearer ${env.STOREFRONT_SECRET_KEY}` } : {}),
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

