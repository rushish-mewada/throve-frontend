import styles from './page.module.css';

export default function ContactPage() {
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
            <form className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input type="text" placeholder="Your full name" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" placeholder="Your email address" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Order Number (Optional)</label>
                <input type="text" placeholder="E.g. ORD-123456" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea placeholder="How can we help you?" className={styles.textarea} rows="5"></textarea>
              </div>
              
              <button type="button" className={styles.primaryBtn}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
