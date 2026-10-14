import Image from 'next/image';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.aboutLayout}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Redefining Streetwear.</h1>
          <p>Born in Mumbai. Built for the bold.</p>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.storySection}>
          <div className={styles.textContent}>
            <h2>Our Story</h2>
            <p>
              Throve started in 2024 with a simple mission: to bridge the gap between high-end fashion and everyday streetwear in India. We grew tired of the generic, mass-produced fast fashion that flooded the market.
            </p>
            <p>
              Every piece we design is conceptualized in our Mumbai studio, using premium fabrics sourced ethically. We believe that what you wear is a direct extension of who you are. We don't just make clothes; we design armor for the modern creator.
            </p>
          </div>
          <div className={styles.imageContent}>
            <Image src="https://placehold.co/600x800/111111/ffffff.png?text=Studio" alt="Throve Studio" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        
        <div className={styles.valuesSection}>
          <h2>Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>01. Quality First</h3>
              <p>We use heavy-weight French terry cottons and premium blends that get better with every wash. No shortcuts.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>02. Ethical Production</h3>
              <p>Our garments are produced in ethical factories with fair wages. We believe in transparency from thread to finish.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>03. Limited Drops</h3>
              <p>We keep our production runs small to minimize waste and ensure exclusivity. When it's gone, it's gone.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
