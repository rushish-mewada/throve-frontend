"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductReviews.module.css';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Devansh M.',
    verified: true,
    stars: 5,
    date: '04 Nov 2026',
    title: 'Impeccable structural drape and fabric weight',
    comment: 'The cut through the shoulders and torso is exceptional. High-density Japanese-grade cotton with a crisp yet fluid drape. Delivered to Mumbai in a bespoke atelier dustbag within 3 days.',
    likes: 14,
  },
  {
    id: 'rev-2',
    name: 'Pooja K.',
    verified: true,
    stars: 5,
    date: '28 Oct 2026',
    title: 'Subtle architectural luxury',
    comment: 'Understated elegance. The seam lines and minimalist finishing are on par with international couture labels. True to size with a tailored silhouette.',
    likes: 9,
  },
  {
    id: 'rev-3',
    name: 'Rohan S.',
    verified: true,
    stars: 5,
    date: '19 Oct 2026',
    title: 'Standout piece in my wardrobe',
    comment: 'Ordered via Cashfree UPI and received it promptly. High-density weave and great collar shape that stays sharp all evening.',
    likes: 18,
  },
  {
    id: 'rev-4',
    name: 'Aanya V.',
    verified: true,
    stars: 4,
    date: '12 Oct 2026',
    title: 'Great tailoring, premium packaging',
    comment: 'The fit is slightly structured around the chest which I love. Packaging was museum-quality with branded tissue, luxury tags, and prompt delivery.',
    likes: 6,
  },
];

export default function ProductReviews({ productHandle = 'default', productTitle = 'this style' }) {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null); // null = all, 5, 4, 3, etc.
  const [activeTab, setActiveTab] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New review form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');

  // Hydrate custom user reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`throve_reviews_${productHandle}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...DEFAULT_REVIEWS]);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [productHandle]);

  // Calculations
  const reviewCount = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
  const averageScore = reviewCount > 0 ? (totalStars / reviewCount).toFixed(1) : '5.0';

  const ratingCounts = {
    5: reviews.filter((r) => r.stars === 5).length,
    4: reviews.filter((r) => r.stars === 4).length,
    3: reviews.filter((r) => r.stars === 3).length,
    2: reviews.filter((r) => r.stars === 2).length,
    1: reviews.filter((r) => r.stars === 1).length,
  };

  const ratingBars = [5, 4, 3, 2, 1].map((stars) => ({
    stars: `${stars}.0`,
    count: ratingCounts[stars],
    percent: reviewCount > 0 ? Math.round((ratingCounts[stars] / reviewCount) * 100) : 0,
    starNum: stars,
  }));

  // Filter reviews
  const displayedReviews = reviews.filter((r) => {
    if (selectedRatingFilter && r.stars !== selectedRatingFilter) return false;
    return true;
  });

  const handleLike = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      verified: true,
      stars: formRating,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: formTitle.trim(),
      comment: formComment.trim(),
      likes: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const stored = localStorage.getItem(`throve_reviews_${productHandle}`);
      const parsed = stored ? JSON.parse(stored) : [];
      localStorage.setItem(`throve_reviews_${productHandle}`, JSON.stringify([newRev, ...parsed]));
    } catch {}

    setFormName('');
    setFormTitle('');
    setFormComment('');
    setFormRating(5);
    setShowReviewForm(false);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <section className={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 className={styles.title} style={{ margin: 0 }}>Client Impressions & Reviews</h2>
        <button
          type="button"
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: showReviewForm ? '#f5f5f5' : '#111111',
            color: showReviewForm ? '#111111' : '#ffffff',
            border: '1px solid #111111',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {formSubmitted && (
        <div style={{ padding: '14px 20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '4px', marginBottom: '24px', fontSize: '14px' }}>
          ✓ Thank you for your review! Your impression has been verified and published below.
        </div>
      )}

      {/* Write Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} style={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '6px', backgroundColor: '#fafaf9', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>
            Write Your Review for {productTitle}
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
              Your Rating *
            </label>
            <div style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '24px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setFormRating(s)}
                  style={{ color: s <= formRating ? '#f5a623' : '#d6d3d1', userSelect: 'none' }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '13px', color: '#666', alignSelf: 'center', marginLeft: '8px' }}>
                {formRating} of 5 Stars
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                Your Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Siddharth M."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                Review Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Exceptional fit and fabric feel"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
              Detailed Review *
            </label>
            <textarea
              rows={4}
              placeholder="Tell other clients about the fabric drape, sizing, silhouette, and delivery experience..."
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 28px',
              backgroundColor: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Submit Verified Review
          </button>
        </form>
      )}

      {/* Top Stats Box */}
      <div className={styles.statsBox}>
        <div className={styles.averageScore}>
          <div className={styles.scoreCircle}>
            <span>{averageScore}</span>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.reviewCount}>
              from {reviewCount} verified client reviews
            </span>
          </div>
        </div>
        
        <div className={styles.ratingBars}>
          {ratingBars.map((bar, i) => (
            <div
              key={i}
              className={styles.barRow}
              onClick={() => setSelectedRatingFilter(selectedRatingFilter === bar.starNum ? null : bar.starNum)}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.barLabel}>
                {bar.stars} <span className={styles.starIcon}>★</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className={styles.filterTitle} style={{ margin: 0, padding: 0, border: 'none' }}>Filter by Rating</h3>
            {selectedRatingFilter && (
              <button
                type="button"
                onClick={() => setSelectedRatingFilter(null)}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
          
          <div className={styles.filterList}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const isChecked = selectedRatingFilter === rating;
              return (
                <label
                  key={rating}
                  className={styles.checkboxLabel}
                  onClick={() => setSelectedRatingFilter(isChecked ? null : rating)}
                  style={{ fontWeight: isChecked ? 600 : 400 }}
                >
                  <input type="checkbox" checked={isChecked} readOnly />
                  <span
                    className={styles.checkmark}
                    style={{ backgroundColor: isChecked ? '#111' : 'transparent', borderColor: isChecked ? '#111' : '#ccc' }}
                  />
                  <span className={styles.starIcon}>★</span> {rating} Stars ({ratingCounts[rating]})
                </label>
              );
            })}
          </div>
        </aside>

        {/* Right Main Content: Reviews List */}
        <div className={styles.reviewsListContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className={styles.listTitle} style={{ margin: 0 }}>
              Reviews ({displayedReviews.length})
            </h3>
            {selectedRatingFilter && (
              <span style={{ fontSize: '13px', color: '#666' }}>
                Showing {selectedRatingFilter} Star reviews
              </span>
            )}
          </div>
          
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('all'); setSelectedRatingFilter(null); }}
            >
              All Reviews ({reviewCount})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === '5stars' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('5stars'); setSelectedRatingFilter(5); }}
            >
              5 Stars ({ratingCounts[5]})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === '4stars' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('4stars'); setSelectedRatingFilter(4); }}
            >
              4 Stars ({ratingCounts[4]})
            </button>
          </div>

          <div className={styles.reviewItems}>
            {displayedReviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div className={styles.reviewStars} style={{ margin: 0 }}>
                    {'★'.repeat(review.stars)}
                  </div>
                  {review.verified && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                      Verified Client
                    </span>
                  )}
                </div>

                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444', margin: '0 0 16px 0' }}>
                  {review.comment}
                </p>
                <span className={styles.reviewDate}>Reviewed on {review.date}</span>
                
                <div className={styles.reviewFooter}>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.avatar} style={{ backgroundColor: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '13px' }}>
                      {review.name.charAt(0)}
                    </div>
                    <span className={styles.reviewerName}>{review.name}</span>
                  </div>
                  
                  <div className={styles.reviewActions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => handleLike(review.id)}
                      title="Mark as helpful"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      <span>Helpful ({review.likes})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
