import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Lock,
  Compass,
  SlidersHorizontal,
  Share2,
  Check,
  PackageCheck,
  Droplets,
  RotateCcw,
  Gem,
  MapPin,
  Smartphone,
  Banknote,
  CreditCard,
  Building2,
  CheckCircle2,
  Play,
  User,
  Eye,
  Type,
  AlertCircle,
  Sliders,
  Copy,
  Clock,
  Edit3,
  Trash2,
  Tag,
  Layers,
  RefreshCw,
  ExternalLink,
  LogOut,
  CheckSquare,
  UploadCloud,
  BarChart3,
  Package,
  Sun,
  Moon,
  Heart,
  Scale,
} from 'lucide-react';

import {
  PRODUCTS,
  CATEGORIES,
  METAL_SWATCHES,
  OCCASION_VIBES,
  WHY_14K_GOLD_COPY,
  COLLECTOR_TESTIMONIALS,
  INDIAN_STATES,
  STORE_CONFIG,
} from '../lib/data';
import {
  persistOrderToDb,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  fetchProductsFromDb,
  fetchOrdersFromDb,
  updateOrderStatusInDb,
} from '../lib/supabase';

const formatPriceINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPriceUSD = (amount) => {
  const usd = Math.round(amount / 83);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd);
};

// ==========================================
// 1. GLOBAL APP CONTEXT
// ==========================================
const AppContext = createContext();

function AppProvider({ children }) {
  // Support deep links like /admin or #admin
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
        return 'admin';
      }
      if (path.includes('orders') || hash.includes('orders')) {
        return 'orders';
      }
      if (path.includes('atelier') || hash.includes('atelier')) {
        return 'atelier';
      }
    }
    return 'home';
  });

  // Reactive Products Catalog: initialized from localStorage or static fallback
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('aviora_products_catalog');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  const [selectedProduct, setSelectedProduct] = useState(products[0] || PRODUCTS[0]);
  
  // Hydrate cart from localStorage
  const [rawCart, setRawCart] = useState(() => {
    try {
      const stored = localStorage.getItem('aura_collection_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item) => ({
          productId: item.productId || item.product?.id,
          quantity: item.quantity || 1,
          engraving: item.engraving || '',
        })).filter((item) => Boolean(item.productId));
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Hydrate orders from localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('aura_orders_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currencyMode, setCurrencyMode] = useState('INR'); // 'INR' | 'USD'
  const [toast, setToast] = useState({ show: false, message: '' });

  // Light / Dark Theme State with HTML class sync
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('aviora_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('aviora_theme', theme);
    } catch (e) {
      console.warn('Theme save notice:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('aviora_wishlist');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aviora_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  // Quick navigation filter states for Atelier
  const [categoryFilter, setCategoryFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');

  // On mount: Hydrate remote products & orders directly from Supabase (ap-south-1 Mumbai)
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseData() {
      try {
        const remoteProducts = await fetchProductsFromDb();
        if (isMounted && remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          localStorage.setItem('aviora_products_catalog', JSON.stringify(remoteProducts));
        }
      } catch (err) {
        console.warn('Supabase products hydration notice:', err);
      }

      try {
        const remoteOrders = await fetchOrdersFromDb();
        if (isMounted && remoteOrders && remoteOrders.length > 0) {
          setOrders((prev) => {
            const map = new Map();
            remoteOrders.forEach((o) => map.set(o.orderNumber, o));
            prev.forEach((o) => map.set(o.orderNumber, o));
            const merged = Array.from(map.values());
            localStorage.setItem('aura_orders_history', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase orders hydration notice:', err);
      }
    }

    loadSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aviora_products_catalog', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products cache:', e);
    }
  }, [products]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_collection_cart', JSON.stringify(rawCart));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [rawCart]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_orders_history', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  const navigate = (view, data = null) => {
    setCurrentView(view);
    if (view === 'pdp' && data) setSelectedProduct(data);
    if (view === 'orders') {
      if (data) setSelectedOrder(data);
      else if (orders.length > 0 && !selectedOrder) setSelectedOrder(orders[0]);
    }
    if (view === 'atelier' && data) {
      if (data.category !== undefined) setCategoryFilter(data.category);
      if (data.material !== undefined) setMaterialFilter(data.material);
      if (data.collection !== undefined) setCollectionFilter(data.collection);
      if (data.weightFilter !== undefined) setWeightFilter(data.weightFilter);
    }
    if (typeof window !== 'undefined') {
      const url = view === 'home' ? '/' : `/${view}`;
      try {
        window.history.pushState(null, '', url);
      } catch {
        // history fallback
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  // DYNAMIC PRICE SYNC:
  // Whenever catalog prices change in admin, the cart automatically resolves
  // the live product and reflects current prices in cart & totals!
  const cart = useMemo(() => {
    return rawCart.map((item) => {
      const liveProduct = products.find((p) => p.id === item.productId) || products[0] || PRODUCTS[0];
      return {
        productId: item.productId,
        product: liveProduct, // Always fresh from live reactive catalog
        quantity: item.quantity,
        engraving: item.engraving,
      };
    });
  }, [rawCart, products]);

  const addToCart = (product, quantity = 1, engraving = '') => {
    setRawCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && (item.engraving || '') === engraving
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { productId: product.id, quantity, engraving }];
    });
    setIsCartOpen(true);
    showToast(`Added to Bag: ${product.name}`);
  };

  const removeFromCart = (productId) => {
    setRawCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item released from bag');
  };

  const updateQuantity = (productId, delta) => {
    setRawCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setRawCart([]);

  // Cart total dynamically calculated using live product prices
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Order Management
  const addOrder = (order) => {
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.orderNumber !== order.orderNumber);
      return [order, ...filtered];
    });
    setSelectedOrder(order);
  };

  // ==========================================
  // ADMIN ACTIONS (CRUD & SUPABASE SYNC)
  // ==========================================
  const adminAddProduct = async (productData) => {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const newProduct = {
      id: productData.id || `avr-${Date.now().toString(36)}`,
      name: productData.name,
      slug,
      subtitle: productData.subtitle || '14K Gold Plated Vermeil over 925 Silver',
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      currency: 'INR',
      description: productData.description || 'Mastercrafted piece in 14K Gold Plated 925 Sterling Silver.',
      editorialNote: productData.editorialNote || 'Hand-finished in our Mumbai & Jaipur ateliers.',
      edition: productData.edition || 'Archival Series 2026',
      material: productData.material || '14K Gold Vermeil over BIS 925 Silver',
      goldPurity: productData.goldPurity || '14K Gold Vermeil',
      colorTone: productData.colorTone || 'Champagne Gold',
      metalColorHex: productData.metalColorHex || '#E6CA97',
      occasionVibe: productData.occasionVibe || 'Everyday Wear',
      dimensions: productData.dimensions || 'Universal luxury fit',
      weight: productData.weight || '12.5g BIS 925 Silver Core',
      craftsmanship: productData.craftsmanship || 'Hand-poured 2.5 micron vermeil over solid sterling silver.',
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : [
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
          ],
      modelImage:
        productData.modelImage ||
        (Array.isArray(productData.images) && productData.images[0]) ||
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      featured: Boolean(productData.featured),
      inStock: Boolean(productData.inStock ?? true),
      inventory: Number(productData.inventory ?? 5),
      isEngravable: Boolean(productData.isEngravable),
      categorySlug: productData.categorySlug || 'anatomical-kadas-cuffs',
      categoryName:
        productData.categorySlug === 'architectural-signets'
          ? 'Architectural Signets'
          : productData.categorySlug === 'sculptural-chokers-haslis'
          ? 'Haslis & Sculptural Chokers'
          : productData.categorySlug === 'negative-space-ear-cuffs'
          ? 'Negative Space Ear Cuffs'
          : 'Anatomical Kadas & Cuffs',
      hallmark: productData.hallmark || 'BIS Hallmarked 925 Pure Silver',
      warranty: productData.warranty || 'Lifetime Anti-Tarnish Warranty',
      pairsWithId: productData.pairsWithId || undefined,
      upsellReason: productData.upsellReason || '',
    };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Piece Published: ${newProduct.name}`);

    // Supabase Persistence
    try {
      const res = await addProductToDb(newProduct);
      if (res && !res.success) {
        console.warn('Supabase add product notice:', res.error);
      }
    } catch (err) {
      console.warn('Supabase add product notice:', err);
    }
  };

  const adminUpdateProduct = async (productId, updates) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Specifications & Pricing Synchronized');

    // Supabase Update
    try {
      const res = await updateProductInDb(productId, updates);
      if (res && !res.success) {
        console.warn('Supabase update product notice:', res.error);
      }
    } catch (err) {
      console.warn('Supabase update product notice:', err);
    }
  };

  const adminDeleteProduct = async (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Piece Removed from Catalog');

    // Supabase Delete
    try {
      const res = await deleteProductFromDb(productId);
      if (res && !res.success) {
        console.warn('Supabase delete product notice:', res.error);
      }
    } catch (err) {
      console.warn('Supabase delete product notice:', err);
    }
  };

  const adminUpdateOrderStatus = async (orderNumber, status, trackingNumber) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderNumber === orderNumber) {
          const updatedTimeline = [...(order.timeline || [])];
          const exists = updatedTimeline.find((t) => t.status === status);
          if (!exists) {
            updatedTimeline.push({
              status,
              label: status.replace(/_/g, ' '),
              location: 'Mumbai Central Vault',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: `Atelier updated status to ${status.replace(/_/g, ' ')}.`,
              completed: true,
              current: true,
            });
          }
          return {
            ...order,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
            timeline: updatedTimeline,
          };
        }
        return order;
      })
    );
    showToast(`Order ${orderNumber} Status Updated`);

    try {
      await updateOrderStatusInDb(orderNumber, status, trackingNumber);
    } catch (err) {
      console.warn('Supabase order status notice:', err);
    }
  };

  const formatPrice = (amount) => {
    return currencyMode === 'INR' ? formatPriceINR(amount) : formatPriceUSD(amount);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedProduct,
        setSelectedProduct,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        currencyMode,
        setCurrencyMode,
        formatPrice,
        toast,
        showToast,
        orders,
        addOrder,
        selectedOrder,
        setSelectedOrder,
        // Admin Features
        products,
        setProducts,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        // Theme & Wishlist Features
        theme,
        toggleTheme,
        wishlist,
        toggleWishlist,
        categoryFilter,
        setCategoryFilter,
        materialFilter,
        setMaterialFilter,
        collectionFilter,
        setCollectionFilter,
        weightFilter,
        setWeightFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// 2. RESILIENT ARTISTIC IMAGE (14K SPECIMEN FALLBACK)
// ==========================================
function ArtisticImage({ src, alt, className = '', exhibitNumber, materialTag }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className="relative w-full h-full min-h-[300px] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden flex flex-col justify-between p-8 border border-[var(--border-subtle)] select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,151,98,0.1)_0%,transparent_75%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <svg viewBox="0 0 200 200" className="w-44 h-44 animate-pulse text-[var(--text-muted)]">
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.75" fill="none" strokeDasharray="3 3" />
            <ellipse cx="100" cy="100" rx="85" ry="35" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-25 100 100)" />
            <circle cx="100" cy="100" r="12" stroke="#b99762" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 flex justify-between items-start text-[10px] tracking-[0.25em] uppercase font-mono text-[var(--text-muted)]">
          <span>{exhibitNumber || '14K SPECIMEN ARCHIVE'}</span>
          <span className="text-[#b99762] dark:text-[#e6ca97] font-semibold">14K CHAMPAGNE GOLD</span>
        </div>
        <div className="relative z-10 my-auto text-center space-y-2">
          <p className="font-serif italic text-2xl text-[var(--text-primary)] tracking-wide">{alt}</p>
          <div className="w-8 h-[1px] bg-[#b99762]/50 mx-auto" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#b99762] dark:text-[#e6ca97] font-mono">
            14K SPECIMEN // {materialTag || 'CHAMPAGNE GOLD & 925 SILVER'}
          </p>
        </div>
        <div className="relative z-10 flex justify-between items-end text-[9px] tracking-[0.2em] font-mono text-[var(--text-muted)]">
          <span>MUMBAI • JAIPUR • PARIS</span>
          <span>BIS 925 CERTIFIED</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-[var(--bg-secondary)] animate-pulse z-10" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover filter contrast-[1.08] saturate-[0.88] brightness-[0.98] transition-all duration-700 hover:contrast-[1.12] hover:saturate-[0.95] ${
          isLoading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-black/10 mix-blend-multiply" />
    </div>
  );
}

// ==========================================
// 3. NAVIGATION & MANDATORY 14K TRUST MARQUEE
// ==========================================
function Navbar() {
  const {
    currentView,
    navigate,
    itemCount,
    setIsCartOpen,
    currencyMode,
    setCurrencyMode,
    orders,
    theme,
    toggleTheme,
    wishlist,
  } = useContext(AppContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (!navSearchQuery.trim()) return;
    navigate('atelier', { searchQuery: navSearchQuery.trim() });
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. AVIORA JEWELLS REFINED UTILITY & ANNOUNCEMENT BAR */}
      <div className="bg-[#1d4136] text-[#fbf8f3] dark:bg-[#11241e] py-1.5 px-4 sm:px-8 select-none font-sans text-[10.5px] tracking-[0.16em] uppercase flex justify-between items-center border-b border-black/10 transition-colors duration-300">
        <div className="flex-1 text-center truncate pr-2 font-medium">
          <span>✦ TIMELESS 14K GOLD PLATED BIS 925 SILVER • 100% WATERPROOF • FREE PAN-INDIA EXPRESS ✦</span>
        </div>

        <div className="hidden md:flex items-center space-x-3.5 shrink-0 text-[10px] font-mono border-l border-white/20 pl-4">
          {/* Subtle Currency Switcher */}
          <div className="flex items-center space-x-1 opacity-90 hover:opacity-100">
            <button
              onClick={() => setCurrencyMode('INR')}
              className={`px-1 py-0.5 transition-all ${currencyMode === 'INR' ? 'font-bold text-[#e6ca97] underline underline-offset-2' : 'text-white/70 hover:text-white'}`}
            >
              ₹ INR
            </button>
            <span className="text-white/30">/</span>
            <button
              onClick={() => setCurrencyMode('USD')}
              className={`px-1 py-0.5 transition-all ${currencyMode === 'USD' ? 'font-bold text-[#e6ca97] underline underline-offset-2' : 'text-white/70 hover:text-white'}`}
            >
              $ USD
            </button>
          </div>

          <span className="text-white/30">•</span>

          {/* Discreet Curator Vault Access */}
          <button
            onClick={() => navigate('admin')}
            className="text-white/75 hover:text-[#e6ca97] flex items-center gap-1 transition-colors"
            title="Atelier Curator Vault & Product Management"
          >
            <Lock className="w-3 h-3" />
            <span>Curator Vault</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER (UNCLUTTERED, ELEGANT, SPACIOUS) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/96 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 shadow-sm'
            : 'bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-4">
          
          {/* Mobile Left: Menu Hamburger Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-[var(--text-primary)] hover:text-[#b99762] transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Identity / Wordmark */}
          <button
            onClick={() => navigate('home')}
            className="group flex flex-col text-center lg:text-left focus:outline-none shrink-0"
          >
            <div className="flex items-baseline justify-center lg:justify-start gap-1">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] uppercase font-normal text-[var(--text-primary)] transition-transform duration-300 group-hover:scale-101">
                AVIORA
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.22em] italic uppercase text-[#b99762]">
                JEWELLS
              </span>
            </div>
            <span className="hidden sm:block text-[7.5px] font-mono tracking-[0.36em] uppercase text-[var(--text-muted)] -mt-0.5">
              14K GOLD & 925 SILVER ATELIER
            </span>
          </button>

          {/* Center Navigation (Desktop Only) - Balanced & Refined */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[12px] font-sans tracking-[0.16em] uppercase font-medium">
            <button
              onClick={() => navigate('atelier', { category: '' })}
              className={`transition-colors hover:text-[#b99762] py-1 relative ${
                currentView === 'atelier' ? 'text-[#b99762] font-semibold' : 'text-[var(--text-primary)]'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'earrings' })}
              className="text-[var(--text-secondary)] hover:text-[#b99762] transition-colors py-1"
            >
              Earrings
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'necklaces' })}
              className="text-[var(--text-secondary)] hover:text-[#b99762] transition-colors py-1"
            >
              Necklaces
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'bracelets' })}
              className="text-[var(--text-secondary)] hover:text-[#b99762] transition-colors py-1"
            >
              Bracelets
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'rings' })}
              className="text-[var(--text-secondary)] hover:text-[#b99762] transition-colors py-1"
            >
              Rings
            </button>
            {/* Direct shortcut to Light & Heavy Curation */}
            <button
              onClick={() => {
                if (currentView === 'home') {
                  document.getElementById('light-heavy-spectrum')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('home');
                  setTimeout(() => {
                    document.getElementById('light-heavy-spectrum')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }
              }}
              className="text-[#1d4136] dark:text-[#e6ca97] font-bold hover:text-[#b99762] transition-colors py-1 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Light & Heavy</span>
            </button>
            <button
              onClick={() => navigate('atelier', { collection: 'gift-edit' })}
              className="text-[var(--text-secondary)] hover:text-[#b99762] transition-colors py-1"
            >
              Gifting
            </button>
          </nav>

          {/* Right Action Icons Suite (Clean, Minimal, Non-Cluttered) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 text-[var(--text-primary)] hover:text-[#b99762] transition-colors"
              title="Search collection"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Wishlist Link (Tablet/Desktop) */}
            <button
              onClick={() => navigate('atelier', { wishlistOnly: true })}
              className="p-1.5 sm:p-2 text-[var(--text-primary)] hover:text-rose-500 transition-colors relative hidden sm:block"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${wishlist?.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist?.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-mono font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders Tracker Link (Desktop) */}
            <button
              onClick={() => navigate('orders')}
              className="p-1.5 sm:p-2 text-[var(--text-primary)] hover:text-[#b99762] transition-colors relative hidden md:block"
              title="Track Blue Dart Logistics"
              aria-label="Track Orders"
            >
              <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {orders?.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[8px] font-mono font-bold flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Sleek Theme Mode Toggle (Circular icon button, zero clutter) */}
            <button
              onClick={toggleTheme}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:border-[#b99762] hover:text-[#b99762] bg-[var(--bg-secondary)] transition-all"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle light and dark mode"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-[#1d4136]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#e6ca97]" />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-primary)] transition-all group"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--text-primary)] group-hover:text-[#b99762] transition-colors" />
              <span className="text-[11px] font-mono font-bold bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-[#242321] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Slide-Down Quick Search Bar */}
        {searchOpen && (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 sm:px-8 md:px-12 py-3 shadow-md animate-fadeIn">
            <form onSubmit={handleNavSearch} className="max-w-4xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <input
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search 14K gold plated & 925 silver jewellery (e.g. Kada, Ear Cuffs, Choker, Light Rings)..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm font-sans text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none py-1"
                autoFocus
              />
              {navSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNavSearchQuery('')}
                  className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 3. LUXURY TOUCH-FIRST MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu Panel */}
            <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-[var(--bg-card)] border-r border-[var(--border-subtle)] p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl tracking-[0.16em] uppercase text-[var(--text-primary)]">
                      AVIORA
                    </span>
                    <span className="font-sans text-[10px] font-bold tracking-[0.22em] italic uppercase text-[#b99762]">
                      JEWELLS
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* In-Drawer Quick Search */}
                <form onSubmit={handleNavSearch} className="my-5 relative">
                  <input
                    type="text"
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                    placeholder="Search jewellery..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] pl-9 pr-4 py-2.5 text-xs font-sans text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none rounded"
                  />
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                </form>

                {/* Primary Category Links */}
                <nav className="space-y-1 font-sans text-xs tracking-[0.14em] uppercase font-medium">
                  <button
                    onClick={() => {
                      navigate('atelier', { category: '' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-2 flex items-center justify-between text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors font-bold"
                  >
                    <span>The Atelier (Shop All)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'earrings' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Earrings & Hoops</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'necklaces' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Necklaces & Chokers</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'bracelets' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Bracelets & Kadas</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'rings' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Rings & Solitaires</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>

                  {/* Weight Spectrum Direct Mobile Shortcuts */}
                  <div className="pt-2 pb-1 border-t border-[var(--border-subtle)] my-2">
                    <p className="px-2 text-[9px] font-mono tracking-[0.25em] text-[#b99762] dark:text-[#e6ca97] uppercase mb-1">
                      Weight Curation
                    </p>
                    <button
                      onClick={() => {
                        navigate('atelier', { weightFilter: 'light' });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-2 flex items-center justify-between text-[#1d4136] dark:text-[#e6ca97] font-semibold hover:bg-[var(--bg-secondary)] rounded transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        The Delicate & Light Edit (0–8g)
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Everyday</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('atelier', { weightFilter: 'heavy' });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-2 flex items-center justify-between text-[#1d4136] dark:text-[#e6ca97] font-semibold hover:bg-[var(--bg-secondary)] rounded transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b99762]" />
                        The Sculptural & Heavy Edit (15–40g)
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Statement</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigate('atelier', { collection: 'gift-edit' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Curated Gift Sets</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                </nav>
              </div>

              {/* Drawer Bottom Utilities */}
              <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <button
                    onClick={() => {
                      navigate('orders');
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[var(--text-primary)] font-medium"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#1d4136] dark:text-[#e6ca97]" />
                    <span>Track Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { wishlistOnly: true });
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[var(--text-primary)] font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Wishlist ({wishlist?.length || 0})</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                    <span>Currency:</span>
                    <button
                      onClick={() => setCurrencyMode(currencyMode === 'INR' ? 'USD' : 'INR')}
                      className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold"
                    >
                      {currencyMode === 'INR' ? '₹ INR' : '$ USD'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="text-[11px] font-mono text-[#b99762] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Curator Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// ==========================================
// 4. CART DRAWER WITH IN-DRAWER 14K UPSELL
// ==========================================
function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, addToCart, cartTotal, itemCount, formatPrice, navigate, orders } =
    useContext(AppContext);

  const FREE_SHIPPING_THRESHOLD = 1999;
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const upsellProduct = useMemo(() => {
    if (cart.length === 0) return undefined;
    for (const item of cart) {
      if (item.product.pairsWithId) {
        const match = PRODUCTS.find((p) => p.id === item.product.pairsWithId);
        if (match && !cart.some((c) => c.product.id === match.id)) return match;
      }
    }
    return PRODUCTS.find((p) => !cart.some((c) => c.product.id === p.id));
  }, [cart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--bg-card)] text-[var(--text-primary)] border-l border-[var(--border-subtle)] shadow-2xl z-[90] flex flex-col justify-between overflow-hidden transition-colors duration-300"
          >
            <div className="px-8 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] font-sans uppercase text-[#1d4136] dark:text-[#e6ca97] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  CURATED SHOPPING BAG
                </span>
                <h2 className="font-serif text-2xl tracking-wide text-[var(--text-primary)] mt-0.5">
                  Your Collection ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--bg-stone)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Gamification Progress Bar */}
            <div className="bg-[var(--bg-secondary)] px-8 py-3 border-b border-[var(--border-subtle)] space-y-1.5">
              <div className="flex justify-between text-[11px] font-sans text-[var(--text-secondary)]">
                {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked: FREE Express Pan-India Delivery!
                  </span>
                ) : (
                  <span>
                    You are <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)}</strong> away from Free Express Delivery
                  </span>
                )}
                <span className="text-[var(--text-muted)] font-bold">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1 bg-[var(--bg-stone)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#b99762] to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5 divide-y divide-[var(--border-subtle)]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 rounded-full border border-dashed border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)]">
                    <span className="font-mono text-xs">00</span>
                  </div>
                  <p className="font-serif italic text-lg text-[var(--text-secondary)]">
                    Your collection bag is empty.
                  </p>
                  <div className="flex flex-col gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('atelier');
                      }}
                      className="px-6 py-2.5 text-xs font-sans font-bold tracking-[0.14em] uppercase border border-[var(--border-strong)] hover:border-[#1d4136] text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] transition-all"
                    >
                      Enter Atelier
                    </button>
                    {orders.length > 0 && (
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('orders');
                        }}
                        className="px-6 py-2.5 text-xs font-sans font-bold tracking-[0.12em] uppercase bg-[var(--bg-secondary)] hover:bg-[var(--bg-stone)] border border-[var(--border-subtle)] text-[#b99762] transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Past Orders ({orders.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                cart.map(({ product, quantity, engraving }) => (
                  <div key={product.id} className="pt-5 first:pt-0 flex gap-4">
                    <div className="relative w-18 h-22 flex-shrink-0 bg-[var(--bg-stone)] overflow-hidden border border-[var(--border-subtle)]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#b99762]">
                              {product.goldPurity || '14K Gold'}
                            </span>
                            <h4 className="font-sans font-semibold text-sm text-[var(--text-primary)] leading-snug">
                              {product.name}
                            </h4>
                          </div>
                          <span className="font-sans text-sm text-[var(--text-primary)] font-bold">
                            {formatPrice(product.price * quantity)}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-sans mt-0.5 line-clamp-1">
                          {product.material}
                        </p>
                        {engraving && (
                          <p className="text-[10px] font-sans text-[#b99762] mt-0.5">
                            Engraving: &ldquo;{engraving}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
                        <div className="flex items-center border border-[var(--border-strong)] rounded bg-[var(--bg-primary)]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-xs text-[var(--text-primary)] font-bold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[10px] font-sans font-bold tracking-widest uppercase text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* In-Drawer Upsells Module */}
              {upsellProduct && cart.length > 0 && (
                <div className="pt-5 mt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1d4136] dark:text-[#e6ca97] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Pairs beautifully with...
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-muted)]">14K SUITE</span>
                  </div>

                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3.5 group hover:border-[#b99762]/50 transition-colors">
                    <div className="relative w-14 h-16 flex-shrink-0 bg-[var(--bg-stone)] overflow-hidden border border-[var(--border-subtle)]">
                      <img
                        src={upsellProduct.images[0]}
                        alt={upsellProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-sans font-semibold text-xs text-[var(--text-primary)] truncate group-hover:text-[#b99762] transition-colors">
                        {upsellProduct.name}
                      </h5>
                      <p className="text-[10px] font-sans text-[var(--text-secondary)]">
                        {formatPrice(upsellProduct.price)}
                      </p>
                      <p className="text-[9px] font-mono text-[var(--text-muted)] truncate">
                        {upsellProduct.colorTone}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(upsellProduct, 1)}
                      className="px-3 py-1.5 bg-[var(--bg-primary)] hover:bg-[#1d4136] hover:text-white dark:hover:bg-[#e6ca97] dark:hover:text-black text-[var(--text-primary)] text-[10px] font-sans uppercase tracking-wider font-bold border border-[var(--border-strong)] transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-3.5">
                <div className="flex items-center justify-between text-[10px] font-sans font-bold tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#1d4136] dark:text-[#e6ca97]" /> Blue Dart Express
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1d4136] dark:text-[#e6ca97]" /> 14K Lifetime Warranty
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-sans font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] block">
                      Subtotal
                    </span>
                    <span className="text-[10px] font-sans text-[var(--text-muted)]">
                      Includes 3% GST & Insured Packaging
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-2xl text-[var(--text-primary)] font-bold">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('checkout');
                  }}
                  className="w-full py-4 bg-[#1d4136] hover:bg-[#132f27] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black font-sans text-xs tracking-[0.18em] uppercase font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-md group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 5. PRODUCT CARD COMPONENT (AVIORA EDITORIAL CARD)
// ==========================================
function ProductArtworkCard({ product, index = 0, compact = false }) {
  const { navigate, addToCart, formatPrice, wishlist, toggleWishlist } = useContext(AppContext);
  const isWishlisted = wishlist?.includes(product.id);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasSecondaryImage = product.images && product.images.length > 1;

  // Format material display
  const materialDisplay =
    product.materials && product.materials.length > 0
      ? product.materials
          .map((m) =>
            m === 'gold-plated-14k'
              ? '14K Gold-Plated'
              : m === 'sterling-silver-925'
              ? '925 Silver'
              : m === 'freshwater-pearls'
              ? 'Freshwater Pearls'
              : m === 'moissanite'
              ? 'Moissanite'
              : m
          )
          .slice(0, 2)
          .join(' · ')
      : product.goldPurity || product.material || '14K Gold Plated · BIS 925 Silver';

  return (
    <article
      className={`group cursor-pointer block select-none ${compact ? 'max-w-[280px]' : 'w-full'}`}
      onClick={() => navigate('pdp', product)}
    >
      <div className="relative aspect-[0.78] w-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] border border-[var(--border-subtle)] transition-colors duration-300">
        {/* Badge: New or Sale */}
        {product.isNew ? (
          <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-[var(--badge-bg)] text-[var(--text-primary)] text-[9px] font-sans font-bold tracking-[0.14em] uppercase border border-[var(--border-subtle)] shadow-xs">
            New
          </span>
        ) : discount ? (
          <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-[#1d4136] text-[#fbf8f3] text-[9px] font-sans font-semibold tracking-wider uppercase">
            {discount}% Off
          </span>
        ) : null}

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-card)]/85 hover:bg-[var(--bg-card)] backdrop-blur-xs transition-all border border-[var(--border-subtle)] shadow-xs ${
            isWishlisted ? 'text-rose-500' : 'text-[var(--text-secondary)] hover:text-rose-500'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-103 ${
            hasSecondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />

        {/* Secondary Image for smooth crossfade on hover */}
        {hasSecondaryImage && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-103"
          />
        )}

        {/* Quick Add Button sliding up on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="absolute bottom-2.5 inset-x-2.5 z-20 py-2.5 px-3 bg-[var(--bg-primary)]/95 dark:bg-[#202622]/95 hover:bg-[#1d4136] dark:hover:bg-[#2a5849] hover:text-white dark:hover:text-white text-[var(--text-primary)] border border-[var(--border-strong)] text-[10px] font-sans font-bold tracking-[0.14em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3 h-3" />
          <span>Quick add</span>
        </button>
      </div>

      {/* Copy row */}
      <div className="pt-3 px-0.5 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sans font-semibold text-[13px] sm:text-[14px] text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] truncate tracking-normal transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5 shrink-0">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] font-sans text-[var(--text-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-sans font-semibold text-[13px] sm:text-[14px] text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <p className="text-[11px] font-sans text-[var(--text-muted)] truncate tracking-normal">
          {materialDisplay}
        </p>
      </div>
    </article>
  );
}

// ==========================================
// 6. VIEW: HOMEPAGE (REFERENCE EDITORIAL ALIGNMENT)
// ==========================================
function HomeView() {
  const { navigate, products, showToast, formatPrice } = useContext(AppContext);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [weightTab, setWeightTab] = useState('light'); // 'light' | 'heavy'

  const newArrivals = useMemo(() => {
    const arr = products.filter((p) => p.isNew);
    return (arr.length >= 4 ? arr : products).slice(0, 4);
  }, [products]);

  const selectedPieces = useMemo(() => {
    return [...products]
      .sort((a, b) => (a.featuredRank || 99) - (b.featuredRank || 99))
      .slice(0, 4);
  }, [products]);

  const lightJewellery = useMemo(() => {
    const list = products.filter((p) => {
      const match = (p.weight || '').match(/([\d.]+)/);
      const grams = match ? parseFloat(match[1]) : 6;
      return grams < 10;
    });
    return (list.length >= 4 ? list : products).slice(0, 4);
  }, [products]);

  const heavyJewellery = useMemo(() => {
    const list = products.filter((p) => {
      const match = (p.weight || '').match(/([\d.]+)/);
      const grams = match ? parseFloat(match[1]) : 20;
      return grams >= 10;
    });
    return (list.length >= 4 ? list : products).slice(0, 4);
  }, [products]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('✦ Welcome to the Aviora Insider Circle');
    setNewsletterEmail('');
    setNewsletterName('');
  };

  return (
    <div className="relative w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* 1. HERO SECTION (CRISP HIGH-CONTRAST IN LIGHT & DARK MODES) */}
      <section className="relative min-h-[660px] md:min-h-[740px] w-full flex items-end overflow-hidden bg-[var(--bg-stone)]">
        <img
          src={STORE_CONFIG.hero.image}
          alt={STORE_CONFIG.hero.alt}
          className="absolute inset-0 w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
          fetchPriority="high"
        />
        {/* Subtle directional vignette for enhanced legibility and warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 md:bg-gradient-to-r md:from-black/55 md:via-black/20 md:to-transparent pointer-events-none" />

        {/* Elevated Editorial Card - Solid High-Contrast Architecture */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-lg bg-[#fffdfa] dark:bg-[#141816] p-8 sm:p-10 md:p-12 border border-[#d8c39f]/50 dark:border-white/15 shadow-2xl shadow-black/25 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b99762] animate-pulse" />
              <p className="text-[10.5px] font-sans font-bold tracking-[0.24em] uppercase text-[#1d4136] dark:text-[#e6ca97]">
                {STORE_CONFIG.hero.eyebrow}
              </p>
            </div>
            
            {/* "Timeless pieces for every moment." - High Contrast Crisp Display */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#181614] dark:text-[#fbf8f3] tracking-tight leading-[1.02] font-normal">
              {STORE_CONFIG.hero.title}
            </h1>
            
            <p className="text-sm sm:text-base font-sans text-[#423c34] dark:text-[#c9ceca] leading-relaxed">
              {STORE_CONFIG.hero.body}
            </p>

            {/* Hallmarked Micro-Badges */}
            <div className="pt-2 pb-2 border-y border-[#181614]/10 dark:border-white/10 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono tracking-wider text-[#685f52] dark:text-[#a0a8a3]">
              <span className="flex items-center gap-1">✦ 14K Gold Plated</span>
              <span className="flex items-center gap-1">✦ BIS 925 Silver Core</span>
              <span className="flex items-center gap-1">✦ 100% Waterproof</span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => navigate('atelier', { collection: 'new-arrivals' })}
                className="px-6 py-3.5 bg-[#1d4136] hover:bg-[#132f27] text-[#fbf8f3] dark:bg-[#e6ca97] dark:text-[#141816] dark:hover:bg-[#d8c39f] font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Shop new arrivals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('atelier', {})}
                className="px-6 py-3.5 bg-white/70 hover:bg-white text-[#181614] dark:bg-white/5 dark:hover:bg-white/10 dark:text-[#fbf8f3] border border-[#181614]/30 dark:border-white/25 font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all"
              >
                Explore collections
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Find your everyday piece.
            </h2>
          </div>
          <button
            onClick={() => navigate('atelier', {})}
            className="text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors self-start sm:self-end"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STORE_CONFIG.categories.slice(0, 4).map((category) => (
            <button
              key={category.id}
              onClick={() => navigate('atelier', { category: category.id })}
              className="group text-left block focus:outline-none"
            >
              <div className="aspect-[0.82] w-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] border border-[var(--border-subtle)] mb-3">
                <img
                  src={category.image}
                  alt={category.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[#1d4136] dark:group-hover:text-[#e6ca97] transition-colors">
                  {category.label}
                </span>
                <span className="w-7 h-7 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] group-hover:border-[#1d4136] group-hover:bg-[#1d4136] group-hover:text-white dark:group-hover:border-[#e6ca97] dark:group-hover:bg-[#e6ca97] dark:group-hover:text-black transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2.5 CREATION SECTION: LIGHT & HEAVY JEWELLERY */}
      <section id="light-heavy-spectrum" className="bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] py-20 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] text-[10px] font-mono tracking-widest uppercase font-semibold">
                <Scale className="w-3.5 h-3.5" />
                <span>The Creation Spectrum • Weight-Calibrated Ateliers</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
                Light vs Heavy Jewellery: Choose Your Presence
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Every Aviora creation is cast in BIS 925 Sterling Silver with a heavy 2.5µm 14K Gold Vermeil jacket. Select between featherlight second-skin stacks designed for uninterrupted 24/7 wear, or dense sculptural statement heirlooms forged with substantial hand-feel.
              </p>
            </div>

            {/* Interactive Weight Segment Tabs */}
            <div className="inline-flex p-1 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-full self-start md:self-end shadow-sm">
              <button
                onClick={() => setWeightTab('light')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs font-sans font-bold tracking-[0.14em] uppercase transition-all ${
                  weightTab === 'light'
                    ? 'bg-[#1d4136] text-white dark:bg-[#e6ca97] dark:text-black shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Delicate & Light (0–8g)</span>
              </button>
              <button
                onClick={() => setWeightTab('heavy')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs font-sans font-bold tracking-[0.14em] uppercase transition-all ${
                  weightTab === 'heavy'
                    ? 'bg-[#1d4136] text-white dark:bg-[#e6ca97] dark:text-black shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sculptural & Heavy (15–40g)</span>
              </button>
            </div>
          </div>

          {/* Educational Spectrum Descriptor Banner */}
          <div className="p-5 sm:p-6 rounded-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1d4136] dark:text-[#e6ca97] flex items-center gap-2">
                <span>{weightTab === 'light' ? '✦ The Feathertouch Edit (0–8 Grams)' : '✦ The Architectural High-Mass Edit (15–40 Grams)'}</span>
              </p>
              <p className="text-xs font-sans text-[var(--text-secondary)] max-w-2xl">
                {weightTab === 'light'
                  ? 'Engineered for zero-drag comfort. Sleep-safe, gym-proof, and designed to layer 3+ pieces effortlessly on ears, neck, and fingers without earlobe stretching or skin indentation.'
                  : 'Solid core casting with commanding tactile heft. Hand-burnished by Mumbai master goldsmiths for galas, festive banquets, and high-presence styling that commands the room.'}
              </p>
            </div>
            <button
              onClick={() => navigate('atelier', { weightFilter: weightTab })}
              className="shrink-0 text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{weightTab === 'light' ? 'Shop all delicate pieces (<10g)' : 'Shop all heavy heirlooms (10g+)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Curated Products Grid for Selected Weight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(weightTab === 'light' ? lightJewellery : heavyJewellery).map((product) => (
              <div key={product.id} className="group flex flex-col justify-between bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#b99762] transition-all duration-300 p-3 sm:p-4 rounded-xs shadow-xs hover:shadow-md">
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#191e1b] mb-3">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Verified Gram Weight Luxury Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-xs text-white text-[9.5px] font-mono tracking-wider rounded-xs flex items-center gap-1 border border-white/20">
                    <Scale className="w-3 h-3 text-[#e6ca97]" />
                    <span>{product.weight || (weightTab === 'light' ? '4.8g' : '28.4g')}</span>
                  </div>
                  {/* Purity Tag */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-[#1d4136]/90 text-[#e6ca97] text-[8.5px] font-mono tracking-wider uppercase rounded-xs">
                    14K / 925 Silver
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-mono tracking-wider text-[var(--text-muted)] uppercase truncate">
                      {product.subtitle || 'Aviora Atelier Series'}
                    </p>
                    <h3 className="font-serif text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#1d4136] dark:group-hover:text-[#e6ca97] transition-colors line-clamp-1 font-normal">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => navigate('pdp', product)}
                      className="text-[10px] font-sans font-bold tracking-wider uppercase text-[#1d4136] dark:text-[#e6ca97] hover:underline"
                    >
                      View Piece →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. JUST IN (NEW ARRIVALS TINTED SECTION) */}
      <section className="bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] py-20 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
                JUST IN
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
                New arrivals.
              </h2>
            </div>
            <button
              onClick={() => navigate('atelier', { collection: 'new-arrivals' })}
              className="text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, idx) => (
              <ProductArtworkCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. MATERIAL-LED SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="mb-10">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
            MATERIAL-LED
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
            Consider the details.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STORE_CONFIG.materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => navigate('atelier', { material: mat.id })}
              className="group relative aspect-[0.82] w-full overflow-hidden text-left bg-[var(--bg-stone)] border border-[var(--border-subtle)] focus:outline-none"
            >
              <img
                src={mat.image}
                alt={mat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                  {mat.label}
                </h3>
                <p className="text-[10px] font-sans tracking-wide text-zinc-300 line-clamp-1 opacity-90">
                  {mat.desc}
                </p>
                <div className="pt-2 border-t border-white/40 flex items-center justify-between text-[9px] font-sans font-bold tracking-[0.14em] uppercase text-zinc-200 group-hover:text-white">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. THE EVERYDAY EDIT (EDITORIAL SPLIT SECTION) */}
      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
          <div className="relative min-h-[380px] md:min-h-full overflow-hidden bg-[var(--bg-stone)]">
            <img
              src={STORE_CONFIG.editorial.image}
              alt={STORE_CONFIG.editorial.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20 bg-[var(--bg-secondary)] dark:bg-[#131715] space-y-6">
            <p className="font-script text-4xl sm:text-5xl text-[#b99762] dark:text-[#e6ca97] -mb-2">
              The everyday edit
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] font-normal tracking-tight leading-[0.96]">
              {STORE_CONFIG.editorial.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
              {STORE_CONFIG.editorial.body} We exclusively cast in 14K Gold Plated Vermeil over BIS 925 sterling silver for superior hardness and permanent waterproof wear.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('atelier', { collection: 'everyday-edit' })}
                className="text-xs font-sans font-bold tracking-[0.14em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b-2 border-current pb-1 inline-flex items-center gap-2 transition-colors"
              >
                <span>Shop the edit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SELECTED PIECES (THE AVIORA EDIT) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
              THE AVIORA EDIT
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Selected pieces.
            </h2>
          </div>
          <button
            onClick={() => navigate('atelier', {})}
            className="text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {selectedPieces.map((product, idx) => (
            <ProductArtworkCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* 7. THE GIFT EDIT FULL-WIDTH BANNER */}
      <section className="relative min-h-[480px] md:min-h-[540px] flex items-center overflow-hidden bg-[#132f27]">
        <img
          src={STORE_CONFIG.gifting.image}
          alt={STORE_CONFIG.gifting.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#132f27]/75 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-16 text-[#fbf8f3] space-y-6">
          <p className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#d8c39f]">
            THE GIFT EDIT
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight max-w-xl leading-[0.95]">
            {STORE_CONFIG.gifting.title}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed">
            Presented in our signature keepsake box with tamper-proof wax seal and official BIS 925 authenticity certificate.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('atelier', { collection: 'gift-edit' })}
              className="px-8 py-3.5 bg-[#fbf8f3] hover:bg-[#d8c39f] text-[#132f27] font-sans text-xs font-bold tracking-[0.14em] uppercase transition-colors shadow-lg"
            >
              Shop gifts
            </button>
          </div>
        </div>
      </section>

      {/* 8. THE AVIORA PROMISE (4 TRUST PILLARS) */}
      <section className="border-b border-[var(--border-subtle)] py-20 px-6 md:px-12 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
              OUR APPROACH
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              The Aviora Promise.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STORE_CONFIG.promises.map((promise, index) => (
              <div
                key={index}
                className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[#b99762]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[var(--text-primary)] font-normal">
                  {promise.title}
                </h3>
                <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
                  {promise.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SEEN ON AVIORA (SOCIAL GRID) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] mb-2">
              SOCIAL
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Seen on Aviora.
            </h2>
          </div>
          <a
            href={STORE_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#1d4136] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors self-start sm:self-end"
          >
            <span>{STORE_CONFIG.brand.instagram}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
          ].map((imgUrl, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden bg-[var(--bg-stone)] border border-[var(--border-subtle)]"
            >
              <img
                src={imgUrl}
                alt={`Aviora patron style ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 10. NEWSLETTER (STAY IN THE KNOW) */}
      <section className="bg-[#1d4136] dark:bg-[#132f27] text-[#fbf8f3] py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#d8c39f]">
              STAY IN THE KNOW
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[0.97]">
              A little sparkle in your inbox.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-md leading-relaxed">
              Join 45,000+ patrons for early private collection access, rare gem insights, and private VIP salon invitations.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="space-y-3 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                required
                className="w-full h-12 px-4 bg-transparent border border-[#fbf8f3]/40 focus:border-[#fbf8f3] text-sm font-sans text-white placeholder-zinc-400 outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-transparent border border-[#fbf8f3]/40 focus:border-[#fbf8f3] text-sm font-sans text-white placeholder-zinc-400 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-[#fbf8f3] hover:bg-[#d8c39f] text-[#1d4136] font-sans text-xs font-bold tracking-[0.16em] uppercase transition-colors shadow-md"
            >
              Subscribe to Aviora
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 7. VIEW: THE ATELIER (FULL REFERENCE FILTERS & CATALOG)
// ==========================================
function ShopView() {
  const {
    products,
    formatPrice,
    categoryFilter,
    setCategoryFilter,
    materialFilter,
    setMaterialFilter,
    collectionFilter,
    setCollectionFilter,
    weightFilter,
    setWeightFilter,
  } = useContext(AppContext);

  // Filter States matching reference app
  const [selectedCategory, setSelectedCategory] = useState(() => categoryFilter || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState(() => materialFilter || 'all');
  const [selectedCollection, setSelectedCollection] = useState(() => collectionFilter || 'all');
  const [selectedWeight, setSelectedWeight] = useState(() => weightFilter || 'all');
  const [selectedColour, setSelectedColour] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Sync external filters
  useEffect(() => {
    if (categoryFilter) setSelectedCategory(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    if (materialFilter) setSelectedMaterial(materialFilter);
  }, [materialFilter]);

  useEffect(() => {
    if (collectionFilter) setSelectedCollection(collectionFilter);
  }, [collectionFilter]);

  useEffect(() => {
    if (weightFilter) setSelectedWeight(weightFilter);
  }, [weightFilter]);

  // Unique attribute options from products
  const uniqueColours = useMemo(() => {
    const list = products.map((p) => p.colour || p.colorTone).filter(Boolean);
    return [...new Set(list)];
  }, [products]);

  const uniqueFinishes = useMemo(() => {
    const list = products.map((p) => p.finish).filter(Boolean);
    return [...new Set(list)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.category === selectedCategory ||
          p.categorySlug === selectedCategory ||
          (selectedCategory === 'earrings' && p.categorySlug?.includes('ear')) ||
          (selectedCategory === 'necklaces' && (p.categorySlug?.includes('choker') || p.categorySlug?.includes('hasli'))) ||
          (selectedCategory === 'bracelets' && (p.categorySlug?.includes('kada') || p.categorySlug?.includes('bangle'))) ||
          (selectedCategory === 'rings' && p.categorySlug?.includes('ring'))
      );
    }

    // Material
    if (selectedMaterial !== 'all') {
      list = list.filter(
        (p) =>
          p.materials?.includes(selectedMaterial) ||
          p.material?.toLowerCase().includes(selectedMaterial.replace(/-/g, ' '))
      );
    }

    // Collection
    if (selectedCollection !== 'all') {
      list = list.filter(
        (p) =>
          p.collections?.includes(selectedCollection) ||
          (selectedCollection === 'new-arrivals' && p.isNew)
      );
    }

    // Colour
    if (selectedColour !== 'all') {
      list = list.filter(
        (p) =>
          (p.colour && p.colour.toLowerCase() === selectedColour.toLowerCase()) ||
          (p.colorTone && p.colorTone.toLowerCase() === selectedColour.toLowerCase())
      );
    }

    // Finish
    if (selectedFinish !== 'all') {
      list = list.filter(
        (p) => p.finish && p.finish.toLowerCase() === selectedFinish.toLowerCase()
      );
    }

    // Availability
    if (selectedAvailability === 'available') {
      list = list.filter((p) => p.inStock !== false && (p.inventory === undefined || p.inventory > 0));
    } else if (selectedAvailability === 'sold-out') {
      list = list.filter((p) => p.inStock === false || p.inventory === 0);
    }

    // Price
    if (selectedPrice === 'under-3000') {
      list = list.filter((p) => p.price < 3000);
    } else if (selectedPrice === '3000-5000') {
      list = list.filter((p) => p.price >= 3000 && p.price <= 5000);
    } else if (selectedPrice === 'over-5000') {
      list = list.filter((p) => p.price > 5000);
    }

    // Weight Spectrum (Delicate < 10g vs Sculptural >= 10g)
    if (selectedWeight !== 'all') {
      list = list.filter((p) => {
        const match = (p.weight || '').match(/([\d.]+)/);
        const grams = match ? parseFloat(match[1]) : 10;
        if (selectedWeight === 'light') return grams < 10;
        if (selectedWeight === 'heavy') return grams >= 10;
        return true;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sorters = {
      featured: (a, b) => (a.featuredRank || 99) - (b.featuredRank || 99),
      newest: (a, b) => Number(b.isNew || 0) - Number(a.isNew || 0),
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      'name-az': (a, b) => a.name.localeCompare(b.name),
    };

    return list.sort(sorters[sortBy] || sorters.featured);
  }, [
    products,
    selectedCategory,
    selectedMaterial,
    selectedCollection,
    selectedWeight,
    selectedColour,
    selectedFinish,
    selectedAvailability,
    selectedPrice,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterial !== 'all') count++;
    if (selectedCollection !== 'all') count++;
    if (selectedWeight !== 'all') count++;
    if (selectedColour !== 'all') count++;
    if (selectedFinish !== 'all') count++;
    if (selectedAvailability !== 'all') count++;
    if (selectedPrice !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCategory,
    selectedMaterial,
    selectedCollection,
    selectedWeight,
    selectedColour,
    selectedFinish,
    selectedAvailability,
    selectedPrice,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedCollection('all');
    setSelectedWeight('all');
    setSelectedColour('all');
    setSelectedFinish('all');
    setSelectedAvailability('all');
    setSelectedPrice('all');
    setSearchQuery('');
    setCategoryFilter('');
    setMaterialFilter('');
    setCollectionFilter('');
    setWeightFilter('');
  };

  // Header Title and Eyebrow
  const pageTitle = useMemo(() => {
    if (searchQuery.trim()) return `Results for “${searchQuery}”`;
    if (selectedCollection !== 'all') {
      const col = STORE_CONFIG.collections.find((c) => c.id === selectedCollection);
      if (col) return col.label;
    }
    if (selectedCategory !== 'all') {
      const cat = STORE_CONFIG.categories.find((c) => c.id === selectedCategory);
      if (cat) return cat.label;
    }
    return 'Shop all jewellery.';
  }, [searchQuery, selectedCollection, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-8">
        {/* Intro Section */}
        <div className="border-b border-[var(--border-subtle)] pb-10 text-center max-w-2xl mx-auto space-y-3">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97]">
            {selectedCollection !== 'all' ? 'THE COLLECTION' : searchQuery ? 'SEARCH' : 'THE AVIORA EDIT'}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            {pageTitle}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Explore the current Aviora edit across delicate everyday and gifting pieces cast in 14K Gold Plated Vermeil and BIS 925 sterling silver.
          </p>
        </div>

        {/* Sticky Controls Bar */}
        <div className="sticky top-[68px] z-30 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 -mx-6 px-6 md:-mx-12 md:px-12 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-bold tracking-[0.12em] uppercase border transition-all ${
                filterPanelOpen || activeFilterCount > 0
                  ? 'border-[#1d4136] bg-[#1d4136] text-white dark:border-[#e6ca97] dark:bg-[#e6ca97] dark:text-black'
                  : 'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:border-[#1d4136]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-sans font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-strong)] text-xs font-sans font-semibold px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">New arrivals</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name-az">Name: A–Z</option>
              </select>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          <AnimatePresence>
            {filterPanelOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-[var(--border-subtle)] mt-3 pt-6 pb-2"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl text-[var(--text-primary)]">
                    Refine your edit
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs font-sans font-bold tracking-[0.1em] uppercase text-[#1d4136] dark:text-[#e6ca97] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* 7 Filter Selectors Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-sans">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All categories</option>
                      {STORE_CONFIG.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Material
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All materials</option>
                      {STORE_CONFIG.materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight Spectrum */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[#1d4136] dark:text-[#e6ca97] font-semibold mb-1">
                      ⚖ Weight Curation
                    </label>
                    <select
                      value={selectedWeight}
                      onChange={(e) => setSelectedWeight(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All weight ranges</option>
                      <option value="light">Delicate & Light (&lt;10g)</option>
                      <option value="heavy">Sculptural & Heavy (10g+)</option>
                    </select>
                  </div>

                  {/* Colour */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Colour
                    </label>
                    <select
                      value={selectedColour}
                      onChange={(e) => setSelectedColour(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All colours</option>
                      {uniqueColours.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Finish */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Finish
                    </label>
                    <select
                      value={selectedFinish}
                      onChange={(e) => setSelectedFinish(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All finishes</option>
                      {uniqueFinishes.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Availability
                    </label>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All availability</option>
                      <option value="available">Available</option>
                      <option value="sold-out">Sold out</option>
                    </select>
                  </div>

                  {/* Collection */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Collection
                    </label>
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All collections</option>
                      {STORE_CONFIG.collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Tier */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Price Tier
                    </label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full h-10 px-2 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                    >
                      <option value="all">All prices</option>
                      <option value="under-3000">Under ₹3,000</option>
                      <option value="3000-5000">₹3,000–₹5,000</option>
                      <option value="over-5000">Over ₹5,000</option>
                    </select>
                  </div>

                  {/* Search text filter */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                      Search Query
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter by keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 px-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none pr-7"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metal Swatches Row */}
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-sans font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
                    Quick Metal Filter:
                  </span>
                  <div className="flex items-center gap-3">
                    {METAL_SWATCHES.map((swatch) => {
                      const isActive = selectedColour.toLowerCase().includes(swatch.name.toLowerCase()) || selectedColour === swatch.name;
                      return (
                        <button
                          key={swatch.name}
                          onClick={() => setSelectedColour(isActive ? 'all' : swatch.name)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans border transition-all ${
                            isActive
                              ? 'border-[#1d4136] bg-[#1d4136]/10 text-[#1d4136] font-bold dark:border-[#e6ca97] dark:text-[#e6ca97]'
                              : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[#1d4136]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span>{swatch.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs font-sans font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">
          <span>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-[#1d4136] dark:text-[#e6ca97] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductArtworkCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12 space-y-4 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#b99762] mx-auto" />
            <h3 className="font-serif text-3xl text-[var(--text-primary)] font-normal">
              No pieces found
            </h3>
            <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
              Try removing one or two filters to rediscover the Aviora edit.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-6 py-2.5 text-xs font-sans font-bold tracking-[0.14em] uppercase border border-[var(--border-strong)] hover:bg-[var(--bg-stone)] text-[var(--text-primary)] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 8. VIEW: CINEMATIC PDP (WITH 14K ACCORDION)
// ==========================================
function ProductView() {
  const { selectedProduct, navigate, addToCart, formatPrice } = useContext(AppContext);
  const [activeAccordion, setActiveAccordion] = useState('why-14k');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const [viewMode, setViewMode] = useState('product'); // 'product' | 'model'

  const [addEngraving, setAddEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');

  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  const product = selectedProduct || PRODUCTS[0];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeResult(
        `✓ Delivery to ${pincode} in 2-3 business days via Blue Dart Express. COD Available.`
      );
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const toggleAccordion = (key) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddPiece = () => {
    addToCart(product, selectedQuantity, addEngraving ? engravingText : '');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="border-b border-[var(--border-subtle)] px-6 md:px-14 py-3.5 flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)]">
        <button
          onClick={() => navigate('atelier')}
          className="flex items-center gap-2 hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atelier Collection</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[#b99762] dark:text-[#e6ca97] hidden sm:inline">
            ✦ 14K GOLD PLATED 925 STERLING SILVER
          </span>
          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors">
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Piece</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Column: Stacked Images with Model Scale Toggle */}
        <div className="lg:col-span-7 space-y-4 lg:space-y-6 p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]">
          <div className="sticky top-24 z-30 flex items-center justify-between bg-[var(--bg-card)]/90 backdrop-blur-md p-2.5 border border-[var(--border-subtle)] text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('product')}
                className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-all flex items-center gap-1.5 ${
                  viewMode === 'product'
                    ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-[#242321] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Product Only</span>
              </button>
              <button
                onClick={() => setViewMode('model')}
                className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-all flex items-center gap-1.5 ${
                  viewMode === 'model'
                    ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-[#242321] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>View on Model (Scale)</span>
              </button>
            </div>

            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest hidden sm:inline">
              14K STUDIO CAPTURE
            </span>
          </div>

          {viewMode === 'model' ? (
            <div className="relative w-full min-h-[75vh] lg:min-h-[92vh] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[#b99762]/40 group animate-fadeIn">
              <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-primary)] bg-[var(--bg-card)]/90 backdrop-blur-md px-3 py-1 border border-[#b99762]/50 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#b99762] dark:text-[#e6ca97]" />
                  RELATIVE SIZE & MODEL PROPORTION
                </span>
              </div>
              <ArtisticImage
                src={product.modelImage}
                alt={`${product.name} on Model`}
                className="w-full h-full"
                exhibitNumber="SCALE // MODEL"
                materialTag="14K CHAMPAGNE GOLD"
              />
            </div>
          ) : (
            <>
              <div className="relative w-full min-h-[70vh] lg:min-h-[92vh] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[var(--border-subtle)] group">
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-primary)] bg-[var(--bg-card)]/85 backdrop-blur-md px-3 py-1 border border-[var(--border-subtle)]">
                    PLATE // 01 (STUDIO MACRO)
                  </span>
                </div>
                <ArtisticImage
                  src={product.images[0]}
                  alt={`${product.name} Plate 1`}
                  className="w-full h-full"
                  exhibitNumber="PLATE // 01"
                  materialTag={product.material}
                />
              </div>

              {/* Looping Light Video Loop */}
              <div className="relative w-full min-h-[60vh] lg:min-h-[85vh] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[var(--border-subtle)] group">
                <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-primary)] bg-[var(--bg-card)]/85 backdrop-blur-md px-3 py-1 border border-[#b99762]/50 flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-[#b99762] dark:text-[#e6ca97] fill-[#b99762] dark:fill-[#e6ca97]" />
                    SLOW-MOTION LIGHT REFLECTION LOOP
                  </span>
                </div>
                <ArtisticImage
                  src={product.images[1] || product.images[0]}
                  alt={`${product.name} Light Loop`}
                  className="w-full h-full animate-[pulse_8s_ease-in-out_infinite]"
                  exhibitNumber="VIDEO // LOOP"
                  materialTag="14K LUSTRE CAPTURE"
                />
              </div>

              {product.images.slice(2).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-full min-h-[70vh] lg:min-h-[92vh] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[var(--border-subtle)] group"
                >
                  <ArtisticImage
                    src={imgUrl}
                    alt={`${product.name} Plate ${idx + 3}`}
                    className="w-full h-full"
                    exhibitNumber={`PLATE // 0${idx + 3}`}
                    materialTag={product.material}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="lg:col-span-5 p-6 md:p-12 lg:p-16 flex flex-col justify-start">
          <div className="lg:sticky lg:top-28 space-y-7">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.3em] uppercase text-[#b99762] dark:text-[#e6ca97]">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.goldPurity} // {product.colorTone}
                </span>
                <span className="text-[var(--text-muted)]">{product.hallmark}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] font-normal tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-sans text-3xl text-[var(--text-primary)] font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-base text-[var(--text-muted)] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                    SAVE {discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                Includes 3% GST · Certified BIS Hallmarking · Free Pan-India Express Delivery
              </p>
            </div>

            {/* Scarcity Urgency Trigger */}
            {product.inventory < 3 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-700 dark:text-amber-300">
                <span className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Archival piece: Only {product.inventory} left in stock.
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  High Demand
                </span>
              </div>
            )}

            {/* 3-Badge Trust Pill */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
              <div className="space-y-1 p-2">
                <Droplets className="w-4 h-4 text-sky-500 dark:text-sky-400 mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  100% Waterproof
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Shower & Gym Safe</span>
              </div>
              <div className="space-y-1 p-2 border-x border-[var(--border-subtle)]">
                <ShieldCheck className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97] mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  14K Gold Plated
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Scratch-Proof Alloy</span>
              </div>
              <div className="space-y-1 p-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  BIS 925 Silver
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Lifetime Warranty</span>
              </div>
            </div>

            {/* Complimentary Engraving */}
            {product.isEngravable && (
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addEngraving}
                    onChange={(e) => setAddEngraving(e.target.checked)}
                    className="accent-[#1d4136] dark:accent-[#e6ca97] w-4 h-4"
                  />
                  <span className="font-semibold text-[#b99762] dark:text-[#e6ca97] flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" /> Add Complimentary Archival Engraving (Free)
                  </span>
                </label>
                {addEngraving && (
                  <div className="space-y-1 pt-1 animate-fadeIn">
                    <input
                      type="text"
                      maxLength={4}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                      placeholder="ENTER INITIALS (MAX 4 LETTERS, e.g. 'AS')"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-3.5 py-2 text-xs font-mono text-[var(--text-primary)] uppercase tracking-widest outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Pincode Checker */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-primary)]">
                <MapPin className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97]" />
                <span>Check Express Delivery & COD by PIN Code</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 400001)"
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-3 py-2 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p className={`text-[11px] font-mono mt-1.5 ${pincodeResult.includes('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-1">
              <div className="flex gap-4">
                <div className="flex items-center border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs font-mono px-3">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="py-2 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    -
                  </button>
                  <span className="px-3 text-[var(--text-primary)] font-bold">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="py-2 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddPiece}
                  className="flex-1 py-4 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-[0.22em] uppercase font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-md"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Add to Bag ({formatPrice(product.price * selectedQuantity)})</span>
                </button>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono text-[var(--text-secondary)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Cash on Delivery (COD) Available
                  </span>
                  <span className="text-[var(--text-muted)]">Extra 5% off on UPI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" /> Easy 30-Day Returns & Exchanges
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" /> Free Pan-India Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] pt-2 text-xs font-mono">
              {/* PRD MANDATORY ACCORDION: Why We Cast in 14K Gold */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('why-14k')}
                  className="w-full flex justify-between items-center text-left text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase font-bold text-[#b99762] dark:text-[#e6ca97] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Why We Cast in 14K Gold
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'why-14k' ? 'rotate-180 text-[#b99762] dark:text-[#e6ca97]' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'why-14k' && (
                  <div className="text-[var(--text-secondary)] pt-3 space-y-3 leading-relaxed">
                    <p className="font-serif italic text-sm text-[var(--text-primary)] border-l-2 border-[#b99762] pl-3 py-1">
                      &ldquo;{WHY_14K_GOLD_COPY.body}&rdquo;
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {WHY_14K_GOLD_COPY.pillars.map((pil) => (
                        <div key={pil.label} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <span className="text-[10px] font-mono text-[#b99762] dark:text-[#e6ca97] block font-bold">
                            {pil.label}
                          </span>
                          <span className="text-[9px] font-mono text-[var(--text-secondary)] block mt-0.5">
                            {pil.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Materiality */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('materiality')}
                  className="w-full flex justify-between items-center text-left text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase">Materiality & Provenance</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'materiality' ? 'rotate-180 text-[#b99762] dark:text-[#e6ca97]' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'materiality' && (
                  <div className="text-[var(--text-secondary)] pt-3 space-y-2 leading-relaxed">
                    <p><strong className="text-[var(--text-primary)]">Alloy:</strong> {product.material}</p>
                    <p><strong className="text-[var(--text-primary)]">Total Weight:</strong> {product.weight}</p>
                    <p><strong className="text-[var(--text-primary)]">Purity:</strong> {product.goldPurity}</p>
                  </div>
                )}
              </div>

              {/* Dimensions */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full flex justify-between items-center text-left text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase">Dimensions & Anatomical Fit</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'dimensions' ? 'rotate-180 text-[#b99762] dark:text-[#e6ca97]' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'dimensions' && (
                  <div className="text-[var(--text-secondary)] pt-3 space-y-2 leading-relaxed">
                    <p>{product.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof: In the Wild */}
      <section className="py-24 px-6 md:px-14 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--border-subtle)] pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#b99762] dark:text-[#e6ca97] block font-bold">
                IN THE WILD // REAL PATRONS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-wide mt-1">
                Collector Testimonials
              </h2>
            </div>
            <p className="text-xs font-mono text-[var(--text-secondary)] max-w-xs sm:text-right">
              Styled organically by jewelry patrons across Mumbai, Delhi, and Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTOR_TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between group hover:border-[#b99762]/60 transition-colors"
              >
                <div className="relative aspect-square w-full bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden">
                  <ArtisticImage
                    src={test.image}
                    alt={`${test.patron} wearing AURA`}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-[var(--bg-card)]/90 backdrop-blur-md px-2 py-0.5 text-[8px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                    VERIFIED PATRON
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="font-serif italic text-xs text-[var(--text-secondary)] leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[var(--text-primary)] font-bold">{test.patron}</span>
                      <span className="text-[var(--text-muted)]">{test.location}</span>
                    </div>
                    <span className="text-[#b99762] dark:text-[#e6ca97] text-[9px] block mt-0.5 font-medium">
                      Acquired: {test.productName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 9. VIEW: CHECKOUT
// ==========================================
function CheckoutView() {
  const { cart, cartTotal, clearCart, navigate, formatPrice, addOrder, currencyMode } = useContext(AppContext);

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const upiDiscount = paymentMethod === 'UPI' ? Math.round(cartTotal * 0.05) : 0;
  const finalTotal = cartTotal - upiDiscount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all delivery details.');
      return;
    }

    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const trackingNumber = `BLD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-IN`;
      const order = {
        orderNumber: `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
        paymentMethod,
        subtotal: cartTotal,
        discount: upiDiscount,
        total: finalTotal,
        currency: currencyMode,
        status: 'IN_TRANSIT',
        courier: 'Blue Dart Express Air',
        trackingNumber,
        estimatedDelivery: '2-3 Business Days',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          quantity: item.quantity,
          image: item.product.images[0],
          material: item.product.material,
          engraving: item.engraving,
          hallmark: item.product.hallmark,
        })),
        timeline: createOrderTimeline('IN_TRANSIT', new Date().toISOString()),
      };

      // Save permanently to order history archive & sync to Supabase database
      addOrder(order);
      persistOrderToDb(order);
      setCompletedOrder(order);
      clearCart();
      setIsSubmitting(false);
    }, 900);
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 px-6 md:px-12 flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-[var(--bg-card)] border border-[#b99762]/60 p-8 md:p-14 shadow-2xl space-y-8 relative overflow-hidden"
        >
          <div className="text-center space-y-3 border-b border-[var(--border-subtle)] pb-8">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#b99762] dark:text-[#e6ca97] block font-bold">
              BIS CERTIFIED ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-wide">
              Thank You for Your Order!
            </h1>
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              Order Reference:{' '}
              <span className="text-[#b99762] dark:text-[#e6ca97] font-semibold">{completedOrder.orderNumber}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono text-[var(--text-primary)]">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Customer:</span>
                <span className="text-[var(--text-primary)] font-medium">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping Destination:</span>
                <span className="text-[var(--text-primary)] font-medium">
                  {completedOrder.city}, {completedOrder.state} — {completedOrder.postalCode}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Blue Dart AWB Air Waybill:</span>
                <span className="text-[var(--text-primary)] font-bold font-mono">
                  {completedOrder.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Payment Mode:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Final Order Amount:</span>
                <span className="text-[#b99762] dark:text-[#e6ca97] text-base font-bold">
                  {formatPrice(completedOrder.total)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                Your 14K jewelry piece is being hallmarked and packed in Mumbai. Tracking updates are active via Blue Dart Express.
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('orders', completedOrder)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Shipment Live ({completedOrder.trackingNumber})</span>
            </button>
            <button
              onClick={() => navigate('atelier')}
              className="w-full sm:w-auto px-8 py-3.5 border border-[var(--border-strong)] hover:border-[var(--text-primary)] text-[var(--text-primary)] font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all text-center"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-12 px-6 md:px-14 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        <button
          onClick={() => navigate('atelier')}
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Atelier</span>
        </button>

        <div className="border-b border-[var(--border-subtle)] pb-6">
          <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#b99762] dark:text-[#e6ca97] block font-bold">
            SECURE ENCRYPTED CHECKOUT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-[var(--text-primary)] mt-1">
            Express Checkout
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[var(--border-subtle)] p-12 space-y-4">
            <p className="font-serif italic text-2xl text-[var(--text-secondary)]">
              Your bag is currently empty.
            </p>
            <button
              onClick={() => navigate('atelier')}
              className="inline-block mt-4 px-6 py-3 border border-[#b99762] text-xs font-mono tracking-widest uppercase text-[#b99762] dark:text-[#e6ca97] hover:bg-[#1d4136] hover:text-white dark:hover:bg-[#e6ca97] dark:hover:text-[#242321] transition-colors font-bold"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b99762]" />
                  01 // Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Full Legal Name"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <input
                    required
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Email for Invoice"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                </div>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Mobile (For WhatsApp Delivery Updates)"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b99762]" />
                  02 // Delivery Address
                </h3>
                <input
                  required
                  type="text"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Street Address, Suite / Apartment"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="PIN Code"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold">
                    03 // Payment Method
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    ⚡ Instant 5% off on UPI
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 text-[var(--text-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#b99762] dark:text-[#e6ca97] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">UPI / GPay</span>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Save 5%</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 text-[var(--text-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">COD</span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">Doorstep</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 text-[var(--text-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#b99762] dark:text-[#e6ca97] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">Cards</span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">RuPay/Visa</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 text-[var(--text-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#b99762] dark:text-[#e6ca97] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">NetBanking</span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">All Banks</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] disabled:opacity-50 text-white dark:text-[#242321] font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-3 transition-all shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'PLACING ORDER...' : `Place 14K Gold Order — ${formatPrice(finalTotal)}`}
                  </span>
                </button>
              </div>
            </form>

            {/* Right Summary */}
            <div className="lg:col-span-5 p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
              <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3 font-bold">
                Bag Summary ({cart.length} Pieces)
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto divide-y divide-[var(--border-subtle)] pr-2">
                {cart.map(({ product, quantity, engraving }) => (
                  <div key={product.id} className="pt-3 first:pt-0 flex gap-3.5">
                    <div className="relative w-14 h-18 flex-shrink-0 bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[var(--border-subtle)]">
                      <ArtisticImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-xs text-[var(--text-primary)]">{product.name}</h4>
                        <p className="text-[9px] font-mono text-[#b99762] dark:text-[#e6ca97] font-semibold">
                          {product.goldPurity} · Qty: {quantity}
                        </p>
                        {engraving && (
                          <p className="text-[9px] font-mono text-[var(--text-secondary)]">
                            Engraved: &ldquo;{engraving}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[var(--border-subtle)] pt-3 text-xs font-mono text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Bag Total:</span>
                  <span className="text-[var(--text-primary)] font-medium">{formatPrice(cartTotal)}</span>
                </div>
                {paymentMethod === 'UPI' && upiDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>UPI Discount (5%):</span>
                    <span>- {formatPrice(upiDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[var(--border-subtle)] text-sm font-serif text-[var(--text-primary)]">
                  <span className="uppercase font-mono text-xs tracking-widest font-bold">Total Payable</span>
                  <span className="text-2xl font-mono text-[#b99762] dark:text-[#e6ca97] font-bold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 10. VIEW: ORDER TRACKING & HISTORICAL ARCHIVE
// ==========================================
function OrdersView() {
  const { orders, selectedOrder, setSelectedOrder, navigate, formatPrice, addOrder, currencyMode } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Derive active order
  const activeOrder = useMemo(() => {
    if (selectedOrder) {
      const match = orders.find((o) => o.orderNumber === selectedOrder.orderNumber);
      if (match) return match;
      return selectedOrder;
    }
    return orders.length > 0 ? orders[0] : null;
  }, [orders, selectedOrder]);

  const handleCopyAWB = (awb) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(awb);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query)) ||
        (o.customerPhone && o.customerPhone.includes(query)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(query))
    );
    if (match) {
      setSelectedOrder(match);
    }
  };

  // Helper to create a demo order if archive is empty
  const handleCreateDemoOrder = () => {
    const demoAwb = `BLD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-IN`;
    const sampleProduct1 = PRODUCTS[0];
    const sampleProduct2 = PRODUCTS[1] || PRODUCTS[0];
    const demoOrder = {
      orderNumber: `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customerName: 'Ananya Sharma',
      customerEmail: 'ananya.sharma@curator.in',
      customerPhone: '+91 98201 44892',
      shippingAddress: 'Flat 402, Sea Green Mansions, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400030',
      country: 'India',
      paymentMethod: 'UPI',
      subtotal: sampleProduct1.price + sampleProduct2.price,
      discount: Math.round((sampleProduct1.price + sampleProduct2.price) * 0.05),
      total: Math.round((sampleProduct1.price + sampleProduct2.price) * 0.95),
      currency: currencyMode,
      status: 'IN_TRANSIT',
      courier: 'Blue Dart Express Air',
      trackingNumber: demoAwb,
      estimatedDelivery: '2-3 Business Days',
      items: [
        {
          productId: sampleProduct1.id,
          name: sampleProduct1.name,
          price: sampleProduct1.price,
          quantity: 1,
          image: sampleProduct1.images[0],
          material: sampleProduct1.material,
          engraving: 'AVIORA 14K',
          hallmark: sampleProduct1.hallmark,
        },
        {
          productId: sampleProduct2.id,
          name: sampleProduct2.name,
          price: sampleProduct2.price,
          quantity: 1,
          image: sampleProduct2.images[0],
          material: sampleProduct2.material,
          engraving: '',
          hallmark: sampleProduct2.hallmark,
        },
      ],
      timeline: createOrderTimeline('IN_TRANSIT', new Date().toISOString()),
    };
    addOrder(demoOrder);
    persistOrderToDb(demoOrder);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-12 px-6 md:px-14 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
          <button
            onClick={() => navigate('atelier')}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier</span>
          </button>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#b99762] dark:text-[#e6ca97] flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" />
            LIVE BLUE DART EXPRESS LOGISTICS
          </span>
        </div>

        {/* Header & Order Lookup Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[var(--text-muted)] block">
              PATRON ARCHIVE // REAL-TIME DISPATCH & TRANSIT
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-[var(--text-primary)] mt-1">
              Order Tracking & History
            </h1>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Order (e.g. AVR-IN-...) or Phone"
                className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-2.5 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Empty Archive State */}
        {orders.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[var(--border-subtle)] p-12 space-y-5 bg-[var(--bg-card)]">
            <div className="w-16 h-16 rounded-full border border-dashed border-[var(--border-subtle)] mx-auto flex items-center justify-center text-[var(--text-muted)]">
              <PackageCheck className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif italic text-2xl text-[var(--text-secondary)]">
                No orders recorded yet.
              </h3>
              <p className="text-xs font-mono text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
                When you complete an order via UPI, Cards, or COD, your order dossier and live Blue Dart tracking milestones are permanently stored here and will never be cleared when adding new items to your bag.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                onClick={handleCreateDemoOrder}
                className="px-6 py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[#b99762]/60 text-[#b99762] dark:text-[#e6ca97] font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Test 14K Order & Real-Time Tracking</span>
              </button>
              <button
                onClick={() => navigate('atelier')}
                className="px-8 py-3 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all"
              >
                Browse 14K Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Historical Orders List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-3">
                <span>Archived Orders ({orders.length})</span>
                <span className="text-[10px] text-[var(--text-muted)]">Saved Locally</span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const isSelected = order.orderNumber === activeOrder?.orderNumber;
                  return (
                    <button
                      key={order.orderNumber}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full text-left p-4 border transition-all ${
                        isSelected
                          ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 shadow-md'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                          {(order.status || 'IN_TRANSIT').replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-baseline text-[11px] font-mono text-[var(--text-secondary)]">
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </span>
                        <span className="text-[#b99762] dark:text-[#e6ca97] font-bold">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1 truncate">
                        {order.items?.length || 1} piece(s) · {order.city}, {order.state}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Order Real-Time Tracking & Inspection */}
            {activeOrder && (
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Live Blue Dart Shipping Status Bar */}
                <div className="p-6 bg-[var(--bg-card)] border border-[#b99762]/60 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#b99762] dark:text-[#e6ca97] block font-bold">
                        ACTIVE LOGISTICS WAYBILL
                      </span>
                      <h2 className="font-serif text-2xl text-[var(--text-primary)] mt-0.5">
                        Order #{activeOrder.orderNumber}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                          Blue Dart AWB Air Waybill
                        </span>
                        <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
                          {activeOrder.trackingNumber || 'BLD-7492-8812-IN'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyAWB(activeOrder.trackingNumber || 'BLD-7492-8812-IN')}
                        className="p-2 border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title="Copy AWB Tracking Number"
                      >
                        {copiedAWB ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 2. Interactive Shipment Progress Stepper */}
                  <div className="space-y-6 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--text-primary)] flex items-center gap-2 font-bold">
                      <Truck className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97]" />
                      Real-Time Transit Progress
                    </h3>

                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
                      {(activeOrder.timeline || createOrderTimeline(activeOrder.status || 'IN_TRANSIT', activeOrder.createdAt)).map((step, idx) => {
                        const isDone = step.completed || step.current;
                        return (
                          <div key={idx} className="relative group">
                            {/* Dot */}
                            <div
                              className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                step.current
                                  ? 'bg-[#1d4136] dark:bg-[#e6ca97] border-[#1d4136] dark:border-[#e6ca97] shadow-sm'
                                  : isDone
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                              }`}
                            >
                              {step.current ? (
                                <span className="w-2 h-2 rounded-full bg-white dark:bg-[#242321] animate-ping" />
                              ) : isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span
                                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                                    step.current ? 'text-[#b99762] dark:text-[#e6ca97]' : isDone ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                  }`}
                                >
                                  {step.label}
                                </span>
                                {step.current && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 border border-[#1d4136] dark:border-[#e6ca97] text-[#1d4136] dark:text-[#e6ca97] animate-pulse font-bold">
                                    IN PROGRESS
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#b99762] dark:text-[#e6ca97]" /> {step.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {step.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Order Items & Materiality Dossier */}
                <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-6">
                  <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3 flex items-center justify-between font-bold">
                    <span>Sculptural Pieces Acquired ({activeOrder.items?.length || 1})</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                      {activeOrder.paymentMethod} Payment Verified
                    </span>
                  </h3>

                  <div className="divide-y divide-[var(--border-subtle)]">
                    {(activeOrder.items || []).map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 flex gap-4">
                        <div className="relative w-18 h-22 flex-shrink-0 bg-[var(--bg-stone)] dark:bg-[#181d1a] border border-[var(--border-subtle)] overflow-hidden">
                          <ArtisticImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-base text-[var(--text-primary)]">{item.name}</h4>
                              <span className="font-mono text-sm text-[var(--text-primary)] font-bold">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
                              {item.material}
                            </p>
                            {item.engraving && (
                              <p className="text-[10px] font-mono text-[#b99762] dark:text-[#e6ca97] mt-0.5 font-semibold">
                                Custom Engraving: &ldquo;{item.engraving}&rdquo;
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] pt-2">
                            <span>Qty: {item.quantity}</span>
                            <span className="text-[#b99762] dark:text-[#e6ca97] flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" /> BIS 925 Pure Silver Core
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--text-secondary)]">
                    <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block">
                        Consignee Details
                      </span>
                      <p className="text-[var(--text-primary)] font-semibold">{activeOrder.customerName}</p>
                      <p>{activeOrder.customerPhone}</p>
                      <p>{activeOrder.customerEmail}</p>
                    </div>

                    <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block">
                        Destination Address
                      </span>
                      <p className="text-[var(--text-primary)]">{activeOrder.shippingAddress}</p>
                      <p>
                        {activeOrder.city}, {activeOrder.state} — {activeOrder.postalCode}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Estimated Delivery: 2-3 Business Days</p>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1.5 text-xs font-mono text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span className="text-[#b99762] dark:text-[#e6ca97] text-base font-bold">
                        {formatPrice(activeOrder.total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                      <span>Inclusive of 3% GST & Lifetime Anti-Tarnish Warranty</span>
                      <span>Free Express Blue Dart Courier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 10. VIEW: CURATOR ADMIN VAULT & CRUD STUDIO
// ==========================================
function AdminView() {
  const {
    products,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    orders,
    formatPrice,
    navigate,
    showToast,
  } = useContext(AppContext);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('aviora_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'add' | 'orders'
  const [searchCatalog, setSearchCatalog] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'earrings',
    categorySlug: 'negative-space-ear-cuffs',
    collection: 'new-arrivals',
    price: 3299,
    originalPrice: 4499,
    inventory: 8,
    goldPurity: '14K Gold Vermeil (2.5μm)',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Everyday Wear',
    finish: 'Polished',
    hallmark: 'BIS Hallmarked 925 Pure Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
    dimensions: 'Standard Universal Fit',
    weight: '6.5g BIS 925 Silver Core',
    image1: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85',
    image2: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    description: 'Precision cast in BIS 925 sterling silver with a heavy 2.5-micron jacket of 14K Champagne Gold Vermeil. 100% waterproof and sweat-proof.',
    editorialNote: 'Hand-finished in our Mumbai & Jaipur ateliers.',
    pairsWithId: '',
    upsellReason: '',
  });

  const handleLogin = (e) => {
    e?.preventDefault();
    if (pinCode.trim() === '149250' || pinCode.trim() === '1492') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('aviora_admin_auth', 'true');
      } catch {}
      setPinError('');
      showToast('✦ Curator Access Authorized');
    } else {
      setPinError('Invalid PIN code. Use 149250 or click Quick VIP Bypass.');
    }
  };

  const handleBypass = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('aviora_admin_auth', 'true');
    } catch {}
    setPinError('');
    showToast('✦ Curator Access Authorized via VIP Bypass');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('aviora_admin_auth');
    } catch {}
    showToast('Curator Session Concluded');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('Please enter a product name and price.');
      return;
    }

    const images = [newProductForm.image1, newProductForm.image2].filter(Boolean);

    adminAddProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      categorySlug: newProductForm.categorySlug,
      collections: [newProductForm.collection],
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice || newProductForm.price),
      inventory: Number(newProductForm.inventory || 5),
      inStock: Number(newProductForm.inventory || 5) > 0,
      goldPurity: newProductForm.goldPurity,
      material: `${newProductForm.goldPurity} over ${newProductForm.hallmark}`,
      colorTone: newProductForm.colorTone,
      metalColorHex: newProductForm.metalColorHex,
      occasionVibe: newProductForm.occasionVibe,
      finish: newProductForm.finish,
      hallmark: newProductForm.hallmark,
      warranty: newProductForm.warranty,
      dimensions: newProductForm.dimensions,
      weight: newProductForm.weight,
      images,
      modelImage: newProductForm.modelImage || images[0],
      description: newProductForm.description,
      editorialNote: newProductForm.editorialNote,
      pairsWithId: newProductForm.pairsWithId || undefined,
      upsellReason: newProductForm.upsellReason || '',
      isNew: true,
      featured: true,
    });

    setActiveTab('catalog');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    adminUpdateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice || editingProduct.price),
      inventory: Number(editingProduct.inventory),
      inStock: Number(editingProduct.inventory) > 0,
      description: editingProduct.description,
      goldPurity: editingProduct.goldPurity,
      colorTone: editingProduct.colorTone,
      material: editingProduct.material,
      images: editingProduct.images,
    });
    setEditingProduct(null);
  };

  // Metrics Calculations
  const totalValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * (Number(p.inventory) || 0), 0);
  }, [products]);

  const totalInventoryUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.inventory) || 0), 0);
  }, [products]);

  const filteredCatalog = useMemo(() => {
    let list = [...products];
    if (filterCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.category === filterCategory ||
          p.categorySlug === filterCategory ||
          (filterCategory === 'earrings' && p.categorySlug?.includes('ear')) ||
          (filterCategory === 'necklaces' && (p.categorySlug?.includes('choker') || p.categorySlug?.includes('hasli'))) ||
          (filterCategory === 'bracelets' && (p.categorySlug?.includes('kada') || p.categorySlug?.includes('bangle'))) ||
          (filterCategory === 'rings' && p.categorySlug?.includes('ring'))
      );
    }
    if (searchCatalog.trim()) {
      const q = searchCatalog.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, filterCategory, searchCatalog]);

  // If locked, render security portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border-strong)] p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 border border-[#1d4136]/30 dark:border-[#e6ca97]/30 flex items-center justify-center mx-auto text-[#1d4136] dark:text-[#e6ca97]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl text-[var(--text-primary)] font-normal">
              Atelier Vault Access
            </h2>
            <p className="text-xs font-sans text-[var(--text-secondary)]">
              Authorized personnel only. Enter your 6-digit Curator Security PIN to manage the catalog, pricing, and Blue Dart logistics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                Curator PIN (Default: 149250)
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter PIN..."
                className="w-full h-12 px-4 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-center tracking-[0.4em] text-lg outline-none focus:border-[#1d4136] dark:focus:border-[#e6ca97]"
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-sans text-rose-500 mt-1.5">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-sans text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:bg-[#132f27] dark:hover:bg-[#d8c39f]"
            >
              Authenticate & Enter
            </button>
          </form>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-center">
            <button
              onClick={handleBypass}
              className="text-xs font-sans font-bold tracking-[0.1em] uppercase text-[#b99762] hover:underline inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Owner 1-Click VIP Bypass</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header Bar */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 md:px-12 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1d4136] dark:bg-[#e6ca97] flex items-center justify-center text-white dark:text-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)]">
                  Atelier Curator Portal
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                  Supabase Live
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)]">
                AVIORA JEWELLERS • MUMBAI & JAIPUR ATELIERS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('atelier')}
              className="px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.1em] uppercase border border-[var(--border-strong)] hover:bg-[var(--bg-card)] transition-colors"
            >
              Storefront
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.1em] uppercase text-rose-500 border border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-sans font-bold tracking-[0.16em] uppercase text-[var(--text-muted)] block">
              Active Catalog SKUs
            </span>
            <span className="font-serif text-3xl text-[var(--text-primary)]">
              {products.length}
            </span>
            <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 block">
              100% Synced to Supabase
            </span>
          </div>

          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-sans font-bold tracking-[0.16em] uppercase text-[var(--text-muted)] block">
              Total Vault Units
            </span>
            <span className="font-serif text-3xl text-[var(--text-primary)]">
              {totalInventoryUnits}
            </span>
            <span className="text-[10px] font-sans text-[var(--text-muted)] block">
              Available for express dispatch
            </span>
          </div>

          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-sans font-bold tracking-[0.16em] uppercase text-[var(--text-muted)] block">
              Catalog Valuation (INR)
            </span>
            <span className="font-serif text-3xl text-[var(--text-primary)]">
              {formatPrice(totalValuation)}
            </span>
            <span className="text-[10px] font-sans text-[#b99762] block">
              14K Gold Plated 925 Silver
            </span>
          </div>

          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-sans font-bold tracking-[0.16em] uppercase text-[var(--text-muted)] block">
              Patron Orders in Pipeline
            </span>
            <span className="font-serif text-3xl text-[var(--text-primary)]">
              {orders.length}
            </span>
            <span className="text-[10px] font-sans text-sky-600 dark:text-sky-400 block">
              Blue Dart Air Express Connected
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 border-b border-[var(--border-subtle)] flex space-x-6 text-xs font-sans font-bold tracking-[0.14em] uppercase">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-[#1d4136] dark:border-[#e6ca97] text-[#1d4136] dark:text-[#e6ca97]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog & Tagging Manager ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'add'
                ? 'border-[#1d4136] dark:border-[#e6ca97] text-[#1d4136] dark:text-[#e6ca97]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#1d4136] dark:border-[#e6ca97] text-[#1d4136] dark:text-[#e6ca97]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Patron Orders & Blue Dart AWB ({orders.length})</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: CATALOG & TAGGING MANAGER */}
        {/* ========================================== */}
        {activeTab === 'catalog' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search piece name or material..."
                  value={searchCatalog}
                  onChange={(e) => setSearchCatalog(e.target.value)}
                  className="w-full sm:w-72 h-10 px-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-10 px-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="rings">Rings</option>
                  <option value="jewellery-sets">Jewellery Sets</option>
                </select>
              </div>

              <button
                onClick={() => setActiveTab('add')}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-xs font-sans font-bold tracking-[0.12em] uppercase transition-colors hover:bg-[#132f27] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Creation</span>
              </button>
            </div>

            {/* Catalog Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((product) => (
                <div
                  key={product.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-24 object-cover bg-[var(--bg-stone)] border border-[var(--border-subtle)] shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--text-muted)] truncate">
                          {product.category || product.categoryName || 'Jewellery'}
                        </span>
                        <span className="text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg text-[var(--text-primary)] truncate font-normal">
                        {product.name}
                      </h4>
                      <p className="text-[10px] font-sans text-[var(--text-secondary)] line-clamp-1">
                        {product.goldPurity || product.material}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[8.5px] font-mono uppercase text-[#b99762] border border-[var(--border-subtle)]">
                          {product.colorTone || 'Champagne Gold'}
                        </span>
                        <span className="px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[8.5px] font-mono uppercase text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          BIS 925
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock and CRUD Controls */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-sans">
                    {/* Live stock stepper syncing immediately */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                        Stock:
                      </span>
                      <button
                        onClick={() => {
                          const cur = Number(product.inventory || 0);
                          if (cur > 0) adminUpdateProduct(product.id, { inventory: cur - 1 });
                        }}
                        className="w-6 h-6 rounded border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--bg-stone)] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-6 text-center text-[var(--text-primary)]">
                        {product.inventory ?? 5}
                      </span>
                      <button
                        onClick={() => {
                          const cur = Number(product.inventory || 0);
                          adminUpdateProduct(product.id, { inventory: cur + 1 });
                        }}
                        className="w-6 h-6 rounded border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--bg-stone)] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct({ ...product })}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border border-[var(--border-strong)] hover:border-[#b99762] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Permanently remove "${product.name}" from catalog?`)) {
                            adminDeleteProduct(product.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: ADD NEW PIECE STUDIO */}
        {/* ========================================== */}
        {activeTab === 'add' && (
          <div className="mt-8 max-w-4xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-10 space-y-8 shadow-sm">
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                Publish New Creation to Atelier Catalog
              </h3>
              <p className="text-xs font-sans text-[var(--text-secondary)] mt-1">
                Once submitted, this piece will immediately be saved to the database (Supabase), available in the storefront with live dynamic pricing.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Orbit Ear Cuff"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Category *
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const slugMap = {
                        earrings: 'negative-space-ear-cuffs',
                        necklaces: 'haslis-sculptural-chokers',
                        bracelets: 'anatomical-kadas-cuffs',
                        rings: 'statement-rings-solitaires',
                        'jewellery-sets': 'gift-sets',
                      };
                      setNewProductForm({
                        ...newProductForm,
                        category: cat,
                        categorySlug: slugMap[cat] || 'anatomical-kadas-cuffs',
                      });
                    }}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="earrings">Earrings & Ear Cuffs</option>
                    <option value="necklaces">Necklaces & Haslis</option>
                    <option value="bracelets">Bracelets & Kadas</option>
                    <option value="rings">Rings & Solitaires</option>
                    <option value="jewellery-sets">Jewellery Sets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Original Strike-through Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Initial Stock Inventory Units
                  </label>
                  <input
                    type="number"
                    value={newProductForm.inventory}
                    onChange={(e) => setNewProductForm({ ...newProductForm, inventory: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Gold Purity & Metallurgy
                  </label>
                  <select
                    value={newProductForm.goldPurity}
                    onChange={(e) => setNewProductForm({ ...newProductForm, goldPurity: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="14K Gold Vermeil (2.5μm)">14K Gold Vermeil (2.5μm)</option>
                    <option value="18K Gold Vermeil">18K Gold Vermeil</option>
                    <option value="Solid 14K Gold">Solid 14K Gold</option>
                    <option value="Pure 925 Silver & Rhodium">Pure 925 Silver & Rhodium</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Color Tone
                  </label>
                  <select
                    value={newProductForm.colorTone}
                    onChange={(e) => setNewProductForm({ ...newProductForm, colorTone: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="Champagne Gold">Champagne Gold</option>
                    <option value="Pure 925 Silver">Pure 925 Silver</option>
                    <option value="14K Rose Gold">14K Rose Gold</option>
                    <option value="Obsidian Black">Obsidian Black</option>
                    <option value="Pearl White">Pearl White</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                    Occasion Vibe
                  </label>
                  <select
                    value={newProductForm.occasionVibe}
                    onChange={(e) => setNewProductForm({ ...newProductForm, occasionVibe: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="Everyday Wear">Everyday Wear</option>
                    <option value="Statement">Statement</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Layering">Layering</option>
                  </select>
                </div>
              </div>

              {/* Images URLs */}
              <div className="space-y-3">
                <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">
                  Imagery URLs (Direct High-Res Links)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="Primary Product Angle Image URL"
                    value={newProductForm.image1}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image1: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Secondary Hover Flip Image URL"
                    value={newProductForm.image2}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image2: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-3 border border-[var(--border-strong)] text-[var(--text-secondary)] font-bold uppercase tracking-[0.12em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold uppercase tracking-[0.14em] hover:bg-[#132f27] transition-colors shadow-md"
                >
                  Publish Creation to Catalog
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PATRON ORDERS & BLUE DART LOGISTICS */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-6">
            <div className="border-b border-[var(--border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                  Patron Order Manifest & Fulfillment
                </h3>
                <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5">
                  Update order status and Blue Dart AWB numbers in real-time. Patrons can track updates on the storefront immediately.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
                <Package className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                <p className="font-serif text-xl text-[var(--text-primary)]">No orders in system yet.</p>
                <p className="text-xs font-sans text-[var(--text-secondary)]">
                  Place a test checkout on the storefront to see the full order lifecycle here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 space-y-5 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                            {order.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current font-bold">
                            {order.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">
                          Order Date: {order.orderDate} • Payment: {order.paymentMethod || 'Prepaid'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">
                          Total Amount Paid:
                        </span>
                        <span className="font-serif text-xl font-normal text-[var(--text-primary)]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Patron Details & Dispatch Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-sans">
                      {/* Customer Info */}
                      <div className="space-y-1 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)] block">
                          Consignee Information
                        </span>
                        <p className="font-bold text-[var(--text-primary)]">{order.customerName}</p>
                        <p>{order.customerPhone}</p>
                        <p>{order.customerEmail}</p>
                        <p className="text-[var(--text-muted)] mt-1">
                          {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)] block">
                          Ordered Sculptures ({order.items?.length || 0})
                        </span>
                        <ul className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-baseline gap-2">
                              <span className="truncate">{item.name} × {item.quantity}</span>
                              <span className="font-mono text-[var(--text-primary)] shrink-0">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Status & Blue Dart Dispatch */}
                      <div className="space-y-3 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col justify-between">
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)]">
                            Update Order Lifecycle
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              adminUpdateOrderStatus(order.orderNumber, e.target.value, order.trackingNumber);
                            }}
                            className="w-full h-9 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-sans outline-none"
                          >
                            <option value="CONFIRMED">CONFIRMED (Order Assayed)</option>
                            <option value="IN_FABRICATION">IN_FABRICATION (Lost-Wax Casting)</option>
                            <option value="BIS_HALLMARKING">BIS_HALLMARKING (Assay Verification)</option>
                            <option value="IN_TRANSIT">IN_TRANSIT (Dispatched)</option>
                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Local Hub)</option>
                            <option value="DELIVERED">DELIVERED (Handed Over)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)]">
                            Blue Dart AWB Air Waybill
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              defaultValue={order.trackingNumber || ''}
                              id={`awb-${order.orderNumber}`}
                              placeholder="BLD-xxxx-xxxx-IN"
                              className="w-full h-8 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`awb-${order.orderNumber}`);
                                if (input) {
                                  adminUpdateOrderStatus(order.orderNumber, order.status, input.value.trim());
                                }
                              }}
                              className="px-2.5 h-8 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#132f27]"
                            >
                              Push
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[var(--bg-card)] border border-[var(--border-strong)] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                Edit Creation Specs & Pricing
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Inventory Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.inventory}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inventory: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  Metallurgy Spec
                </label>
                <input
                  type="text"
                  value={editingProduct.goldPurity || editingProduct.material}
                  onChange={(e) => setEditingProduct({ ...editingProduct, goldPurity: e.target.value })}
                  className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-[var(--border-strong)] text-[var(--text-secondary)] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold uppercase tracking-wider hover:bg-[#132f27]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 11. FOOTER & TOAST
// ==========================================
function Footer() {
  const { navigate } = useContext(AppContext);

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-[var(--border-subtle)]">
          <div className="space-y-5">
            <button onClick={() => navigate('home')} className="text-left">
              <span className="font-serif text-3xl tracking-[0.2em] uppercase text-[var(--text-primary)] block">
                AVIORA
              </span>
              <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#b99762] block mt-0.5 font-bold">
                14K GOLD PLATED 925 SILVER ATELIER
              </span>
            </button>
            <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed max-w-sm">
              We exclusively cast in 18K/14K gold plated vermeil and BIS hallmarked 925 sterling silver for superior scratch-resistance and waterproof permanence.
            </p>
            <div className="text-[10px] font-mono text-[var(--text-muted)] space-y-1">
              <p>SALON PRIVÉ: BANDRA WEST, MUMBAI</p>
              <p>DIRECT CONCIERGE: +91 98201 99283</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] font-bold">
              The Collections
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[var(--text-secondary)]">
              <li>
                <button onClick={() => navigate('atelier', { category: 'bracelets' })} className="hover:text-[#b99762] transition-colors">
                  Molten 14K Vermeil Cuffs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('atelier', { category: 'rings' })} className="hover:text-[#b99762] transition-colors">
                  Architectural Signets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('atelier', { category: 'necklaces' })} className="hover:text-[#b99762] transition-colors">
                  Haslis & Sculptural Chokers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('atelier', { category: 'earrings' })} className="hover:text-[#b99762] transition-colors">
                  Negative Space Ear Cuffs
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] font-bold">
              Trust & Guarantees
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[var(--text-secondary)]">
              <li><span className="hover:text-[var(--text-primary)] cursor-pointer">Why 14K Gold Plated 925 Silver</span></li>
              <li><span className="hover:text-[var(--text-primary)] cursor-pointer">BIS 925 Hallmarking Certificate</span></li>
              <li><span className="hover:text-[var(--text-primary)] cursor-pointer">Lifetime Anti-Tarnish Warranty</span></li>
              <li><span className="hover:text-[var(--text-primary)] cursor-pointer">30-Day Hassle-Free Returns</span></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] font-bold">
              The Aviora Insider
            </h4>
            <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
              Join 45,000+ collectors for private drop releases and complimentary engraving events.
            </p>
            <div className="flex border-b border-[var(--border-strong)] pb-2 focus-within:border-[#1d4136] dark:focus-within:border-[#e6ca97]">
              <input
                type="email"
                placeholder="Enter email or WhatsApp..."
                className="bg-transparent border-none outline-none text-xs font-sans w-full text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
              <button className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97] font-bold hover:underline">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[var(--text-muted)] space-y-4 md:space-y-0">
          <div>© {new Date().getFullYear()} AVIORA JEWELLERS PVT LTD. ALL RIGHTS RESERVED.</div>
          <div className="flex space-x-8">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">PRIVACY PROTOCOL</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">TERMS OF SERVICE</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">BIS VERIFICATION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Toast() {
  const { toast } = useContext(AppContext);
  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] border border-[#b99762] text-[var(--text-primary)] px-6 py-3 shadow-2xl z-[100] text-xs font-sans font-bold tracking-wider flex items-center gap-3 backdrop-blur-md"
        >
          <div className="w-2 h-2 bg-[#b99762] rounded-full animate-ping" />
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const { currentView } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[#d8c39f] selection:text-[#242321] flex flex-col transition-colors duration-300">
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView />
            </motion.div>
          )}
          {currentView === 'atelier' && (
            <motion.div key="atelier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ShopView />
            </motion.div>
          )}
          {currentView === 'pdp' && (
            <motion.div key="pdp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductView />
            </motion.div>
          )}
          {currentView === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckoutView />
            </motion.div>
          )}
          {currentView === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OrdersView />
            </motion.div>
          )}
          {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}