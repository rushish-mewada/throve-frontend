import Image from 'next/image';
import styles from './ProductReviews.module.css';

export default function ProductReviews() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Product Reviews</h2>

      {/* Top Stats Box */}
      <div className={styles.statsBox}>
        <div className={styles.averageScore}>
          <div className={styles.scoreCircle}>
            <span>4.5</span>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.reviewCount}>from 1,25k reviews</span>
          </div>
        </div>
        
        <div className={styles.ratingBars}>
          {[
            { stars: '5.0', percent: 80, count: 2823 },
            { stars: '4.0', percent: 60, count: 38 },
            { stars: '3.0', percent: 15, count: 4 },
            { stars: '2.0', percent: 0, count: 0 },
            { stars: '1.0', percent: 0, count: 0 }
          ].map((bar, i) => (
            <div key={i} className={styles.barRow}>
              <span className={styles.barLabel}>{bar.stars} <span className={styles.starIcon}>★</span></span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${bar.percent}%` }}></div>
              </div>
              <span className={styles.barCount}>{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reviewsLayout}>
        {/* Left Sidebar: Filters */}
        <aside className={styles.filtersSidebar}>
          <h3 className={styles.filterTitle}>Reviews Filter</h3>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <h4>Rating</h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
            </div>
            <div className={styles.filterList}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span className={styles.checkmark}></span>
                  <span className={styles.starIcon}>★</span> {rating}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <h4>Review Topics</h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
            </div>
            <div className={styles.filterList}>
              {['Product Quality', 'Seller Services', 'Product Price', 'Shipment', 'Match with Description'].map((topic, i) => (
                <label key={i} className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span className={styles.checkmark}></span>
                  {topic}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Content: Reviews List */}
        <div className={styles.reviewsListContainer}>
          <h3 className={styles.listTitle}>Review Lists</h3>
          
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${styles.tabActive}`}>All Reviews</button>
            <button className={styles.tabBtn}>With Photo & Video</button>
            <button className={styles.tabBtn}>With Description</button>
          </div>

          <div className={styles.reviewItems}>
            {[
              { id: 1, name: 'Darrell Steward', date: 'July 2, 2020 03:29 PM', title: 'This is amazing product I have.', likes: 128 },
              { id: 2, name: 'Darlene Robertson', date: 'July 2, 2020 1:04 PM', title: 'This is amazing product I have.', likes: 82 },
              { id: 3, name: 'Kathryn Murphy', date: 'June 26, 2020 10:03 PM', title: 'This is amazing product I have.', likes: 9 },
              { id: 4, name: 'Ronald Richards', date: 'July 7, 2020 10:14 AM', title: 'This is amazing product I have.', likes: 124 }
            ].map(review => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewStars}>★★★★★</div>
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <span className={styles.reviewDate}>{review.date}</span>
                
                <div className={styles.reviewFooter}>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.avatar}>
                      <Image src={`https://placehold.co/40x40/e0e0e0/666666.png?text=${review.name.charAt(0)}`} alt={review.name} fill />
                    </div>
                    <span className={styles.reviewerName}>{review.name}</span>
                  </div>
                  
                  <div className={styles.reviewActions}>
                    <button className={styles.actionBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                      {review.likes}
                    </button>
                    <button className={styles.actionBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <span className={styles.pageActive}>1</span>
            <span className={styles.pageItem}>2</span>
            <span className={styles.pageItem}>...</span>
            <span className={styles.pageItem}>19</span>
            <button className={styles.pageNext}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
