"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductSpecsSection.module.css";

/**
 * Extracts structured technical specifications from backend product data.
 * Checks product.specifications, product.metadata.specifications, or converts product.specs if available.
 * Returns empty array if no backend specifications are defined.
 */
function getSpecificationsFromProduct(product) {
  if (Array.isArray(product?.specifications) && product.specifications.length > 0) {
    return product.specifications.filter((s) => s && s.label && s.value);
  }
  if (Array.isArray(product?.metadata?.specifications) && product.metadata.specifications.length > 0) {
    return product.metadata.specifications.filter((s) => s && s.label && s.value);
  }
  if (product?.specs && typeof product.specs === "object") {
    const list = [];
    if (product.specs.fabric) list.push({ label: "Fabric", value: product.specs.fabric });
    if (product.specs.tailoring) list.push({ label: "Fit & Tailoring", value: product.specs.tailoring });
    if (product.specs.care) list.push({ label: "Wash Care", value: product.specs.care });
    if (list.length > 0) return list;
  }
  return [];
}

/**
 * Extracts visual layout blocks from backend product data.
 * Returns empty array if no backend visual blocks are defined.
 */
function getVisualBlocksFromProduct(product) {
  if (Array.isArray(product?.visualBlocks) && product.visualBlocks.length > 0) {
    return product.visualBlocks.filter((b) => b && (b.title || b.image));
  }
  if (Array.isArray(product?.metadata?.visualBlocks) && product.metadata.visualBlocks.length > 0) {
    return product.metadata.visualBlocks.filter((b) => b && (b.title || b.image));
  }
  return [];
}

export default function ProductSpecsSection({ product }) {
  if (!product) return null;

  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isVisualStudyOpen, setIsVisualStudyOpen] = useState(false);

  const specifications = getSpecificationsFromProduct(product);
  const visualBlocks = getVisualBlocksFromProduct(product);

  const hasSpecs = specifications.length > 0;
  const hasVisual = visualBlocks.length > 0;

  // If no backend data is there, hide this section and keep a clean divider
  if (!hasSpecs && !hasVisual) {
    return <div className={styles.hiddenSectionDivider} aria-hidden="true" />;
  }

  return (
    <section
      id="product-specifications"
      className={styles.section}
      aria-labelledby="specs-heading"
    >
      <div className={styles.atelierFrame}>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.tagline}>ATELIER DOSSIER · MATERIALITY &amp; SARTORIAL FORM</span>
          <h2 id="specs-heading" className={styles.title}>
            Anatomy &amp; Craftsmanship
          </h2>
          <p className={styles.subtitle}>
            Material Composition, Architectural Drape &amp; Tailoring
          </p>
        </div>

        {/* Unified Accordion Sub-Sections */}
        <div className={styles.accordionGroup}>
          {/* Sub-Section 1: Anatomy & Specifications */}
          {hasSpecs && (
            <div className={`${styles.accordionItem} ${isDossierOpen ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.accordionHeaderBtn}
                onClick={() => setIsDossierOpen((prev) => !prev)}
                aria-expanded={isDossierOpen}
                aria-controls="specifications-body"
              >
                <div className={styles.accordionHeaderLeft}>
                  <span className={styles.subIndexLabel}>ANATOMY</span>
                  <h3 className={styles.accordionTitle}>Specifications</h3>
                  <p className={styles.accordionSubtitle}>
                    Fabrication, Material Composition &amp; Garment Architecture
                  </p>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span
                    className={`${styles.iconButton} ${isDossierOpen ? styles.iconButtonOpen : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${styles.accordionChevron} ${isDossierOpen ? styles.chevronOpen : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>

              {isDossierOpen && (
                <div id="specifications-body" className={styles.accordionBody}>
                  <div className={styles.specGrid}>
                    {specifications.map((item, idx) => (
                      <div key={idx} className={styles.specCell}>
                        <span className={styles.specLabel}>{item.label}</span>
                        <span className={styles.specValue}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-Section 2: Craftsmanship & Visual Study */}
          {hasVisual && (
            <div className={`${styles.accordionItem} ${isVisualStudyOpen ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.accordionHeaderBtn}
                onClick={() => setIsVisualStudyOpen((prev) => !prev)}
                aria-expanded={isVisualStudyOpen}
                aria-controls="visual-study-body"
              >
                <div className={styles.accordionHeaderLeft}>
                  <span className={styles.subIndexLabel}>CRAFTSMANSHIP</span>
                  <h3 className={styles.accordionTitle}>Visual Study &amp; Design in Detail</h3>
                  <p className={styles.accordionSubtitle}>
                    An intimate study of textile purity, architectural silhouette, and artisanal hardware.
                  </p>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span
                    className={`${styles.iconButton} ${isVisualStudyOpen ? styles.iconButtonOpen : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${styles.accordionChevron} ${isVisualStudyOpen ? styles.chevronOpen : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>

              {isVisualStudyOpen && (
                <div id="visual-study-body" className={styles.accordionBody}>
                  <div className={styles.visualBlocksList}>
            {visualBlocks.map((block) => {
              // Layout: image_left (Image 1:1 on Left, Text on Right)
              if (block.layout === "image_left") {
                return (
                  <article key={block.id || block.title} className={styles.layoutSplit}>
                    <div className={styles.ratio1x1}>
                      <Image
                        src={block.image}
                        alt={block.imageAlt || block.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.contentCol}>
                      {block.tag && <span className={styles.blockTag}>{block.tag}</span>}
                      <h4 className={styles.blockTitle}>{block.title}</h4>
                      <p className={styles.blockDesc}>{block.description}</p>
                      {Array.isArray(block.features) && block.features.length > 0 && (
                        <ul className={styles.featureList}>
                          {block.features.map((feat, fIdx) => (
                            <li key={fIdx} className={styles.featureItem}>
                              <span className={styles.featureCheck}>✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              }

              // Layout: image_right (Text on Left, Image 1:1 on Right)
              if (block.layout === "image_right") {
                return (
                  <article
                    key={block.id || block.title}
                    className={`${styles.layoutSplit} ${styles.layoutSplitRight}`}
                  >
                    <div className={styles.contentCol}>
                      {block.tag && <span className={styles.blockTag}>{block.tag}</span>}
                      <h4 className={styles.blockTitle}>{block.title}</h4>
                      <p className={styles.blockDesc}>{block.description}</p>
                      {Array.isArray(block.features) && block.features.length > 0 && (
                        <ul className={styles.featureList}>
                          {block.features.map((feat, fIdx) => (
                            <li key={fIdx} className={styles.featureItem}>
                              <span className={styles.featureCheck}>✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className={styles.ratio1x1}>
                      <Image
                        src={block.image}
                        alt={block.imageAlt || block.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </article>
                );
              }

              // Layout: image_top (Wide 2:1 Image on Top, Text Below)
              if (block.layout === "image_top") {
                return (
                  <article key={block.id || block.title} className={styles.layoutStacked}>
                    <div className={styles.ratio2x1}>
                      <Image
                        src={block.image}
                        alt={block.imageAlt || block.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1000px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.contentCol}>
                      {block.tag && <span className={styles.blockTag}>{block.tag}</span>}
                      <h4 className={styles.blockTitle}>{block.title}</h4>
                      <p className={styles.blockDesc}>{block.description}</p>
                    </div>
                  </article>
                );
              }

              // Layout: image_bottom (Text on Top, Wide 2:1 Image Below)
              if (block.layout === "image_bottom") {
                return (
                  <article key={block.id || block.title} className={styles.layoutStacked}>
                    <div className={styles.contentCol}>
                      {block.tag && <span className={styles.blockTag}>{block.tag}</span>}
                      <h4 className={styles.blockTitle}>{block.title}</h4>
                      <p className={styles.blockDesc}>{block.description}</p>
                    </div>
                    <div className={styles.ratio2x1}>
                      <Image
                        src={block.image}
                        alt={block.imageAlt || block.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1000px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </article>
                );
              }

              // Layout: image_only (Strict 16:9 Widescreen Image with Overlay Caption)
              if (block.layout === "image_only") {
                return (
                  <article key={block.id || block.title} className={styles.layoutImageOnly}>
                    <div className={styles.ratio16x9}>
                      <Image
                        src={block.image}
                        alt={block.imageAlt || block.title || "Editorial view"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1100px"
                        style={{ objectFit: "cover" }}
                      />
                      {block.caption && (
                        <div className={styles.imageOnlyCaption}>
                          <strong>{block.caption}</strong>
                          <span>Aspect Ratio 16:9 Cinematic</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }

              // Layout: text_only (Editorial Typography Block)
              return (
                <article key={block.id || block.title} className={styles.layoutTextOnly}>
                  {block.tag && <span className={styles.blockTag}>{block.tag}</span>}
                  <h4 className={styles.blockTitle}>{block.title}</h4>
                  <p className={styles.blockDesc}>{block.description}</p>
                </article>
              );
            })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
  );
}
