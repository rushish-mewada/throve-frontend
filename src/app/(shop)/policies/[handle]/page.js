import Link from 'next/link';
import { getStorefrontConfig } from '@/lib/storefront/config';
import styles from './page.module.css';

const policies = {
  'terms': {
    title: 'Terms & Conditions',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>Welcome to THROVE Atelier (<strong>https://throve.in</strong>). By accessing our website, browsing our catalog, or placing an order, you explicitly agree to be bound by these Terms and Conditions and all applicable statutory regulations in the Republic of India.</p>
        
        <h3>1. Commercial Offerings & Product Pricing</h3>
        <p>THROVE curates, manufactures, and fulfills bespoke luxury apparel, fine tailoring, and designer garments. All product descriptions, specifications, and sizes are accurately represented. All prices are explicitly stated in <strong>Indian Rupees (INR / ₹)</strong> and are inclusive of Goods & Services Tax (GST) unless specified otherwise. We reserve the right to correct typographical pricing errors before order dispatch.</p>
        
        <h3>2. Payment Processing & Authorized Gateways</h3>
        <p>All online transactions are securely routed through Reserve Bank of India (RBI) authorized payment aggregators (including <strong>Cashfree Payments</strong>) via 256-bit SSL encrypted channels complying with PCI-DSS Level 1 standards. By initiating checkout, you authorize our payment partners to charge the specified INR amount to your selected payment instrument (Cards, UPI, NetBanking). THROVE never stores credit/debit card numbers, CVV, or netbanking passwords on its servers.</p>
        
        <h3>3. Order Acceptance & Fraud Prevention</h3>
        <p>Receipt of an electronic order confirmation does not signify our final acceptance of your order. THROVE reserves the right to decline, hold, or cancel quantities purchased per person, per household, or per order in instances of suspected commercial resale, bot activities, fraudulent payment attempts, or inaccurate shipping credentials.</p>
        
        <h3>4. Governing Law & Exclusive Jurisdiction</h3>
        <p>These Terms and Conditions and all commercial transactions shall be governed by, construed, and enforced in accordance with the laws of the Republic of India. Any legal action, dispute, or proceeding arising out of or related to your use of this site or purchases shall be subject to the <strong>exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India</strong>.</p>
        
        <h3>5. Limitation of Liability</h3>
        <p>To the maximum extent permitted by applicable Indian law, THROVE&apos;s total aggregate liability arising out of or related to any order, defect, or claim shall be strictly limited to the <strong>actual purchase price paid by the customer for the specific product in question</strong>. Under no circumstances shall THROVE, its directors, or affiliates be liable for indirect, incidental, punitive, or consequential damages.</p>
        
        <h3>6. Product Representation & Digital Display Variance</h3>
        <p>While we make every effort to display garment colors, textile sheens, and silhouettes with photographic fidelity, variations in digital displays, screen contrast settings, and studio lighting may cause minor perceptible differences. Such minor variances are inherent to textile craftsmanship and do not constitute defective goods or misrepresentation.</p>
        
        <h3>7. Force Majeure & Delivery Transit</h3>
        <p>THROVE shall not be held liable or deemed in default for delivery delays, shipment holds, or non-performance resulting from acts of God, extreme weather, strikes, carrier embargoes, regional lockdowns, statutory courier disruptions, or circumstances beyond our reasonable control.</p>
        
        <h3>8. Communication & Transactional Consent</h3>
        <p>By providing your mobile number and email during checkout or account registration, you expressly consent to receive operational transactional notifications, delivery tracking updates, electronic invoices, and authentication OTPs via WhatsApp, SMS, and email pursuant to applicable TRAI and DPDP guidelines.</p>
      </>
    )
  },
  'privacy': {
    title: 'Privacy Policy',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>THROVE Atelier respects your digital privacy. This Privacy Policy details how we collect, process, safeguard, and retain your personal data in strict compliance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the Information Technology Act, 2000.</p>
        
        <h3>1. Personal Data We Collect</h3>
        <p>We collect only the minimal data strictly necessary for order fulfillment and doorstep delivery: full name, shipping and billing address, email address, phone number, and transaction identifiers. We do not store sensitive payment credentials such as card numbers or CVV.</p>
        
        <h3>2. Purpose of Data Processing</h3>
        <p>Your information is processed solely to fulfill your orders, provide shipment tracking notifications, disburse refunds, and offer dedicated concierge support. We never sell, rent, or trade customer information to third-party advertisers.</p>
        
        <h3>3. Data Retention Policy (DPDP & Statutory Compliance)</h3>
        <p>In accordance with Section 8(7) of the DPDP Act, 2023, customer personal data is retained only for as long as necessary to fulfill the operational purpose for which it was collected or to satisfy statutory obligations:</p>
        <ul>
          <li><strong>Statutory Invoices & Tax Records:</strong> Maintained for a minimum of <strong>8 years (72 months)</strong> in compliance with Section 128 of the Companies Act, 2013 and Section 36 of the Central Goods and Services Tax (CGST) Act, 2017.</li>
          <li><strong>Customer Account & Contact Profile:</strong> Retained during the active life of your account, or until you submit a formal deletion request.</li>
          <li><strong>Ephemeral Logs & Abandoned Carts:</strong> Session logs and abandoned checkout records are automatically purged or anonymized after 90 days.</li>
        </ul>
        
        <h3>4. Data Subject Rights (Access, Correction & Erasure)</h3>
        <p>You have the legal right to request access to your stored personal records, correct inaccurate information, or request permanent deletion (subject to statutory tax retention rules) by emailing our Data Protection Officer at <a href="mailto:throve.in@gmail.com">throve.in@gmail.com</a>.</p>
        
        <h3>5. Grievance Redressal Mechanism & Officer</h3>
        <p>In compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, our designated Grievance Officer details are published below:</p>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', marginTop: '12px' }}>
          <p><strong>Designation:</strong> Grievance Redressal Officer, THROVE Atelier</p>
          <p><strong>Registered Office:</strong> Girgaon, Charni Road, Mumbai, Maharashtra — 400004, India</p>
          <p><strong>Email:</strong> <a href="mailto:throve.in@gmail.com">throve.in@gmail.com</a></p>
          <p><strong>Helpline:</strong> <a href="tel:+919892691094">+91 98926 91094</a> (Mon–Sat, 9:00 AM – 6:00 PM IST)</p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#a8a29e' }}>*All consumer grievances are formally acknowledged within 48 hours and resolved within 30 days as prescribed by law.</p>
        </div>
      </>
    )
  },
  'refunds': {
    title: 'Cancellation & Refund Policy',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>At THROVE, we are dedicated to an uncompromising standard of sartorial excellence. If you are not completely satisfied with your purchase, our transparent cancellation and refund guidelines are outlined below.</p>
        
        <h3>1. Order Cancellation Prior to Dispatch</h3>
        <p>You may cancel any order free of charge within <strong>24 hours</strong> of placement or before physical carrier dispatch. Upon cancellation, a 100% full refund is initiated immediately back to your original payment method. If an order has already entered transit, cancellation cannot be processed midway; you may refuse delivery at the doorstep or request a 7-day return upon arrival.</p>
        
        <h3>2. 7-Day Doorstep Return & Exchange Window</h3>
        <p>You are entitled to initiate a return or exchange request within <strong>7 calendar days</strong> from confirmed doorstep delivery. To qualify:</p>
        <ul>
          <li>The garment must remain unworn, unwashed, unaltered, and free of perfumes or makeup marks.</li>
          <li>All brand designer labels, tags, and security seals must remain firmly attached.</li>
          <li>Original protective garment bags and luxury packaging must be returned intact.</li>
        </ul>
        
        <h3>3. Refund Disbursement Timelines</h3>
        <p>Upon return package receipt at our Mumbai atelier, quality inspection is concluded within <strong>24 to 48 business hours</strong>. Approved refunds are disbursed as follows:</p>
        <ul>
          <li><strong>Prepaid Transactions (UPI, Credit/Debit Cards, NetBanking):</strong> Funds are credited back to the source account via <strong>Cashfree Payments</strong> within <strong>5 to 7 business days</strong>.</li>
          <li><strong>Cash on Delivery (COD) Transactions:</strong> Our team will request your verified bank NEFT or UPI details. Funds are disbursed via automated bank payout within <strong>2 to 4 business days</strong>.</li>
        </ul>
        
        <h3>4. Damaged or Defective Items</h3>
        <p>In the rare event of receiving a transit-damaged or defective garment, notify our concierge within <strong>48 hours</strong> of delivery with clear photographs. We will coordinate an immediate replacement or issue a full refund including express shipping fees.</p>
      </>
    )
  },
  'returns': {
    title: 'Returns & Exchange Policy',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>We want every THROVE piece to fit you flawlessly. We provide a seamless 7-day doorstep return and exchange workflow across all serviced pin codes in India.</p>
        
        <h3>1. Complimentary Size Exchanges</h3>
        <p>Need a different size? We arrange complimentary reverse pickups for size exchanges free of charge. Your replacement garment is dispatched promptly upon handover.</p>
        
        <h3>2. Reverse Pickup Coordination</h3>
        <p>Upon initiating a return through our concierge or account portal, our premium courier partners (Blue Dart, Delhivery) will attempt doorstep pickup within <strong>24 to 48 business hours</strong>.</p>
        
        <h3>3. How to Initiate a Return or Exchange</h3>
        <p>Reach out to our dedicated concierge with your Order Reference ID:</p>
        <ul>
          <li><strong>WhatsApp Concierge:</strong> <a href="tel:+919892691094">+91 98926 91094</a></li>
          <li><strong>Support Email:</strong> <a href="mailto:throve.in@gmail.com">throve.in@gmail.com</a></li>
          <li><strong>Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST</li>
        </ul>
      </>
    )
  },
  'shipping': {
    title: 'Shipping & Delivery Policy',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>THROVE partners with India&apos;s premier express logistics carriers (Blue Dart Express, Delhivery Air) to guarantee rapid, secure PAN-India fulfillment.</p>
        
        <h3>1. Dispatch & Processing Window</h3>
        <p>All in-stock orders undergo meticulous hand-finishing, steam pressing, and quality inspection, dispatching from our Mumbai facility within <strong>24 to 48 business hours</strong>.</p>
        
        <h3>2. Estimated Transit Timelines</h3>
        <ul>
          <li><strong>Tier-1 Metros (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
          <li><strong>Tier-2 / Tier-3 Cities & Rest of India:</strong> 4 to 7 business days.</li>
          <li><strong>Northeast & Remote Locations:</strong> 6 to 9 business days.</li>
        </ul>
        
        <h3>3. Shipping Rates & COD Surcharge</h3>
        <p><strong>Complimentary Express Shipping</strong> is provided on all prepaid orders across India. For Cash on Delivery (COD) orders, a standard handling fee of ₹99 is applicable to cover courier COD verification services.</p>
      </>
    )
  },
  'cookies': {
    title: 'Cookies & Tracking Policy',
    updated: 'November 14, 2026',
    content: (
      <>
        <p>In strict compliance with India&apos;s Digital Personal Data Protection (DPDP) Act, THROVE respects your online privacy and operates under a privacy-first data architecture.</p>
        
        <h3>1. Strictly Essential Cookies</h3>
        <p>Essential cookies are required to authenticate your shopping session, preserve cart contents, and protect payment requests. These cookies do not track your activity across third-party websites.</p>
        
        <h3>2. Analytics & Performance Cookies</h3>
        <p>We use aggregated, anonymized telemetry cookies to analyze website speed and optimize checkout reliability. No personally identifiable or financial information is shared with advertisers.</p>
        
        <h3>3. Managing Your Cookie Preferences</h3>
        <p>You can adjust cookie permissions at any time via your browser settings. Disabling essential cookies may impair core cart or checkout functionality.</p>
      </>
    )
  }
};

export default async function PolicyPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle;
  const policy = policies[handle];

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

  const config = await getStorefrontConfig().catch(() => ({}));
  let customContent = null;
  if (handle === 'terms' && config?.policies?.termsContent) {
    customContent = config.policies.termsContent;
  } else if (handle === 'privacy' && config?.policies?.privacyContent) {
    customContent = config.policies.privacyContent;
  } else if (handle === 'shipping' && config?.policies?.shippingContent) {
    customContent = config.policies.shippingContent;
  } else if ((handle === 'refunds' || handle === 'returns') && config?.policies?.refundContent) {
    customContent = config.policies.refundContent;
  }

  return (
    <main className={styles.policyLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{policy.title}</h1>
          <p>Last updated: {policy.updated}</p>
        </div>
        <div className={styles.content}>
          {customContent ? (
            customContent.split('\n\n').map((block, idx) => (
              <p key={idx}>{block}</p>
            ))
          ) : (
            policy.content
          )}
        </div>
      </div>
    </main>
  );
}
