import "server-only";
import AccountDashboard from './_components/AccountDashboard/AccountDashboard';

// Placeholder for DAL fetching
const getAccountData = async () => {
  // TODO: Fetch this data securely from Medusa DAL
  return {
    user: { name: 'Aryan Sharma', phone: '+91 98765 43210', email: 'aryan@example.com', tier: 'Throve Black VIP' },
    orders: [
      { id: 'ORD-1092', date: 'Oct 04, 2026', total: '₹4,300', status: 'Delivered', image: 'https://placehold.co/100x120/111111/ffffff.png?text=Jacket' },
      { id: 'ORD-1045', date: 'Sep 12, 2026', total: '₹2,100', status: 'Processing', image: 'https://placehold.co/100x120/e0e0e0/666666.png?text=Shirt' },
    ],
    addresses: [
      { id: 1, type: 'Home', name: 'Aryan Sharma', address: '123 Fashion Street, Apt 4B', city: 'Mumbai', state: 'Maharashtra', pin: '400001' }
    ]
  };
};

export default async function AccountPage() {
  const data = await getAccountData();

  return (
    <AccountDashboard 
      user={data.user} 
      orders={data.orders} 
      addresses={data.addresses} 
    />
  );
}
