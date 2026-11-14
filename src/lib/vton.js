/**
 * Determines whether a product has Virtual Try-On (VTON) actively enabled.
 * Checks product-level flags, vton metadata, and variant-level configuration.
 *
 * @param {Object} product
 * @returns {boolean}
 */
export function isProductVtonActive(product) {
  if (!product) return false;

  const vton = product.vton || product.metadata?.vton;
  const hasCutout = Boolean(vton?.cutout_url && String(vton.cutout_url).trim().length > 0);

  // 1. Explicit boolean flag
  if (typeof product.vtonActive === 'boolean') {
    if (!product.vtonActive) return false;
    if (vton && typeof vton === 'object') {
      return Boolean(vton.enabled) && hasCutout;
    }
    return product.vtonActive && hasCutout;
  }
  if (typeof product.isVtonActive === 'boolean') {
    if (!product.isVtonActive) return false;
    if (vton && typeof vton === 'object') {
      return Boolean(vton.enabled) && hasCutout;
    }
    return product.isVtonActive && hasCutout;
  }

  // 2. Direct vton object
  if (vton && typeof vton === 'object') {
    return Boolean(vton.enabled) && hasCutout;
  }

  // 3. Check variants for VTON
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.some((v) => {
      const vVton = v.vton || v.metadata?.vton;
      return Boolean(vVton?.enabled) && Boolean(vVton?.cutout_url && String(vVton.cutout_url).trim().length > 0);
    });
  }

  return false;
}
