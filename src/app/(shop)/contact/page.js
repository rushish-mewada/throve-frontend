"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    // 2-second realistic submission simulation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', orderNumber: '', message: '' });
  };

  return (
    <main className={styles.contactLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Contact Us</h1>
          <p>Have a question or need assistance? We're here to help.</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.infoCol}>
            <h2>Get in Touch</h2>
            <p>Our customer service team is available Monday through Friday, 9 AM to 6 PM IST.</p>
            
            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <h3>Email</h3>
                  <p>support@throve.com</p>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <h3>Office Address</h3>
                  <p>123 Fashion Street, Bandra West<br />Mumbai, Maharashtra 400050<br />India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.formCol}>
            {isSubmitted && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '14px 18px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '0.92rem',
                lineHeight: 1.5
              }}>
                ✓ Thank you! Your message has been received. Our concierge team will reply within 24 hours.
              </div>
            )}
            
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Order Number (Optional)</label>
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="E.g. ORD-123456"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  rows="5"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.primaryBtn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" opacity="0.4" />
                    </svg>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
