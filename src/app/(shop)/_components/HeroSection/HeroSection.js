import styles from './HeroSection.module.css';
import HeroSlider from './HeroSlider';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background Grid Pattern */}
      <div className={styles.gridOverlay}></div>

      {/* Top Left Title Overlay */}
      <div className={styles.header}>
        <span className={styles.subtitle}>Introducing</span>
        <h1 className={styles.title}>SUMMER COLLECTION</h1>
      </div>

      {/* Hero Slider Container */}
      <HeroSlider />
    </section>
  );
}
