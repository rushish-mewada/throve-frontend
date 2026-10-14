"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log generic error info server-side or to observability in production
    console.error('Storefront Runtime Error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.card}>
        <span className={styles.statusCode}>UNEXPECTED ERROR</span>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.description}>
          An unexpected issue interrupted your browsing session. Our engineers have been alerted.
        </p>

        <div className={styles.actionGroup}>
          <button
            type="button"
            onClick={() => reset()}
            className={styles.primaryBtn}
          >
            Try Again
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
