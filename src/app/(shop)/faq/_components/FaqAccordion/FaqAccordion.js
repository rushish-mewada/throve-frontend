"use client";

import { useState } from 'react';
import styles from './FaqAccordion.module.css';

const FAQ_SECTIONS = [
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'What payment methods do you accept in India?',
        a: 'We accept all major Indian credit & debit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ Indian banks, and Cash on Delivery (COD) on eligible pin codes.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, COD is available for orders up to ₹10,000 across serviceable Indian pin codes. For security and fraud prevention, COD orders may require a quick WhatsApp or OTP verification before dispatch.',
      },
      {
        q: 'Are all prices inclusive of GST?',
        a: 'Yes, all prices displayed on Throve are fully inclusive of 12% or 18% GST as per Indian apparel tax regulations. You will receive a GST tax invoice with our registered GSTIN on order delivery.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take across India?',
        a: 'Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata) typically receive deliveries within 2–4 business days. Non-metro and regional locations take 4–7 business days via our logistics partners (Blue Dart, Delhivery, DTDC).',
      },
      {
        q: 'What are the shipping charges?',
        a: 'We offer Free Express Shipping on all prepaid orders across India. For Cash on Delivery orders, a standard handling fee of ₹99 applies.',
      },
      {
        q: 'How can I track my shipment?',
        a: 'Once your order is dispatched, you will receive an SMS and email with your AWB tracking link. You can also track your order directly on our website using the Track Order page with your Order ID.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return & exchange window?',
        a: 'We offer a 7-day hassle-free return and exchange policy from the date of delivery. Items must be unworn, unwashed, and returned with original tags and packaging intact.',
      },
      {
        q: 'How do I initiate a return or exchange?',
        a: 'Log into your Throve Account, navigate to "Orders", and select "Request Return / Exchange". Alternatively, you can message our client concierge with your Order ID. A reverse courier pickup will be arranged.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once the returned item passes quality inspection at our Mumbai fulfillment center, prepaid refunds are initiated to the original payment source within 3–5 business days. COD refunds are processed via UPI or direct bank transfer.',
      },
    ],
  },
  {
    category: 'Sizing & Garment Care',
    items: [
      {
        q: 'How do Throve garments fit?',
        a: 'Most Throve silhouettes feature a contemporary streetwear cut — oversized shoulders, boxy drape, and relaxed width. If you prefer a regular tailored fit, we recommend sizing down. Detailed measurements are provided on every product page.',
      },
      {
        q: 'How should I care for heavyweight cotton and printed tees?',
        a: 'To preserve garment structure and print longevity, machine wash cold (below 30°C) inside out with mild detergent. Do not tumble dry. Iron on low heat on the reverse side; never iron directly over screen prints.',
      },
    ],
  },
];

export default function FaqAccordion() {
  const [activeTab, setActiveTab] = useState(0);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={styles.container}>
      {/* Category Pills */}
      <div className={styles.categoryTabs}>
        {FAQ_SECTIONS.map((section, idx) => (
          <button
            key={section.category}
            type="button"
            className={`${styles.tabBtn} ${activeTab === idx ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {section.category}
          </button>
        ))}
      </div>

      {/* Accordion List for Active Category */}
      <div className={styles.accordionList}>
        {FAQ_SECTIONS[activeTab].items.map((item, itemIdx) => {
          const isOpen = !!openItems[`${activeTab}-${itemIdx}`];
          return (
            <div
              key={item.q}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
            >
              <button
                type="button"
                className={styles.questionBtn}
                onClick={() => toggleItem(activeTab, itemIdx)}
                aria-expanded={isOpen}
              >
                <span className={styles.questionText}>{item.q}</span>
                <span className={styles.iconWrapper}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className={styles.answerWrapper}>
                  <p className={styles.answerText}>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
