"use client";

import styles from './CustomInput.module.css';

export default function CustomInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
  prefix,
  error,
  fullWidth = false,
  disabled = false,
}) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={`${styles.inputContainer} ${prefix ? styles.hasPrefix : ''} ${error ? styles.hasError : ''}`}>
        {prefix && (
          <span className={styles.prefix}>
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          className={styles.input}
        />
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
