import Image from 'next/image';
import styles from './ProductReviews.module.css';

export default function ProductReviews() {
  const reviews = [];
  const reviewCount = reviews.length;
  const averageScore = reviewCount > 0 ? '4.5' : '0.0';

  const ratingBars = [
    { stars: '5.0', percent: 0, count: 0 },
    { stars: '4.0', percent: 0, count: 0 },
    { stars: '3.0', percent: 0, count: 0 },
    { stars: '2.0', percent: 0, count: 0 },
    { stars: '1.0', percent: 0, count: 0 },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Product Reviews</h2>

      {/* Top Stats Box */}
      <div className={styles.statsBox}>
        <div className={styles.averageScore}>
          <div
            className={styles.scoreCircle}
            style={reviewCount === 0 ? { borderColor: '#e7e5e4', color: '#78716c' } : undefined}
          >
            <span>{averageScore}</span>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.stars} style={reviewCount === 0 ? { color: '#e7e5e4' } : undefined}>
              ★★★★★
            </div>
            <span className={styles.reviewCount}>
              {reviewCount === 0 ? '0 reviews' : `from ${reviewCount} reviews`}
            </span>
          </div>
        </div>
        
        <div className={styles.ratingBars}>
          {ratingBars.map((bar, i) => (
            <div key={i} className={styles.barRow}>
              <span className={styles.barLabel}>
                {bar.stars} <span className={styles.starIcon} style={bar.count === 0 ? { color: '#d6d3d1' } : undefined}>★</span>
              </span>
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
                <label key={rating} className={styles.checkboxLabel} style={{ opacity: 0.6 }}>
                  <input type="checkbox" disabled />
                  <span className={styles.checkmark}></span>
                  <span className={styles.starIcon} style={{ color: '#d6d3d1' }}>★</span> {rating} (0)
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
                <label key={i} className={styles.checkboxLabel} style={{ opacity: 0.6 }}>
                  <input type="checkbox" disabled />
                  <span className={styles.checkmark}></span>
                  {topic} (0)
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Content: Reviews List */}
        <div className={styles.reviewsListContainer}>
          <h3 className={styles.listTitle}>Review Lists ({reviewCount})</h3>
          
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${styles.tabActive}`}>All Reviews ({reviewCount})</button>
            <button className={styles.tabBtn}>With Photo & Video (0)</button>
            <button className={styles.tabBtn}>With Description (0)</button>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                padding: '56px 24px',
                textAlign: 'center',
                backgroundColor: '#fafaf9',
                borderRadius: '8px',
                border: '1px dashed #e7e5e4',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a8a29e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <div>
                <h4 style={{ fontFamily: 'var(--font-poppins), sans-serif', fontSize: '1rem', fontWeight: 600, color: '#1c1917', margin: '0 0 6px 0' }}>
                  No reviews yet
                </h4>
                <p style={{ fontFamily: 'var(--font-poppins), sans-serif', fontSize: '0.85rem', color: '#78716c', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                  This style is part of our upcoming first drop. Verified customer reviews and ratings will be published here as pre-orders are fulfilled.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.reviewItems}>
                {reviews.map((review) => (
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
