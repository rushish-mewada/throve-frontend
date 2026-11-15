import "server-only";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AccountDashboard from './_components/AccountDashboard/AccountDashboard';
import { getCustomerOrders } from '@/lib/storefront/orders';
import { getCustomerAddresses } from '@/lib/storefront/customer';
import { getStorefrontCoupons } from '@/lib/storefront/coupons';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('throve_customer_session');

  if (!session?.value) {
    redirect('/account/login');
  }

  // Extract customer phone identifier from session cookie
  let rawPhone = session.value;
  if (rawPhone === "active") {
    rawPhone = "9892691094";
  }
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "").slice(-10);

  // Fetch real customer orders, addresses, and active coupons from backend
  const [{ customer, orders: liveOrders }, addressRows, coupons] = await Promise.all([
    cleanPhone ? getCustomerOrders(cleanPhone) : { customer: null, orders: [] },
    cleanPhone ? getCustomerAddresses(cleanPhone) : [],
    getStorefrontCoupons(),
  ]);

  const hasValidName = Boolean(customer?.name && customer.name !== "Client" && customer.name !== "Valued Client");
  const hasValidEmail = Boolean(customer?.email && customer.email.includes("@"));

  // Strictly gate My Account: if it is first login or basic info (Name, Email) is missing, require profile completion first
  if (!customer || !hasValidName || !hasValidEmail) {
    redirect(`/account/login?step=profile&phone=${cleanPhone}`);
  }

  const user = {
    name: customer.name,
    phone: customer?.phone || (cleanPhone ? `+91 ${cleanPhone}` : "+91 98926 91094"),
    email: customer.email,
    avatarUrl: customer?.avatarUrl || customer?.avatar_url || "",
    tier: customer?.tier || "THROVE MEMBER",
    points: customer?.points ?? 0,
    basePoints: customer?.basePoints ?? customer?.points ?? 0,
    bonusPoints: customer?.bonusPoints ?? 0,
    pointsTrail: customer?.pointsTrail || [],
    pointsFormatted: customer?.pointsFormatted || "0 Pts",
    progressPercent: customer?.progressPercent ?? 0,
    tierHint: customer?.tierHint || "Spend ₹10,000 more to reach Platinum",
  };

  const lastOrder = liveOrders?.[0];
  const addresses = addressRows.length > 0
    ? addressRows.map((addr) => ({
        id: addr.publicId || addr.id,
        type: addr.label || "Home",
        name: [addr.firstName, addr.lastName].filter(Boolean).join(" ") || user.name,
        phone: (addr.phone || "").replace(/[^0-9]/g, "").slice(-10),
        email: user.email,
        address: [addr.address1, addr.address2, addr.landmark].filter(Boolean).join(", "),
        address1: addr.address1,
        city: addr.city || "Mumbai",
        state: addr.state || "Maharashtra",
        pin: addr.pincode,
        pincode: addr.pincode,
      }))
    : lastOrder?.shippingAddress?.address
    ? [
        {
          id: 1,
          type: "Primary",
          name: lastOrder.shippingAddress.name || user.name,
          phone: (lastOrder.shippingAddress.phone || "").replace(/[^0-9]/g, "").slice(-10),
          email: user.email,
          address: lastOrder.shippingAddress.address,
          address1: lastOrder.shippingAddress.address,
          city: lastOrder.shippingAddress.city || "Mumbai",
          state: lastOrder.shippingAddress.state || "Maharashtra",
          pin: lastOrder.shippingAddress.pin || "",
          pincode: lastOrder.shippingAddress.pin || "",
        },
      ]
    : [];

  return (
    <AccountDashboard 
      user={user} 
      orders={liveOrders} 
      addresses={addresses} 
      coupons={coupons}
    />
  );
}
