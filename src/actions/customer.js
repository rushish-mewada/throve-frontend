"use server";

import { cookies } from "next/headers";
import {
  updateCustomerProfile,
  getCustomerProfile,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/storefront/customer";

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
export async function updateCustomerProfileAction({ name, email, avatarUrl }) {
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
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    });

    return result;
  } catch (err) {
    return { ok: false, error: err.message || "Failed to update profile." };
  }
}

/**
 * Server action to save (create or update) a customer delivery address in the backend.
 *
 * @param {Object} data
 * @returns {Promise<{ ok: boolean, data?: Object, error?: string }>}
 */
export async function saveCustomerAddressAction(data) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("throve_customer_session");
    let rawPhone = session?.value;
    if (!rawPhone) {
      return { ok: false, error: "Authentication session expired. Please log in again." };
    }
    if (rawPhone === "active") rawPhone = "9892691094";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);

    const nameParts = String(data.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "Valued";
    const lastName = nameParts.slice(1).join(" ") || "Client";

    const payload = {
      phone: cleanPhone,
      label: data.label || "Home",
      firstName,
      lastName,
      addressPhone: (data.phone || cleanPhone).replace(/[^0-9]/g, "").slice(-10),
      address1: String(data.address1 || "").trim(),
      address2: data.address2 ? String(data.address2).trim() : "",
      city: String(data.city || "Mumbai").trim(),
      state: String(data.state || "Maharashtra").trim(),
      pincode: String(data.pincode || "").replace(/\D/g, "").slice(0, 6),
      isDefault: Boolean(data.isDefault),
    };

    if (data.id) {
      return await updateCustomerAddress({
        ...payload,
        id: data.id,
      });
    }

    return await createCustomerAddress(payload);
  } catch (err) {
    return { ok: false, error: err.message || "Failed to save address." };
  }
}

/**
 * Server action to delete a customer address in the backend.
 *
 * @param {string|number} addressId
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function deleteCustomerAddressAction(addressId) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("throve_customer_session");
    let rawPhone = session?.value;
    if (!rawPhone) {
      return { ok: false, error: "Authentication session expired. Please log in again." };
    }
    if (rawPhone === "active") rawPhone = "9892691094";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);

    return await deleteCustomerAddress({ addressId, phone: cleanPhone });
  } catch (err) {
    return { ok: false, error: err.message || "Failed to delete address." };
  }
}
