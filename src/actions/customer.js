"use server";

import { cookies } from "next/headers";
import { updateCustomerProfile, getCustomerProfile } from "@/lib/storefront/customer";

/**
 * Server action to check customer profile status upon OTP verification.
 * Determines if user is a first-time login requiring basic information (Name & Email).
 *
 * @param {string} phone
 * @returns {Promise<{ ok: boolean, isFirstLogin: boolean, customer?: Object }>}
 */
export async function checkCustomerStatusAction(phone) {
  try {
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { ok: false, isFirstLogin: true };
    }

    const customer = await getCustomerProfile(cleanPhone);
    const hasValidName = Boolean(customer?.name && customer.name !== "Client" && customer.name !== "Valued Client");
    const hasValidEmail = Boolean(customer?.email && customer.email.includes("@"));

    const isFirstLogin = !customer || !hasValidName || !hasValidEmail;

    return {
      ok: true,
      isFirstLogin,
      customer: customer || null,
    };
  } catch (err) {
    return { ok: false, isFirstLogin: true };
  }
}

/**
 * Server action to complete initial registration / profile upon first login.
 * Strictly registers Name & Email before allowing access to the My Account dashboard.
 *
 * @param {Object} data
 * @param {string} data.phone
 * @param {string} data.name
 * @param {string} data.email
 * @returns {Promise<{ ok: boolean, customer?: Object, error?: string }>}
 */
export async function completeFirstLoginAction({ phone, name, email }) {
  try {
    const cookieStore = await cookies();
    const sessionVal = cookieStore.get("throve_customer_session")?.value;
    const rawPhone = phone || (sessionVal === "active" ? "9892691094" : sessionVal) || "";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanPhone || cleanPhone.length !== 10) {
      return { ok: false, error: "Valid 10-digit mobile number required." };
    }
    if (!cleanName || cleanName.length < 2) {
      return { ok: false, error: "Please enter your full legal name." };
    }
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return { ok: false, error: "Please provide a valid email address." };
    }

    const result = await updateCustomerProfile({
      phone: cleanPhone,
      name: cleanName,
      email: cleanEmail,
    });

    if (result.ok) {
      const cookieStore = await cookies();
      cookieStore.set("throve_customer_session", cleanPhone, {
        path: "/",
        maxAge: 604800,
        sameSite: "lax",
        httpOnly: false, // Accessible to storefront auth state
      });
    }

    return result;
  } catch (err) {
    return { ok: false, error: err.message || "Failed to complete account setup." };
  }
}

/**
 * Server action to update customer profile details (name, email)
 *
 * @param {Object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @returns {Promise<{ ok: boolean, customer?: Object, error?: string }>}
 */
export async function updateCustomerProfileAction({ name, email }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("throve_customer_session");
    let rawPhone = session?.value;
    if (!rawPhone) {
      return { ok: false, error: "Authentication session expired. Please log in again." };
    }
    if (rawPhone === "active") {
      rawPhone = "9892691094";
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);
    const result = await updateCustomerProfile({
      phone: cleanPhone,
      name: String(name || "").trim(),
      email: String(email || "").trim(),
    });

    return result;
  } catch (err) {
    return { ok: false, error: err.message || "Failed to update profile." };
  }
}
