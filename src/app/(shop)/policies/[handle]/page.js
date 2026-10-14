import Link from 'next/link';
import styles from './page.module.css';

const policies = {
  'terms': {
    title: 'Terms & Conditions',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>Welcome to Throve. By accessing our website, you agree to these Terms and Conditions. Please read them carefully.</p>
        
        <h3>1. General Conditions</h3>
        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
        
        <h3>2. Products or Services</h3>
        <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
        
        <h3>3. Accuracy of Billing and Account Information</h3>
        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</p>
      </>
    )
  },
  'privacy': {
    title: 'Privacy Policy',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Throve.</p>
        
        <h3>1. Personal Information We Collect</h3>
        <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
        
        <h3>2. How Do We Use Your Personal Information?</h3>
        <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
        
        <h3>3. Data Retention</h3>
        <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>
      </>
    )
  },
  'refunds': {
    title: 'Cancellation & Refund Policy',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>At Throve, we strive to ensure you are completely satisfied with your purchase. If you are not entirely happy, we are here to help.</p>
        
        <h3>1. Returns</h3>
        <p>You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        
        <h3>2. Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your credit card (or original method of payment) within 5-7 business days.</p>
        
        <h3>3. Return Shipping</h3>
        <p>Reverse pickup is arranged free of charge for size exchanges. For non-defective returns, a reverse pickup fee may be deducted from the refund.</p>
      </>
    )
  },
  'returns': {
    title: 'Returns & Exchange Policy',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>We want you to love your Throve pieces. We provide a 7-day hassle-free return and exchange policy across India.</p>
        
        <h3>1. Eligibility</h3>
        <p>Items must be in original condition: unworn, unwashed, unaltered, and with all tags, brand labels, and security seals attached. Seasonal drop items marked as &quot;Final Archive Sale&quot; are eligible for size exchange only.</p>
        
        <h3>2. Reverse Pickup</h3>
        <p>Once you initiate a request from your Account dashboard or via our Concierge, our logistics partner will attempt pickup within 24–48 hours.</p>
        
        <h3>3. Quality Assessment & Resolution</h3>
        <p>Upon receipt at our fulfillment center, garments undergo a quality check within 24 hours. Your exchange order or refund will be processed immediately thereafter.</p>
      </>
    )
  },
  'shipping': {
    title: 'Shipping & Delivery Policy',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>Throve partners with premium Indian logistics carriers (Blue Dart, Delhivery) to guarantee secure and prompt PAN-India delivery.</p>
        
        <h3>1. Order Processing Time</h3>
        <p>All in-stock orders are packed and dispatched within 24–48 business hours from our Mumbai facility. Limited drop items ship according to release schedules specified on the product page.</p>
        
        <h3>2. Delivery Timelines</h3>
        <p>Tier-1 metros typically receive shipments within 2–4 business days. Regional and North-East destinations typically arrive within 4–7 business days.</p>
        
        <h3>3. Shipping Rates</h3>
        <p>Complimentary Express Shipping is extended to all prepaid orders in India. A nominal handling fee of ₹99 is applicable on Cash on Delivery orders.</p>
      </>
    )
  },
  'cookies': {
    title: 'Cookies & Tracking Policy',
    updated: 'October 10, 2026',
    content: (
      <>
        <p>In compliance with India&apos;s Digital Personal Data Protection (DPDP) Act, Throve strictly respects your digital privacy.</p>
        
        <h3>1. Essential Cookies</h3>
        <p>These cookies are strictly required to operate your shopping session, maintain cart state, and preserve secure authentication. They do not track your activity across other sites.</p>
        
        <h3>2. Analytics & Preference Cookies</h3>
        <p>We use aggregated, anonymized analytics cookies to understand site performance. No personal or financial information is shared with third parties.</p>
        
        <h3>3. Managing Cookie Preferences</h3>
        <p>You can adjust cookie settings via your browser settings or opt-out of optional tracking anytime through our privacy portal.</p>
      </>
    )
  }
};

export default async function PolicyPage({ params }) {
  const resolvedParams = await params;
  const policy = policies[resolvedParams?.handle];

  if (!policy) {
    return (
      <main className={styles.policyLayout}>
        <div className={styles.container}>
          <h1>Policy Not Found</h1>
          <Link href="/" className={styles.homeLink}>Return to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.policyLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{policy.title}</h1>
          <p>Last updated: {policy.updated}</p>
        </div>
        <div className={styles.content}>
          {policy.content}
        </div>
      </div>
    </main>
  );
}
