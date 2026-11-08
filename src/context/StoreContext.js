"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_CART = [
  {
    id: 'cart-1',
    productId: 'throve_lp_01',
    title: 'Sleeveless Tailored Mini Dress',
    variant: 'Size: M | Color: Navy',
    priceNum: 4800,
    qty: 1,
    image: '/products/navy-tailored-mini-dress/front.jpg?v=3',
    handle: 'navy-tailored-mini-dress',
  },
  {
    id: 'cart-2',
    productId: 'throve_lp_02',
    title: 'Overlapping Mandarin Shirt',
    variant: 'Size: L | Color: Espresso Brown',
    priceNum: 3900,
    qty: 1,
    image: '/products/asymmetric-mandarin-shirt/front.jpg?v=3',
    handle: 'asymmetric-mandarin-shirt',
  },
];

const INITIAL_WISHLIST = [
  {
    id: 'throve_lp_04',
    title: 'Scalloped Sweetheart Top',
    category: 'Tops',
    price: '₹ 2,900',
    priceNum: 2900,
    image: '/products/scalloped-sweetheart-top/front.jpg?v=3',
    handle: 'scalloped-sweetheart-top',
    inStock: true,
  },
  {
    id: 'throve_lp_03',
    title: 'Pleated Straight Formal Pants',
    category: 'Trousers',
    price: '₹ 4,200',
    priceNum: 4200,
    image: '/products/pleated-formal-pants/front.jpg?v=3',
    handle: 'pleated-formal-pants',
    inStock: true,
  },
];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [wishlistItems, setWishlistItems] = useState(INITIAL_WISHLIST);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage once on client
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('throve_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
      const savedWishlist = localStorage.getItem('throve_wishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlistItems(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('throve_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors
    }
  }, [cartItems, isMounted]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('throve_wishlist', JSON.stringify(wishlistItems));
    } catch {
      // Ignore storage errors
    }
  }, [wishlistItems, isMounted]);

  // Cart operations
  const addToCart = (product, size = 'M', color = 'Standard', qty = 1, openDrawer = true) => {
    const sizeName = typeof size === 'object' ? size?.name || 'M' : size;
    const colorName = typeof color === 'object' ? color?.name || 'Standard' : color;
    const variantStr = `Size: ${sizeName} | Color: ${colorName}`;
    const priceNum = typeof product.priceNum === 'number'
      ? product.priceNum
      : parseInt(String(product.price || '').replace(/[^\d]/g, ''), 10) || 4500;
    const imageSrc = product.image || (Array.isArray(product.images) ? product.images[0] : '/products/navy-tailored-mini-dress/front.jpg?v=3');

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => (item.productId === product.id || item.handle === product.handle) && item.variant === variantStr
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: updated[existingIdx].qty + qty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id || product.handle,
          title: product.title,
          variant: variantStr,
          priceNum,
          qty,
          image: imageSrc,
          handle: product.handle,
        },
      ];
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQty = (cartItemId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const isInWishlist = (idOrHandle) => {
    if (!idOrHandle) return false;
    return wishlistItems.some(
      (item) => item.id === idOrHandle || item.handle === idOrHandle
    );
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const key = product.id || product.handle;
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === key || item.handle === key);
      if (exists) {
        return prev.filter((item) => item.id !== key && item.handle !== key);
      }
      const priceNum = typeof product.priceNum === 'number'
        ? product.priceNum
        : parseInt(String(product.price || '').replace(/[^\d]/g, ''), 10) || 4500;
      const imageSrc = product.image || (Array.isArray(product.images) ? product.images[0] : '/products/navy-tailored-mini-dress/front.jpg?v=3');

      return [
        ...prev,
        {
          id: product.id || product.handle,
          title: product.title,
          category: product.category || 'Atelier Collection',
          price: product.price || `₹ ${priceNum.toLocaleString('en-IN')}`,
          priceNum,
          image: imageSrc,
          handle: product.handle,
          inStock: true,
        },
      ];
    });
  };

  const removeFromWishlist = (idOrHandle) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== idOrHandle && item.handle !== idOrHandle)
    );
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.priceNum * item.qty, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCart: () => setIsCartDrawerOpen(true),
        closeCart: () => setIsCartDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
