import "server-only";
import { fetchStorefront } from "./client.js";

/**
 * Server-only helper to fetch customer profile data by phone.
 *
 * @param {string} phone
 * @returns {Promise<Object|null>}
 */
export async function getCustomerProfile(phone) {
  if (!phone) return null;
  const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

  try {
    const res = await fetchStorefront(`/v1/customers/profile?phone=${encodeURIComponent(cleanPhone)}`, {
      cache: "no-store",
    });
    return res?.data || null;
  } catch {
    return null;
  }
}

/**
 * Server-only helper to update customer profile data.
 *
 * @param {Object} data
 * @param {string} data.phone
 * @param {string} [data.name]
 * @param {string} [data.email]
 * @returns {Promise<{ ok: boolean, customer?: Object, error?: string }>}
 */
export async function updateCustomerProfile({ phone, name, email, avatarUrl }) {
  if (!phone) {
    return { ok: false, error: "Phone number is required" };
  }

  try {
    const res = await fetchStorefront("/v1/customers/profile", {
      method: "POST",
      body: JSON.stringify({
        phone,
        name,
        email,
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      }),
      cache: "no-store",
    });

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to update profile" };
    }

    return { ok: true, customer: res?.data };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while saving profile" };
  }
}

/**
 * Server-only helper to fetch customer saved addresses from backend.
 *
 * @param {string} phone
 * @returns {Promise<Array>}
 */
export async function getCustomerAddresses(phone) {
  if (!phone) return [];
  const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

  try {
    const res = await fetchStorefront(
      `/v1/customers/addresses?phone=${encodeURIComponent(cleanPhone)}`,
      { cache: "no-store" }
    );
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}

/**
 * Server-only helper to create a new customer address in backend.
 *
 * @param {Object} data
 * @returns {Promise<{ ok: boolean, data?: Object, error?: string }>}
 */
export async function createCustomerAddress(data) {
  try {
    const res = await fetchStorefront("/v1/customers/addresses", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to save address" };
    }

    return { ok: true, data: res?.data };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while saving address" };
  }
}

/**
 * Server-only helper to update an existing customer address in backend.
 *
 * @param {Object} data
 * @returns {Promise<{ ok: boolean, data?: Object, error?: string }>}
 */
export async function updateCustomerAddress(data) {
  try {
    const res = await fetchStorefront("/v1/customers/addresses", {
      method: "PUT",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to update address" };
    }

    return { ok: true, data: res?.data };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while updating address" };
  }
}

/**
 * Server-only helper to delete a customer address in backend.
 *
 * @param {Object} params
 * @param {string|number} params.addressId
 * @param {string} params.phone
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function deleteCustomerAddress({ addressId, phone }) {
  try {
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(-10);
    const res = await fetchStorefront(
      `/v1/customers/addresses?addressId=${encodeURIComponent(addressId)}&phone=${encodeURIComponent(cleanPhone)}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (res?.error) {
      return { ok: false, error: res.error.message || "Failed to delete address" };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || "Network error while deleting address" };
  }
}
