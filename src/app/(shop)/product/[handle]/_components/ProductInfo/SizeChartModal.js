"use client";

import { useState, useEffect } from "react";
import styles from "./ProductInfo.module.css";

const SIZE_DATA = {
  dress: {
    category: "Tailored Dresses",
    measurements: [
      { name: "Bust", s: 34, m: 36, l: 38 },
      { name: "Waist", s: 27, m: 29, l: 31 },
      { name: "Hip", s: 37, m: 39, l: 41 },
      { name: "Length", s: 35.5, m: 36, l: 36.5 },
    ],
    tips: "Measure around the fullest part of your bust and hips. For waist, measure at the narrowest point of your natural waistline.",
  },
  shirt: {
    category: "Tailored Shirts",
    measurements: [
      { name: "Chest", s: 38, m: 40, l: 42 },
      { name: "Shoulder", s: 17.5, m: 18.5, l: 19.5 },
      { name: "Sleeve Length", s: 24.5, m: 25, l: 25.5 },
      { name: "Garment Length", s: 28, m: 29, l: 30 },
    ],
    tips: "Measure around the fullest part of the chest, keeping the tape horizontal under the arms. Shoulder measurement from seam to seam.",
  },
  pants: {
    category: "Tailored Trousers",
    measurements: [
      { name: "Waist", s: 28, m: 30, l: 32 },
      { name: "Hip", s: 38, m: 40, l: 42 },
      { name: "Inseam", s: 30, m: 30.5, l: 31 },
      { name: "Outseam (Total Length)", s: 40.5, m: 41, l: 41.5 },
    ],
    tips: "Measure your natural waist where trousers comfortably sit. Inseam is measured from crotch seam to bottom hem.",
  },
  top: {
    category: "Sweetheart Tops & Bodices",
    measurements: [
      { name: "Bust", s: 33, m: 35, l: 37 },
      { name: "Underbust", s: 27, m: 29, l: 31 },
      { name: "Waist", s: 26, m: 28, l: 30 },
      { name: "Front Length", s: 16, m: 16.5, l: 17 },
    ],
    tips: "Designed for a sculpted contour fit. If you fall between sizes, we suggest choosing the larger size for optimum ease.",
  },
};

function getCategoryData(handle, title = "") {
  const h = (handle || "").toLowerCase();
  const t = (title || "").toLowerCase();
  if (h.includes("shirt") || t.includes("shirt")) return SIZE_DATA.shirt;
  if (h.includes("pants") || t.includes("pants") || h.includes("trouser") || t.includes("trouser")) return SIZE_DATA.pants;
  if (h.includes("top") || t.includes("top")) return SIZE_DATA.top;
  return SIZE_DATA.dress;
}

export default function SizeChartModal({ isOpen, onClose, product }) {
  const [unit, setUnit] = useState("in"); // 'in' or 'cm'

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const data = getCategoryData(product?.handle, product?.title);

  const formatValue = (valInches) => {
    if (unit === "cm") {
      return (valInches * 2.54).toFixed(1);
    }
    return valInches;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Size Guide</h3>
            <p className={styles.modalSubtitle}>{product?.title || data.category} · Garment Measurements</p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close size guide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Unit Switcher */}
        <div className={styles.unitToggleRow}>
          <span className={styles.unitLabel}>Unit of measure:</span>
          <div className={styles.unitButtonGroup}>
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === "in" ? styles.unitBtnActive : ""}`}
              onClick={() => setUnit("in")}
            >
              Inches (in)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === "cm" ? styles.unitBtnActive : ""}`}
              onClick={() => setUnit("cm")}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.sizeTable}>
            <thead>
              <tr>
                <th className={styles.thMeasure}>Dimension</th>
                <th>S</th>
                <th>M</th>
                <th>L</th>
              </tr>
            </thead>
            <tbody>
              {data.measurements.map((m) => (
                <tr key={m.name}>
                  <td className={styles.tdMeasure}>{m.name}</td>
                  <td>{formatValue(m.s)} {unit}</td>
                  <td className={styles.tdHighlight}>{formatValue(m.m)} {unit}</td>
                  <td>{formatValue(m.l)} {unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Tips */}
        <div className={styles.measurementTips}>
          <div className={styles.tipIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.3 15.3l-6.6 6.6c-.4.4-1 .4-1.4 0l-11-11c-.4-.4-.4-1 0-1.4l6.6-6.6c.4-.4 1-.4 1.4 0l11 11c.4.4.4 1 0 1.4z" />
              <path d="M7.5 4.5L10 7" />
              <path d="M10.5 7.5L12 9" />
              <path d="M13.5 10.5L16 13" />
              <path d="M16.5 13.5L18 15" />
            </svg>
          </div>
          <div>
            <strong>How to Measure:</strong>
            <p className={styles.tipText}>{data.tips}</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className={styles.modalFooter}>
          <p className={styles.footerNote}>
            Need assistance choosing your size? Contact our Concierge or WhatsApp support.
          </p>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

