import "server-only";
import { fetchStorefront } from "./client.js";
import { formatMoney } from "./format.js";

/**
 * Server-only helper to fetch order details by publicId or displayId.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getOrderById(id) {
  if (!id) return null;

  try {
    const res = await fetchStorefront(`/v1/orders/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    const raw = res?.data;
    if (!raw) return null;

    const addr = raw.shipping_address || {};
    const formattedDate = raw.createdAt || raw.created_at
      ? new Date(raw.createdAt || raw.created_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    return {
      id: raw.display_id || raw.public_id || raw.publicId || id,
      publicId: raw.public_id || raw.publicId,
      date: formattedDate,
      email: addr.email || "",
      total: formatMoney(raw.totalPaise || raw.total_paise || 0, raw.currency || "INR"),
      subtotal: formatMoney(raw.subtotalPaise || raw.subtotal_paise || raw.totalPaise || 0, raw.currency || "INR"),
      shipping: (raw.shippingTotalPaise || raw.shipping_paise || 0) > 0
        ? formatMoney(raw.shippingTotalPaise || raw.shipping_paise, raw.currency || "INR")
        : "Free",
      paymentMethod: raw.payment_method || "Cash on Delivery (COD)",
      status: raw.status || "pending_dispatch",
      awbNumber: raw.awbNumber || raw.awb || null,
      courierPartner: raw.courierPartner || raw.courier || "Delhivery Express",
      shippingAddress: {
        name: `${addr.firstName || ""} ${addr.lastName || ""}`.trim() || "Customer",
        address: [addr.address1, addr.address2].filter(Boolean).join(", ") || "India",
        city: addr.city || "",
        state: addr.state || "",
        pin: addr.pincode || "",
      },
      items: (raw.items || []).map((item, idx) => ({
        id: item.id || idx + 1,
        image: item.image || "/images/hero/slide4.png",
        title: item.title,
        variant: item.sku || "Standard",
        price: formatMoney(item.subtotalPaise || item.unitPricePaise || 0, raw.currency || "INR"),
        qty: item.quantity || 1,
      })),
    };
  } catch {
    return null;
  }
}
