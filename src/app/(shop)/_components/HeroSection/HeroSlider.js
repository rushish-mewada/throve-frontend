"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.css";

const PRODUCTS = [
  {
    id: "p1",
    image: "/images/hero/hero-mandarin-shirt.png",
    title: "Overlapping Mandarin Shirt",
    description:
      "Architectural asymmetric diagonal placket with signature black hardware, high-stand collar, and relaxed drop-shoulder tailoring in rich espresso brown.",
    hotspots: [
      {
        id: "h1_1",
        title: "Overlapping Mandarin Shirt",
        collection: "First Launch · S/S 25",
        price: "₹ 3,900",
        rating: "4.9",
        color: "Espresso Brown",
        colorDots: ["#4A2E18", "#111111"],
        dotTop: "34%",
        dotLeft: "48%",
        cardSide: "left",
        cardTop: "14%",
        handle: "asymmetric-mandarin-shirt",
      },
    ],
  },
  {
    id: "p2",
    image: "/images/hero/hero-pleated-pants.png",
    title: "Pleated Formal Pants",
    description:
      "Double forward knife pleats, extended waist tab, and clean turn-up cuffs cut from structured ivory suiting cloth for an effortless silhouette.",
    hotspots: [
      {
        id: "h2_1",
        title: "Pleated Formal Pants",
        collection: "First Launch · S/S 25",
        price: "₹ 4,200",
        rating: "4.8",
        color: "Ivory Cream",
        colorDots: ["#F5F2EB", "#111111"],
        dotTop: "56%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "46%",
        handle: "pleated-formal-pants",
      },
    ],
  },
  {
    id: "p3",
    image: "/images/hero/hero-scalloped-top.png",
    title: "Scalloped Sweetheart Top",
    description:
      "Sculpted sweetheart neckline with subtle scalloped curvature, precision vertical contour seams, and tailored shoulder straps in dusty blush pink.",
    hotspots: [
      {
        id: "h3_1",
        title: "Scalloped Sweetheart Top",
        collection: "First Launch · S/S 25",
        price: "₹ 2,900",
        rating: "4.8",
        color: "Blush Pink",
        colorDots: ["#E8B4B8", "#111111"],
        dotTop: "32%",
        dotLeft: "46%",
        cardSide: "left",
        cardTop: "14%",
        handle: "scalloped-sweetheart-top",
      },
    ],
  },
  {
    id: "p4",
    image: "/images/hero/hero-flare-pants.png",
    title: "High Waisted Flare Pants",
    description:
      "Architectural wide-leg flare trousers with an ultra-high sculpted waistband, fluid circular hem movement, and tailored side pockets.",
    hotspots: [
      {
        id: "h4_1",
        title: "High Waisted Flare Pants",
        collection: "First Launch · S/S 25",
        price: "₹ 3,950",
        rating: "4.9",
        color: "Dusty Rose",
        colorDots: ["#C47E85", "#111111"],
        dotTop: "52%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "42%",
        handle: "high-waisted-flare-pants",
      },
    ],
  },
  {
    id: "p5",
    image: "/images/hero/hero-mini-dress.png",
    title: "Sleeveless Tailored Mini Dress",
    description:
      "Architectural structured shift dress in deep midnight navy, featuring an asymmetric angular collar, princess seams, and engraved metallic buttons.",
    hotspots: [
      {
        id: "h5_1",
        title: "Sleeveless Tailored Mini Dress",
        collection: "First Launch · S/S 25",
        price: "₹ 4,800",
        rating: "4.9",
        color: "Navy",
        colorDots: ["#1C2841", "#111111"],
        dotTop: "30%",
        dotLeft: "46%",
        cardSide: "left",
        cardTop: "12%",
        handle: "navy-tailored-mini-dress",
      },
    ],
  },
  {
    id: "p6",
    image: "/images/hero/hero-princess-dress.png",
    title: "Sleeveless Princess Sheath Dress",
    description:
      "Form-sculpting sheath silhouette in soft cream with an origami foldover collar, twin statement hardware, and longitudinal contouring.",
    hotspots: [
      {
        id: "h6_1",
        title: "Sleeveless Princess Sheath Dress",
        collection: "First Launch · S/S 25",
        price: "₹ 4,900",
        rating: "4.9",
        color: "Soft Cream",
        colorDots: ["#FAF7F2", "#111111"],
        dotTop: "28%",
        dotLeft: "52%",
        cardSide: "right",
        cardTop: "14%",
        handle: "sleeveless-princess-sheath-dress",
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
              className={`${styles.carouselItem} ${slotClass} ${isCenter ? styles.centerItem : ""
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
                  priority={true}
                  sizes={isCenter ? "300px" : "150px"}
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
                    className={`${styles.hotspotCard} ${hs.cardSide === "left" ? styles.cardLeft : styles.cardRight
                      }`}
                    style={{ top: hs.cardTop }}
                  >
                    <div className={styles.cardHeader}>
                      <Link
                        href={hs.handle ? `/product/${hs.handle}` : '/collections/new-arrivals'}
                        className={styles.cardTitle}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {hs.title}
                      </Link>
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
                      <Link
                        href={hs.handle ? `/product/${hs.handle}` : '/collections/new-arrivals'}
                        className={styles.priceContainer}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
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
                      </Link>
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
