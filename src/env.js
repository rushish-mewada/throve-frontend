import "server-only";
import { z } from "zod";

const StorefrontEnvSchema = z.object({
  STOREFRONT_API_URL: z.string().url("STOREFRONT_API_URL must be a valid URL"),
  STOREFRONT_PUBLISHABLE_KEY: z.string().min(1, "STOREFRONT_PUBLISHABLE_KEY is required"),
  STOREFRONT_SECRET_KEY: z.string().min(1, "STOREFRONT_SECRET_KEY is required"),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  CASHFREE_APP_ID: z.string().optional(),
  CASHFREE_SECRET_KEY: z.string().optional(),
});

let cachedEnv = null;

/**
 * Validate and return server-only storefront environment configuration.
 * Contains zero static fallback URLs or keys and fails fast if misconfigured.
 *
 * @returns {{
 *   STOREFRONT_API_URL: string,
 *   STOREFRONT_PUBLISHABLE_KEY: string,
 *   STOREFRONT_SECRET_KEY: string,
 *   REVALIDATE_SECRET?: string,
 *   CASHFREE_APP_ID?: string,
 *   CASHFREE_SECRET_KEY?: string
 * }}
 */
export function getStorefrontEnv() {
  if (cachedEnv) return cachedEnv;

  const leakedPublicKeys = Object.keys(process.env).filter(
    (k) =>
      k.startsWith("NEXT_PUBLIC_STOREFRONT") ||
      k.startsWith("NEXT_PUBLIC_REVALIDATE") ||
      k.startsWith("NEXT_PUBLIC_CASHFREE") ||
      k.startsWith("NEXT_PUBLIC_SECRET")
  );
  if (leakedPublicKeys.length > 0) {
    throw new Error(
      `Forbidden NEXT_PUBLIC_ storefront env variable(s): ${leakedPublicKeys.join(", ")}`
    );
  }

  const parsed = StorefrontEnvSchema.safeParse({
    STOREFRONT_API_URL: process.env.STOREFRONT_API_URL,
    STOREFRONT_PUBLISHABLE_KEY: process.env.STOREFRONT_PUBLISHABLE_KEY,
    STOREFRONT_SECRET_KEY: process.env.STOREFRONT_SECRET_KEY,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || undefined,
    CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || process.env.APP_ID || undefined,
    CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || process.env.SECRET_KEY || undefined,
  });

  if (!parsed.success) {
    throw new Error(`Invalid storefront environment configuration: ${parsed.error.message}`);
  }

  cachedEnv = {
    ...parsed.data,
    STOREFRONT_API_URL: parsed.data.STOREFRONT_API_URL.replace(/\/+$/, ""),
  };
  return cachedEnv;
}

