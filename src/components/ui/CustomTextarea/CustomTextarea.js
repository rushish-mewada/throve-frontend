"use client";

import styles from './CustomTextarea.module.css';

export default function CustomTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  maxLength,
  error,
  hint,
  disabled = false,
  fullWidth = true,
}) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={id} className={styles.label}>
            {label} {required && <span className={styles.requiredStar}>*</span>}
          </label>
          {maxLength && (
            <span className={styles.charCount}>
              {value?.length || 0} / {maxLength}
            </span>
          )}
        </div>
      )}

      <div className={`${styles.textareaContainer} ${error ? styles.hasError : ''}`}>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={styles.textarea}
        />
      </div>

      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
