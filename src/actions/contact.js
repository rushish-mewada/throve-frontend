"use server";

import { submitContactInquiry } from "@/lib/storefront/contact";

/**
 * Server Action: Submit customer contact inquiry.
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} [data.orderNumber]
 * @param {string} data.message
 * @returns {Promise<{ ok: boolean, data?: Object, error?: string }>}
 */
export async function submitContactInquiryAction({ name, email, orderNumber, message } = {}) {
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanMessage = String(message || "").trim();
  const cleanOrder = String(orderNumber || "").trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return { ok: false, error: "Name, email, and message are required." };
  }

  return await submitContactInquiry({
    name: cleanName,
    email: cleanEmail,
    orderNumber: cleanOrder,
    message: cleanMessage,
  });
}
