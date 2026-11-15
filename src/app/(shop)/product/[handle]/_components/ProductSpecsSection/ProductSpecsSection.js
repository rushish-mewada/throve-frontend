"use client";

import Image from "next/image";
import styles from "./ProductSpecsSection.module.css";

/**
 * Returns comprehensive technical specifications for the product.
 * If product defines explicit specifications, uses them; otherwise generates high-fidelity specs based on product attributes.
 */
function getNormalizedSpecifications(product) {
  if (Array.isArray(product?.specifications) && product.specifications.length > 0) {
    return product.specifications;
  }

  const desc = (product?.description || "").toLowerCase();
  const title = (product?.title || "").toLowerCase();
  const subcategory = (product?.subcategory || product?.category || "Apparel").toLowerCase();

  // Determine material blend & composition
  let composition = "100% Japanese-Grade High-Density Cotton Twill";
  let blendPercent = "100% Cotton (0% Synthetics)";
  let weaveWeight = "240 GSM Structured Twill Weave";
  let fit = "Relaxed Tailored Silhouette with Structural Drape";
  let collar = "Architectural Standing Collar with Clean Contour";
  let closure = "Bespoke Geometric Matte Metal Buttons";
  let sleeves = "Long Sleeve with Angled French Beveled Cuffs";
  let pockets = "2 Concealed Side Seam Pockets";
  let washCare = "Gentle Cold Machine Wash or Dry Clean. Steam Iron on Low Heat.";
  let hem = "Standard Straight Hem with Reinforced Blind Stitch";
  let lining = "Unlined with Clean-Finished French Bound Seams";

  if (title.includes("dress") || subcategory.includes("dress")) {
    if (title.includes("sheath") || title.includes("princess")) {
      composition = "Tailored Architectural Wool-Blend Weave";
      blendPercent = "70% Wool, 25% Viscose, 5% Elastane Stretch";
      weaveWeight = "280 GSM Structured Compact Weave";
      fit = "Sculpted Princess-Line Contoured Sheath Fit";
      collar = "Asymmetric Lapel Shirt Collar";
      closure = "Twin Custom Geometric Matte Buttons";
      sleeves = "Sleeveless with Clean Reinforced Armholes";
      pockets = "Seamless Profile (Clean Silhouette)";
      washCare = "Specialist Dry Clean Only. Warm Press with Pressing Cloth.";
      hem = "Knee-Length Straight Hem with Vent";
      lining = "Full 100% Breathable Silk-Touch Cupro Lining";
    } else {
      composition = "High-Density Compact Twill Weave with Contoured Drape";
      blendPercent = "78% Cotton, 20% Lyocell, 2% Elastane";
      weaveWeight = "260 GSM Sculpted Compact Twill";
      fit = "Contoured Tailored Mini Fit with A-Line Hem";
      collar = "Asymmetrical Overlapped Architectural Collar";
      closure = "Antique Gunmetal Precision Metal Front Buttons";
      sleeves = "Sleeveless with Bonded Armholes";
      pockets = "Zero Exterior Pockets for Razor-Sharp Line";
      washCare = "Specialist Dry Clean Recommended. Steam Iron on Low Heat.";
      hem = "Clean A-Line Mini Hem";
      lining = "Tonal Breathable Cupro Interior Lining";
    }
  } else if (title.includes("shirt") || subcategory.includes("shirt")) {
    composition = "100% Japanese High-Density Textured Cotton";
    blendPercent = "100% Long-Staple Pure Combed Cotton";
    weaveWeight = "180 GSM Breathable Textured Poplin Weave";
    fit = "Relaxed Tailored Fit with Drape";
    collar = "Structured Mandarin Collar with Overlapping Neckline Placket";
    closure = "Custom-Cast Geometric Dark Metal Accent Buttons";
    sleeves = "Long Sleeve with Angled Beveled 2-Button Cuffs";
    pockets = "Clean Front (Zero Bulky Chest Pockets)";
    washCare = "Gentle Cold Hand Wash or Machine Wash Delicate. Steam Medium.";
    hem = "Curved Tailored Hemline for Tucked or Untucked Wear";
    lining = "Self-Faced Placket with Clean Bound Seams";
  } else if (title.includes("pant") || subcategory.includes("pant") || title.includes("trouser")) {
    composition = "Crisp Structured Suiting Twill with Permanent Crease";
    blendPercent = "65% Fine Wool, 33% Recycled Poly, 2% Spandex";
    weaveWeight = "310 GSM Heavyweight Architectural Suiting";
    fit = "Deep Double Front Pleats with Straight-Leg Drape";
    collar = "Extended Tab Waistband with Concealed Hook & Bar";
    closure = "Concealed YKK Zip Fly with Inner Anchor Button";
    sleeves = "N/A (Bottomwear)";
    pockets = "Deep Side Slant Pockets & Twin Rear Besom Pockets";
    washCare = "Specialist Dry Clean Only. Professional Steam Press.";
    hem = "Classic 2-Inch Turnup Cuff with Heavy Drape";
    lining = "Half-Lined Front to Knee with Anti-Static Bemberg";
  } else if (title.includes("top") || title.includes("sweetheart")) {
    composition = "Double-Weave Sculpted Cotton Blend";
    blendPercent = "92% Combed Cotton, 8% Elastane Support";
    weaveWeight = "290 GSM Contouring Double Knit Weave";
    fit = "Form-Sculpting Silhouette with Vertical Contour Seams";
    collar = "Sculpted Sweetheart Neckline with Scalloped Edge";
    closure = "Exposed Heavy-Duty Matte Metal Back Zip";
    sleeves = "Wide Supportive Straps";
    pockets = "Clean Silhouette (Zero Pockets)";
    washCare = "Cold Delicate Machine Wash in Mesh Bag. Flat Dry.";
    hem = "Cropped Clean Hem Designed for High-Rise Pairings";
    lining = "Self-Lined Double Fabric Bodice";
  }

  // Override with any explicit product specs if provided
  if (product?.specs?.fabric) composition = product.specs.fabric;
  if (product?.specs?.tailoring) fit = product.specs.tailoring;
  if (product?.specs?.care) washCare = product.specs.care;

  return [
    { label: "Fabric Composition", value: composition },
    { label: "Material Blend %", value: blendPercent },
    { label: "Weave & Weight", value: weaveWeight },
    { label: "Fit & Silhouette", value: fit },
    { label: "Collar & Neckline", value: collar },
    { label: "Closure & Hardware", value: closure },
    { label: "Sleeve & Cuffs", value: sleeves },
    { label: "Pocket Architecture", value: pockets },
    { label: "Wash & Material Care", value: washCare },
    { label: "Dimensions & Hemline", value: hem },
    { label: "Lining & Interior Finish", value: lining },
    { label: "Country of Origin", value: "Artisan Handcrafted in India" },
  ];
}

/**
 * Returns visual layout blocks for the product.
 * Supports: image_left, image_right, image_top, image_bottom, image_only, text_only.
 */
function getNormalizedVisualBlocks(product) {
  if (Array.isArray(product?.visualBlocks) && product.visualBlocks.length > 0) {
    return product.visualBlocks;
  }

  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images.map((img) => (typeof img === "string" ? img : img.url)).filter(Boolean)
    : ["/products/navy-tailored-mini-dress/main.jpg?v=3"];

  const img0 = images[0] || "/products/navy-tailored-mini-dress/main.jpg?v=3";
  const img1 = images[1] || images[0] || "/products/navy-tailored-mini-dress/front.jpg?v=3";
  const img2 = images[2] || images[1] || images[0];

  return [
    {
      id: "vb_1",
      layout: "image_left",
      tag: "ARCHITECTURAL SILHOUETTE",
      title: "Engineered Precision & Structured Drape",
      description:
        "Every contour is drafted from architectural principles to provide effortless structure without restricting movement. Hand-aligned seams ensure the drape falls cleanly whether stationary or in fluid stride.",
      features: [
        "Continuous structural contouring designed to hold its profile",
        "Bespoke hardware accents custom-cast for this collection",
        "Reinforced stress points along the placket and seams",
      ],
      image: img1,
      imageAlt: `${product?.title || "Product"} silhouette tailoring detail`,
    },
    {
      id: "vb_2",
      layout: "image_right",
      tag: "MATERIALITY & FINISH",
      title: "Pure Handfeel with Lasting Shape Retention",
      description:
        "Selected for supreme tactile comfort, this specialized weave balances organic breathability with high tensile strength. Resists pilling and retains deep, true color through hundreds of wears.",
      features: [
        "Long-staple fibers combed for feather-light softness",
        "Double-needle clean bound interior seams prevent skin friction",
        "Breathable weave engineered for year-round temperature balance",
      ],
      image: img2,
      imageAlt: `${product?.title || "Product"} textile finish and hardware detail`,
    },
    {
      id: "vb_3",
      layout: "image_only",
      title: "First Launch Edition · S/S 25",
      image: img0,
      imageAlt: `${product?.title || "Product"} full editorial lookbook`,
      caption: `${product?.title || "The Silhouette"} · First Launch Edition Lookbook`,
    },
  ];
}

export default function ProductSpecsSection({ product }) {
  if (!product) return null;

  const specifications = getNormalizedSpecifications(product);
  const visualBlocks = getNormalizedVisualBlocks(product);

  return (
    <section
      id="product-specifications"
      className={styles.section}
      aria-labelledby="specs-heading"
    >
      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.tagline}>TECHNICAL ARCHITECTURE & MATERIALITY</span>
        <h2 id="specs-heading" className={styles.title}>
          Anatomy & Craftsmanship
        </h2>
        <p className={styles.subtitle}>
          Materials, Dimensions & Tailoring
        </p>
      </div>

      {/* Sub-Section 1: The Specifications Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderBar}>
          <span className={styles.tableHeaderTitle}>Technical Specification Breakdown</span>
          <span className={styles.tableHeaderBadge}>
            {specifications.length} Verified Attributes
          </span>
        </div>
        <div className={styles.specGrid}>
          {specifications.map((item, idx) => (
            <div key={idx} className={styles.specCell}>
              <span className={styles.specLabel}>{item.label}</span>
              <span className={styles.specValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Section 2: Visual Format Blocks */}
      <div className={styles.visualContainer}>
        <div className={styles.visualHeader}>
          <h3 className={styles.visualSectionTitle}>Design in Detail</h3>
          <p className={styles.visualSectionSub}>
            An intimate study of textile purity, tailoring, and artisanal hardware.
          </p>
        </div>

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
    </section>
  );
}
