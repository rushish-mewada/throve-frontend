import { cookies } from "next/headers";
import { sdk } from "@/lib/medusa";
import CheckoutForm from "@/components/CheckoutForm";
import styles from "./checkout.module.css";
import Link from "next/link";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;

  if (!cartId) {
    return (
      <main className={styles.emptyContainer}>
        <h2>Your cart is empty.</h2>
        <Link href="/" className={styles.button}>Return to Store</Link>
      </main>
    );
  }

  // Strictly Fetch Cart & Shipping options on the Server
  let cart = null;
  let shippingOptions = [];
  try {
    const { cart: retrievedCart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*items, *region, *items.variant, *items.variant.product",
    });
    cart = retrievedCart;

    // Fetch the available shipping options (Standard Shipping, Mumbai Local, etc.)
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
    shippingOptions = shipping_options;
  } catch (e) {
    console.error("Error fetching checkout data:", e);
    return <div>Failed to load checkout session.</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        {/* Left Side: Forms */}
        <section className={styles.formSection}>
          <h1 className={styles.title}>Secure Checkout</h1>
          <p className={styles.subtitle}>Zero-API architecture protecting your data.</p>
          
          <CheckoutForm cartId={cart.id} shippingOptions={shippingOptions} />
        </section>

        {/* Right Side: Order Summary */}
        <aside className={styles.summarySection}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.itemsList}>
            {cart.items?.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.title}</p>
                  <p className={styles.itemQty}>Qty: {item.quantity}</p>
                </div>
                <p className={styles.itemPrice}>₹{item.unit_price}</p>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>₹{cart.item_subtotal || 0}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Estimated Taxes (GST 18%)</span>
              <span>₹{cart.tax_total || 0}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{cart.shipping_total ? `₹${cart.shipping_total}` : "Calculated next"}</span>
            </div>
            
            <div className={styles.grandTotal}>
              <span>Total</span>
              <span>₹{cart.total || 0}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
