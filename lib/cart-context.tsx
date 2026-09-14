'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRODUCTS, type Product, type CartItem, type OrderRecord } from './data';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, engraving?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  itemCount: number;
  
  // Persistent Order History & Real-Time Tracking
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  getOrder: (orderNumber: string) => OrderRecord | undefined;
  lastPlacedOrder: OrderRecord | null;
  setLastPlacedOrder: (order: OrderRecord | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawCart, setRawCart] = useState<{ productId: string; quantity: number; engraving?: string }[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate Cart & Orders from localStorage on mount
  useEffect(() => {
    try {
      // Cart items
      const storedCart = localStorage.getItem('aura_collection_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        // Normalize to { productId, quantity, engraving }
        const normalized = parsed.map((item: any) => ({
          productId: item.productId || item.product?.id,
          quantity: item.quantity || 1,
          engraving: item.engraving || '',
        })).filter((item: any) => Boolean(item.productId));
        setRawCart(normalized);
      }

      // Orders history (never deleted during add to bag)
      const storedOrders = localStorage.getItem('aura_orders_history');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
          if (parsedOrders.length > 0) {
            setLastPlacedOrder(parsedOrders[0]);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage hydration fallback:', e);
    }
    setIsHydrated(true);
  }, []);

  // 2. Persist Cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('aura_collection_cart', JSON.stringify(rawCart));
      } catch (e) {
        console.warn('Failed to persist cart:', e);
      }
    }
  }, [rawCart, isHydrated]);

  // 3. Persist Orders to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('aura_orders_history', JSON.stringify(orders));
      } catch (e) {
        console.warn('Failed to persist orders:', e);
      }
    }
  }, [orders, isHydrated]);

  // 4. DYNAMIC PRICE SYNC:
  // Whenever catalog prices in PRODUCTS change, the cart automatically resolves
  // the live product and reflects current prices in cart & totals!
  const cart: CartItem[] = useMemo(() => {
    return rawCart.map((item) => {
      const liveProduct = PRODUCTS.find((p) => p.id === item.productId) || PRODUCTS[0];
      return {
        productId: item.productId,
        product: liveProduct, // Always uses the latest catalog pricing & stock
        quantity: item.quantity,
        engraving: item.engraving,
      };
    });
  }, [rawCart]);

  const addToCart = (product: Product, quantity = 1, engraving = '') => {
    setRawCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && (item.engraving || '') === engraving
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { productId: product.id, quantity, engraving }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setRawCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setRawCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is { productId: string; quantity: number; engraving?: string } => item !== null)
    );
  };

  const clearCart = () => setRawCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Orders Management (Never overwritten by add to bag!)
  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.orderNumber !== order.orderNumber);
      return [order, ...filtered];
    });
    setLastPlacedOrder(order);
  };

  const getOrder = (orderNumber: string): OrderRecord | undefined => {
    return orders.find(
      (o) => o.orderNumber.trim().toLowerCase() === orderNumber.trim().toLowerCase()
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        itemCount,
        orders,
        addOrder,
        getOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
