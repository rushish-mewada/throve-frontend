import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.aboutLayout}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Architectural Tailoring. Modern Luxury.</h1>
          <p>Born from precision. Engineered for timeless distinction.</p>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.storySection}>
          <div className={styles.textContent}>
            <h2>Our Story</h2>
            <p>
              Throve was founded with a singular conviction: to create industrial-grade sartorial elegance where architectural form meets modern luxury craftsmanship.
            </p>
            <p>
              Every garment begins in our studio with meticulous technical flat drafting, millimeter-precise tech packs, and sculptural pattern engineering. From asymmetric overlapped lapels and custom geometric metal hardware to contoured princess seams and deep front pleats, each piece is shaped for commanding poise.
            </p>
            <p>
              We reject fleeting, disposable trends. Instead, our inaugural S/S 25 collection offers deliberate silhouettes, structured drape, and tactile fabrics that redefine contemporary occasionwear.
            </p>
            <Link
              href="/collections/new-arrivals"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '14px 28px',
                backgroundColor: '#111111',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-poppins), sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                borderRadius: '4px',
              }}
            >
              Explore S/S 25 Collection &rarr;
            </Link>
          </div>
          <div className={styles.imageContent}>
            <Image
              src="/products/sleeveless-princess-sheath-dress/main.jpg?v=3"
              alt="Throve Atelier Tailoring"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        
        <div className={styles.valuesSection}>
          <h2>Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>01. Architectural Precision</h3>
              <p>Every silhouette is drafted from exact technical spec sheets. We calibrate seam curvatures, collar overlaps, and drape allowances to create flattering, structured contours.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>02. Artisanal Fabrication</h3>
              <p>We select tactile, high-density woven fabrics, textured poly-twills, fine cottons, and rich linings that retain structural integrity through repeated wear.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>03. Limited Edition Drops</h3>
              <p>Our debut collection is produced in small, limited numbers with individual atelier quality control, ensuring exclusivity and mindful production.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
