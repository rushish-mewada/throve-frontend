import "server-only";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AccountDashboard from './_components/AccountDashboard/AccountDashboard';
import { getCustomerOrders } from '@/lib/storefront/orders';

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

  // Fetch real customer orders and details from backend
  const { customer, orders: liveOrders } = cleanPhone
    ? await getCustomerOrders(cleanPhone)
    : { customer: null, orders: [] };

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
    tier: customer?.tier || "Throve Member",
  };

  const lastOrder = liveOrders?.[0];
  const addresses = lastOrder?.shippingAddress?.address ? [
    {
      id: 1,
      type: "Primary",
      name: lastOrder.shippingAddress.name || user.name,
      address: lastOrder.shippingAddress.address,
      city: lastOrder.shippingAddress.city || "Mumbai",
      state: lastOrder.shippingAddress.state || "Maharashtra",
      pin: lastOrder.shippingAddress.pin || "",
    },
  ] : [];

  return (
    <AccountDashboard 
      user={user} 
      orders={liveOrders} 
      addresses={addresses} 
    />
  );
}
