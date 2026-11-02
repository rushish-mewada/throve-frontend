import "server-only";
import Medusa from "@medusajs/js-sdk";

/**
 * Server-only Medusa SDK client instance for Next.js BFF.
 * Adheres strictly to security rules: never imported into Client Components,
 * zero exposure of secrets or endpoints to the browser.
 */
export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
});

