import "server-only";

/**
 * In-memory repository of verified buyer reviews.
 * Can be hooked to a database or remote microservice when the reviews table is migrated.
 */
const VERIFIED_REVIEWS_STORE = {
  'sleeveless-princess-sheath-dress': [
    {
      id: 'rev-kanta-01',
      name: 'Kanta Jain',
      verified: true,
      orderId: 'THR-MXPGSL',
      stars: 5,
      date: '08 Nov 2026',
      title: 'Exceptional tailoring and contoured sheath fit',
      comment: 'The princess seams and structured silhouette are flawless. Delivered to Charni Road, Mumbai in bespoke packaging within 2 days.',
      fitFeedback: 'True to Size',
      tags: ['Flattering Seams', 'Tailored Fit'],
      media: [
        { type: 'image', url: '/products/sleeveless-princess-sheath-dress/front.jpg?v=3', alt: 'Kanta Jain fit' },
      ],
      likes: 1,
    },
  ],
};

/**
 * Fetch verified reviews for a product by its handle.
 *
 * @param {string} handle
 * @returns {Promise<Array<Object>>}
 */
export async function getReviewsForProduct(handle) {
  if (!handle) return [];
  const normalized = String(handle).toLowerCase().trim();
  return VERIFIED_REVIEWS_STORE[normalized] || [];
}
