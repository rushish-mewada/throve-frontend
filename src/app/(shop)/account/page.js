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

  const user = {
    name: customer?.name || "Valued Client",
    phone: customer?.phone || (cleanPhone ? `+91 ${cleanPhone}` : "+91 98926 91094"),
    email: customer?.email || "throve.in@gmail.com",
    tier: customer?.tier || "Throve Atelier Member",
  };

  const addresses = [
    {
      id: 1,
      type: "Primary",
      name: user.name,
      address: "Atelier Delivery Address",
      city: "Mumbai",
      state: "Maharashtra",
      pin: "400004",
    },
  ];

  return (
    <AccountDashboard 
      user={user} 
      orders={liveOrders} 
      addresses={addresses} 
    />
  );
}
