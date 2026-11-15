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
      items: (raw.items || []).map((item, idx) => {
        let itImg = item.image || null;
        if (!itImg) {
          const tLower = String(item.title || "").toLowerCase();
          if (tLower.includes("mandarin") || tLower.includes("shirt")) itImg = "/products/asymmetric-mandarin-shirt/main.jpg?v=3";
          else if (tLower.includes("sheath") || tLower.includes("princess")) itImg = "/products/sleeveless-princess-sheath-dress/main.jpg?v=3";
          else if (tLower.includes("flare") || tLower.includes("waisted")) itImg = "/products/high-waisted-flare-pants/main.jpg?v=3";
          else if (tLower.includes("sweetheart") || tLower.includes("scalloped")) itImg = "/products/scalloped-sweetheart-top/main.jpg?v=3";
          else if (tLower.includes("mini") || tLower.includes("navy")) itImg = "/products/navy-tailored-mini-dress/main.jpg?v=3";
          else itImg = "/products/pleated-formal-pants/main.jpg?v=3";
        }
        return {
          id: item.id || idx + 1,
          image: itImg,
          title: item.title,
          variant: item.sku || "Standard",
          price: formatMoney(item.subtotalPaise || item.unitPricePaise || 0, raw.currency || "INR"),
          qty: item.quantity || 1,
        };
      }),
    };
  } catch {
    return null;
  }
}

/**
 * Server-only helper to fetch order history and profile for an authenticated customer.
 *
 * @param {string} identifier - Phone or Email
 * @returns {Promise<{ customer: Object|null, orders: Array<Object> }>}
 */
export async function getCustomerOrders(identifier) {
  if (!identifier) return { customer: null, orders: [] };

  try {
    const isEmail = String(identifier).includes("@");
    const param = isEmail
      ? `email=${encodeURIComponent(identifier)}`
      : `phone=${encodeURIComponent(identifier)}`;

    const res = await fetchStorefront(`/v1/orders?${param}`, {
      cache: "no-store",
    });

    const raw = res?.data;
    if (!raw) return { customer: null, orders: [] };

    return {
      customer: raw.customer || null,
      orders: (raw.orders || []).map((o) => {
        const firstItem = (Array.isArray(o.items) && o.items[0]) || {};
        const titleLower = String(firstItem.title || "").toLowerCase();
        let image = firstItem.image || null;
        if (!image) {
          if (titleLower.includes("mandarin") || titleLower.includes("shirt")) {
            image = "/products/asymmetric-mandarin-shirt/main.jpg?v=3";
          } else if (titleLower.includes("sheath") || titleLower.includes("princess")) {
            image = "/products/sleeveless-princess-sheath-dress/main.jpg?v=3";
          } else if (titleLower.includes("flare") || titleLower.includes("waisted")) {
            image = "/products/high-waisted-flare-pants/main.jpg?v=3";
          } else if (titleLower.includes("sweetheart") || titleLower.includes("scalloped")) {
            image = "/products/scalloped-sweetheart-top/main.jpg?v=3";
          } else if (titleLower.includes("mini") || titleLower.includes("navy")) {
            image = "/products/navy-tailored-mini-dress/main.jpg?v=3";
          } else {
            image = "/products/pleated-formal-pants/main.jpg?v=3";
          }
        }

        const itemsCount = (Array.isArray(o.items) && o.items.length > 0)
          ? o.items.reduce((acc, it) => acc + (it.quantity || 1), 0)
          : 1;

        return {
          id: o.displayId || o.id,
          publicId: o.id || o.publicId || o.displayId,
          displayId: o.displayId || o.id,
          date: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recent",
          total: formatMoney(o.totalPaise || 0, o.currency || "INR"),
          totalPaise: o.totalPaise || 0,
          status: o.status || "pending",
          paymentStatus: o.paymentStatus || "pending",
          fulfillmentStatus: o.fulfillmentStatus || "not_fulfilled",
          awbNumber: o.awbNumber || null,
          courierPartner: o.courierPartner || null,
          itemsCount,
          items: (o.items || []).map((it) => ({
            title: it.title || "Tailored Atelier Garment",
            sku: it.sku || "",
            quantity: it.quantity || 1,
            unitPrice: formatMoney(it.unitPricePaise || it.subtotalPaise || 0, o.currency || "INR"),
          })),
          firstItemTitle: firstItem.title || "Tailored Atelier Garment",
          firstItemSku: firstItem.sku || "",
          image,
        };
      }),
    };
  } catch {
    return { customer: null, orders: [] };
  }
}
