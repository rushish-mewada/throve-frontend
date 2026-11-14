/**
 * Determines whether a product has Virtual Try-On (VTON) actively enabled.
 * Checks product-level flags, vton metadata, and variant-level configuration.
 *
 * @param {Object} product
 * @returns {boolean}
 */
export function isProductVtonActive(product) {
  if (!product) return false;

  // 1. Explicit boolean flag
  if (typeof product.vtonActive === 'boolean') {
    return product.vtonActive;
  }
  if (typeof product.isVtonActive === 'boolean') {
    return product.isVtonActive;
  }

  // 2. Direct vton object
  const vton = product.vton || product.metadata?.vton;
  if (vton && typeof vton === 'object') {
    if (vton.enabled === true) {
      return true;
    }
    if (vton.enabled === false) {
      return false;
    }
  }

  // 3. Check variants for VTON
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.some((v) => {
      const vVton = v.vton || v.metadata?.vton;
      return vVton && typeof vVton === 'object' && vVton.enabled === true;
    });
  }

  return false;
}
