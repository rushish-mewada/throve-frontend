"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import styles from './ProductInfo.module.css';
import SizeChartModal from './SizeChartModal';
import DeliveryTermsModal from './DeliveryTermsModal';
import QuickSizeModal from './QuickSizeModal';
import { initiateCashfreeCheckoutAction } from '@/actions/checkout';
import { launchCashfreeCheckout } from '@/lib/cashfree';
import { checkPincodeAction } from '@/actions/serviceability';

export default function AddToCartClient({ variants = [], colors = [], product, config }) {
  const router = useRouter();
  const { addToCart, setIsCartDrawerOpen } = useStore();
  const actionsRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const safeVariants = Array.isArray(variants) && variants.length > 0
    ? variants
    : [{ id: 'v_s', name: 'S' }, { id: 'v_m', name: 'M' }, { id: 'v_l', name: 'L' }];

  const safeColors = Array.isArray(colors) && colors.length > 0
    ? colors
    : [{ id: 'c_default', name: 'Classic', hex: '#18181b' }];

  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(safeColors[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isQuickSizeOpen, setIsQuickSizeOpen] = useState(false);
  const [quickSizeAction, setQuickSizeAction] = useState('cart'); // 'cart' | 'buy'
  const [pincode, setPincode] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeResult, setPincodeResult] = useState(null);

  const handleCheckPincode = async (e) => {
    e?.preventDefault?.();
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setPincodeResult({ ok: false, error: 'Please enter a valid 6-digit Indian pincode.' });
      return;
    }
    setPincodeLoading(true);
    setPincodeResult(null);
    try {
      const res = await checkPincodeAction(cleanPin);
      if (res.ok) {
        setPincodeResult(res);
      } else {
        setPincodeResult({ ok: false, error: res.error || 'Unable to verify pincode.' });
      }
    } catch {
      setPincodeResult({ ok: false, error: 'Failed to verify pincode.' });
    } finally {
      setPincodeLoading(false);
    }
  };

  const prodImg = (Array.isArray(product?.images) && product.images.length > 0)
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
    : (typeof product?.image === 'string' ? product.image : product?.image?.url);
  const safeProdImg = (typeof prodImg === 'string' && prodImg.trim().length > 0)
    ? prodImg.trim()
    : '/products/navy-tailored-mini-dress/main.jpg?v=3';

  // IntersectionObserver detects when primary CTA buttons scroll out of viewport
  useEffect(() => {
    const target = actionsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAbove = entry.boundingClientRect.bottom < 0;
        setShowStickyBar(!entry.isIntersecting && isAbove);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (sizeOverride = null) => {
    const sizeToUse = sizeOverride || selectedSize;
    if (!sizeToUse) {
      setSizeError(true);
      if (actionsRef.current) {
        actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (isAdding) return;
    setIsAdding(true);
    const sizeName = sizeToUse?.name || sizeToUse?.title || 'M';
    const colorName = selectedColor?.name || 'Standard';
    addToCart(product, sizeName, colorName, 1);
    setIsAdding(false);
    setAddedSuccess(true);
    setIsCartDrawerOpen(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleCheckoutNow = (sizeOverride = null) => {
    const sizeToUse = sizeOverride || selectedSize;
    if (!sizeToUse) {
      setSizeError(true);
      if (actionsRef.current) {
        actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setIsCheckingOut(true);
    setIsCartDrawerOpen(false);
    const sizeName = sizeToUse?.name || sizeToUse?.title || 'M';
    const colorName = selectedColor?.name || 'Standard';
    // Strictly do not open cart sidebar drawer on Buy Now (5th param openDrawer = false)
    addToCart(product, sizeName, colorName, 1, false);
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  const handleStickyAddToCart = () => {
    if (!selectedSize) {
      setQuickSizeAction('cart');
      setIsQuickSizeOpen(true);
      return;
    }
    handleAddToCart();
  };

  const handleStickyCheckoutNow = () => {
    if (!selectedSize) {
      setQuickSizeAction('buy');
      setIsQuickSizeOpen(true);
      return;
    }
    handleCheckoutNow();
  };

  const handleQuickSizeConfirm = (action, sizeChosen) => {
    setIsQuickSizeOpen(false);
    const sizeToUse = sizeChosen || selectedSize;
    if (action === 'buy') {
      handleCheckoutNow(sizeToUse);
    } else {
      handleAddToCart(sizeToUse);
    }
  };

  return (
    <div className={styles.formContainer}>

      {/* Colors */}
      <div className={styles.optionGroup}>
        <span className={styles.optionLabel}>Color: <span>{selectedColor?.name || 'Classic'}</span></span>
        <div className={styles.swatchList}>
          {safeColors.map(color => (
            <button
              key={color.id}
              className={`${styles.swatch} ${selectedColor?.id === color.id ? styles.swatchActive : ''}`}
              style={{ backgroundColor: color.hex || '#18181b' }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.optionGroup}>
        <div className={styles.sizeHeader}>
          <span className={styles.optionLabel}>
            Size: {selectedSize ? <span>{selectedSize.name || selectedSize.title}</span> : <span className={styles.sizePrompt}>Select your size</span>}
          </span>
          <button
            type="button"
            className={styles.sizeGuideBtn}
            onClick={() => setIsSizeChartOpen(true)}
          >
            View Size Chart
          </button>
        </div>
        <div className={`${styles.sizeList} ${sizeError ? styles.sizeListError : ''}`}>
          {safeVariants.map((v) => {
            const rawLabel = v.name || v.title || 'M';
            const shortLabel = rawLabel.includes(' / ') ? rawLabel.split(' / ')[0].trim() : rawLabel;
            const isSelected = selectedSize && (selectedSize.id === v.id || selectedSize.name === v.name || selectedSize.name === shortLabel);
            return (
              <button
                key={v.id}
                type="button"
                className={`${styles.sizeBtn} ${isSelected ? styles.sizeActive : ''}`}
                onClick={() => {
                  setSelectedSize({ ...v, name: shortLabel });
                  setSizeError(false);
                }}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
        {sizeError && (
          <div className={styles.sizeErrorMsg} role="alert">
            Please choose a size to continue
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions} ref={actionsRef}>
        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          disabled={isAdding}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isAdding ? (
            <>
              <span className={styles.spinner} />
              <span>Adding to Bag...</span>
            </>
          ) : addedSuccess ? (
            <span style={{ color: '#86efac', fontWeight: 600 }}>✓ Added to Bag!</span>
          ) : (
            <>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Add To Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.checkoutNowBtn}
          onClick={handleCheckoutNow}
          disabled={isCheckingOut}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isCheckingOut ? (
            <>
              <span className={styles.spinnerDark} />
              <span>Launching Checkout...</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Buy Now</span>
            </>
          )}
        </button>
      </div>

      {/* Pincode Serviceability Checker */}
      <div className={styles.pincodeBox}>
        <div className={styles.pincodeHeader}>
          <span className={styles.pincodeTitle}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Delivery &amp; Serviceability</span>
          </span>
          <button
            type="button"
            className={styles.deliveryLink}
            onClick={() => setIsDeliveryOpen(true)}
            style={{ margin: 0 }}
          >
            Delivery T&amp;C
          </button>
        </div>

        <form onSubmit={handleCheckPincode} className={styles.pincodeForm}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={styles.pincodeInput}
            aria-label="Delivery Pincode"
          />
          <button
            type="submit"
            disabled={pincodeLoading || pincode.length !== 6}
            className={styles.pincodeBtn}
          >
            {pincodeLoading ? 'Checking...' : 'Check'}
          </button>
        </form>

        {pincodeResult && (
          <div>
            {pincodeResult.serviceable ? (
              <div className={styles.pincodeResultSuccess}>
                <div style={{ fontWeight: 600 }}>✓ {pincodeResult.message}</div>
                <div style={{ color: '#166534', fontSize: '0.74rem' }}>
                  • {pincodeResult.codStatus} · Dispatched via {pincodeResult.carrier}
                </div>
              </div>
            ) : (
              <div className={styles.pincodeResultError}>
                ✕ {pincodeResult.error || pincodeResult.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Luxury Delivery & Service Guarantee */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: '#fafaf9',
          border: '1px solid #e7e5e4',
          fontSize: '11.5px',
          color: '#44403c',
          lineHeight: 1.45,
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          marginTop: '2px',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <div>
          <strong style={{ color: '#1c1917', display: 'block', marginBottom: '2px' }}>
            Complimentary Express Delivery & 7-Day Returns
          </strong>
          <span>
            {product?.inStock !== false ? 'Handcrafted luxury piece in ready stock.' : 'Limited allocation bespoke order.'}{' '}
            Secured instant order processing with{' '}
            {config?.commerce?.activePaymentGateway
              ? (config.commerce.activePaymentGateway.charAt(0).toUpperCase() + config.commerce.activePaymentGateway.slice(1))
              : '1-Click Checkout'}
            {config?.commerce?.codEnabled !== false ? ' & COD available across India.' : ' with secure prepaid delivery.'}
          </span>
        </div>
      </div>

      {/* Floating Sticky Bottom Bar when main CTAs are scrolled out of view */}
      <aside
        className={`${styles.stickyBar} ${showStickyBar ? styles.stickyBarVisible : ''}`}
        aria-hidden={!showStickyBar}
        aria-label="Sticky Purchase Actions"
      >
        <div className={styles.stickyBarInner}>
          {/* Left: Product Thumbnail, Title & Price info */}
          <div className={styles.stickyProdInfo}>
            <div className={styles.stickyThumb}>
              <Image
                src={safeProdImg}
                alt={product?.title || 'Product'}
                fill
                sizes="50px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.stickyTextGroup}>
              <span className={styles.stickyTitle} title={product?.title}>
                {product?.title}
              </span>
              <div className={styles.stickyMetaRow}>
                <span className={styles.stickyPrice}>{product?.price}</span>
                {product?.oldPrice && (
                  <span className={styles.stickyOldPrice}>{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Size Selector & Action Buttons */}
          <div className={styles.stickyActionsGroup}>
            {/* Quick Size Options */}
            <div className={styles.stickySizeList}>
              {safeVariants.map((v) => {
                const rawLabel = v.name || v.title || 'M';
                const shortLabel = rawLabel.includes(' / ') ? rawLabel.split(' / ')[0].trim() : rawLabel;
                const isSelected = selectedSize && (selectedSize.id === v.id || selectedSize.name === v.name || selectedSize.name === shortLabel);
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`${styles.stickySizeBtn} ${isSelected ? styles.stickySizeActive : ''}`}
                    onClick={() => {
                      setSelectedSize({ ...v, name: shortLabel });
                      setSizeError(false);
                    }}
                    aria-label={`Select size ${shortLabel}`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* CTAs */}
            <div className={styles.stickyButtons}>
              <button
                type="button"
                className={styles.stickyAddBtn}
                onClick={handleStickyAddToCart}
                disabled={isAdding}
                aria-label="Add to Cart"
              >
                {isAdding ? (
                  <span className={styles.spinner} />
                ) : addedSuccess ? (
                  <span style={{ color: '#86efac', fontWeight: 600 }}>✓ Added</span>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className={styles.stickyBuyBtn}
                onClick={handleStickyCheckoutNow}
                disabled={isCheckingOut}
                aria-label="Buy Now"
              >
                {isCheckingOut ? (
                  <span className={styles.spinnerDark} />
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Buy Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <QuickSizeModal
        isOpen={isQuickSizeOpen}
        onClose={() => setIsQuickSizeOpen(false)}
        product={product}
        selectedSize={selectedSize}
        onSelectSize={(sz) => {
          setSelectedSize(sz);
          setSizeError(false);
        }}
        onConfirm={handleQuickSizeConfirm}
        actionType={quickSizeAction}
        isSubmitting={quickSizeAction === 'buy' ? isCheckingOut : isAdding}
        onOpenSizeChart={() => setIsSizeChartOpen(true)}
      />

      {/* Modals */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        product={product}
      />

      <DeliveryTermsModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        config={config}
      />
    </div>
  );
}
