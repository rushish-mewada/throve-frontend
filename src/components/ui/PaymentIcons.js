"use client";

import Image from 'next/image';

export function UpiIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/upi.svg" alt="UPI" width={32} height={13} style={{ objectFit: 'contain', height: '13px', width: 'auto' }} />
    </span>
  );
}

export function GPayIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/gpay.svg" alt="Google Pay" width={28} height={13} style={{ objectFit: 'contain', height: '13px', width: 'auto' }} />
    </span>
  );
}

export function PhonePeIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/phonepe.svg" alt="PhonePe" width={14} height={14} style={{ objectFit: 'contain', height: '14px', width: 'auto' }} />
    </span>
  );
}

export function RuPayIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/rupay.svg" alt="RuPay" width={30} height={13} style={{ objectFit: 'contain', height: '13px', width: 'auto' }} />
    </span>
  );
}

export function MastercardIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/mastercard.svg" alt="Mastercard" width={22} height={14} style={{ objectFit: 'contain', height: '14px', width: 'auto' }} />
    </span>
  );
}

export function VisaIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 5px', height: '22px' }}>
      <Image src="/assets/images/payments/visa.svg" alt="Visa" width={26} height={12} style={{ objectFit: 'contain', height: '12px', width: 'auto' }} />
    </span>
  );
}

export function CodIcon({ className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f5f5f4', border: '1px solid #e7e5e4', borderRadius: '4px', padding: '2px 6px', height: '22px', fontSize: '0.72rem', fontWeight: 600, color: '#1c1917' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
      <span>COD</span>
    </span>
  );
}
