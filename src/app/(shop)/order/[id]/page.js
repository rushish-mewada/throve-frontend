import { getOrderById } from "@/lib/storefront/orders";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function OrderConfirmationPage({ params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams?.id ? decodeURIComponent(resolvedParams.id) : "";
  const serverOrder = orderId ? await getOrderById(orderId) : null;

  return <OrderDetailsClient serverOrder={serverOrder} orderId={orderId} />;
}
