"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { checkCustomerStatusAction, completeFirstLoginAction } from '@/actions/customer';
import styles from './page.module.css';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile Setup
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginUser } = useStore();

  useEffect(() => {
    const stepParam = searchParams.get('step');
    const phoneParam = searchParams.get('phone');
    if (phoneParam) {
      const clean = phoneParam.replace(/[^0-9]/g, '').slice(-10);
      setPhone(clean);
    }
    if (stepParam === 'profile') {
      setStep(3);
    }
  }, [searchParams]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (otp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP received on WhatsApp.');
      return;
    }

    setIsLoading(true);
    let cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone && typeof document !== 'undefined') {
      const match = document.cookie.match(/throve_customer_session=([0-9]+)/);
      if (match) cleanPhone = match[1];
    }

    try {
      const statusRes = await checkCustomerStatusAction(cleanPhone);

      if (statusRes.isFirstLogin) {
        // First login: basic profile (Name & Email) is missing. Strictly gate access!
        if (statusRes.customer?.name && statusRes.customer.name !== 'Client' && statusRes.customer.name !== 'Valued Client') {
          setName(statusRes.customer.name);
        }
        if (statusRes.customer?.email) {
          setEmail(statusRes.customer.email);
        }
        setStep(3);
      } else {
        // Returning customer with existing profile
        const cust = statusRes.customer;
        loginUser({
          name: cust.name,
          phone: `+91 ${cleanPhone}`,
          email: cust.email,
          tier: cust.tier || 'Throve Member',
        });
        document.cookie = `throve_customer_session=${cleanPhone}; path=/; max-age=604800; SameSite=Lax`;
        window.location.href = redirectTarget;
      }
    } catch {
      setErrorMsg('Failed to verify customer profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address for order receipts and updates.');
      return;
    }

    setIsLoading(true);
    let cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone && typeof document !== 'undefined') {
      const match = document.cookie.match(/throve_customer_session=([0-9]+)/);
      if (match) cleanPhone = match[1];
    }

    try {
      const result = await completeFirstLoginAction({
        phone: cleanPhone,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      if (!result.ok) {
        setErrorMsg(result.error || 'Failed to save profile. Please try again.');
        setIsLoading(false);
        return;
      }

      loginUser({
        name: name.trim(),
        phone: `+91 ${cleanPhone}`,
        email: email.trim().toLowerCase(),
        tier: 'Throve Member',
      });

      window.location.href = redirectTarget;
    } catch {
      setErrorMsg('An unexpected error occurred while saving your profile.');
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.authLayout}>
      <div className={styles.imageCol}>
        <div className={styles.imageWrapper}>
          <Image
            src="/products/asymmetric-mandarin-shirt/main.jpg"
            alt="Throve S/S 25 Editorial"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      <div className={styles.formCol}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>
              {step === 1 && 'Welcome to Throve.'}
              {step === 2 && 'Verify Number'}
              {step === 3 && 'Complete Profile'}
            </h1>
            <p>
              {step === 1 && 'Enter your mobile number to securely log in or create your account.'}
              {step === 2 && `We've sent a 6-digit code to your WhatsApp on +91 ${phone}`}
              {step === 3 && 'Please provide your basic details before accessing your account dashboard.'}
            </p>
          </div>

          {errorMsg && (
            <div className={styles.errorBanner} style={{ marginBottom: '20px' }}>
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form className={styles.form} onSubmit={handleSendOtp}>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <div className={styles.phoneInputWrapper}>
                  <span className={styles.countryCode}>+91</span>
                  <input
                    type="tel"
                    placeholder="98926 91094"
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
          )}

          {step === 2 && (
            <>
              <form className={styles.form} onSubmit={handleVerifyOtp}>
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

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <div className={styles.toggleText}>
                Didn't receive the code?{' '}
                <button type="button" className={styles.toggleBtn}>Resend via WhatsApp</button>
                <br /><br />
                <button type="button" className={styles.toggleBtn} onClick={() => setStep(1)}>Change Number</button>
              </div>
            </>
          )}

          {step === 3 && (
            <form className={styles.form} onSubmit={handleCompleteProfile}>
              <div className={styles.inputGroup}>
                <label>Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  className={styles.textInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. aarav@gmail.com"
                  className={styles.textInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.noticeBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className={styles.noticeIcon}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>
                  <strong>Checkout Delivery Note:</strong> Your shipping and billing addresses are collected and verified securely at the time of checking out.
                </span>
              </div>

              <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                {isLoading ? 'Saving Profile...' : 'Complete & Access My Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className={styles.authLayout}><div className={styles.formCol}>Loading...</div></main>}>
      <LoginFormContent />
    </Suspense>
  );
}
