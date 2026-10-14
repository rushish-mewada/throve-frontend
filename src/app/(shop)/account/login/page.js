"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length > 9) {
      setStep(2);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Simulate verification
    if (otp.length === 6) {
      window.location.href = "/account";
    }
  };

  return (
    <main className={styles.authLayout}>
      <div className={styles.imageCol}>
        <div className={styles.imageWrapper}>
          <Image 
            src="https://placehold.co/800x1200/111111/ffffff.png?text=Throve+Editorial" 
            alt="Throve Fashion" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
      
      <div className={styles.formCol}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>{step === 1 ? 'Welcome to Throve.' : 'Verify Number'}</h1>
            <p>
              {step === 1 
                ? 'Enter your mobile number to securely log in or create an account.' 
                : `We've sent a 6-digit code to your WhatsApp on +91 ${phone}`}
            </p>
          </div>

          {step === 1 ? (
            <form className={styles.form} onSubmit={handleSendOtp}>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <div className={styles.phoneInputWrapper}>
                  <span className={styles.countryCode}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="98765 43210" 
                    className={styles.phoneInput} 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Send OTP via WhatsApp
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleVerify}>
              <div className={styles.inputGroup}>
                <label>Enter 6-digit OTP</label>
                <input 
                  type="text" 
                  placeholder="• • • • • •" 
                  className={styles.otpInput} 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Verify & Login
              </button>
            </form>
          )}

          {step === 2 && (
            <div className={styles.toggleText}>
              Didn't receive the code?{' '}
              <button className={styles.toggleBtn}>Resend via WhatsApp</button>
              <br/><br/>
              <button className={styles.toggleBtn} onClick={() => setStep(1)}>Change Number</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
