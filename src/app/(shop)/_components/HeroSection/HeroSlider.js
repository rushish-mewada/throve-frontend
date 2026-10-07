"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./HeroSection.module.css";

const PRODUCTS = [
  {
    id: "p1",
    image: "/images/hero/prod1.png",
    title: "Green Polo & Pleated Trousers",
    description:
      "Step into the season with style and confidence. Designed for comfort, performance, and timeless appeal, our new jacket is crafted with premium materials that balance function and fashion.",
    hotspots: [
      {
        id: "h1_1",
        title: "Brown Jacket",
        collection: "Summer collection 2025",
        price: "₹ 139,600",
        rating: "4.8",
        color: "Brown",
        colorDots: ["#6e473b", "#d4b896", "#6b1d24"],
        dotTop: "24%",
        dotLeft: "42%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "h1_2",
        title: "Brown Jacket",
        collection: "Summer collection 2025",
        price: "₹ 139,600",
        rating: "4.8",
        color: "Brown",
        colorDots: ["#6e473b", "#d4b896", "#6b1d24"],
        dotTop: "32%",
        dotLeft: "58%",
        cardSide: "right",
        cardTop: "10%",
      },
      {
        id: "h1_3",
        title: "Brown Jacket",
        collection: "Summer collection 2025",
        price: "₹ 139,600",
        rating: "4.8",
        color: "Brown",
        colorDots: ["#6e473b", "#d4b896", "#6b1d24"],
        dotTop: "54%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "48%",
      },
    ],
  },
  {
    id: "p2",
    image: "/images/hero/prod2.png",
    title: "Linen Shirt & Wide Pants",
    description:
      "Discover our relaxed tailoring. Premium breathable linen shirt paired with wide-leg trousers and a classic striped knit draped for effortless elegance.",
    hotspots: [
      {
        id: "h2_1",
        title: "Relaxed Linen Shirt",
        collection: "Summer collection 2025",
        price: "₹ 52,000",
        rating: "4.9",
        color: "Off White",
        colorDots: ["#faf8f5", "#1a1a1a", "#6e473b"],
        dotTop: "30%",
        dotLeft: "44%",
        cardSide: "left",
        cardTop: "14%",
      },
      {
        id: "h2_2",
        title: "Striped Knit Sweater",
        collection: "Summer collection 2025",
        price: "₹ 86,000",
        rating: "4.8",
        color: "Navy Stripe",
        colorDots: ["#1a1a3e", "#f5f5dc", "#6e473b"],
        dotTop: "24%",
        dotLeft: "56%",
        cardSide: "right",
        cardTop: "10%",
      },
      {
        id: "h2_3",
        title: "Wide-Leg Trousers",
        collection: "Summer collection 2025",
        price: "₹ 74,000",
        rating: "4.7",
        color: "Beige",
        colorDots: ["#d4b896", "#2c3e50", "#faf8f5"],
        dotTop: "58%",
        dotLeft: "50%",
        cardSide: "right",
        cardTop: "48%",
      },
    ],
  },
  {
    id: "p3",
    image: "/images/hero/prod3.png",
    title: "Polo Shirt & Navy Trousers",
    description:
      "Embrace effortless luxury with our Resort Line. Tailored navy trousers and cream polo with draped sweater for high-end versatility during warm seasonal travels.",
    hotspots: [
      {
        id: "h3_1",
        title: "Cream Knit Polo",
        collection: "Resort Collection 2025",
        price: "₹ 48,000",
        rating: "4.9",
        color: "Cream",
        colorDots: ["#f5f5dc", "#1b2a4a", "#6e473b"],
        dotTop: "28%",
        dotLeft: "45%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "h3_2",
        title: "Draped Knit Sweater",
        collection: "Resort Collection 2025",
        price: "₹ 92,000",
        rating: "4.9",
        color: "Navy",
        colorDots: ["#1b2a4a", "#d4b896", "#ffffff"],
        dotTop: "22%",
        dotLeft: "54%",
        cardSide: "right",
        cardTop: "10%",
      },
      {
        id: "h3_3",
        title: "Tailored Navy Trousers",
        collection: "Resort Collection 2025",
        price: "₹ 76,000",
        rating: "4.8",
        color: "Midnight Navy",
        colorDots: ["#1b2a4a", "#d4b896", "#ffffff"],
        dotTop: "56%",
        dotLeft: "48%",
        cardSide: "right",
        cardTop: "48%",
      },
    ],
  },
  {
    id: "p4",
    image: "/images/hero/prod1.png",
    title: "Olive Knit Polo Selection",
    description:
      "Modern minimalist aesthetic featuring lightweight unstructured outerwear and structured tailored trousers for seasonal versatility.",
    hotspots: [
      {
        id: "h4_1",
        title: "Olive Polo Shirt",
        collection: "Summer collection 2025",
        price: "₹ 44,000",
        rating: "4.8",
        color: "Olive",
        colorDots: ["#556b2f", "#6e473b", "#d4b896"],
        dotTop: "26%",
        dotLeft: "46%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "h4_2",
        title: "Cream Tailored Trousers",
        collection: "Summer collection 2025",
        price: "₹ 66,000",
        rating: "4.9",
        color: "Cream",
        colorDots: ["#f5f5dc", "#1a1a1a", "#6e473b"],
        dotTop: "60%",
        dotLeft: "50%",
        cardSide: "right",
        cardTop: "14%",
      },
    ],
  },
  {
    id: "p5",
    image: "/images/hero/prod3.png",
    title: "Resort Tailored Navy Outfit",
    description:
      "Refined leisure wear with layered fine-gauge knits and classic pleated tailoring for warm evening gatherings.",
    hotspots: [
      {
        id: "p5_1",
        title: "Resort Polo Shirt",
        collection: "Resort Collection 2025",
        price: "₹ 49,000",
        rating: "4.9",
        color: "Off White",
        colorDots: ["#f5f5dc", "#1b2a4a", "#6e473b"],
        dotTop: "28%",
        dotLeft: "48%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "p5_2",
        title: "Pleated Navy Trousers",
        collection: "Resort Collection 2025",
        price: "₹ 78,000",
        rating: "4.8",
        color: "Navy",
        colorDots: ["#1b2a4a", "#d4b896", "#ffffff"],
        dotTop: "62%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "14%",
      },
    ],
  },
  {
    id: "p6",
    image: "/images/hero/prod2.png",
    title: "Summer Linen Casual Wear",
    description:
      "Lightweight, breathable linen separates ideal for warm climates and relaxed coastal weekends.",
    hotspots: [
      {
        id: "p6_1",
        title: "Linen Shirt",
        collection: "Summer collection 2025",
        price: "₹ 53,000",
        rating: "4.8",
        color: "White",
        colorDots: ["#ffffff", "#1a1a1a", "#6e473b"],
        dotTop: "32%",
        dotLeft: "45%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "p6_2",
        title: "Wide Pants",
        collection: "Summer collection 2025",
        price: "₹ 72,000",
        rating: "4.7",
        color: "Beige",
        colorDots: ["#d4b896", "#2c3e50", "#faf8f5"],
        dotTop: "64%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "14%",
      },
    ],
  },
  {
    id: "p7",
    image: "/images/hero/prod1.png",
    title: "Classic Summer Polo Edition",
    description:
      "Timeless tailoring reinvented with contemporary silhouettes and signature detailing for everyday luxury.",
    hotspots: [
      {
        id: "p7_1",
        title: "Knit Polo",
        collection: "Summer collection 2025",
        price: "₹ 46,000",
        rating: "4.9",
        color: "Green",
        colorDots: ["#556b2f", "#6e473b", "#d4b896"],
        dotTop: "27%",
        dotLeft: "44%",
        cardSide: "left",
        cardTop: "12%",
      },
      {
        id: "p7_2",
        title: "Pleated Trousers",
        collection: "Summer collection 2025",
        price: "₹ 69,000",
        rating: "4.8",
        color: "Cream",
        colorDots: ["#f5f5dc", "#2c3e50", "#1a1a1a"],
        dotTop: "61%",
        dotLeft: "50%",
        cardSide: "right",
        cardTop: "14%",
      },
    ],
  },
];

// Fixed 7 relative slots: 3 items left (-3,-2,-1), 1 center (0), 3 items right (1,2,3)
const OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

export default function HeroSlider() {
  const NUM_DOM_ELEMENTS = 9;
  const [offsetBase, setOffsetBase] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prevOffsetBaseRef = useRef(offsetBase);

  useEffect(() => {
    prevOffsetBaseRef.current = offsetBase;
  }, [offsetBase]);

  const prevOffsetBase = prevOffsetBaseRef.current;

  let activeIdx = (-offsetBase) % PRODUCTS.length;
  if (activeIdx < 0) activeIdx += PRODUCTS.length;

  const activeProduct = PRODUCTS[activeIdx];

  // Auto-play loop
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setOffsetBase((prev) => prev - 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setOffsetBase((prev) => prev - 1);
  const prevSlide = () => setOffsetBase((prev) => prev + 1);

  return (
    <div
      className={styles.sliderWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fixed 7 Slots Carousel Container */}
      <div className={styles.carouselContainer}>
        {Array.from({ length: NUM_DOM_ELEMENTS }).map((_, domIndex) => {
          let offset = (domIndex + offsetBase) % NUM_DOM_ELEMENTS;
          if (offset < -4) offset += NUM_DOM_ELEMENTS;
          if (offset > 4) offset -= NUM_DOM_ELEMENTS;

          let prevOffset = (domIndex + prevOffsetBase) % NUM_DOM_ELEMENTS;
          if (prevOffset < -4) prevOffset += NUM_DOM_ELEMENTS;
          if (prevOffset > 4) prevOffset -= NUM_DOM_ELEMENTS;

          const isWrapping = Math.abs(offset - prevOffset) > 1;

          let prodIdx = (activeIdx + offset) % PRODUCTS.length;
          if (prodIdx < 0) prodIdx += PRODUCTS.length;
          const prod = PRODUCTS[prodIdx];

          const isCenter = offset === 0;
          const slotClass = styles[`slot_${offset}`];

          return (
            <div
              key={domIndex}
              className={`${styles.carouselItem} ${slotClass} ${
                isCenter ? styles.centerItem : ""
              }`}
              style={isWrapping ? { transition: "none" } : {}}
              onClick={() => {
                if (!isCenter && offset >= -3 && offset <= 3) {
                  setOffsetBase((prev) => prev - offset);
                }
              }}
            >
              <div className={styles.itemImageFrame}>
                <Image
                  src={prod.image}
                  alt={prod.title}
                  fill
                  priority={isCenter}
                  sizes={isCenter ? "260px" : "110px"}
                  style={{ objectFit: "contain", objectPosition: "center bottom" }}
                />

                {/* Hotspot Dots on Center Active Product */}
                {isCenter &&
                  prod.hotspots.map((hs) => (
                    <div
                      key={hs.id}
                      className={styles.hotspotDot}
                      style={{ top: hs.dotTop, left: hs.dotLeft }}
                    >
                      <span className={styles.dotPulse} />
                      <span className={styles.dotCenter} />
                    </div>
                  ))}
              </div>

              {/* Floating Hotspot Cards on Center Active Product */}
              {isCenter &&
                prod.hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className={`${styles.hotspotCard} ${
                      hs.cardSide === "left" ? styles.cardLeft : styles.cardRight
                    }`}
                    style={{ top: hs.cardTop }}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{hs.title}</span>
                      <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <span className={styles.cardCollection}>{hs.collection}</span>

                    <div className={styles.cardMeta}>
                      <span className={styles.cardColor}>Color: {hs.color}</span>
                      <span className={styles.cardRating}>★ {hs.rating}</span>
                    </div>

                    <div className={styles.cardPriceRow}>
                      <div className={styles.colorSwatches}>
                        {hs.colorDots.map((color, i) => (
                          <span
                            key={i}
                            style={{ backgroundColor: color }}
                            className={i === 0 ? styles.swatchActive : ""}
                          />
                        ))}
                      </div>
                      <div className={styles.priceContainer}>
                        <span className={styles.cardPrice}>{hs.price}</span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M9 18l6-6-6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}

            </div>
          );
        })}
      </div>

      {/* Explore Anchor Link fixed below center product */}
      <div className={styles.exploreWrapper}>
        <a href="#explore" className={styles.exploreLink}>
          Explore
        </a>
      </div>

      {/* Bottom Bar Controls & Description */}
      <div className={styles.bottomBar}>
        <div className={styles.descriptionBox}>
          <p className={styles.descriptionText}>{activeProduct.description}</p>
        </div>

        <div className={styles.navigationButtons}>
          <button
            className={styles.navBtn}
            aria-label="Previous Slide"
            onClick={prevSlide}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M15 18L9 12L15 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.navBtn}
            aria-label="Next Slide"
            onClick={nextSlide}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M9 18L15 12L9 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
