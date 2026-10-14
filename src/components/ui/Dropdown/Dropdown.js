"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

export default function Dropdown({ options, value, onChange, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg 
          width="16" height="16" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      
      {isOpen && (
        <div className={styles.menu}>
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => {
                if (onChange) onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {opt.icon && <span className={styles.iconWrapper}>{opt.icon}</span>}
                <span>{opt.label}</span>
              </div>
              {opt.value === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
