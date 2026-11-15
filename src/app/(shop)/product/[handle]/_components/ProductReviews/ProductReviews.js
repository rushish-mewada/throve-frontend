"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import CustomInput from '@/components/ui/CustomInput/CustomInput';
import CustomTextarea from '@/components/ui/CustomTextarea/CustomTextarea';
import { verifyReviewEligibilityAction, submitVerifiedReviewAction } from '@/actions/reviews';
import styles from './ProductReviews.module.css';

const RATING_DESCRIPTIONS = {
  5: '5.0 · Exceptional Couture Standard',
  4: '4.0 · Very Good Tailoring & Fit',
  3: '3.0 · Average / Met Expectations',
  2: '2.0 · Below Expectations',
  1: '1.0 · Dissatisfied with Garment',
};

export default function ProductReviews({
  productHandle = 'default',
  productTitle = 'this style',
  initialReviews = [],
}) {
  const { user, isLoggedIn } = useStore();
  const fileInputRef = useRef(null);

  // Reviews list & filters hydrated dynamically from server initialReviews and local guest reviews
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'media', '5stars', '4stars'

  // Purchase verification state
  const [isVerifyingEligibility, setIsVerifyingEligibility] = useState(false);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  // Manual guest order verification state
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [manualOrderId, setManualOrderId] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualVerifyError, setManualVerifyError] = useState('');

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formRatingHover, setFormRatingHover] = useState(null);
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formFit, setFormFit] = useState('True to Size');
  const [formTags, setFormTags] = useState([]);
  const [formMedia, setFormMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Lightbox state for customer photos & videos
  const [lightboxItem, setLightboxItem] = useState(null);

  // 1. Hydrate stored reviews for this product
  useEffect(() => {
    try {
      const base = initialReviews || [];
      const stored = localStorage.getItem(`throve_reviews_${productHandle}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove legacy dummy reviews (rev-1, rev-2, rev-3, rev-4)
          const validReviews = parsed.filter(
            (r) => !['rev-1', 'rev-2', 'rev-3', 'rev-4'].includes(r.id)
          );
          const merged = [...validReviews];
          for (const b of base) {
            if (!merged.some((m) => m.id === b.id)) {
              merged.push(b);
            }
          }
          setReviews(merged);
          return;
        }
      }
      setReviews(base);
    } catch {
      setReviews(initialReviews || []);
    }
  }, [productHandle, initialReviews]);

  // 2. Automatically check verification eligibility when user logs in or page loads
  useEffect(() => {
    let isCancelled = false;

    async function checkEligibility() {
      if (!isLoggedIn && !user) {
        setIsEligibleToReview(false);
        setEligibilityData(null);
        setEligibilityChecked(true);
        return;
      }

      setIsVerifyingEligibility(true);
      try {
        const res = await verifyReviewEligibilityAction({
          productHandle,
          phone: user?.phone,
          email: user?.email,
        });

        if (!isCancelled) {
          if (res.eligible) {
            setIsEligibleToReview(true);
            setEligibilityData(res);
            if (res.customerName && !formName) {
              setFormName(res.customerName);
            }
          } else {
            // Also check if user recently ordered in this browser session
            try {
              const lastOrder = localStorage.getItem('throve_last_order');
              if (lastOrder) {
                const parsedOrder = JSON.parse(lastOrder);
                if (parsedOrder?.id) {
                  const checkGuestOrder = await verifyReviewEligibilityAction({
                    productHandle,
                    orderId: parsedOrder.id,
                  });
                  if (checkGuestOrder.eligible) {
                    setIsEligibleToReview(true);
                    setEligibilityData(checkGuestOrder);
                    if (checkGuestOrder.customerName && !formName) {
                      setFormName(checkGuestOrder.customerName);
                    }
                    return;
                  }
                }
              }
            } catch { }

            setIsEligibleToReview(false);
            setEligibilityData(res);
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setIsEligibleToReview(false);
        }
      } finally {
        if (!isCancelled) {
          setIsVerifyingEligibility(false);
          setEligibilityChecked(true);
        }
      }
    }

    checkEligibility();

    return () => {
      isCancelled = true;
    };
  }, [productHandle, isLoggedIn, user]);

  // 3. Handle manual verification with Order ID & Phone
  const handleManualVerify = async (e) => {
    e.preventDefault();
    setManualVerifyError('');
    setIsVerifyingEligibility(true);

    try {
      const res = await verifyReviewEligibilityAction({
        productHandle,
        orderId: manualOrderId.trim(),
        phone: manualPhone.trim(),
      });

      if (res.eligible) {
        setIsEligibleToReview(true);
        setEligibilityData(res);
        setShowManualVerify(false);
        setShowReviewForm(true);
        if (res.customerName) setFormName(res.customerName);
      } else {
        setManualVerifyError(res.message || 'No matching order with this product found.');
      }
    } catch {
      setManualVerifyError('Failed to verify order. Please ensure the Order ID is correct.');
    } finally {
      setIsVerifyingEligibility(false);
    }
  };

  // 4. Handle Media Selection (Photos & Videos)
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formMedia.length + files.length > 5) {
      alert('You can upload up to 5 photos or video clips in total.');
      return;
    }

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isImage && !isVideo) {
        alert(`File format ${file.type} is not supported. Please upload JPG, PNG, WEBP, or MP4.`);
        return;
      }

      // Max file size: 25MB for video, 10MB for image
      if (isVideo && file.size > 25 * 1024 * 1024) {
        alert('Video file size exceeds 25MB limit.');
        return;
      }
      if (isImage && file.size > 10 * 1024 * 1024) {
        alert('Image file size exceeds 10MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormMedia((prev) => [
          ...prev,
          {
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: isVideo ? 'video' : 'image',
            url: event.target.result,
            fileName: file.name,
            sizeFormatted: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (mediaId) => {
    setFormMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const toggleTag = (tag) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 5. Submit Verified Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) {
      setSubmitError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitVerifiedReviewAction({
        productHandle,
        orderId: eligibilityData?.orderId || manualOrderId || 'THR-VERIFIED',
        rating: formRating,
        title: formTitle,
        comment: formComment,
        name: formName,
        fitFeedback: formFit,
        tags: formTags,
        media: formMedia,
      });

      if (!result.success || !result.review) {
        setSubmitError(result.error || 'Failed to submit review.');
        setIsSubmitting(false);
        return;
      }

      const newReview = {
        ...result.review,
        tags: formTags,
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);

      try {
        const stored = localStorage.getItem(`throve_reviews_${productHandle}`);
        const parsed = stored ? JSON.parse(stored) : [];
        localStorage.setItem(`throve_reviews_${productHandle}`, JSON.stringify([newReview, ...parsed]));
      } catch { }

      // Reset form
      setFormTitle('');
      setFormComment('');
      setFormMedia([]);
      setFormTags([]);
      setShowReviewForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setSubmitError('An unexpected error occurred while posting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // State to track reviews voted as helpful by the current user or guest
  const [votedReviewIds, setVotedReviewIds] = useState([]);

  // Hydrate user/guest helpful votes from localStorage
  useEffect(() => {
    try {
      const guestVotes = JSON.parse(localStorage.getItem('throve_helpful_voted_guest') || '[]');
      const userVotes = user?.id
        ? JSON.parse(localStorage.getItem(`throve_helpful_voted_${user.id}`) || '[]')
        : [];
      const legacyVotes = JSON.parse(localStorage.getItem('throve_helpful_voted_reviews') || '[]');
      const combined = Array.from(new Set([...guestVotes, ...userVotes, ...legacyVotes]));
      setVotedReviewIds(combined);
    } catch {
      // Ignore storage errors
    }
  }, [user?.id]);

  const handleLike = (id) => {
    if (votedReviewIds.includes(id)) {
      return; // Allowed only once per user / guest user
    }

    const nextVoted = [...votedReviewIds, id];
    setVotedReviewIds(nextVoted);

    try {
      const key = user?.id ? `throve_helpful_voted_${user.id}` : 'throve_helpful_voted_guest';
      localStorage.setItem(key, JSON.stringify(nextVoted));
      localStorage.setItem('throve_helpful_voted_reviews', JSON.stringify(nextVoted));
    } catch {
      // Ignore storage errors
    }

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
  };

  // Calculations
  const reviewCount = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
  const averageScore = reviewCount > 0 ? (totalStars / reviewCount).toFixed(1) : '—';
  const reviewsWithMedia = reviews.filter((r) => Array.isArray(r.media) && r.media.length > 0);

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

  // Filtering
  const displayedReviews = reviews.filter((r) => {
    if (selectedRatingFilter && r.stars !== selectedRatingFilter) return false;
    if (activeTab === 'media' && (!r.media || r.media.length === 0)) return false;
    if (activeTab === '5stars' && r.stars !== 5) return false;
    if (activeTab === '4stars' && r.stars !== 4) return false;
    return true;
  });

  return (
    <section id="reviews" className={styles.section}>
      {/* Header & Write Review Action */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitleCol}>
          <h2 className={styles.title} style={{ margin: 0 }}>Client Impressions & Reviews</h2>
          <p className={styles.subtitle}>Verified owner critiques, fabric drapes, and fit reviews</p>
        </div>

        {reviewCount > 0 && (
          <div className={styles.headerActionsCol}>
            {isEligibleToReview ? (
              <button
                type="button"
                className={styles.writeReviewBtn}
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Close Form' : 'Write a Verified Review'}
              </button>
            ) : (
              <button
                type="button"
                className={styles.writeReviewBtn}
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowManualVerify(true);
                  } else {
                    setShowManualVerify(!showManualVerify);
                  }
                }}
              >
                {showManualVerify ? 'Close Verification' : 'Verify Purchase to Review'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Manual Guest Order Verification Box */}
      {showManualVerify && !isEligibleToReview && (
        <form onSubmit={handleManualVerify} className={styles.manualVerifyBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', margin: 0 }}>
              Verify Purchase with Order ID
            </h3>
            <button
              type="button"
              onClick={() => setShowManualVerify(false)}
              style={{ background: 'none', border: 'none', color: '#78716c', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#57534e', marginBottom: '16px', lineHeight: 1.5 }}>
            Enter your 10-digit mobile number and Order ID (found in your SMS or email confirmation, e.g. <code style={{ backgroundColor: '#f5f5f4', padding: '2px 6px', borderRadius: '4px' }}>THR-1001</code>) to unlock review submission.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <CustomInput
              label="Mobile Number *"
              id="verify-phone"
              name="verifyPhone"
              type="tel"
              prefix="+91"
              placeholder="98926 91094"
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              required
            />
            <CustomInput
              label="Order ID *"
              id="verify-order-id"
              name="verifyOrderId"
              type="text"
              placeholder="e.g. THR-1001"
              value={manualOrderId}
              onChange={(e) => setManualOrderId(e.target.value)}
              required
            />
          </div>

          {manualVerifyError && (
            <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>
              ⚠ {manualVerifyError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isVerifyingEligibility}
              className={styles.submitBtn}
              style={{ padding: '10px 24px', fontSize: '13px' }}
            >
              {isVerifyingEligibility ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              onClick={() => setShowManualVerify(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Success Banner */}
      {submitSuccess && (
        <div className={styles.successBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <strong style={{ display: 'block', marginBottom: '2px', color: '#166534' }}>
              Thank you for your review!
            </strong>
            <span>Your verified impression and media have been authenticated and published below.</span>
          </div>
        </div>
      )}

      {/* Verified Review Form */}
      {showReviewForm && isEligibleToReview && (
        <form onSubmit={handleSubmitReview} className={styles.reviewFormBox}>
          <div className={styles.formHeader}>
            <div>
              <div className={styles.verifiedBadgeRow}>
                <span className={styles.verifiedBadge}>
                  ✓ Verified Buyer Confirmed · Order #{eligibilityData?.orderId || manualOrderId || 'THR-VERIFIED'}
                </span>
              </div>
              <h3 className={styles.formTitle}>Write Your Impression for {productTitle}</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className={styles.closeFormBtn}
            >
              ✕
            </button>
          </div>

          {/* Rating Picker */}
          <div style={{ marginBottom: '20px' }}>
            <label className={styles.inputLabel}>
              Overall Rating <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div className={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((s) => {
                  const activeStar = formRatingHover !== null ? formRatingHover : formRating;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setFormRating(s)}
                      onMouseEnter={() => setFormRatingHover(s)}
                      onMouseLeave={() => setFormRatingHover(null)}
                      className={styles.starPickBtn}
                      style={{ color: s <= activeStar ? '#f59e0b' : '#d6d3d1' }}
                      aria-label={`${s} star rating`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
              <span className={styles.ratingText}>
                {RATING_DESCRIPTIONS[formRatingHover !== null ? formRatingHover : formRating]}
              </span>
            </div>
          </div>

          {/* User Name & Review Title (CustomInput) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <CustomInput
              label="Your Name *"
              id="review-name"
              name="name"
              placeholder="e.g. Siddharth M."
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
            <CustomInput
              label="Review Headline *"
              id="review-title"
              name="title"
              placeholder="e.g. Impeccable tailoring and structured fabric weight"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </div>

          {/* Fit Assessment */}
          <div style={{ marginBottom: '18px' }}>
            <label className={styles.inputLabel}>How is the fit?</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Runs Small', 'True to Size', 'Runs Large'].map((fit) => (
                <button
                  type="button"
                  key={fit}
                  onClick={() => setFormFit(fit)}
                  className={`${styles.fitChip} ${formFit === fit ? styles.fitChipActive : ''}`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Garment Highlights */}
          <div style={{ marginBottom: '18px' }}>
            <label className={styles.inputLabel}>Notable Garment Highlights (Select all that apply)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                'Heavy Fabric Weave',
                'Architectural Cut',
                'Flattering Seams',
                'Sharp Collar',
                'Breathable',
                'High-End Finish',
                'Fast Delivery',
              ].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`${styles.tagChip} ${formTags.includes(tag) ? styles.tagChipActive : ''}`}
                >
                  {formTags.includes(tag) ? '✓ ' : '+ '}
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Review (CustomTextarea) */}
          <div style={{ marginBottom: '20px' }}>
            <CustomTextarea
              label="Detailed Review & Experience"
              id="review-comment"
              name="comment"
              placeholder="Describe the fabric texture, shoulder drape, silhouette contour, and how the garment wears in daily movement..."
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              required
              rows={4}
              maxLength={800}
            />
          </div>

          {/* Media Upload (Photos & Short Videos) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className={styles.inputLabel} style={{ margin: 0 }}>
                Upload Customer Photos & Video Clips (Optional)
              </label>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                {formMedia.length}/5 uploaded
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#78716c', margin: '0 0 10px 0' }}>
              Help other buyers see the real silhouette. Supported: JPG, PNG, WEBP, MP4, MOV (up to 25MB).
            </p>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaUpload}
              multiple
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
              style={{ display: 'none' }}
            />

            {/* Media Previews Grid */}
            <div className={styles.mediaUploadGrid}>
              {formMedia.map((media) => (
                <div key={media.id} className={styles.mediaPreviewCard}>
                  {media.type === 'image' ? (
                    <img src={media.url} alt={media.fileName} className={styles.mediaPreviewImg} />
                  ) : (
                    <div className={styles.mediaVideoContainer}>
                      <video src={media.url} className={styles.mediaPreviewVideo} muted playsInline />
                      <div className={styles.videoBadge}>▶ Video</div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(media.id)}
                    className={styles.removeMediaBtn}
                    aria-label="Remove media"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {formMedia.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.addMediaBox}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#1c1917', marginTop: '6px' }}>
                    + Add Photo or Video
                  </span>
                  <span style={{ fontSize: '10px', color: '#a8a29e' }}>
                    Click or drop files
                  </span>
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
              ⚠ {submitError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? 'Publishing Review...' : 'Publish Verified Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Zero Reviews Clean Empty State OR Populated Stats & Reviews Layout */}
      {reviewCount === 0 ? (
        !showReviewForm && !showManualVerify && (
          <div className={styles.emptyReviewsCard}>
            <div className={styles.emptyReviewsIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className={styles.emptyReviewsTitle}>No Reviews Yet</h3>
            <p className={styles.emptyReviewsText}>
              Be the first verified client to share your impression of this piece.
            </p>

            <div className={styles.emptyReviewsAction}>
              {isEligibleToReview ? (
                <button
                  type="button"
                  className={styles.writeReviewBtn}
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Verified Review
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.writeReviewBtn}
                  onClick={() => setShowManualVerify(true)}
                >
                  Verify Purchase to Review
                </button>
              )}

              <span className={styles.verifiedBuyerTag}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                {isEligibleToReview ? 'Verified Buyer Confirmed' : 'Verified Purchases Only'}
              </span>
            </div>
          </div>
        )
      ) : (
        <>
          {/* Top Stats Box */}
          <div className={styles.statsBox}>
            <div className={styles.averageScore}>
              <div className={styles.scoreCircle}>
                <span>{averageScore}</span>
              </div>
              <div className={styles.scoreDetails}>
                <div>
                  <span className={styles.verifiedBuyerTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    {isEligibleToReview ? 'Verified Buyer Confirmed' : 'Verified Purchases Only'}
                  </span>
                </div>
                <div className={styles.stars}>
                  {reviewCount > 0 ? '★★★★★' : '☆☆☆☆☆'}
                </div>
                <span className={styles.reviewCount}>
                  Based on {reviewCount} verified owner {reviewCount === 1 ? 'review' : 'reviews'}
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

          {/* Reviews Main Grid with Filters */}
          <div className={styles.reviewsLayout}>
            {/* Left Sidebar: Filters */}
            <aside className={styles.filtersSidebar}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className={styles.filterTitle} style={{ margin: 0, padding: 0, border: 'none' }}>Filter by Rating</h3>
                {selectedRatingFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedRatingFilter(null)}
                    style={{ background: 'none', border: 'none', color: '#78716c', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
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
                      className={`${styles.checkboxLabel} ${isChecked ? styles.checkboxLabelActive : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedRatingFilter(isChecked ? null : rating);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setSelectedRatingFilter(isChecked ? null : rating)}
                      />
                      <span
                        className={`${styles.checkmark} ${isChecked ? styles.checkmarkChecked : ''}`}
                      >
                        {isChecked && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={styles.starIcon}>★</span> {rating} {rating === 1 ? 'Star' : 'Stars'}
                      <span className={styles.filterBadge}>{ratingCounts[rating]}</span>
                    </label>
                  );
                })}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e7e5e4', margin: '20px 0' }} />

              <div style={{ fontSize: '12px', color: '#78716c', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', color: '#1c1917', marginBottom: '4px' }}>
                  Quality Verification Seal
                </strong>
                Every review is confirmed against verified order delivery records from Cashfree & Delhivery logistics.
              </div>
            </aside>

            {/* Right Main Content: Reviews List */}
            <div className={styles.reviewsListContainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 className={styles.listTitle} style={{ margin: 0 }}>
                  Reviews <span className={styles.titleBadge}>{displayedReviews.length}</span>
                </h3>
                {selectedRatingFilter && (
                  <span style={{ fontSize: '13px', color: '#78716c' }}>
                    Filtering by {selectedRatingFilter} Star reviews
                  </span>
                )}
              </div>

              {/* Filter Tabs */}
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'all' && !selectedRatingFilter ? styles.tabActive : ''}`}
                  onClick={() => { setActiveTab('all'); setSelectedRatingFilter(null); }}
                >
                  All Reviews <span className={styles.tabBadge}>{reviewCount}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'media' ? styles.tabActive : ''}`}
                  onClick={() => { setActiveTab('media'); setSelectedRatingFilter(null); }}
                >
                  With Photos & Videos <span className={styles.tabBadge}>{reviewsWithMedia.length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === '5stars' || selectedRatingFilter === 5 ? styles.tabActive : ''}`}
                  onClick={() => { setActiveTab('5stars'); setSelectedRatingFilter(5); }}
                >
                  5 Stars <span className={styles.tabBadge}>{ratingCounts[5]}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === '4stars' || selectedRatingFilter === 4 ? styles.tabActive : ''}`}
                  onClick={() => { setActiveTab('4stars'); setSelectedRatingFilter(4); }}
                >
                  4 Stars <span className={styles.tabBadge}>{ratingCounts[4]}</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className={styles.reviewItems}>
                {displayedReviews.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#78716c', backgroundColor: '#fafaf9', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 500, color: '#1c1917' }}>
                      {reviewCount === 0
                        ? 'No verified reviews yet. Be the first verified client to review this piece after delivery.'
                        : 'No reviews match this filter'}
                    </p>
                    {reviewCount > 0 && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('all'); setSelectedRatingFilter(null); }}
                        style={{ background: 'none', border: 'none', color: '#1c1917', textDecoration: 'underline', fontSize: '13px', cursor: 'pointer' }}
                      >
                        View all verified reviews
                      </button>
                    )}
                  </div>
                ) : (
                  displayedReviews.map((review) => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <div className={styles.reviewStars} style={{ margin: 0 }}>
                            {'★'.repeat(review.stars)}
                          </div>
                          {review.verified && (
                            <span className={styles.verifiedBuyerTag}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Verified Buyer {review.orderId ? `· #${review.orderId}` : ''}
                            </span>
                          )}
                          {review.fitFeedback && (
                            <span className={styles.fitTag}>
                              Fit: {review.fitFeedback}
                            </span>
                          )}
                        </div>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>

                      <h4 className={styles.reviewTitle}>{review.title}</h4>
                      <p className={styles.reviewComment}>{review.comment}</p>

                      {/* Highlights / Tags */}
                      {Array.isArray(review.tags) && review.tags.length > 0 && (
                        <div className={styles.reviewTagsRow}>
                          {review.tags.map((t, idx) => (
                            <span key={idx} className={styles.reviewHighlightChip}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Photos & Videos attached to review */}
                      {Array.isArray(review.media) && review.media.length > 0 && (
                        <div className={styles.reviewMediaGallery}>
                          {review.media.map((m, idx) => (
                            <div
                              key={idx}
                              className={styles.reviewMediaThumb}
                              onClick={() => setLightboxItem(m)}
                            >
                              {m.type === 'video' ? (
                                <div className={styles.videoThumbWrapper}>
                                  <video src={m.url} className={styles.thumbMedia} muted playsInline />
                                  <div className={styles.videoPlayOverlay}>▶</div>
                                </div>
                              ) : (
                                <img src={m.url} alt={m.alt || 'Customer photo'} className={styles.thumbMedia} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={styles.reviewFooter}>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.avatar}>
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <span className={styles.reviewerName}>{review.name}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: '#a8a29e' }}>
                              Verified Member
                            </span>
                          </div>
                        </div>

                        <div className={styles.reviewActions}>
                          {(() => {
                            const isVoted = votedReviewIds.includes(review.id);
                            return (
                              <button
                                type="button"
                                className={`${styles.actionBtn} ${isVoted ? styles.actionBtnVoted : ''}`}
                                onClick={() => handleLike(review.id)}
                                disabled={isVoted}
                                title={isVoted ? 'You marked this review as helpful' : 'Mark as helpful'}
                                aria-label={isVoted ? 'Review marked as helpful' : 'Mark review as helpful'}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill={isVoted ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                                <span>Helpful</span>
                                <span className={`${styles.helpfulBadge} ${isVoted ? styles.helpfulBadgeVoted : ''}`}>
                                  {review.likes || 0}
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Lightbox Modal for customer photos and videos */}
      {lightboxItem && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxItem(null)}>
          <div className={styles.lightboxCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxItem(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            {lightboxItem.type === 'video' ? (
              <video
                src={lightboxItem.url}
                className={styles.lightboxVideo}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.alt || 'Full size customer media'}
                className={styles.lightboxImg}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
