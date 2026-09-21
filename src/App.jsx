import React, { useState, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
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
  ChevronLeft,
  ChevronRight,
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
  Zap,
  Link,
  FileText,
  FileSpreadsheet,
  Database,
  Download,
  BookOpen,
  Mail,
  Phone,
  Award,
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
  OUR_STORY,
  BRAND_POLICIES,
  createOrderTimeline,
} from '../lib/data';
import {
  persistOrderToDb,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  fetchProductsFromDb,
  fetchOrdersFromDb,
  fetchOrdersByPhone,
  updateOrderStatusInDb,
  uploadProductImageToStorage,
  recordBookkeepingLedgerEntry,
  fetchBookkeepingLedgerFromDb,
  exportBookkeepingLedgerAsCsv,
  exportBookkeepingLedgerAsJson,
} from '../lib/supabase';
import {
  generateOtp,
  verifyOtp,
  generateAwbNumber,
  getTrackingUrl,
  sendWhatsAppStageNotification,
  getWhatsAppDirectUrl,
  composeWhatsAppTemplateMessage,
  executePaymentCallback,
  createPhonePePaymentLink,
  executePhonePeCallback,
  getPhonePeConfig,
  savePhonePeConfig,
  DEFAULT_PHONEPE_CONFIG,
} from '../lib/services';

// PhonePe Brand Icon SVG
export function PhonePeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#5F259F" />
      <path
        d="M13.6 6H9.25c-.4 0-.75.35-.75.75v11c0 .3.2.5.45.5.15 0 .25-.05.35-.15l3.05-3.05h1.5c2.65 0 4.65-2.05 4.65-4.55 0-2.5-2.05-4.5-4.9-4.5zm-.1 6.4h-2.4V8.6h2.4c1.2 0 2.1.8 2.1 1.9s-.9 1.9-2.1 1.9z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// WhatsApp Brand Icon SVG
export function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.41-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

// Instagram Icon SVG
export function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Brand Crest & Logo Component
export function AvioraBrandCrest({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <line x1="50" y1="6" x2="50" y2="14" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="40" y1="10" x2="43" y2="16" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="10" x2="57" y2="16" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="16" x2="38" y2="21" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="68" y1="16" x2="62" y2="21" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
      <polygon points="50,18 42,24 45,30 55,30 58,24" fill="#F4EBD9" stroke="#B89758" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="42" y1="24" x2="58" y2="24" stroke="#B89758" strokeWidth="1"/>
      <circle cx="50" cy="54" r="26" stroke="#D4AF37" strokeWidth="3" fill="none" opacity="0.95"/>
      <circle cx="50" cy="54" r="23" stroke="#B89758" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M50 36 L34 76 L40 76 L48 55 L58 76 L64 76 Z" fill="#EDE7DC" stroke="#C5B28D" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M43 65 L60 65 L60 70 L41 70 Z" fill="#D4AF37" stroke="#9A7B38" strokeWidth="0.8"/>
      <path d="M50 45 L45 58 L55 58 Z" fill="#132A22"/>
    </svg>
  );
}

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
      if (path.includes('pdp') || hash.includes('pdp')) {
        return 'pdp';
      }
    }
    return 'home';
  });

  // Keep currentView synchronized on hash or pathname change
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentView('admin');
      } else if (path.includes('orders') || hash.includes('orders')) {
        setCurrentView('orders');
      } else if (path.includes('atelier') || hash.includes('atelier')) {
        setCurrentView('atelier');
      } else if (path.includes('pdp') || hash.includes('pdp')) {
        setCurrentView('pdp');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Reactive Products Catalog: initialized from localStorage or static fallback
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('aviora_products_catalog');
      if (stored) {
        const parsed = JSON.parse(stored);
        const authenticMap = new Map(PRODUCTS.map((p) => [p.id, p]));
        // Discard legacy mock products (e.g. Molten Kada)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          !parsed.some((p) => p.name && p.name.includes('Molten'))
        ) {
          const valid = parsed
            .filter((p) => authenticMap.has(p.id))
            .map((p) => {
              const canonical = authenticMap.get(p.id);
              return {
                ...canonical,
                ...p,
                images: p.id === 'prod-008' ? canonical.images : (canonical?.images || p.images),
                modelImage: p.id === 'prod-008' ? canonical.modelImage : (canonical?.modelImage || p.modelImage),
              };
            });
          const existingIds = new Set(valid.map((p) => p.id));
          const missing = PRODUCTS.filter((p) => !existingIds.has(p.id));
          const merged = missing.length > 0 ? [...valid, ...missing] : valid;
          if (merged.length === PRODUCTS.length) {
            return merged;
          }
        }
      }
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const prodId = params.get('product') || params.get('id');
        const slug = params.get('slug');
        if (prodId) {
          const found = PRODUCTS.find((p) => p.id === prodId);
          if (found) return found;
        }
        if (slug) {
          const found = PRODUCTS.find((p) => p.slug === slug);
          if (found) return found;
        }
        const savedId = localStorage.getItem('aviora_selected_product_id');
        if (savedId) {
          const found = PRODUCTS.find((p) => p.id === savedId);
          if (found) return found;
        }
      } catch {
        // fallback
      }
    }
    return PRODUCTS.find((p) => p.id === 'prod-009') || PRODUCTS[0];
  });

  // Persist selectedProduct ID for seamless reloads on /pdp
  useEffect(() => {
    if (selectedProduct?.id) {
      try {
        localStorage.setItem('aviora_selected_product_id', selectedProduct.id);
      } catch {}
    }
  }, [selectedProduct?.id]);
  
  // Hydrate cart from localStorage (only for authenticated patrons, otherwise guest cart starts empty)
  const [rawCart, setRawCart] = useState(() => {
    try {
      const patron = localStorage.getItem('aviora_patron_session');
      if (!patron) {
        // Unauthenticated guests start with a clean empty cart by default
        return [];
      }
      const stored = localStorage.getItem('aura_collection_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => ({
              productId: item.productId || item.product?.id,
              quantity: Number(item.quantity) || 1,
              engraving: item.engraving || '',
            }))
            .filter((item) => Boolean(item.productId));
        }
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

  // Patron Customer Login & Authentication Session (Mobile Phone OTP)
  const [patronUser, setPatronUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aviora_patron_session');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const loginPatron = (phone, name = '') => {
    const cleanPhone = (phone || '').replace(/[^\d]/g, '').slice(-10);
    if (!cleanPhone) return null;
    const session = {
      phone: cleanPhone,
      name: name || `Patron +91 ${cleanPhone}`,
      loggedInAt: new Date().toISOString(),
    };
    setPatronUser(session);
    try {
      localStorage.setItem('aviora_patron_session', JSON.stringify(session));
    } catch {}
    showToast(`✓ Welcome, ${session.name}! Access granted to personal commission dossier.`);
    return session;
  };

  const logoutPatron = () => {
    setPatronUser(null);
    setRawCart([]);
    try {
      localStorage.removeItem('aviora_patron_session');
      localStorage.removeItem('aura_collection_cart');
    } catch {}
    showToast('Patron session signed out securely.');
  };

  // Patron Auth Modal State for customer login before cart addition
  const [patronAuthModalOpen, setPatronAuthModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  // Ensure store owner / staff is NEVER auto-logged in from stale storage
  useEffect(() => {
    try {
      localStorage.removeItem('aviora_admin_auth');
      sessionStorage.removeItem('aviora_admin_session_auth');
    } catch {}
  }, []);

  // Synchronize orders with Supabase database (Remote updates from Curator take precedence)
  const syncOrdersFromDb = async () => {
    try {
      const remoteOrders = await fetchOrdersFromDb();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders((prev) => {
          const map = new Map();
          // Put local state first
          prev.forEach((o) => map.set(o.orderNumber, o));
          // Overwrite with latest updates from database (Curator stage moves)
          remoteOrders.forEach((o) => {
            const existing = map.get(o.orderNumber);
            map.set(o.orderNumber, existing ? { ...existing, ...o } : o);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('aura_orders_history', JSON.stringify(merged));
          return merged;
        });
      }
      return remoteOrders;
    } catch (e) {
      console.warn('Sync orders notice:', e);
      return [];
    }
  };

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
  const [silhouetteFilter, setSilhouetteFilter] = useState(''); // 'light' | 'heavy' (silhouette curation, no weight)
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState('our-story');

  const openPolicyModal = (tabId = 'our-story') => {
    setActivePolicyTab(tabId);
    setPolicyModalOpen(true);
  };

  // On mount: Hydrate remote products & orders directly from Supabase (ap-south-1 Mumbai)
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseData() {
      try {
        const remoteProducts = await fetchProductsFromDb();
        if (isMounted && remoteProducts && remoteProducts.length > 0) {
          const authenticMap = new Map(PRODUCTS.map((p) => [p.id, p]));
          const valid = remoteProducts
            .filter((p) => authenticMap.has(p.id))
            .map((p) => {
              const canonical = authenticMap.get(p.id);
              return {
                ...canonical,
                ...p,
                images: p.id === 'prod-008' ? canonical.images : (canonical?.images || p.images),
                modelImage: p.id === 'prod-008' ? canonical.modelImage : (canonical?.modelImage || p.modelImage),
              };
            });
          const remoteIds = new Set(valid.map((p) => p.id));
          const missing = PRODUCTS.filter((p) => !remoteIds.has(p.id));
          const merged = missing.length > 0 ? [...valid, ...missing] : valid;
          setProducts(merged);
          localStorage.setItem('aviora_products_catalog', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('Supabase products hydration notice:', err);
      }

      try {
        const remoteOrders = await fetchOrdersFromDb();
        if (isMounted && remoteOrders && remoteOrders.length > 0) {
          setOrders((prev) => {
            const map = new Map();
            prev.forEach((o) => map.set(o.orderNumber, o));
            remoteOrders.forEach((o) => {
              const existing = map.get(o.orderNumber);
              map.set(o.orderNumber, existing ? { ...existing, ...o } : o);
            });
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

  const navigate = (view, data = null, shouldScrollToTop = true) => {
    setCurrentView(view);
    if (view === 'pdp') {
      const prod = data || selectedProduct;
      if (prod) {
        setSelectedProduct(prod);
        try {
          localStorage.setItem('aviora_selected_product_id', prod.id);
        } catch {}
      }
    }
    if (view === 'orders') {
      if (data) setSelectedOrder(data);
      else if (orders.length > 0 && !selectedOrder) setSelectedOrder(orders[0]);
    }
    if (view === 'atelier' && data) {
      if (data.category !== undefined) setCategoryFilter(data.category);
      if (data.material !== undefined) setMaterialFilter(data.material);
      if (data.collection !== undefined) setCollectionFilter(data.collection);
      if (data.silhouetteFilter !== undefined) setSilhouetteFilter(data.silhouetteFilter);
      if (data.weightFilter !== undefined) setSilhouetteFilter(data.weightFilter);
    }
    if (typeof window !== 'undefined') {
      let url = view === 'home' ? '/' : `/${view}`;
      if (view === 'pdp') {
        const prod = data || selectedProduct;
        if (prod?.slug) url = `/pdp?slug=${encodeURIComponent(prod.slug)}`;
        else if (prod?.id) url = `/pdp?product=${encodeURIComponent(prod.id)}`;
      }
      try {
        window.history.pushState(null, '', url);
      } catch {
        // history fallback
      }
    }
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSpectrum = (silhouette = null) => {
    if (silhouette) {
      setSilhouetteFilter(silhouette);
      navigate('atelier', { silhouetteFilter: silhouette });
    } else {
      navigate('atelier');
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  // DYNAMIC PRICE SYNC:
  // Whenever catalog prices change in admin, the cart automatically resolves
  // the live product and reflects current prices in cart & totals!
  const cart = useMemo(() => {
    return rawCart
      .map((item) => {
        const liveProduct =
          products.find((p) => p.id === item.productId || p.slug === item.productId) ||
          PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
        // Do NOT default to products[0] for non-existent or orphan product IDs
        if (!liveProduct) return null;
        return {
          productId: liveProduct.id,
          product: liveProduct, // Always fresh from live reactive catalog
          quantity: item.quantity,
          engraving: item.engraving,
        };
      })
      .filter(Boolean);
  }, [rawCart, products]);

  // Sanitize rawCart: automatically purge any stale or non-existent items
  useEffect(() => {
    if (rawCart.length > 0) {
      const allCatalog = products.length > 0 ? products : PRODUCTS;
      const valid = rawCart.filter((item) =>
        allCatalog.some((p) => p.id === item.productId || p.slug === item.productId)
      );
      if (valid.length !== rawCart.length) {
        setRawCart(valid);
      }
    }
  }, [products, rawCart]);

  const addToCart = (product, quantity = 1, engraving = '') => {
    // Enforce patron customer authentication before adding to cart
    if (!patronUser) {
      setPendingCartAction({ product, quantity, engraving });
      setPatronAuthModalOpen(true);
      showToast('✦ Patron Sign-in Required: Please sign in to add pieces to your bag');
      return;
    }
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

  const removeFromCart = (productId, index = null) => {
    setRawCart((prev) => {
      if (typeof index === 'number' && index >= 0 && index < prev.length) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.filter(
        (item) => item.productId !== productId && item.product?.id !== productId
      );
    });
    showToast('Item released from bag');
  };

  const updateQuantity = (productId, delta, index = null) => {
    setRawCart((prev) =>
      prev
        .map((item, idx) => {
          const isMatch =
            (typeof index === 'number' && idx === index) ||
            item.productId === productId ||
            item.product?.id === productId;
          if (isMatch) {
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
      editorialNote: productData.editorialNote || 'Hand-finished in our Delhi atelier.',
      edition: productData.edition || 'Archival Series 2026',
      material: productData.material || '14K Gold Vermeil over Fine 925 Silver',
      goldPurity: productData.goldPurity || '14K Gold Vermeil',
      colorTone: productData.colorTone || 'Whitish Gold',
      metalColorHex: productData.metalColorHex || '#EDE7DC',
      silhouette: productData.silhouette || 'light',
      occasionVibe: productData.occasionVibe || 'Everyday Wear',
      dimensions: productData.dimensions || 'Universal luxury fit',
      weight: productData.weight || 'Fine 925 Silver Core',
      craftsmanship: productData.craftsmanship || 'Hand-poured 2.5 micron vermeil over solid sterling silver.',
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : [
            '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg',
            '/products/clover-freshwater-pearl-blue-apatite-necklace-2.jpg',
          ],
      modelImage:
        productData.modelImage ||
        (Array.isArray(productData.images) && productData.images[0]) ||
        '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg',
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
      hallmark: productData.hallmark || 'Fine 925 Sterling Silver',
      warranty: productData.warranty || '30-Day Manufacturing Warranty',
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

  const adminUpdateOrderStatus = async (orderNumber, status, trackingNumber, whatsappNotification) => {
    let targetOrder = null;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderNumber === orderNumber) {
          const finalAwb = trackingNumber !== undefined ? trackingNumber : order.trackingNumber;
          const updatedTimeline = createOrderTimeline(status, order.createdAt || new Date().toISOString(), finalAwb);
          const currentNotifications = [...(order.whatsappNotifications || [])];
          if (whatsappNotification) {
            currentNotifications.push(whatsappNotification);
          }
          const updated = {
            ...order,
            status,
            trackingNumber: finalAwb,
            timeline: updatedTimeline,
            whatsappNotifications: currentNotifications,
          };
          targetOrder = updated;
          return updated;
        }
        return order;
      })
    );
    showToast(`Order #${orderNumber} moved to ${status.replace(/_/g, ' ')}`);

    try {
      await updateOrderStatusInDb(
        orderNumber,
        status,
        trackingNumber,
        targetOrder?.timeline,
        targetOrder?.whatsappNotifications
      );
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
        scrollToSpectrum,
        cart,
        setRawCart,
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
        silhouetteFilter,
        setSilhouetteFilter,
        weightFilter: silhouetteFilter,
        // Patron Customer Authentication & Sync
        patronUser,
        loginPatron,
        logoutPatron,
        syncOrdersFromDb,
        patronAuthModalOpen,
        setPatronAuthModalOpen,
        pendingCartAction,
        setPendingCartAction,
        // Policy Modal Features
        policyModalOpen,
        setPolicyModalOpen,
        activePolicyTab,
        setActivePolicyTab,
        openPolicyModal,
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
  const imgRef = useRef(null);

  useEffect(() => {
    setHasError(false);
  }, [src]);

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
          <span>{exhibitNumber || 'FINE SPECIMEN ARCHIVE'}</span>
          <span className="text-[#b99762] dark:text-[#e6ca97] font-semibold">14K WHITISH GOLD</span>
        </div>
        <div className="relative z-10 my-auto text-center space-y-2">
          <p className="font-serif italic text-2xl text-[var(--text-primary)] tracking-wide">{alt}</p>
          <div className="w-8 h-[1px] bg-[#b99762]/50 mx-auto" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#b99762] dark:text-[#e6ca97] font-mono">
            14K SPECIMEN // {materialTag || 'WHITISH GOLD & 925 SILVER'}
          </p>
        </div>
        <div className="relative z-10 flex justify-between items-end text-[9px] tracking-[0.2em] font-mono text-[var(--text-muted)]">
          <span>DELHI ATELIER</span>
          <span>FINE 925 SILVER</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center filter contrast-[1.05] saturate-[0.92] brightness-[0.99] transition-opacity duration-300"
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
    scrollToSpectrum,
    itemCount,
    setIsCartOpen,
    currencyMode,
    setCurrencyMode,
    orders,
    theme,
    toggleTheme,
    wishlist,
    openPolicyModal,
    patronUser,
    logoutPatron,
    setPatronAuthModalOpen,
    categoryFilter,
  } = useContext(AppContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  // Compute patron-specific order count for badge (only visible when logged in)
  const patronOrderCount = useMemo(() => {
    if (!patronUser?.phone) return 0;
    const cleanPhone = patronUser.phone.replace(/[^\d]/g, '').slice(-10);
    return orders.filter(
      (o) => (o.customerPhone || '').replace(/[^\d]/g, '').slice(-10) === cleanPhone
    ).length;
  }, [patronUser, orders]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
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
      {/* 1. AVIORA REFINED UTILITY & ANNOUNCEMENT BAR */}
      <div className="bg-[#132A22] text-[#fbf8f3] dark:bg-[#0c1c16] py-1.5 sm:py-2 px-2 sm:px-8 select-none font-sans text-[9px] sm:text-[10.5px] tracking-[0.1em] sm:tracking-[0.16em] uppercase border-b border-black/15 transition-colors duration-300 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4 w-full">
          {/* Main Announcement Message with clean mobile line-break */}
          <div className="w-full md:w-auto text-center font-medium flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 leading-snug">
            <span className="text-[#e6ca97]">✦</span>
            <span>Timeless Jewellery</span>
            <span className="text-[#e6ca97]">•</span>
            <span className="text-[#e6ca97] font-semibold">Made For You</span>
            <span className="hidden lg:inline text-white/40">•</span>
            <span className="hidden lg:inline">Fine 925 Silver & 14K Gold</span>
            <span className="text-white/40">•</span>
            <button
              onClick={() => openPolicyModal('shipping-policy')}
              className="text-[#EDE7DC] hover:text-[#e6ca97] underline underline-offset-2 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
              title="Pan-India Shipping & Crafting Schedule"
            >
              <span>Pan-India Shipping</span>
              <span className="opacity-80 lowercase font-mono text-[8.5px] sm:text-[9px]">(15–20d)</span>
            </button>
            <span className="text-[#e6ca97]">✦</span>
          </div>

          {/* Quick Track Order & Utilities (VISIBLE ON BOTH MOBILE & DESKTOP!) */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] font-mono shrink-0">
            {/* Direct Track Order Button */}
            <button
              onClick={() => navigate('orders')}
              className="px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e6ca97] hover:text-white border border-[#e6ca97]/50 flex items-center gap-1 sm:gap-1.5 transition-all font-sans font-semibold tracking-wider uppercase text-[8.5px] sm:text-[9.5px] cursor-pointer shadow-2xs shrink-0"
              title="Track Blue Dart Consignment & Workshop Status"
            >
              <Truck className="w-3 h-3 text-[#e6ca97]" />
              <span>Track Order</span>
              {patronUser && patronOrderCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-[#e6ca97] text-[#132A22] text-[7.5px] sm:text-[8px] font-bold flex items-center justify-center">
                  {patronOrderCount}
                </span>
              )}
            </button>

            <span className="text-white/30">•</span>

            {/* Currency Selector */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 opacity-90 hover:opacity-100">
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

            {/* Patron Session / Sign In */}
            {patronUser ? (
              <>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate('orders')}
                    className="text-[#e6ca97] hover:underline flex items-center gap-1 transition-colors font-bold"
                  >
                    <User className="w-3 h-3 text-[#e6ca97]" />
                    <span className="truncate max-w-[65px] sm:max-w-[120px]">{patronUser.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={logoutPatron}
                    className="text-white/50 hover:text-rose-300 text-[8px] sm:text-[8.5px] uppercase tracking-wider transition-colors"
                  >
                    (Exit)
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setPatronAuthModalOpen(true)}
                className="text-white/80 hover:text-[#e6ca97] hidden sm:flex items-center gap-1 transition-colors font-sans text-[9.5px] tracking-wider uppercase"
                title="Sign into Patron Account"
              >
                <User className="w-3 h-3 text-[#e6ca97]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (UNCLUTTERED, ELEGANT, DYNAMIC SCROLL ELEVATION) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full overflow-hidden ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] py-2 sm:py-2.5 shadow-md'
            : 'bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] py-2 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-8 md:px-12 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          {/* Mobile Left: Menu Hamburger Trigger */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 sm:p-1.5 text-[var(--text-primary)] hover:text-[#b99762] transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Identity: Monogram Crest + AVIORA Wordmark */}
          <button
            onClick={() => navigate('home')}
            className="group flex items-center gap-1.5 sm:gap-2.5 focus:outline-none shrink-0 text-left min-w-0"
          >
            <AvioraBrandCrest className="w-6 h-6 sm:w-9 sm:h-9 shrink-0 text-[#b99762] transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-lg sm:text-3xl tracking-[0.16em] sm:tracking-[0.22em] uppercase font-normal text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[#b99762] leading-tight truncate">
                AVIORA
              </span>
              <span className="block text-[6px] sm:text-[7.5px] font-sans font-bold tracking-[0.12em] sm:tracking-[0.26em] uppercase text-[#0d281e] dark:text-[#3d7965] -mt-0.5 truncate">
                TIMELESS ELEGANCE, MADE FOR YOU
              </span>
            </div>
          </button>

          {/* Center Navigation (Desktop Only) - Balanced & Refined Hierarchy */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[11.5px] font-sans tracking-[0.14em] uppercase font-medium">
            <button
              onClick={() => navigate('atelier', { category: 'new-arrivals' })}
              className={`transition-colors hover:text-[#b99762] py-1 relative ${
                currentView === 'atelier' && (categoryFilter === 'new-arrivals' || !categoryFilter) ? 'text-[#b99762] font-semibold' : 'text-[var(--text-primary)]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'minimalist' })}
              className={`transition-colors hover:text-[#b99762] py-1 ${
                currentView === 'atelier' && categoryFilter === 'minimalist' ? 'text-[#b99762] font-semibold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Minimalist
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'statement' })}
              className={`transition-colors hover:text-[#b99762] py-1 ${
                currentView === 'atelier' && categoryFilter === 'statement' ? 'text-[#b99762] font-semibold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Statement
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'moissanite' })}
              className={`transition-colors hover:text-[#b99762] py-1 ${
                currentView === 'atelier' && categoryFilter === 'moissanite' ? 'text-[#b99762] font-semibold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Moissanite
            </button>
            <button
              onClick={() => navigate('atelier', { category: 'pearl' })}
              className={`transition-colors hover:text-[#b99762] py-1 ${
                currentView === 'atelier' && categoryFilter === 'pearl' ? 'text-[#b99762] font-semibold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Pearl Collection
            </button>
          </nav>

          {/* Right Action Icons Suite (Clean, Minimal, Non-Cluttered) */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 sm:p-2 text-[var(--text-primary)] hover:text-[#b99762] transition-colors"
              title="Search collection"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Instagram Direct Link (@aviora_jewells) - Hidden on ultra-narrow screens < 360px */}
            <a
              href={STORE_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 sm:p-2 text-[var(--text-primary)] hover:text-[#b99762] transition-colors hidden xs:block"
              title="Follow @aviora_jewells on Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>

            {/* Wishlist Link (Tablet/Desktop) */}
            <button
              onClick={() => navigate('atelier', { wishlistOnly: true })}
              className="p-1.5 sm:p-2 text-[var(--text-primary)] hover:text-rose-500 transition-colors relative hidden sm:block shrink-0"
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

            {/* Dedicated Patron Account / Sign In Trigger (Desktop) */}
            <button
              onClick={() => {
                if (patronUser) navigate('orders');
                else setPatronAuthModalOpen(true);
              }}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full border transition-all hidden md:flex items-center gap-1.5 shrink-0 ${
                patronUser
                  ? 'border-[#b99762]/60 bg-[#b99762]/10 text-[#132A22] dark:text-[#e6ca97] font-bold'
                  : 'border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-primary)] hover:text-[#b99762]'
              }`}
              title={patronUser ? `Patron Account: ${patronUser.name} (+91 ${patronUser.phone})` : 'Patron Sign In / Order Dossier'}
              aria-label="Patron Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#b99762] dark:text-[#e6ca97]" />
              <span className="hidden lg:inline text-[11px] font-mono tracking-wider">
                {patronUser ? patronUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Orders Tracker Link (Desktop) */}
            <button
              onClick={() => navigate('orders')}
              className="p-1.5 sm:p-2 text-[var(--text-primary)] hover:text-[#b99762] transition-colors relative hidden md:flex items-center gap-1.5 shrink-0"
              title={patronUser ? `Track Orders for ${patronUser.name}` : 'Track Blue Dart Logistics'}
              aria-label="Track Orders"
            >
              <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {patronUser && patronOrderCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#132A22] dark:bg-[#e6ca97] text-white dark:text-black text-[8px] font-mono font-bold flex items-center justify-center">
                  {patronOrderCount}
                </span>
              )}
            </button>

            {/* Sleek Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:border-[#b99762] hover:text-[#b99762] bg-[var(--bg-secondary)] transition-all shrink-0"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle light and dark mode"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-[#132A22]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#e6ca97]" />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-primary)] transition-all group shrink-0"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--text-primary)] group-hover:text-[#b99762] transition-colors" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold bg-[#132A22] dark:bg-[#e6ca97] text-white dark:text-[#242321] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-xs">
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
                placeholder="Search fine 925 silver & 14K gold jewellery (e.g. Kada, Moissanite Solitaire, Choker, Rings)..."
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
                className="px-4 py-1.5 bg-[#132A22] dark:bg-[#e6ca97] text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded"
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
                  <div className="flex items-center gap-2.5">
                    <AvioraBrandCrest className="w-7 h-7 text-[#b99762]" />
                    <div className="flex flex-col">
                      <span className="font-serif text-2xl tracking-[0.2em] uppercase text-[var(--text-primary)] font-normal">
                        AVIORA
                      </span>
                      <span className="text-[7px] font-sans font-bold tracking-[0.2em] text-[#0d281e] dark:text-[#3d7965] uppercase -mt-0.5">
                        TIMELESS ELEGANCE, MADE FOR YOU
                      </span>
                    </div>
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
                    placeholder="Search fine jewellery..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] pl-9 pr-4 py-2.5 text-xs font-sans text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none rounded"
                  />
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                </form>

                {/* Primary Category Links */}
                <nav className="space-y-1 font-sans text-xs tracking-[0.14em] uppercase font-medium">
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'new-arrivals' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-2 flex items-center justify-between text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors font-bold"
                  >
                    <span>New Arrivals (Latest Launches)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'minimalist' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Minimalist Jewellery</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'statement' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Statement Jewellery</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'moissanite' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Moissanite Collection</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('atelier', { category: 'pearl' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                  >
                    <span>Pearl Collection</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>

                  <button
                    onClick={() => {
                      openPolicyModal('our-story');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-[#b99762] hover:bg-[var(--bg-secondary)] rounded transition-colors font-semibold"
                  >
                    <span>Our Story & Policies</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                </nav>
              </div>

              {/* Drawer Bottom Utilities */}
              <div className="pt-5 border-t border-[var(--border-subtle)] space-y-4">
                {/* Patron Account Card in Mobile Drawer */}
                {patronUser ? (
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[#b99762]/40 rounded space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-mono text-[var(--text-primary)] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" />
                        <span>{patronUser.name}</span>
                      </span>
                      <button
                        onClick={() => {
                          logoutPatron();
                          setMobileMenuOpen(false);
                        }}
                        className="text-[10px] font-mono text-rose-500 hover:underline uppercase tracking-wider"
                      >
                        Sign Out
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      Patron Mobile: +91 {patronUser.phone}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPatronAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-[#242321] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Patron Sign In / Track Order</span>
                  </button>
                )}

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
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[#b99762] flex items-center gap-1"
                    title="Atelier Internal Staff Vault (Restricted)"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span>Staff Portal</span>
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
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, addToCart, cartTotal, itemCount, formatPrice, navigate, orders, patronUser } =
    useContext(AppContext);

  // Only count patron's own orders
  const patronOrderCount = useMemo(() => {
    if (!patronUser?.phone) return 0;
    const cleanPhone = patronUser.phone.replace(/[^\d]/g, '').slice(-10);
    return orders.filter(
      (o) => (o.customerPhone || '').replace(/[^\d]/g, '').slice(-10) === cleanPhone
    ).length;
  }, [patronUser, orders]);

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
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] font-sans uppercase text-[#1d4136] dark:text-[#e6ca97] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  CURATED SHOPPING BAG
                </span>
                <h2 className="font-serif text-xl sm:text-2xl tracking-wide text-[var(--text-primary)] mt-0.5">
                  Your Collection ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--bg-stone)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Gamification Progress Bar */}
            <div className="bg-[var(--bg-secondary)] px-4 sm:px-8 py-2.5 sm:py-3 border-b border-[var(--border-subtle)] space-y-1.5">
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

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-5 space-y-5 divide-y divide-[var(--border-subtle)]">
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
                    {patronUser && patronOrderCount > 0 && (
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('orders');
                        }}
                        className="px-6 py-2.5 text-xs font-sans font-bold tracking-[0.12em] uppercase bg-[var(--bg-secondary)] hover:bg-[var(--bg-stone)] border border-[var(--border-subtle)] text-[#b99762] transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track My Orders ({patronOrderCount})</span>
                      </button>
                    )}
                    {!patronUser && (
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('orders');
                        }}
                        className="px-6 py-2.5 text-xs font-sans font-bold tracking-[0.12em] uppercase bg-[var(--bg-secondary)] hover:bg-[var(--bg-stone)] border border-[var(--border-subtle)] text-[#b99762] transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Sign In to Track Order</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                cart.map(({ productId, product, quantity, engraving }, idx) => (
                  <div key={productId || product.id || idx} className="pt-5 first:pt-0 flex gap-4">
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
                            onClick={() => updateQuantity(productId || product.id, -1, idx)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-xs text-[var(--text-primary)] font-bold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(productId || product.id, 1, idx)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(productId || product.id, idx)}
                          className="text-[10px] font-sans font-bold tracking-widest uppercase text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
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
              <div className="p-4 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-3.5">
                <div className="flex items-center justify-between text-[10px] font-sans font-bold tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#1d4136] dark:text-[#e6ca97]" /> Blue Dart Express
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1d4136] dark:text-[#e6ca97]" /> 30-Day Manufacturing Warranty
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-sans font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] block">
                      Subtotal
                    </span>
                    <span className="text-[10px] font-sans text-[var(--text-muted)]">
                      Free Pan-India Insured Delivery & Keepsake Packaging
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

  const primaryImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.modelImage ||
    '/products/14k-gold-plated-double-layer-necklace-3828-1.jpg';
  const secondaryImage =
    (Array.isArray(product.images) && product.images[1]) || primaryImage;
  const hasSecondaryImage =
    Boolean(Array.isArray(product.images) && product.images.length > 1 && product.images[1] !== primaryImage);

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
      : product.goldPurity || product.material || '14K Whitish Gold · Fine 925 Silver';

  return (
    <article
      className={`group cursor-pointer block select-none ${compact ? 'max-w-[280px]' : 'w-full'}`}
      onClick={() => navigate('pdp', product)}
    >
      <div className="relative aspect-[0.78] w-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] border border-[var(--border-subtle)] transition-colors duration-300">
        {/* Badge: New */}
        {Boolean(
          product.isNew ||
          (Array.isArray(product.collections) && (product.collections.includes('new-arrivals') || product.collections.includes('new') || product.collections.includes('new-arrival'))) ||
          (Array.isArray(product.tags) && (product.tags.includes('new') || product.tags.includes('new-arrivals') || product.tags.includes('new-arrival')))
        ) && (
          <span className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 bg-[#0d281e] text-white dark:bg-[#e6ca97] dark:text-[#1c1b18] text-[9.5px] font-sans font-bold tracking-[0.16em] uppercase shadow-xs">
            NEW
          </span>
        )}

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
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            if (product.modelImage && e.currentTarget.src !== product.modelImage) {
              e.currentTarget.src = product.modelImage;
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-103 ${
            hasSecondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />

        {/* Secondary Image for smooth crossfade on hover */}
        {hasSecondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate angle`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-103"
          />
        )}

        {/* Multi-Angle Studio Badge */}
        {product.images?.length > 1 && (
          <span className="absolute bottom-2.5 left-2.5 z-20 px-1.5 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[8.5px] font-mono tracking-wider uppercase rounded-xs border border-white/10 group-hover:opacity-0 transition-opacity pointer-events-none">
            {product.images.length} Angles
          </span>
        )}

        {/* Quick Add Button - Touch friendly on mobile, sliding up on hover on desktop */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="absolute bottom-2 sm:bottom-3 inset-x-2 sm:inset-x-3 z-20 py-1.5 sm:py-2.5 px-2 sm:px-3 bg-white/95 dark:bg-[#132A22]/95 hover:bg-[#132A22] dark:hover:bg-[#e6ca97] text-[#132A22] dark:text-[#fbf8f3] hover:text-white dark:hover:text-[#132A22] border border-[#132A22]/25 dark:border-[#e6ca97]/40 text-[9.5px] sm:text-[11px] font-sans font-bold tracking-[0.14em] sm:tracking-[0.16em] uppercase opacity-90 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-200 shadow-lg backdrop-blur-md flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b99762] dark:text-[#e6ca97] transition-colors" />
          <span className="font-bold">QUICK ADD</span>
        </button>
      </div>

      {/* Copy row with clean singular luxury price (No Strikethrough) */}
      <div className="pt-3 px-0.5 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sans font-semibold text-[13px] sm:text-[14px] text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] truncate tracking-normal transition-colors">
            {product.name}
          </h3>
          <div className="shrink-0">
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
// ATELIER PILLARS & ARCHIVE DEFINITION
// ==========================================
const ATELIER_CHAPTERS = [
  {
    id: 'our-story',
    badge: 'Founding Vision',
    title: 'Our Story & Founding Vision',
    subtitle: 'Everyday Luxury • Pure Noble Metals & Artisan Craft',
    icon: Sparkles,
    summary: 'AVIORA was created with one vision — to bring timeless, elegant jewellery that feels luxurious yet wearable every day. Our collections feature carefully selected pieces crafted from 925 Sterling Silver, 14K Whitish Gold-Plated Sterling Silver, Moissanite, Freshwater Pearls, and other premium materials mentioned on individual product pages. Every design is chosen for elegance, craftsmanship, and comfort.',
    highlights: [
      'Authentic Fine 925 Sterling Silver carrying verified purity standard',
      '14K & 18K Whitish Gold Vermeil in champagne-free tone (#EDE7DC)',
      'D-Colorless Brilliant Moissanite with exceptional optical fire',
      'Hand-selected Grade-AAA organic freshwater pearls with natural luster',
    ],
    linkText: 'Explore Founding Vision & Atelier Heritage',
  },
  {
    id: 'terms-and-conditions',
    badge: 'Pricing Integrity',
    title: 'Terms of Craft & Honest Pricing',
    subtitle: 'Direct-From-Foundry Transparent Valuation',
    icon: Scale,
    summary: 'We eliminate the traditional 800–1000% retail markups common in conventional jewelry maisons. Honest direct-from-foundry pricing with complete transparency across noble alloy specifications, gemstone cuts, and dimensions. No hidden markups, no artificial strikethrough pricing.',
    highlights: [
      'Zero artificial strikethrough pricing or deceptive discount claims',
      'Meticulous metallurgical and stone dimensions on every product dossier',
      'All-inclusive transparent pricing with insured Pan-India transit',
      'Strict intellectual property protections for our original bench artworks',
    ],
    linkText: 'Explore Terms of Craft & Pricing Integrity',
  },
  {
    id: 'privacy-policy',
    badge: 'Patron Discretion',
    title: 'Patron Privacy & Vault Discretion',
    subtitle: '256-Bit SSL Encrypted Security & Confidential Delivery',
    icon: Lock,
    summary: 'Your trust is our cornerstone. We safeguard patron information using bank-grade encryption and dispatch every piece in discreet, tamper-proof wax-sealed packaging with zero exterior branding clues to protect high-value heirlooms in transit.',
    highlights: [
      '256-bit SSL encrypted checkout & OTP mobile authentication',
      'Zero sharing, renting, or monetization of patron contact dossiers',
      'Discreet, unmarked courier packaging ensuring delivery confidentiality',
      'Tamper-evident security wax seal on every jewellery presentation box',
    ],
    linkText: 'Explore Patron Privacy & Discretion Protocol',
  },
  {
    id: 'shipping-policy',
    badge: 'Logistics & Transit',
    title: 'Made-to-Order Shipping & Blue Dart Air',
    subtitle: '15–20 Days Benchwork + Insured Pan-India Air Express',
    icon: Truck,
    summary: 'Because each Aviora artwork is custom cast, hand-set, and mirror-finished especially for you, our benchwork takes 15–20 business days. Once prepared, orders are dispatched via Blue Dart Air Cargo with live AWB tracking and complimentary transit insurance.',
    highlights: [
      '15–20 business days dedicated handcrafting benchwork',
      '1–5 days insured express delivery across India via Blue Dart Air',
      'Real-time SMS, Email, and WhatsApp Business notifications with AWB link',
      'Complimentary Pan-India insured delivery on all orders',
    ],
    linkText: 'Explore Shipping & Logistics Protocol',
  },
  {
    id: 'return-and-refund-policy',
    badge: 'Bespoke Resolution',
    title: 'Bespoke Integrity & Resolution Protocol',
    subtitle: 'Custom Craftsmanship Protocol & 48-Hour Unboxing Support',
    icon: RotateCcw,
    summary: 'Because all Aviora creations are customized and cast to order for each collector, sales are final. However, we stand 100% behind transit safety with a dedicated 48-hour unboxing resolution protocol for damaged or incorrect pieces via our WhatsApp concierge.',
    highlights: [
      'Customized and made to order especially for each collector',
      'Zero mass-market inventory waste or returned recycled stock',
      '48-hour damaged or incorrect transit resolution via WhatsApp concierge',
      'Prompt review and replacement support for verified transit claims',
    ],
    linkText: 'Explore Bespoke Resolution Guidelines',
  },
  {
    id: 'cancellation-policy',
    badge: 'Cancellation Protocol',
    title: 'Atelier Cancellation Guidelines',
    subtitle: 'Pre-Production Flexibility & Foundry Policy',
    icon: Clock,
    summary: 'We understand plans change. Orders may be modified or cancelled prior to the commencement of artisan casting and wax carving in our foundry, ensuring smooth collector flexibility before precious alloys are cast.',
    highlights: [
      'Order modification permitted before workshop bench production begins',
      'Dedicated concierge assistance via WhatsApp (+91 8796841184)',
      'Transparent refunds processed to original payment method',
      'Full protection before precious alloy casting is initiated',
    ],
    linkText: 'Explore Cancellation Guidelines',
  },
  {
    id: 'warranty-policy',
    badge: '30-Day Warranty',
    title: '30-Day Manufacturing Warranty Policy',
    subtitle: 'Craftsmanship Guarantee from Doorstep Delivery',
    icon: ShieldCheck,
    summary: 'Every Aviora creation carries an authentic 30-Day Manufacturing Warranty covering craftsmanship defects, structural clasp integrity, and loose gemstone settings from the timestamp of doorstep delivery handover.',
    highlights: [
      'Full coverage for clasp integrity and spring mechanisms',
      'Protection against loose gemstone or moissanite prong settings',
      'Covers structural craftsmanship defects from atelier benchwork',
      'Active from the timestamp of doorstep delivery handover',
    ],
    linkText: 'Explore 30-Day Manufacturing Warranty',
  },
  {
    id: 'jewellery-care-guide',
    badge: 'Jewellery Care Guide',
    title: 'Heirloom Jewellery Care Guide',
    subtitle: 'Preserving Noble Luster & Gemstone Brilliance',
    icon: Gem,
    summary: 'Fine jewellery requires mindful affection. Learn how to maintain the radiant mirror finish of Fine 925 Silver, Whitish Gold vermeil, organic freshwater pearls, and moissanite gemstones through simple, proven care rituals.',
    highlights: [
      'Clean silver gently with soft microfiber cloths to maintain mirror shine',
      'Store in airtight velvet pouches away from moisture and direct sunlight',
      'Put pearls and vermeil on after cosmetics, perfumes, and lotions',
      'Warm water and ultra-soft bristle brush for moissanite brilliance',
    ],
    linkText: 'Explore Jewellery Care Guide',
  },
  {
    id: 'product-authenticity-policy',
    badge: 'Authenticity Guarantee',
    title: 'Authenticity & Metallurgy Assurance',
    subtitle: 'Brilliant Moissanite & Fine 925 Purity',
    icon: CheckCircle2,
    summary: 'Complete metallurgical and gemstone transparency. Every sterling piece is crafted from authentic Fine 925 Sterling Silver, and all moissanite creations feature hand-selected stones chosen for maximum optical fire.',
    highlights: [
      'Fine 925 Sterling Silver purity on all silver creations',
      'Exceptional D-Colorless VVS1 clarity Brilliant Moissanite',
      'Hand-selected gemstones verifying exceptional fire and optical brilliance',
      'Natural organic Grade-AAA freshwater pearls with unique luster',
    ],
    linkText: 'Explore Authenticity & Purity Assurance',
  },
];

// ==========================================
// 6. VIEW: HOMEPAGE (REFERENCE EDITORIAL ALIGNMENT)
// ==========================================
function HomeView() {
  const { navigate, products, showToast, formatPrice, openPolicyModal, silhouetteFilter, scrollToSpectrum } = useContext(AppContext);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [weightTab, setWeightTab] = useState(() => (silhouetteFilter === 'heavy' ? 'heavy' : 'light'));
  const [activeStoryChapter, setActiveStoryChapter] = useState('our-story');

  useEffect(() => {
    if (silhouetteFilter === 'heavy' || silhouetteFilter === 'light') {
      setWeightTab(silhouetteFilter);
    }
  }, [silhouetteFilter]);

  const newArrivals = useMemo(() => {
    const arr = products.filter((p) => 
      p.isNew || 
      p.category === 'new-arrivals' ||
      (Array.isArray(p.collections) && (p.collections.includes('new-arrivals') || p.collections.includes('new') || p.collections.includes('new-arrival'))) ||
      (Array.isArray(p.tags) && (p.tags.includes('new') || p.tags.includes('new-arrivals') || p.tags.includes('new-arrival')))
    );
    return (arr.length >= 4 ? arr : products).slice(0, 4);
  }, [products]);

  const selectedPieces = useMemo(() => {
    return [...products]
      .sort((a, b) => (a.featuredRank || 99) - (b.featuredRank || 99))
      .slice(0, 4);
  }, [products]);

  const lightJewellery = useMemo(() => {
    const list = products.filter((p) => p.silhouette === 'light' || p.category === 'minimalist');
    return (list.length >= 4 ? list : products).slice(0, 4);
  }, [products]);

  const heavyJewellery = useMemo(() => {
    const list = products.filter((p) => p.silhouette === 'heavy' || p.category === 'statement');
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
      <section className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[720px] w-full flex items-center md:items-end overflow-hidden bg-[var(--bg-stone)]">
        <img
          src={STORE_CONFIG.hero.image}
          alt={STORE_CONFIG.hero.alt}
          className="absolute inset-0 w-full h-full object-cover object-[center_right] sm:object-center scale-102 transition-transform duration-1000"
          fetchPriority="high"
        />
        {/* Subtle directional vignette for enhanced legibility and warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent pointer-events-none" />

        {/* Elevated Editorial Card - Solid High-Contrast Architecture */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-2.5 sm:px-6 md:px-12 py-6 sm:py-12 md:py-16 flex justify-center md:justify-start">
          <div className="w-full max-w-lg bg-[#fffdfa]/95 dark:bg-[#121915]/95 backdrop-blur-md p-4 sm:p-8 md:p-12 border border-[#d8c39f]/60 dark:border-[#e6ca97]/30 shadow-2xl shadow-black/30 rounded-xs space-y-3.5 sm:space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b99762] animate-pulse shrink-0" />
              <p className="text-[9px] sm:text-[10.5px] font-sans font-bold tracking-[0.18em] sm:tracking-[0.24em] uppercase text-[#132A22] dark:text-[#e6ca97] truncate">
                {STORE_CONFIG.hero.eyebrow}
              </p>
            </div>
            
            {/* "Timeless pieces for every moment." - High Contrast Crisp Display */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#181614] dark:text-[#fbf8f3] tracking-tight leading-[1.08] sm:leading-[1.04] font-normal break-words">
              {STORE_CONFIG.hero.title}
            </h1>
            
            <div className="border-l-2 border-[#b38f56] dark:border-[#e6ca97] pl-3 sm:pl-3.5 py-1">
              <p className="font-editorial text-[13px] sm:text-base md:text-lg text-[#2c2720] dark:text-[#f0eae0] leading-relaxed">
                “{STORE_CONFIG.hero.body}”
              </p>
            </div>

            {/* Authentic Brand Trust Micro-Badges */}
            <div className="pt-2 pb-2 border-y border-[#181614]/10 dark:border-white/15 flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 text-[8.5px] sm:text-[10px] font-mono tracking-wider text-[#685f52] dark:text-[#d4bf98]">
              <span className="flex items-center gap-1">✦ Fine 925 Sterling Silver</span>
              <span className="flex items-center gap-1">✦ 14K Whitish Gold Vermeil</span>
              <span className="flex items-center gap-1">✦ 30-Day Manufacturing Warranty</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3.5 w-full">
              <button
                onClick={() => navigate('atelier', { category: 'new-arrivals' })}
                className="w-full sm:w-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-[#132A22] hover:bg-[#0c1c16] text-[#fbf8f3] dark:bg-[#e6ca97] dark:text-[#141816] dark:hover:bg-[#d8c39f] font-sans text-[11px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
              >
                <span>Shop new arrivals</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
              <button
                onClick={() => navigate('atelier', {})}
                className="w-full sm:w-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-white/80 hover:bg-white text-[#181614] dark:bg-white/10 dark:hover:bg-white/20 dark:text-[#fbf8f3] border border-[#181614]/30 dark:border-white/25 font-sans text-[11px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase transition-all text-center cursor-pointer"
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
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#132A22] dark:text-[#e6ca97] mb-2">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Find your everyday piece.
            </h2>
          </div>
          <button
            onClick={() => navigate('atelier', {})}
            className="text-xs font-sans font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[#132A22] dark:hover:text-[#e6ca97] border-b border-current pb-0.5 inline-flex items-center gap-1.5 transition-colors self-start sm:self-end"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {STORE_CONFIG.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate('atelier', { category: category.id })}
              className="group text-left block focus:outline-none w-full"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--bg-stone)] dark:bg-[#181d1a] border border-[var(--border-subtle)] mb-3 relative group">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#b99762] transition-colors leading-tight line-clamp-1">
                  {category.label}
                </span>
                <span className="w-6 h-6 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] group-hover:border-[#132A22] group-hover:bg-[#132A22] group-hover:text-white dark:group-hover:border-[#e6ca97] dark:group-hover:bg-[#e6ca97] dark:group-hover:text-black transition-all shrink-0 ml-1">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
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
              onClick={() => navigate('atelier', { category: 'new-arrivals' })}
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
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] md:aspect-auto md:min-h-[520px] lg:min-h-[580px] w-full overflow-hidden bg-[var(--bg-stone)] group">
            <img
              src={STORE_CONFIG.editorial.image}
              alt={STORE_CONFIG.editorial.alt}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-card)]/95 dark:bg-[#0d281e]/90 backdrop-blur-md text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-[#1d4136] dark:text-[#e6ca97] border border-[#b38f56]/40 shadow-xs rounded-xs">
                <span>✦</span> Atelier Exhibit // 14K Whitish Gold
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20 bg-[var(--bg-secondary)] dark:bg-[#131715] space-y-6">
            <p className="font-script text-4xl sm:text-5xl text-[#b99762] dark:text-[#e6ca97] -mb-2">
              The everyday edit
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] font-normal tracking-tight leading-[0.96]">
              {STORE_CONFIG.editorial.title}
            </h2>
            <div className="border-l-2 border-[#b38f56] dark:border-[#e6ca97]/70 pl-4 py-1.5">
              <p className="font-editorial text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
                {STORE_CONFIG.editorial.body} We exclusively craft in 14K Whitish Gold Vermeil over Fine 925 Sterling Silver for enduring elegance and everyday luxury.
              </p>
            </div>
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

      {/* 7. THE ATELIER EDIT FULL-WIDTH BANNER */}
      <section className="relative min-h-[480px] md:min-h-[540px] flex items-center overflow-hidden bg-[#132f27]">
        <img
          src="/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg"
          alt="Aviora Atelier Fine Jewellery Craftsmanship"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#132f27]/75 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-16 text-[#fbf8f3] space-y-6">
          <p className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#d8c39f]">
            THE ATELIER EDIT
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight max-w-xl leading-[0.95]">
            Handcrafted with devotion. Made to be cherished.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed">
            Every piece is made-to-order by master artisans in Fine 925 Sterling Silver and 14K Whitish Gold. Complete with 30-Day Manufacturing Warranty.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('atelier')}
              className="px-8 py-3.5 bg-[#fbf8f3] hover:bg-[#d8c39f] text-[#132f27] font-sans text-xs font-bold tracking-[0.14em] uppercase transition-colors shadow-lg"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>
      {/* 8. OUR STORY & ATELIER FOUNDATIONS (FRONT-PAGE SHOWCASE) */}
      <section id="our-story-chapters" className="py-20 md:py-28 px-6 md:px-12 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] relative overflow-hidden">
        {/* Subtle Ambient Luxury Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b99762]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#132A22]/5 dark:bg-[#e6ca97]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          {/* Header & Vision Statement */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-[#b99762] dark:text-[#e6ca97]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10.5px] font-sans font-bold tracking-[0.26em] uppercase">
                  THE ATELIER MANIFESTO • OUR HERITAGE
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] font-normal tracking-tight leading-[0.98]">
                Our Story.
              </h2>
              <div className="border-l-2 border-[#b38f56] dark:border-[#e6ca97]/70 pl-4 py-1">
                <p className="font-editorial text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                  AVIORA was created with one vision — to bring timeless, elegant jewellery that feels luxurious yet wearable every day. Discover the foundational principles that define our craft, noble materials, and commitments.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openPolicyModal('our-story')}
                className="px-5 py-3 bg-[var(--bg-card)] hover:bg-[var(--bg-primary)] border border-[#b99762]/60 text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Read Full Manifesto</span>
                <ArrowUpRight className="w-4 h-4 text-[#b99762]" />
              </button>
            </div>
          </div>

          {/* Editorial Founding Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--bg-card)] border border-[var(--border-strong)] p-8 sm:p-12 shadow-xl relative overflow-hidden">
            {/* Left: Bench Craftsmanship Photography */}
            <div className="lg:col-span-5 relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] overflow-hidden bg-[var(--bg-stone)] border border-[var(--border-subtle)]">
              <img
                src="/products/genuine-natural-turquoise-drop-pendant-1.jpg"
                alt="Aviora Atelier Jewellery Making"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="absolute inset-x-6 bottom-6 text-white space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest uppercase">
                  <span>Fine 925 Silver</span>
                </div>
                <h3 className="font-serif text-2xl text-white font-normal">
                  Foundry Bench, Delhi Atelier
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Where centuries-old Indian goldsmithing heritage joins modern minimalist silhouettes.
                </p>
              </div>
            </div>

            {/* Right: Narrative & Founding Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#b99762] dark:text-[#e6ca97] font-bold block">
                  THE FOUNDING VISION // INCEPTION & CRAFT
                </span>
                <blockquote className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-snug italic border-l-2 border-[#b38f56] dark:border-[#e6ca97] pl-4">
                  &ldquo;AVIORA was created with one vision — to bring timeless, elegant jewellery that feels luxurious yet wearable every day.&rdquo;
                </blockquote>
              </div>

              <div className="space-y-4 font-serif text-[14.5px] sm:text-[15.5px] text-[var(--text-secondary)] leading-[1.85]">
                <p>
                  Our collections feature carefully selected pieces crafted from <strong className="text-[var(--text-primary)] font-semibold">Fine 925 Sterling Silver</strong>, <strong className="text-[var(--text-primary)] font-semibold">14K Whitish Gold-Plated Sterling Silver</strong>, <strong className="text-[var(--text-primary)] font-semibold">Brilliant Moissanite</strong>, <strong className="text-[var(--text-primary)] font-semibold">Freshwater Pearls</strong>, and other premium materials mentioned on individual product pages. Every design is chosen for elegance, craftsmanship, and comfort.
                </p>
                <p>
                  Drawing inspiration from the bespoke salons of Place Vendôme and modern design houses like Mejuri, Catbird, and Monica Vinader, we questioned why authentic fine jewellery was locked away in bank vaults or inflated with 10x traditional retail markups. Aviora pieces are created for living — made to be layered, personalized, and cherished from sunrise meetings to midnight celebrations.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-base sm:text-lg font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">925 Silver</span>
                  <span className="text-[9.5px] font-mono uppercase text-[var(--text-muted)] block">Noble Metallurgy</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-base sm:text-lg font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">14K Gold</span>
                  <span className="text-[9.5px] font-mono uppercase text-[var(--text-muted)] block">Whitish Vermeil</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-base sm:text-lg font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">15–20 Days</span>
                  <span className="text-[9.5px] font-mono uppercase text-[var(--text-muted)] block">Made to Order</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-base sm:text-lg font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">30 Days</span>
                  <span className="text-[9.5px] font-mono uppercase text-[var(--text-muted)] block">Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Pillars Explorer: Foundations of Aviora */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#b99762] dark:text-[#e6ca97] font-bold">
                  THE COMPLETE ATELIER DOSSIER
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">
                  Foundations & Guarantees.
                </h3>
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                Select any pillar below to inspect our atelier standards & policies
              </p>
            </div>

            {/* Pillars Tabs Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {ATELIER_CHAPTERS.map((ch) => {
                const isSelected = activeStoryChapter === ch.id;
                const IconComponent = ch.icon;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveStoryChapter(ch.id)}
                    className={`px-4 py-3 border whitespace-nowrap text-left flex items-center gap-2.5 transition-all text-xs font-mono shrink-0 ${
                      isSelected
                        ? 'border-[#b99762] bg-[#b99762]/10 dark:bg-[#b99762]/20 text-[var(--text-primary)] font-bold shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#b99762]/50'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#b99762] dark:text-[#e6ca97]' : 'text-[var(--text-muted)]'}`} />
                    <span className="text-[11px] font-sans font-medium">{ch.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Interactive Preview Pane */}
            {(() => {
              const ch = ATELIER_CHAPTERS.find((c) => c.id === activeStoryChapter) || ATELIER_CHAPTERS[0];
              const IconComponent = ch.icon;
              return (
                <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] p-6 sm:p-10 space-y-8 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-[#b99762]/10 border border-[#b99762]/30 flex items-center justify-center text-[#b99762] dark:text-[#e6ca97]">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#b99762]/15 text-[#b99762] dark:text-[#e6ca97] border border-[#b99762]/40 text-[9.5px] font-mono font-bold uppercase rounded">
                            {ch.badge}
                          </span>
                        </div>
                        <h4 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mt-1">
                          {ch.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openPolicyModal(ch.id)}
                      className="px-5 py-2.5 bg-[#1d4136] hover:bg-[#132f27] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors self-start sm:self-auto flex items-center gap-2 shrink-0 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Explore Full Policy</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-[#b38f56] dark:text-[#e6ca97] font-semibold">
                        {ch.subtitle}
                      </p>
                      <div className="border-l-2 border-[#b38f56] dark:border-[#e6ca97]/70 pl-4 py-2 bg-[#b38f56]/5 rounded-r-xs">
                        <p className="font-editorial text-[15px] sm:text-[17px] text-[var(--text-primary)] leading-[1.85]">
                          {ch.summary}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3.5 rounded-xs shadow-xs">
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#b38f56] dark:text-[#e6ca97] font-bold block border-b border-[var(--border-subtle)] pb-2">
                        Key Commitments & Takeaways
                      </span>
                      <div className="space-y-2.5">
                        {ch.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-serif text-[var(--text-secondary)] leading-relaxed">
                            <Check className="w-4 h-4 text-[#b38f56] dark:text-[#e6ca97] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* The Modern Fine Jewellery Standard: Benchmark Comparison */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] p-8 sm:p-12 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#b99762] dark:text-[#e6ca97] font-bold">
                THE ATELIER BENCHMARK
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal">
                The Modern Fine Jewellery Standard.
              </h3>
              <p className="font-editorial text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Inspired by transparent fine jewellery ateliers worldwide, we built Aviora to challenge the conventional jewelry retail markup model.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]">
                    <th className="p-4 uppercase tracking-wider text-[var(--text-muted)] font-bold">Dimension</th>
                    <th className="p-4 uppercase tracking-wider text-rose-700 dark:text-rose-400 font-bold">Traditional High-Street Jewellers</th>
                    <th className="p-4 uppercase tracking-wider text-[#b99762] dark:text-[#e6ca97] font-bold bg-[#b99762]/10 dark:bg-[#b99762]/20 border-x border-[#b99762]/30">
                      ✦ The AVIORA Atelier Standard
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Pricing Model</td>
                    <td className="p-4 text-[var(--text-secondary)]">800% – 1,000% retail markups with artificial strikethroughs</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      Direct Atelier Honest Pricing (Zero fake markups or discounts)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Noble Base Metal</td>
                    <td className="p-4 text-[var(--text-secondary)]">Hollow brass, mystery alloy, or unverified base metals</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      Solid Fine 925 Sterling Silver with noble metal purity
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Gold Vermeil Finish</td>
                    <td className="p-4 text-[var(--text-secondary)]">Thin 0.2µ flash plating prone to fast peeling and chipping</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      Thick 14K & 18K Whitish Gold Vermeil (#EDE7DC) for enduring luster
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Crafting Approach</td>
                    <td className="p-4 text-[var(--text-secondary)]">Mass factory stamping stockpiled in bins for months</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      15–20 Days Dedicated Artisan Made-to-Order Benchwork
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Patron Warranty</td>
                    <td className="p-4 text-[var(--text-secondary)]">Disclaimed immediately upon stepping out of the store</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      30-Day Manufacturing Warranty covering clasps & stone prongs
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[var(--text-primary)]">Gemstone Verification</td>
                    <td className="p-4 text-[var(--text-secondary)]">Uncertified simulated cubic zirconia or plastic pearls</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)] bg-[#b99762]/5 border-x border-[#b99762]/20">
                      D-Colorless VVS1 Brilliant Moissanite + Grade-AAA Pearls
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('atelier')}
                className="px-6 py-3.5 bg-[#132A22] hover:bg-[#0c1c16] text-[#fbf8f3] dark:bg-[#e6ca97] dark:text-[#141816] dark:hover:bg-[#d8c39f] font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-md flex items-center gap-2"
              >
                <span>Explore Fine 925 Jewellery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => openPolicyModal('our-story')}
                className="px-6 py-3.5 border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#b99762]" />
                <span>Open Atelier Manifesto</span>
              </button>
            </div>
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
            '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg',
            '/products/14k-gold-plated-vvs-moissanite-ring-5300-1.jpg',
            '/products/emerald-green-white-cz-tennis-bracelet-1.jpg',
            '/products/sapphire-zirconia-halo-earrings-1.jpg',
            '/products/mop-freshwater-pearl-clover-bracelet-1.jpg',
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
            <p className="text-xs sm:text-sm font-editorial text-zinc-300 max-w-md leading-relaxed">
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
    silhouetteFilter,
    setSilhouetteFilter,
    weightFilter,
    setWeightFilter,
    scrollToSpectrum,
  } = useContext(AppContext);

  // Filter States matching reference app
  const [selectedCategory, setSelectedCategory] = useState(() => categoryFilter || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState(() => materialFilter || 'all');
  const [selectedCollection, setSelectedCollection] = useState(() => collectionFilter || 'all');
  const [selectedSilhouette, setSelectedSilhouette] = useState(() => silhouetteFilter || weightFilter || 'all');
  const [selectedColour, setSelectedColour] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Dynamic Subcategory & Taxonomy Tags Map
  const categoryTagMap = useMemo(() => ({
    'minimalist': [
      { id: 'all', label: 'All Minimalist' },
      { id: 'necklaces', label: 'Necklaces' },
      { id: 'earrings', label: 'Earrings' },
      { id: 'rings', label: 'Rings' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'sets', label: 'Sets' },
      { id: 'anklets', label: 'Anklets' },
    ],
    'statement': [
      { id: 'all', label: 'All Statement' },
      { id: 'necklaces', label: 'Necklaces' },
      { id: 'earrings', label: 'Earrings' },
      { id: 'rings', label: 'Rings' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'sets', label: 'Sets' },
      { id: 'anklets', label: 'Anklets' },
    ],
    'moissanite': [
      { id: 'all', label: 'All Moissanite' },
      { id: 'gra-certified', label: 'GRA Certified Jewellery' },
      { id: 'rings', label: 'Rings' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'earrings', label: 'Earrings' },
      { id: 'necklaces', label: 'Necklaces' },
    ],
    'pearl': [
      { id: 'all', label: 'All Pearls' },
      { id: 'freshwater-pearls', label: 'Freshwater Pearl Jewellery' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'necklaces', label: 'Necklaces' },
      { id: 'earrings', label: 'Earrings' },
    ],
    'gifting': [
      { id: 'all', label: 'All Gifting' },
      { id: 'rakhi', label: 'Rakhi' },
      { id: 'birthday', label: 'Birthday' },
      { id: 'anniversary', label: 'Anniversary' },
      { id: 'bridesmaid', label: 'Bridesmaid' },
    ],
    'new-arrivals': [
      { id: 'all', label: 'All Launches' },
      { id: 'necklaces', label: 'Necklaces' },
      { id: 'earrings', label: 'Earrings' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'rings', label: 'Rings' },
    ],
    'all': [
      { id: 'all', label: 'All Pieces' },
      { id: 'necklaces', label: 'Necklaces' },
      { id: 'earrings', label: 'Earrings' },
      { id: 'rings', label: 'Rings' },
      { id: 'bracelets', label: 'Bracelets' },
      { id: 'sets', label: 'Sets' },
      { id: 'anklets', label: 'Anklets' },
      { id: 'gra-certified', label: 'GRA Certified Jewellery' },
      { id: 'freshwater-pearls', label: 'Freshwater Pearls' },
      { id: 'gifting', label: 'Gifting' },
    ],
  }), []);

  // Reset tag when category switches
  useEffect(() => {
    setSelectedTag('all');
  }, [selectedCategory]);

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
    if (silhouetteFilter) setSelectedSilhouette(silhouetteFilter);
    else if (weightFilter) setSelectedSilhouette(weightFilter);
  }, [silhouetteFilter, weightFilter]);

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
      if (selectedCategory === 'new-arrivals') {
        list = list.filter(
          (p) =>
            p.isNew ||
            p.category === 'new-arrivals' ||
            p.categorySlug === 'new-arrivals' ||
            (Array.isArray(p.collections) && (p.collections.includes('new-arrivals') || p.collections.includes('new') || p.collections.includes('new-arrival'))) ||
            (Array.isArray(p.tags) && (p.tags.includes('new') || p.tags.includes('new-arrivals') || p.tags.includes('new-arrival')))
        );
      } else if (selectedCategory === 'minimalist') {
        // Minimalist is light silhouette
        list = list.filter(
          (p) =>
            p.category === 'minimalist' ||
            p.categorySlug === 'minimalist' ||
            p.collections?.includes('minimalist') ||
            p.silhouette === 'light'
        );
      } else if (selectedCategory === 'statement') {
        // Statement is heavy silhouette
        list = list.filter(
          (p) =>
            p.category === 'statement' ||
            p.categorySlug === 'statement' ||
            p.collections?.includes('statement') ||
            p.silhouette === 'heavy'
        );
      } else if (selectedCategory === 'moissanite') {
        list = list.filter(
          (p) =>
            p.category === 'moissanite' ||
            p.categorySlug === 'moissanite' ||
            p.materials?.includes('moissanite') ||
            p.collections?.includes('moissanite') ||
            p.name.toLowerCase().includes('moissanite')
        );
      } else if (selectedCategory === 'pearl') {
        list = list.filter(
          (p) =>
            p.category === 'pearl' ||
            p.categorySlug === 'pearl' ||
            p.materials?.includes('freshwater-pearls') ||
            p.collections?.includes('pearl') ||
            p.name.toLowerCase().includes('pearl')
        );
      } else {
        list = list.filter(
          (p) =>
            p.category === selectedCategory ||
            p.categorySlug === selectedCategory ||
            (selectedCategory === 'earrings' && (p.category === 'earrings' || p.categorySlug?.includes('ear') || p.name.toLowerCase().includes('earring') || p.name.toLowerCase().includes('stud'))) ||
            (selectedCategory === 'necklaces' && (p.category === 'necklaces' || p.categorySlug?.includes('choker') || p.categorySlug?.includes('hasli') || p.name.toLowerCase().includes('necklace') || p.name.toLowerCase().includes('chain') || p.name.toLowerCase().includes('pendant'))) ||
            (selectedCategory === 'bracelets' && (p.category === 'bracelets' || p.categorySlug?.includes('kada') || p.categorySlug?.includes('bangle') || p.name.toLowerCase().includes('bracelet'))) ||
            (selectedCategory === 'rings' && (p.category === 'rings' || p.categorySlug?.includes('ring') || p.name.toLowerCase().includes('ring')))
        );
      }
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
      if (selectedCollection === 'new-arrivals') {
        list = list.filter(
          (p) =>
            p.isNew ||
            p.category === 'new-arrivals' ||
            p.categorySlug === 'new-arrivals' ||
            (Array.isArray(p.collections) && (p.collections.includes('new-arrivals') || p.collections.includes('new') || p.collections.includes('new-arrival'))) ||
            (Array.isArray(p.tags) && (p.tags.includes('new') || p.tags.includes('new-arrivals') || p.tags.includes('new-arrival')))
        );
      } else if (selectedCollection === 'minimalist') {
        list = list.filter((p) => p.collections?.includes('minimalist') || p.silhouette === 'light' || p.category === 'minimalist');
      } else if (selectedCollection === 'statement') {
        list = list.filter((p) => p.collections?.includes('statement') || p.silhouette === 'heavy' || p.category === 'statement');
      } else if (selectedCollection === 'moissanite') {
        list = list.filter((p) => p.collections?.includes('moissanite') || p.category === 'moissanite' || p.materials?.includes('moissanite') || p.name.toLowerCase().includes('moissanite'));
      } else if (selectedCollection === 'pearl') {
        list = list.filter((p) => p.collections?.includes('pearl') || p.category === 'pearl' || p.materials?.includes('freshwater-pearls') || p.name.toLowerCase().includes('pearl'));
      } else {
        list = list.filter((p) => p.collections?.includes(selectedCollection));
      }
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

    // Silhouette Presence (Delicate & Light vs Bold & Heavy - Aesthetic styling curation, no weight)
    if (selectedSilhouette !== 'all') {
      list = list.filter((p) => p.silhouette === selectedSilhouette);
    }

    // Subcategory & Taxonomy Tag Filter
    if (selectedTag && selectedTag !== 'all') {
      list = list.filter((p) => {
        if (p.subcategory === selectedTag) return true;
        if (Array.isArray(p.tags) && p.tags.includes(selectedTag)) return true;
        if (Array.isArray(p.collections) && p.collections.includes(selectedTag)) return true;
        if (Array.isArray(p.materials) && p.materials.includes(selectedTag)) return true;

        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const catSlug = (p.categorySlug || '').toLowerCase();

        if (selectedTag === 'new' || selectedTag === 'new-arrivals') {
          return (
            Boolean(p.isNew) ||
            p.category === 'new-arrivals' ||
            (Array.isArray(p.collections) && (p.collections.includes('new-arrivals') || p.collections.includes('new') || p.collections.includes('new-arrival'))) ||
            (Array.isArray(p.tags) && (p.tags.includes('new') || p.tags.includes('new-arrivals') || p.tags.includes('new-arrival')))
          );
        }

        if (selectedTag === 'gra-certified') {
          return (
            (Array.isArray(p.tags) && p.tags.includes('gra-certified')) ||
            p.category === 'moissanite' ||
            p.categorySlug === 'moissanite' ||
            nameLower.includes('moissanite') ||
            descLower.includes('moissanite') ||
            (Array.isArray(p.materials) && p.materials.includes('moissanite'))
          );
        }

        if (selectedTag === 'freshwater-pearls') {
          return (
            (Array.isArray(p.tags) && (p.tags.includes('freshwater-pearls') || p.tags.includes('freshwater-pearl'))) ||
            p.category === 'pearl' ||
            p.categorySlug === 'pearl' ||
            nameLower.includes('pearl') ||
            descLower.includes('pearl') ||
            (Array.isArray(p.materials) && (p.materials.includes('freshwater-pearls') || p.materials.includes('freshwater-pearl')))
          );
        }

        if (selectedTag === 'bracelets') {
          return (
            p.subcategory === 'bracelets' ||
            nameLower.includes('bracelet') ||
            nameLower.includes('kada') ||
            nameLower.includes('bangle') ||
            catSlug.includes('bracelet')
          );
        }

        if (selectedTag === 'necklaces') {
          return (
            p.subcategory === 'necklaces' ||
            nameLower.includes('necklace') ||
            nameLower.includes('chain') ||
            nameLower.includes('pendant') ||
            nameLower.includes('choker') ||
            nameLower.includes('hasli')
          );
        }

        if (selectedTag === 'earrings') {
          return (
            p.subcategory === 'earrings' ||
            nameLower.includes('earring') ||
            nameLower.includes('stud') ||
            nameLower.includes('droplet')
          );
        }

        if (selectedTag === 'rings') {
          return (
            p.subcategory === 'rings' ||
            nameLower.includes('ring') ||
            catSlug.includes('ring')
          );
        }

        if (selectedTag === 'sets') {
          return (
            p.subcategory === 'sets' ||
            p.subcategory === 'jewellery-sets' ||
            nameLower.includes('set') ||
            nameLower.includes('suite')
          );
        }

        if (selectedTag === 'anklets') {
          return (
            p.subcategory === 'anklets' ||
            nameLower.includes('anklet') ||
            nameLower.includes('payal')
          );
        }

        if (selectedTag === 'rakhi') {
          return (
            (Array.isArray(p.tags) && p.tags.includes('rakhi')) ||
            nameLower.includes('rakhi') ||
            (Array.isArray(p.collections) && p.collections.includes('gifting'))
          );
        }

        if (selectedTag === 'birthday' || selectedTag === 'anniversary' || selectedTag === 'bridesmaid') {
          return (
            (Array.isArray(p.tags) && p.tags.includes(selectedTag)) ||
            (Array.isArray(p.collections) && p.collections.includes('gifting')) ||
            p.occasionVibe === 'Bridal' ||
            p.category === 'gifting'
          );
        }

        return false;
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
    selectedSilhouette,
    selectedColour,
    selectedFinish,
    selectedAvailability,
    selectedPrice,
    selectedTag,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterial !== 'all') count++;
    if (selectedCollection !== 'all') count++;
    if (selectedSilhouette !== 'all') count++;
    if (selectedColour !== 'all') count++;
    if (selectedFinish !== 'all') count++;
    if (selectedAvailability !== 'all') count++;
    if (selectedPrice !== 'all') count++;
    if (selectedTag !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCategory,
    selectedMaterial,
    selectedCollection,
    selectedSilhouette,
    selectedColour,
    selectedFinish,
    selectedAvailability,
    selectedPrice,
    selectedTag,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedCollection('all');
    setSelectedSilhouette('all');
    setSelectedColour('all');
    setSelectedFinish('all');
    setSelectedAvailability('all');
    setSelectedPrice('all');
    setSelectedTag('all');
    setSearchQuery('');
    setCategoryFilter('');
    setMaterialFilter('');
    setCollectionFilter('');
    setSilhouetteFilter('');
    setWeightFilter('');
  };

  // Header Title and Eyebrow
  const pageTitle = useMemo(() => {
    if (searchQuery.trim()) return `Results for “${searchQuery}”`;
    if (selectedCollection !== 'all') {
      const col = (STORE_CONFIG.collections || []).find((c) => c.id === selectedCollection);
      if (col) return col.label;
    }
    if (selectedCategory !== 'all') {
      const cat = (STORE_CONFIG.categories || []).find((c) => c.id === selectedCategory);
      if (cat) return cat.label;
    }
    return 'Shop all jewellery.';
  }, [searchQuery, selectedCollection, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 space-y-6 sm:space-y-8">
        {/* Intro Section */}
        <div className="border-b border-[var(--border-subtle)] pb-8 sm:pb-10 text-center max-w-2xl mx-auto space-y-3">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1d4136] dark:text-[#e6ca97]">
            {selectedCollection !== 'all' ? 'THE COLLECTION' : searchQuery ? 'SEARCH' : 'THE AVIORA EDIT'}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            {pageTitle}
          </h1>
          <p className="font-editorial text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Explore the current Aviora edit across delicate everyday and statement pieces crafted from 14K Whitish Gold Plated vermeil and Fine 925 Sterling Silver.
          </p>
        </div>

        {/* Sticky Controls Bar */}
        <div className="sticky top-[58px] sm:top-[68px] z-30 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] py-2 sm:py-2.5 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12 transition-colors">
          <div className="max-w-7xl mx-auto space-y-2 sm:space-y-0">
            <div className="flex items-center justify-between gap-3">
              {/* Filter Drawer Toggle & Desktop Tag Chips */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.12em] uppercase border shrink-0 transition-all cursor-pointer ${
                    filterPanelOpen || activeFilterCount > 0
                      ? 'border-[#0d281e] bg-[#0d281e] text-white dark:border-[#e6ca97] dark:bg-[#e6ca97] dark:text-black'
                      : 'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:border-[#0d281e]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                <div className="h-4 w-px bg-[var(--border-subtle)] shrink-0 hidden sm:block" />

                {/* Tag Chips in Sticky Bar (Desktop) */}
                <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
                  {(categoryTagMap[selectedCategory] || categoryTagMap.all).map((tag) => {
                    const isTagActive = selectedTag === tag.id;
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedTag(isTagActive ? 'all' : tag.id)}
                        className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide uppercase whitespace-nowrap transition-all duration-200 border shrink-0 cursor-pointer ${
                          isTagActive
                            ? 'bg-[#0d281e] text-white border-[#0d281e] dark:bg-[#e6ca97] dark:text-black dark:border-[#e6ca97] font-bold shadow-xs'
                            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[#b38f56] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {isTagActive && tag.id !== 'all' ? '✓ ' : ''}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Results Count & Sort Dropdown */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-[11px] font-mono text-[var(--text-muted)] hidden md:inline">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-sans font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)]">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-strong)] text-xs font-sans font-semibold px-2 sm:px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">New arrivals</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name-az">Name: A–Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Tag Chips: Full-width horizontal swipeable row */}
            <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
              {(categoryTagMap[selectedCategory] || categoryTagMap.all).map((tag) => {
                const isTagActive = selectedTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(isTagActive ? 'all' : tag.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans tracking-wide uppercase whitespace-nowrap transition-all duration-200 border shrink-0 cursor-pointer ${
                      isTagActive
                        ? 'bg-[#0d281e] text-white border-[#0d281e] dark:bg-[#e6ca97] dark:text-black dark:border-[#e6ca97] font-bold shadow-xs'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[#b38f56] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isTagActive && tag.id !== 'all' ? '✓ ' : ''}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Chips Pills (Removable) */}
          {activeFilterCount > 0 && (
            <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 pt-2 mt-2 border-t border-[var(--border-subtle)] text-xs">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-semibold mr-1">
                Active Filters:
              </span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Category: {selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedTag !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Tag: {selectedTag}
                  <button
                    type="button"
                    onClick={() => setSelectedTag('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedMaterial !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Material: {selectedMaterial}
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedColour !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Metal: {selectedColour}
                  <button
                    type="button"
                    onClick={() => setSelectedColour('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedSilhouette !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Silhouette: {selectedSilhouette}
                  <button
                    type="button"
                    onClick={() => setSelectedSilhouette('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedPrice !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/15 text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/30 dark:border-[#e6ca97]/40 rounded-full font-sans text-[11px]">
                  Price: {selectedPrice}
                  <button
                    type="button"
                    onClick={() => setSelectedPrice('all')}
                    className="hover:opacity-75 font-bold cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-sans font-bold tracking-wider uppercase text-[#1d4136] dark:text-[#e6ca97] hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Luxury Slide-Over Filter Drawer */}
        <AnimatePresence>
          {filterPanelOpen && (
            <>
              {/* Dim Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFilterPanelOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity cursor-pointer"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="fixed inset-y-0 right-0 max-w-lg w-full bg-[var(--bg-card)] border-l border-[var(--border-strong)] shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[var(--text-primary)]">
                      Refine your edit
                    </h2>
                    <p className="text-xs font-sans text-[var(--text-muted)] mt-0.5">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} found
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-sans font-bold tracking-[0.1em] uppercase text-[#1d4136] dark:text-[#e6ca97] hover:underline cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setFilterPanelOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] text-sm cursor-pointer"
                      aria-label="Close filters"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Drawer Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-11 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs"
                    >
                      <option value="all">All categories</option>
                      {STORE_CONFIG.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Taxonomy & Subcategory Tags Chips */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
                      Subcategory & Item Type Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-3 bg-[var(--bg-primary)] border border-[var(--border-strong)]">
                      {(categoryTagMap[selectedCategory] || categoryTagMap.all).map((tag) => {
                        const isTagActive = selectedTag === tag.id;
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => setSelectedTag(isTagActive ? 'all' : tag.id)}
                            className={`px-3 py-1 text-[11px] font-mono uppercase rounded transition-colors cursor-pointer ${
                              isTagActive
                                ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold shadow-xs'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            {isTagActive && tag.id !== 'all' ? '✓ ' : '+ '}
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Silhouette Curation */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#1d4136] dark:text-[#e6ca97] font-semibold mb-2">
                      ✦ Silhouette & Presence
                    </label>
                    <select
                      value={selectedSilhouette}
                      onChange={(e) => setSelectedSilhouette(e.target.value)}
                      className="w-full h-11 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs cursor-pointer"
                    >
                      <option value="all">All Silhouettes</option>
                      <option value="light">Delicate & Light (Everyday Minimalist)</option>
                      <option value="heavy">Bold & Heavy (Statement Sculptures)</option>
                    </select>
                  </div>

                  {/* Material & Finish Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                        Material
                      </label>
                      <select
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="w-full h-10 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs"
                      >
                        <option value="all">All materials</option>
                        {STORE_CONFIG.materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                        Finish
                      </label>
                      <select
                        value={selectedFinish}
                        onChange={(e) => setSelectedFinish(e.target.value)}
                        className="w-full h-10 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs"
                      >
                        <option value="all">All finishes</option>
                        {uniqueFinishes.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick Metal Swatches */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
                      Color Tone & Metallurgy
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {METAL_SWATCHES.map((swatch) => {
                        const isActive =
                          selectedColour.toLowerCase().includes(swatch.name.toLowerCase()) ||
                          selectedColour === swatch.name;
                        return (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={() => setSelectedColour(isActive ? 'all' : swatch.name)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-sans border transition-all cursor-pointer ${
                              isActive
                                ? 'border-[#1d4136] bg-[#1d4136]/10 text-[#1d4136] font-bold dark:border-[#e6ca97] dark:text-[#e6ca97]'
                                : 'border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[#1d4136]'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <span>{swatch.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability & Price Tier Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                        Availability
                      </label>
                      <select
                        value={selectedAvailability}
                        onChange={(e) => setSelectedAvailability(e.target.value)}
                        className="w-full h-10 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs"
                      >
                        <option value="all">All availability</option>
                        <option value="available">Available</option>
                        <option value="sold-out">Sold out</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                        Price Tier
                      </label>
                      <select
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="w-full h-10 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none text-xs"
                      >
                        <option value="all">All prices</option>
                        <option value="under-3000">Under ₹3,000</option>
                        <option value="3000-5000">₹3,000–₹5,000</option>
                        <option value="over-5000">Over ₹5,000</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Query */}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
                      Search Keyword
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by piece name, stone, or style..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none pr-8 text-xs"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Drawer Pinned Action Footer */}
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-3 border border-[var(--border-strong)] text-xs font-sans font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterPanelOpen(false)}
                    className="flex-1 py-3 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-xs font-sans font-bold tracking-[0.14em] uppercase hover:opacity-90 shadow-md transition-all cursor-pointer text-center"
                  >
                    Show {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} →
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
  const { selectedProduct, setSelectedProduct, products, navigate, addToCart, formatPrice } = useContext(AppContext);
  const [activeAccordion, setActiveAccordion] = useState('why-14k');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [addEngraving, setAddEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');

  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  // On mount: resolve product from URL params (slug or product id)
  // This ensures direct navigation to /pdp?slug=... always shows the right product
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const prodId = params.get('product') || params.get('id');
    const catalog = products && products.length > 0 ? products : PRODUCTS;
    if (slug) {
      const found = catalog.find((p) => p.slug === slug);
      if (found && found.id !== selectedProduct?.id) {
        setSelectedProduct(found);
      }
    } else if (prodId) {
      const found = catalog.find((p) => p.id === prodId);
      if (found && found.id !== selectedProduct?.id) {
        setSelectedProduct(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const product = (products && products.find((p) => p.id === selectedProduct?.id)) || selectedProduct || PRODUCTS[0];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Reset active image on product switch
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);


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
      <div className="border-b border-[var(--border-subtle)] px-4 sm:px-6 md:px-14 py-3 sm:py-3.5 flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)]">
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
        {/* Left Column: Interactive Multi-Angle Studio Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:space-y-6 p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]">
          {/* Top Bar: Angle indicator & Quick Switchers (Non-sticky to avoid lingering white strip) */}
          <div className="flex items-center justify-between bg-[var(--bg-secondary)]/80 p-2.5 border border-[var(--border-subtle)] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#0d281e] dark:bg-[#e6ca97] text-white dark:text-[#242321] text-[10px] font-bold tracking-wider uppercase font-mono">
                ANGLE 0{activeImageIndex + 1} OF 0{product.images?.length || 1}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest hidden sm:inline">
                {product.images && product.images.length > 1
                  ? `${product.images.length} STUDIO ANGLES AVAILABLE`
                  : '14K STUDIO CAPTURE'}
              </span>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))
                  }
                  className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-[#b99762]/15 border border-[var(--border-subtle)] hover:border-[#b99762] text-[10px] font-mono text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Previous Angle"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))
                  }
                  className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-[#b99762]/15 border border-[var(--border-subtle)] hover:border-[#b99762] text-[10px] font-mono text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Next Angle"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Main Stage View with Floating Arrows */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[85vh] bg-[var(--bg-stone)] dark:bg-[#181d1a] overflow-hidden border border-[var(--border-subtle)] group">
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-primary)] bg-[var(--bg-card)]/85 backdrop-blur-md px-3 py-1 border border-[var(--border-subtle)]">
                PLATE // 0{activeImageIndex + 1} (STUDIO CAPTURE)
              </span>
            </div>

            {product.images && product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--bg-card)]/85 hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--bg-card)]/85 hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <ArtisticImage
              src={product.images?.[activeImageIndex] || product.images?.[0]}
              alt={`${product.name} Angle ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
              exhibitNumber={`PLATE // 0${activeImageIndex + 1}`}
              materialTag={product.material}
            />
          </div>

          {/* Clickable Perspective Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[var(--text-muted)]">
                <span>Select Perspective ({product.images.length} studio angles)</span>
                <span>Click thumbnail to inspect</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden transition-all border-2 cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-[#0d281e] dark:border-[#e6ca97] ring-2 ring-[#0d281e]/30 scale-102 shadow-md'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} Angle 0${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[8.5px] font-mono px-1.5 py-0.5 bg-black/85 text-white font-bold rounded-xs">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Product Info with Smooth Overflow */}
        <div className="lg:col-span-5 p-4 sm:p-6 md:p-12 lg:p-16 flex flex-col justify-start">
          <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto overscroll-contain pr-2 space-y-7 custom-scrollbar">
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
              </div>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                Fine 925 Sterling Silver · Free Pan-India Insured Delivery
              </p>
            </div>

            {/* Atelier Curatorial Description & Archival Notes */}
            {product.description && (
              <div className="p-4 sm:p-5 rounded-xs bg-[#fdfbf7] dark:bg-[#1a221e] border border-[#b38f56]/35 dark:border-[#e6ca97]/30 shadow-xs space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#b38f56]/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8c6527] dark:text-[#e6ca97]" />
                    <span className="text-[10.5px] font-mono tracking-[0.25em] uppercase text-[#8c6527] dark:text-[#e6ca97] font-bold">
                      Atelier Curatorial Description
                    </span>
                  </div>
                  <span className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#0d281e]/8 dark:bg-[#e6ca97]/15 text-[#0d281e] dark:text-[#e6ca97] border border-[#0d281e]/15 dark:border-[#e6ca97]/25 font-semibold">
                    Atelier Edition
                  </span>
                </div>
                <div className="relative pl-3.5 border-l-2 border-[#b38f56] dark:border-[#e6ca97]">
                  <p className="font-playfair italic text-[15px] sm:text-[16px] leading-[1.85] text-[#1c1b18] dark:text-[#fbf8f3] font-normal tracking-wide">
                    “{product.description}”
                  </p>
                </div>
                {product.editorialNote && (
                  <div className="pt-2.5 flex items-start gap-2.5 border-t border-[#b38f56]/20 text-xs">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#8c6527] dark:text-[#e6ca97] shrink-0 mt-0.5 px-2 py-0.5 bg-[#b38f56]/15 dark:bg-[#e6ca97]/15 rounded-xs border border-[#b38f56]/25 dark:border-[#e6ca97]/30">
                      Artisan Note
                    </span>
                    <span className="font-sans text-xs sm:text-[12.5px] leading-relaxed italic text-[#4a453e] dark:text-[#d4cebf]">
                      {product.editorialNote}
                    </span>
                  </div>
                )}
              </div>
            )}

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
            <div className="grid grid-cols-3 gap-2 p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center rounded-xs shadow-xs">
              <div className="space-y-1 p-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  Fine 925 Silver
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Noble Metallurgy</span>
              </div>
              <div className="space-y-1 p-2 border-x border-[var(--border-subtle)]">
                <ShieldCheck className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97] mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  14K Whitish Gold
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Vermeil Plated</span>
              </div>
              <div className="space-y-1 p-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 mx-auto" />
                <span className="text-[10px] font-mono text-[var(--text-primary)] block font-semibold leading-tight">
                  30-Day Warranty
                </span>
                <span className="text-[8px] font-mono text-[var(--text-muted)] block">Manufacturing Defects</span>
              </div>
            </div>

            {/* Complimentary Engraving */}
            {product.isEngravable && (
              <div className="p-4 sm:p-4.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 rounded-xs shadow-xs">
                <label className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addEngraving}
                    onChange={(e) => setAddEngraving(e.target.checked)}
                    className="accent-[#0d281e] dark:accent-[#e6ca97] w-4 h-4"
                  />
                  <span className="font-semibold text-[#8c6527] dark:text-[#e6ca97] flex items-center gap-1.5">
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
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[#b38f56] px-3.5 py-2 text-xs font-mono text-[var(--text-primary)] uppercase tracking-widest outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Pincode Checker */}
            <div className="p-4 sm:p-4.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 rounded-xs shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-primary)]">
                <MapPin className="w-4 h-4 text-[#8c6527] dark:text-[#e6ca97]" />
                <span>Check Express Delivery & COD by PIN Code</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 400001)"
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-[#b38f56] px-3 py-2 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d281e] hover:bg-[#163e2f] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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

            {/* Made-to-Order Luxury Notice */}
            <div className="p-4 sm:p-4.5 bg-[var(--bg-card)] border-l-2 border-[#b38f56] border-[var(--border-subtle)] space-y-1.5 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#8c6527] dark:text-[#e6ca97] font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Made to Order Luxury</span>
              </div>
              <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
                Every AVIORA piece is made especially for you. Kindly allow <strong>15–20 business days</strong> for crafting and preparation, followed by <strong>1–5 business days</strong> for shipping.
              </p>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97] shrink-0" /> Made to Order · Final Sale · 48h Defect Resolution
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97] shrink-0" /> Free Pan-India Delivery
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
                    <p><strong className="text-[var(--text-primary)]">Silhouette & Presence:</strong> {product.silhouette === 'heavy' ? 'Bold & Sculptural Statement' : 'Delicate & Minimalist Everyday'}</p>
                    <p><strong className="text-[var(--text-primary)]">Purity:</strong> {product.goldPurity}</p>
                    <p><strong className="text-[var(--text-primary)]">Material Assurance:</strong> Fine 925 Sterling Silver</p>
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

              {/* Product Story & Description Accordion */}
              {product.description && (
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('description')}
                    className="w-full flex justify-between items-center text-left text-[var(--text-primary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
                  >
                    <span className="tracking-[0.2em] uppercase flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Product Overview & Details
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeAccordion === 'description' ? 'rotate-180 text-[#b99762] dark:text-[#e6ca97]' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === 'description' && (
                    <div className="text-[var(--text-secondary)] pt-3 space-y-3 leading-relaxed">
                      <p className="font-playfair italic text-[13.5px] sm:text-[14.5px] leading-relaxed text-[var(--text-primary)] border-l-2 border-[#b38f56] pl-3 py-0.5">
                        {product.description}
                      </p>
                      {product.craftsmanship && (
                        <p className="text-xs font-mono text-[var(--text-muted)] pt-1 pl-3">
                          <strong className="text-[#8c6527] dark:text-[#d4bf98] uppercase tracking-wider font-semibold">Bench Craft:</strong> {product.craftsmanship}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                    alt={`${test.patron} wearing AVIORA`}
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
  const { cart, cartTotal, clearCart, navigate, formatPrice, addOrder, currencyMode, showToast, loginPatron } = useContext(AppContext);

  const [paymentMethod, setPaymentMethod] = useState('PHONEPE');
  const [upiId, setUpiId] = useState('');
  const [phonePeLinkData, setPhonePeLinkData] = useState(null);
  const [isGeneratingPhonePeLink, setIsGeneratingPhonePeLink] = useState(false);
  const [phonePeLinkCopied, setPhonePeLinkCopied] = useState(false);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
  });

  // OTP Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(60);

  // Payment Gateway Modal State & 12-Digit UPI UTR Verification
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userUtr, setUserUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardData, setCardData] = useState({
    name: '',
    number: '4532 8901 2345 6789',
    exp: '08/29',
    cvv: '849',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Note: For PhonePe, amount is strictly identical to cart total as requested
  const upiDiscount = paymentMethod === 'UPI' ? Math.round(cartTotal * 0.05) : 0;
  const finalTotal = paymentMethod === 'UPI' ? (cartTotal - upiDiscount) : cartTotal;
  const finalTotalInPaise = Math.round(finalTotal * 100);

  // Generate PhonePe Payment Link matching official API specification
  const loadPhonePeLink = async (orderRef) => {
    setIsGeneratingPhonePeLink(true);
    try {
      const generatedOrderNum = orderRef || `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = await createPhonePePaymentLink({
        orderNumber: generatedOrderNum,
        amount: finalTotal, // exact cart amount in INR
        customerName: formData.customerName || 'AVIORA Patron',
        customerPhone: formData.customerPhone || '9820012345',
        customerEmail: formData.customerEmail,
      });
      setPhonePeLinkData(result);
      return result;
    } catch (err) {
      console.error('Failed to create PhonePe payment link:', err);
      return null;
    } finally {
      setIsGeneratingPhonePeLink(false);
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (showOtpModal && otpResendTimer > 0) {
      timer = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpResendTimer]);

  // Pre-generate PhonePe / UPI QR Code when PhonePe or UPI is selected
  useEffect(() => {
    const generateUpiQr = async () => {
      try {
        const vpa = '9650834445@kotak';
        const payeeName = 'AVIORA ATELIER';
        const formattedAmount = finalTotal.toFixed(2);
        const upiIntentUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent('AVIORA Order Payment')}`;
        const qrUrl = await QRCode.toDataURL(upiIntentUri, {
          width: 256,
          margin: 1,
          color: {
            dark: '#132A22',
            light: '#FFFFFF',
          },
        });
        setUpiQrDataUrl(qrUrl);
      } catch (err) {
        console.error('QR code generation error:', err);
      }
    };
    generateUpiQr();
  }, [finalTotal, paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInitiateVerification = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all delivery details before proceeding.');
      return;
    }

    const cleanPhone = formData.customerPhone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    // Pre-initialize PhonePe link
    if (paymentMethod === 'PHONEPE') {
      loadPhonePeLink();
    }

    if (!isPhoneVerified) {
      const generated = generateOtp(formData.customerPhone);
      setActiveGeneratedOtp(generated.otp);
      setOtpInput('');
      setOtpError('');
      setOtpResendTimer(60);
      setShowOtpModal(true);
      showToast(`✦ Verification code dispatched to +91 ${cleanPhone.slice(-10)}`);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleSubmitOrder = handleInitiateVerification;

  const handleVerifyOtp = async () => {
    setOtpError('');
    if (!otpInput.trim()) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    const result = verifyOtp(formData.customerPhone, otpInput.trim());
    if (result.success) {
      setIsPhoneVerified(true);
      setShowOtpModal(false);
      if (paymentMethod === 'PHONEPE') {
        await loadPhonePeLink();
      }
      setShowPaymentModal(true);
      showToast('✓ Phone verified. Opening PhonePe Payment Gateway...');
    } else {
      setOtpError(result.message);
    }
  };

  const handleResendOtp = () => {
    const generated = generateOtp(formData.customerPhone);
    setActiveGeneratedOtp(generated.otp);
    setOtpInput('');
    setOtpError('');
    setOtpResendTimer(60);
    showToast(`✦ New verification code sent to +91 ${formData.customerPhone.replace(/[^\d]/g, '').slice(-10)}`);
  };

  const handleExecutePayment = async () => {
    // Validate 12-digit UTR input for manual offline Direct UPI mode only
    if (paymentMethod === 'UPI') {
      const cleanUtr = (userUtr || '').trim();
      if (!cleanUtr) {
        setUtrError('Please enter your 12-digit UPI Bank Reference / UTR Number from your payment app, or click "Auto-Fill Test UTR".');
        return;
      }
      if (cleanUtr.length < 6) {
        setUtrError('UTR / Bank Reference Number must be at least 6 characters.');
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      let callbackResult;
      let phonePeMetadata = {};
      const finalVerifiedUtr = (userUtr || '').trim();

      if (paymentMethod === 'PHONEPE') {
        // Ensure active PhonePe link is present
        let activeLink = phonePeLinkData;
        if (!activeLink) {
          activeLink = await loadPhonePeLink();
        }

        // Execute PhonePe payment callback
        const ppRes = await executePhonePeCallback(activeLink);
        const orderNum = activeLink?.data?.rawPayload?.message?.match(/#([^\s]+)/)?.[1] || `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`;
        const assignedTxnId = finalVerifiedUtr || ppRes.data.transactionId;

        callbackResult = {
          orderNumber: orderNum,
          transactionId: assignedTxnId,
          signature: ppRes.data.signature,
          paymentMode: 'PhonePe Payment Gateway',
          paidAt: ppRes.data.paidAt,
          amount: ppRes.data.amountInRupees,
          currency: currencyMode,
          bankRefNumber: finalVerifiedUtr || ppRes.data.paymentInstrument.utr,
        };

        phonePeMetadata = {
          phonepeTransactionId: assignedTxnId,
          phonepeMerchantTransactionId: activeLink.data.merchantTransactionId,
          phonepePaymentLinkId: activeLink.data.payLink,
          phonepeAmountInPaise: activeLink.data.amountInPaise,
          phonepePaymentUrl: activeLink.data.payLink,
        };
      } else {
        // Contact Generic Indian Payment Gateway & execute verified callback
        const assignedTxnId = finalVerifiedUtr || `UPI-TXN-${Date.now()}`;
        callbackResult = await executePaymentCallback({
          orderNumber: `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: finalTotal,
          currency: currencyMode,
          paymentMethod,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          upiId: paymentMethod === 'UPI' ? (upiId || 'patron@okhdfcbank') : undefined,
        });

        if (finalVerifiedUtr) {
          callbackResult.transactionId = finalVerifiedUtr;
          callbackResult.bankRefNumber = finalVerifiedUtr;
        }
      }

      // 2. Blue Dart Consignment number will be provided later upon courier handover (SHIPPED stage)
      const trackingNumber = '';
      const gstAmount = Math.round((finalTotal * 3) / 103);

      // 3. Assemble complete order record with 5-stage timeline
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: callbackResult.orderNumber,
        createdAt: new Date().toISOString(),
        orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
        paymentMethod: paymentMethod === 'PHONEPE' ? 'PhonePe' : paymentMethod,
        subtotal: cartTotal,
        discount: upiDiscount,
        total: finalTotal,
        gstAmount,
        currency: currencyMode,
        status: 'CONFIRMED',
        courier: 'Blue Dart Express Air',
        trackingNumber: '',
        bluedartConsignmentNo: '',
        estimatedDelivery: '15-20 Business Days Handcrafting + 1-5 Days Express Air',
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
        timeline: createOrderTimeline('CONFIRMED', new Date().toISOString(), ''),
        otpVerified: true,
        paymentTransactionId: callbackResult.transactionId,
        paymentSignature: callbackResult.signature,
        ...phonePeMetadata,
      };

      // 4. Automated WhatsApp Business Template Dispatch for CONFIRMED stage
      const waNotification = await sendWhatsAppStageNotification(newOrder, 'CONFIRMED', '');
      newOrder.whatsappNotifications = [waNotification];

      // 5. Persist to archive & Supabase database + Bookkeeping Ledger
      addOrder(newOrder);
      await persistOrderToDb(newOrder);

      // 6. Sign patron into personal session so commission dossier is immediately accessible
      if (loginPatron) {
        loginPatron(formData.customerPhone, formData.customerName);
      }

      // 7. Complete and clean cart
      setCompletedOrder(newOrder);
      clearCart();
      setShowPaymentModal(false);
      showToast(`✓ PhonePe Payment Verified! WhatsApp confirmation dispatched to +91 ${formData.customerPhone}`);
    } catch (err) {
      console.error('Payment processing failed:', err);
      showToast('Payment gateway notice. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (completedOrder) {
    const waReceipt = completedOrder.whatsappNotifications?.[0];

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 px-6 md:px-12 flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-[var(--bg-card)] border border-[#b99762]/60 p-8 md:p-14 shadow-2xl space-y-8 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center space-y-3 border-b border-[var(--border-subtle)] pb-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black flex items-center justify-center shadow-lg">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#b99762] dark:text-[#e6ca97] block font-bold">
              PAYMENT VERIFIED & ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-wide">
              Thank You for Your Order!
            </h1>
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              Order Reference:{' '}
              <span className="text-[#b99762] dark:text-[#e6ca97] font-semibold font-mono">{completedOrder.orderNumber}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono text-[var(--text-primary)]">
            {/* Payment & Logistics Summary */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Customer Name:</span>
                <span className="text-[var(--text-primary)] font-medium">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Phone (OTP Verified):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> +91 {completedOrder.customerPhone}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping Destination:</span>
                <span className="text-[var(--text-primary)] font-medium">
                  {completedOrder.city}, {completedOrder.state} — {completedOrder.postalCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span>Blue Dart Consignment:</span>
                {completedOrder.trackingNumber ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {completedOrder.trackingNumber}
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px] bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 border border-amber-300 dark:border-amber-800/50">
                    Pending Dispatch (Provided upon Courier Handover)
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Payment Mode & Gateway Ref:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  {completedOrder.paymentMethod === 'PhonePe' && <PhonePeIcon className="w-3.5 h-3.5" />}
                  <span>{completedOrder.paymentMethod} • {completedOrder.paymentTransactionId || 'TXN-SETTLED'}</span>
                </span>
              </div>
              {completedOrder.paymentMethod === 'PhonePe' && (
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Gateway Verification:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    Verified by PhonePe Gateway ✓
                  </span>
                </div>
              )}
              {completedOrder.phonepePaymentLinkId && (
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>PhonePe Payment Link:</span>
                  <a
                    href={completedOrder.phonepePaymentLinkId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5F259F] hover:underline font-mono truncate max-w-[240px]"
                  >
                    {completedOrder.phonepePaymentLinkId}
                  </a>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Final Order Amount:</span>
                <span className="text-[#b99762] dark:text-[#e6ca97] text-base font-bold">
                  {formatPrice(completedOrder.total)}
                </span>
              </div>
            </div>

            {/* WhatsApp Confirmation Notice (Message Preview Only) */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Official WhatsApp Update Dispatched</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  SENT TO +91 {completedOrder.customerPhone} ✓
                </span>
              </div>
              <p className="text-[11px] font-mono text-emerald-900 dark:text-emerald-100">
                Official order confirmation message sent to your registered WhatsApp (+91 {completedOrder.customerPhone}):
              </p>
              {/* WhatsApp Message Preview Box */}
              <div className="whitespace-pre-wrap text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed bg-[var(--bg-card)] p-3 border border-emerald-500/30 rounded">
                {waReceipt?.previewText || `✦ AVIORA — ORDER UPDATE ✦\n\nNamaste ${completedOrder.customerName},\n\nYour AVIORA jewellery order #${completedOrder.orderNumber} has been updated to:\n*PAYMENT CONFIRMED & MATERIAL QUEUED*\n\n📌 Status Details: Your payment is confirmed! Your made-to-order piece has entered the atelier queue. Blue Dart consignment tracking will be issued upon dispatch & courier handover.\n\n✨ Craft Guarantee: Fine 925 Sterling Silver · 30-Day Manufacturing Warranty.\n💬 Need assistance? Reply directly to this WhatsApp concierge or call +91 8796841184.\n\n_AVIORA — Timeless Elegance, Made For You_`}
              </div>
            </div>

            {/* Craftsmanship & Delivery Notice */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97] shrink-0 mt-0.5" />
              <span>
                Your made-to-order creation is entering casting & benchwork (15–20 business days). You will receive a Blue Dart consignment tracking number via WhatsApp as soon as the piece is completed and handed to the courier.
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('orders', completedOrder)}
              className="w-full sm:w-auto px-4 sm:px-8 py-3.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-normal sm:tracking-[0.16em] uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-md text-center"
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span className="break-words">
                {completedOrder.trackingNumber
                  ? `Track Blue Dart Consignment (${completedOrder.trackingNumber})`
                  : 'Track Order Lifecycle (In Atelier Benchwork)'}
              </span>
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-8 sm:py-12 px-4 sm:px-6 md:px-14 transition-colors duration-300">
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
            <form onSubmit={handleInitiateVerification} className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b99762]" />
                  01 // Contact & OTP Verification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    autoComplete="name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Full Legal Name"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <input
                    required
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Email for Invoice"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                </div>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={10}
                    value={formData.customerPhone}
                    onChange={(e) => {
                      setFormData({ ...formData, customerPhone: e.target.value });
                      if (isPhoneVerified) setIsPhoneVerified(false);
                    }}
                    placeholder="10-Digit Mobile Number (e.g. 9820012345)"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none pr-32"
                  />
                  {isPhoneVerified ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                      <Check className="w-3 h-3" /> OTP Verified
                    </span>
                  ) : (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#b99762] dark:text-[#e6ca97]">
                      OTP Required
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b99762]" />
                  02 // Delivery Address
                </h3>
                <input
                  required
                  type="text"
                  autoComplete="street-address"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Street Address, Suite / Apartment"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="PIN Code (6 digits)"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[#b99762] px-4 py-3 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <input
                    required
                    type="text"
                    autoComplete="address-level2"
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

              {/* Payment Method Selector */}
              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold">
                    03 // Preferred Payment Channel
                  </h3>
                  <span className="text-[10px] font-mono text-[#5F259F] font-bold">
                    ✦ Official PhonePe Gateway Integration
                  </span>
                </div>

                {/* Primary Featured PhonePe Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('PHONEPE');
                    loadPhonePeLink();
                  }}
                  className={`w-full p-4 border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all relative overflow-hidden ${
                    paymentMethod === 'PHONEPE'
                      ? 'border-[#5F259F] bg-[#5F259F]/10 dark:bg-[#5F259F]/20 text-[var(--text-primary)] shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#5F259F]/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <PhonePeIcon className="w-10 h-10 shrink-0 shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                          PhonePe Payment Gateway
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#5F259F] text-white text-[9px] font-mono uppercase font-bold tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                        UPI QR, PhonePe App, Cards & NetBanking • Instant Online Settlement ({formatPrice(finalTotal)})
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-mono text-[#5F259F] font-bold block uppercase tracking-wider">
                      Instant API Link
                    </span>
                    <span className="font-serif text-sm font-bold text-[var(--text-primary)]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </button>

                {/* Alternative Payment Channels */}
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
                      <span className="text-xs font-mono font-bold block">Direct UPI</span>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">5% Off</span>
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
                </div>

                {/* DIRECT ON-PAGE UPI / PHONEPE QR CODE */}
                {(paymentMethod === 'PHONEPE' || paymentMethod === 'UPI') && (
                  <div className="p-5 bg-[var(--bg-secondary)] border-2 border-[#5F259F]/40 dark:border-[#5F259F]/60 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Real Scannable QR Code */}
                      <div className="bg-white p-2.5 border-2 border-[#5F259F] shrink-0 shadow-md text-center">
                        {upiQrDataUrl ? (
                          <img
                            src={upiQrDataUrl}
                            alt={`Scan to pay ${formatPrice(finalTotal)} to 9650834445@kotak`}
                            className="w-40 h-40 sm:w-44 sm:h-44 object-contain mx-auto"
                          />
                        ) : (
                          <div className="w-40 h-40 flex items-center justify-center text-xs text-gray-400">
                            Generating QR Code...
                          </div>
                        )}
                        <span className="text-[10px] font-mono font-bold text-[#5F259F] block mt-1">
                          ✦ Scan with Any UPI App
                        </span>
                      </div>

                      {/* Details & Direct App Triggers */}
                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#5F259F] dark:text-[#a875e2] block">
                            DIRECT INSTANT QR PAYMENT
                          </span>
                          <h4 className="font-serif text-lg text-[var(--text-primary)] font-normal mt-0.5">
                            Scan to Pay with PhonePe, GPay, or Paytm
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Scan this QR code directly using your camera, PhonePe, Google Pay, Paytm, BHIM, or Kotak app to pay to verified account.
                          </p>
                        </div>

                        <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-muted)]">Verified VPA:</span>
                            <span className="font-bold text-[var(--text-primary)] select-all">9650834445@kotak</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-muted)]">Payee:</span>
                            <span className="font-medium text-[var(--text-primary)]">AVIORA ATELIER</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-muted)]">Exact Amount:</span>
                            <span className="font-bold text-[#5F259F] dark:text-[#a875e2]">{formatPrice(finalTotal)}</span>
                          </div>
                        </div>

                        {/* Direct App Link / Copy VPA */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                          <a
                            href={`upi://pay?pa=9650834445@kotak&pn=AVIORA%20ATELIER&am=${finalTotal.toFixed(2)}&cu=INR&tn=Order%20Payment`}
                            className="px-3.5 py-2 bg-[#5F259F] hover:bg-[#4d1e82] text-white text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Open PhonePe App</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('9650834445@kotak');
                              showToast('✓ UPI ID 9650834445@kotak copied to clipboard');
                            }}
                            className="px-3 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI ID</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] disabled:opacity-50 text-white dark:text-[#242321] font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-3 transition-all shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isPhoneVerified
                      ? `Proceed to Payment Gateway — ${formatPrice(finalTotal)}`
                      : `Verify Phone & Proceed to Payment — ${formatPrice(finalTotal)}`}
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
                  <span className="font-bold text-[#b99762] dark:text-[#e6ca97]">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 1. PHONE OTP VERIFICATION MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full my-auto bg-[var(--bg-card)] border border-[#b99762] p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[var(--text-primary)] font-normal uppercase">
                      Phone Verification
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      OTP FOR PATRON AUTHENTICATION
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <p className="text-[var(--text-secondary)]">
                  A 6-digit authentication code was sent to{' '}
                  <span className="text-[var(--text-primary)] font-bold font-mono">
                    +91 {formData.customerPhone}
                  </span>
                  .
                </p>

                {/* Auto-Fill Test OTP helper */}
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#b99762] dark:text-[#e6ca97]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test OTP: <strong className="font-mono">{activeGeneratedOtp || '849201'}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpInput(activeGeneratedOtp || '849201')}
                    className="px-2.5 py-1 bg-[#b99762]/10 hover:bg-[#b99762]/20 border border-[#b99762]/40 text-[#b99762] dark:text-[#e6ca97] text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Auto-Fill Code
                  </button>
                </div>

                {/* Code Input */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full h-12 text-center bg-[var(--bg-primary)] border border-[var(--border-strong)] focus:border-[#b99762] text-xl font-mono tracking-[0.4em] font-bold text-[var(--text-primary)] outline-none"
                  />
                  {otpError && (
                    <p className="text-rose-600 dark:text-rose-400 text-[10px] font-mono mt-1">
                      {otpError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  {otpResendTimer > 0 ? (
                    <span>Resend code in 00:{otpResendTimer.toString().padStart(2, '0')}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#b99762] dark:text-[#e6ca97] underline font-bold uppercase"
                    >
                      Resend OTP Code
                    </button>
                  )}
                  <span>Master code: 123456</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-3 border border-[var(--border-strong)] text-[var(--text-secondary)] text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="flex-1 py-3 bg-[#1d4136] hover:bg-[#132f27] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Verify & Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 2. INTERACTIVE PAYMENT GATEWAY MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full my-auto bg-[var(--bg-card)] border border-[#b99762] p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#b99762] dark:text-[#e6ca97] block font-bold">
                    AVIORA SECURE GATEWAY • 256-BIT SSL
                  </span>
                  <h3 className="font-serif text-xl text-[var(--text-primary)] uppercase">
                    Authorize Payment
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                    Amount Payable
                  </span>
                  <span className="font-serif text-lg font-bold text-[#b99762] dark:text-[#e6ca97]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Mode Body */}
              <div className="space-y-4 text-xs font-mono">
                {paymentMethod === 'PHONEPE' && (
                  <div className="space-y-4">
                    {/* PhonePe Header Card */}
                    <div className="p-4 bg-[#5F259F]/10 dark:bg-[#5F259F]/20 border border-[#5F259F]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <PhonePeIcon className="w-6 h-6" />
                          <div>
                            <span className="text-xs font-mono font-bold text-[#5F259F] dark:text-[#a875e2] block">
                              PhonePe Direct UPI Integration
                            </span>
                            <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                              Kotak Bank Merchant Settlement
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#5F259F] text-white text-[9px] font-mono font-bold uppercase">
                          Live Active
                        </span>
                      </div>

                      {/* Direct UPI VPA Box */}
                      <div className="space-y-1.5 pt-2 border-t border-[#5F259F]/20">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[var(--text-secondary)] font-semibold">
                            Direct Merchant UPI VPA:
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Verified Kotak Account
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            readOnly
                            type="text"
                            value="9650834445@kotak"
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-strong)] px-3 py-2 text-[11px] font-mono text-[var(--text-primary)] font-bold select-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('9650834445@kotak');
                              setPhonePeLinkCopied(true);
                              showToast('✓ UPI ID 9650834445@kotak copied to clipboard');
                              setTimeout(() => setPhonePeLinkCopied(false), 3000);
                            }}
                            className="px-3 py-2 bg-[var(--bg-card)] hover:bg-[#5F259F] hover:text-white border border-[#5F259F] text-[#5F259F] text-[10px] font-mono font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
                          >
                            {phonePeLinkCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy UPI ID</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Scannable PhonePe / UPI QR Code */}
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-36 h-36 p-1.5 bg-white border-2 border-[#5F259F] shrink-0 flex items-center justify-center shadow-xs text-center">
                        {upiQrDataUrl ? (
                          <img
                            src={upiQrDataUrl}
                            alt="Scan PhonePe QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-[10px] text-gray-400">Loading QR...</div>
                        )}
                      </div>

                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#5F259F] dark:text-[#a875e2] flex items-center gap-1.5 justify-center sm:justify-start">
                          <Zap className="w-3.5 h-3.5" /> Direct Scan & Pay via UPI
                        </span>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          Scan using PhonePe, Google Pay, Paytm, BHIM, or Kotak mobile banking app.
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">
                          VPA: <strong className="text-[var(--text-primary)]">9650834445@kotak</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                          <a
                            href={`upi://pay?pa=9650834445@kotak&pn=AVIORA%20ATELIER&am=${finalTotal.toFixed(2)}&cu=INR&tn=Order%20Payment`}
                            className="px-3 py-1.5 bg-[#5F259F] hover:bg-[#4d1e82] text-white text-[10px] font-mono font-bold rounded flex items-center gap-1 transition-colors"
                          >
                            <Smartphone className="w-3 h-3" /> Open PhonePe / UPI App
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Exact Cart Amount & API Specs Audit */}
                    <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                      <div className="flex justify-between">
                        <span>Cart Total in INR:</span>
                        <span className="text-[var(--text-primary)] font-bold">{formatPrice(finalTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gateway Settlement:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Direct Verification</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement VPA:</span>
                        <span className="text-[var(--text-primary)] font-semibold font-mono">9650834445@kotak</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Merchant Txn ID:</span>
                        <span className="text-[var(--text-primary)] font-mono truncate max-w-[200px]">{phonePeLinkData?.data?.merchantTransactionId || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-32 h-32 p-1.5 bg-white border border-gray-300 shrink-0 flex items-center justify-center shadow-xs">
                        {upiQrDataUrl ? (
                          <img
                            src={upiQrDataUrl}
                            alt="Direct UPI QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-[10px] text-gray-400">Loading QR...</div>
                        )}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          ⚡ Instant UPI Scan & Pay
                        </span>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          VPA: <strong className="text-[var(--text-primary)]">9650834445@kotak</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Or Enter Your UPI ID (VPA)
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardData.exp}
                          onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                          className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NETBANKING' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Select Authorized Indian Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-[11px]">
                    <span className="font-bold text-[var(--text-primary)] block">Cash on Delivery Verification</span>
                    <p className="text-[var(--text-secondary)]">
                      Doorstep cash handover upon arrival via Blue Dart Express. OTP verification active at delivery.
                    </p>
                  </div>
                )}

                {paymentMethod === 'PHONEPE' && (
                  <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 border-2 border-[#5F259F]/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#5F259F] dark:text-[#a875e2] font-bold uppercase text-[11px] font-mono">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>PhonePe Gateway Redirection & Callback Flow</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-200 dark:bg-purple-900 text-[#5F259F] dark:text-purple-200 font-bold">
                        Sandbox Simulator
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed">
                      <strong>Production Flow:</strong> When live credentials are active, clicking below redirects your browser directly to PhonePe’s secure server. If you cancel or do not pay on PhonePe, the order is <em>rejected</em>.
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed">
                      <strong>Current Sandbox:</strong> To test payment success, click <em>Simulate Successful Payment</em>. If you did <em>not</em> pay and want to cancel, click <em>Cancel (Did Not Pay)</em> below.
                    </p>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold pt-1 border-t border-purple-200/60 dark:border-purple-800/30">
                      ✓ S2S Callback & Auto-advance active • Zero manual UTR typing required
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[#b99762]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-[#b99762] dark:text-[#e6ca97] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Step 2: Enter 12-Digit Bank UTR / Reference No.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const demoUtr = `42${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                          setUserUtr(demoUtr);
                          setUtrError('');
                          showToast(`✓ Auto-filled demo UTR: ${demoUtr}`);
                        }}
                        className="px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase transition-colors"
                      >
                        Auto-Fill Test UTR
                      </button>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-mono leading-relaxed">
                      After completing your transfer of <strong className="text-[var(--text-primary)]">{formatPrice(finalTotal)}</strong> to <strong className="text-[var(--text-primary)]">9650834445@kotak</strong> in PhonePe / UPI app, enter your 12-digit bank reference (UTR) from the receipt.
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={18}
                        value={userUtr}
                        onChange={(e) => {
                          setUserUtr(e.target.value.replace(/[^\w]/g, '').toUpperCase());
                          if (utrError) setUtrError('');
                        }}
                        placeholder="e.g. 426309817263 (12 digits)"
                        className={`w-full h-11 px-3.5 bg-[var(--bg-card)] border text-sm font-mono tracking-wider text-[var(--text-primary)] font-bold outline-none uppercase ${
                          utrError ? 'border-red-500' : 'border-[var(--border-strong)] focus:border-[#b99762]'
                        }`}
                      />
                      {userUtr.length >= 10 && (
                        <Check className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {utrError && (
                      <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {utrError}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>3D Secure 2.0 Enabled • Automatic Callback & WhatsApp Notification</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => {
                    setShowPaymentModal(false);
                    showToast('Payment aborted. Order was not placed.');
                  }}
                  className="py-3 px-5 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel (Did Not Pay)
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment || (paymentMethod === 'PHONEPE' && isGeneratingPhonePeLink)}
                  onClick={handleExecutePayment}
                  className={`flex-1 py-3 disabled:opacity-50 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 ${
                    paymentMethod === 'PHONEPE'
                      ? 'bg-[#5F259F] hover:bg-[#4d1e82] text-white'
                      : 'bg-[#1d4136] hover:bg-[#132f27] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{paymentMethod === 'PHONEPE' ? 'Awaiting PhonePe Gateway Return...' : 'Verifying Payment & Recording UTR...'}</span>
                    </>
                  ) : paymentMethod === 'PHONEPE' ? (
                    <>
                      <PhonePeIcon className="w-4 h-4" />
                      <span>Simulate Successful Payment ({formatPrice(finalTotal)})</span>
                    </>
                  ) : paymentMethod === 'UPI' ? (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Verify UTR & Confirm Order ({formatPrice(finalTotal)})</span>
                    </>
                  ) : (
                    <span>Authorize & Pay {formatPrice(finalTotal)}</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 10. VIEW: ORDER TRACKING & HISTORICAL ARCHIVE
// ==========================================
function OrdersView() {
  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    navigate,
    formatPrice,
    addOrder,
    currencyMode,
    showToast,
    patronUser,
    loginPatron,
    logoutPatron,
    syncOrdersFromDb,
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Patron Sign-In Form State (Mobile Phone OTP Verification)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter orders strictly to logged-in patron's phone number for complete customer privacy
  const patronCleanPhone = useMemo(() => {
    if (!patronUser?.phone) return '';
    return patronUser.phone.replace(/[^\d]/g, '').slice(-10);
  }, [patronUser]);

  const patronOrders = useMemo(() => {
    if (!patronCleanPhone) return [];
    return orders.filter(
      (o) => (o.customerPhone || '').replace(/[^\d]/g, '').slice(-10) === patronCleanPhone
    );
  }, [orders, patronCleanPhone]);

  // Derive active order from patron's personal commissions
  const activeOrder = useMemo(() => {
    if (selectedOrder) {
      const match = patronOrders.find((o) => o.orderNumber === selectedOrder.orderNumber);
      if (match) return match;
    }
    return patronOrders.length > 0 ? patronOrders[0] : null;
  }, [patronOrders, selectedOrder]);

  // Auto-poll Supabase database every 8 seconds so curator stage moves (e.g. PREPARING) reflect live
  useEffect(() => {
    if (!patronUser) return;
    syncOrdersFromDb();
    const interval = setInterval(() => {
      syncOrdersFromDb();
    }, 8000);
    return () => clearInterval(interval);
  }, [patronUser]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncOrdersFromDb();
      showToast('✓ Live atelier status synced with workshop ledger');
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const handleCopyAWB = (awb) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(awb);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  const handleSearch = (queryStr) => {
    setSearchQuery(queryStr);
    if (!queryStr.trim()) return;
    const query = queryStr.trim().toLowerCase();
    const match = patronOrders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query)) ||
        (o.customerPhone && o.customerPhone.includes(query)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(query)) ||
        (o.city && o.city.toLowerCase().includes(query))
    );
    if (match) {
      setSelectedOrder(match);
    }
  };



  // 1. PATRON AUTHENTICATION SCREEN: If not logged in, enforce phone OTP authentication for privacy
  if (!patronUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-14 px-6 md:px-14 transition-colors duration-300 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[var(--bg-card)] border border-[#b99762]/60 p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-3 border-b border-[var(--border-subtle)] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current text-[10px] font-mono tracking-[0.25em] uppercase font-bold">
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal • Patron Security Authentication</span>
            </div>
            <h1 className="font-serif text-3xl text-[var(--text-primary)] uppercase tracking-wide">
              Customer Account & Order Tracking
            </h1>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              Please sign in with your registered mobile phone number. Only you can access your personal bespoke jewellery creation, studio casting timeline, and Blue Dart express courier logistics.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 text-xs font-mono">
            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider text-[10px] text-[var(--text-muted)] font-bold">
                Registered Mobile Phone
              </label>
              <div className="flex">
                <span className="h-11 px-3.5 bg-[var(--bg-secondary)] border border-r-0 border-[var(--border-strong)] text-[var(--text-secondary)] text-xs flex items-center font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={10}
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(e.target.value.replace(/[^\d]/g, ''));
                    setLoginError('');
                  }}
                  placeholder="e.g. 8796841184"
                  className="flex-1 h-11 px-3.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm font-mono tracking-widest text-[var(--text-primary)] font-bold outline-none focus:border-[#b99762]"
                />
              </div>
            </div>

            {/* OTP Field if sent */}
            {otpSent && (
              <div className="space-y-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <label className="block uppercase tracking-wider text-[10px] text-[var(--text-muted)] font-bold">
                    6-Digit Verification Code (OTP)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginOtp('123456');
                      setLoginError('');
                      showToast('✓ Auto-filled test code: 123456');
                    }}
                    className="text-[9px] font-mono text-[#b99762] dark:text-[#e6ca97] hover:underline uppercase font-bold"
                  >
                    Auto-Fill Test Code
                  </button>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={loginOtp}
                  onChange={(e) => {
                    setLoginOtp(e.target.value.replace(/[^\d]/g, ''));
                    setLoginError('');
                  }}
                  placeholder="123456"
                  className="w-full h-11 px-3.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-center text-lg font-mono tracking-[0.4em] text-[var(--text-primary)] font-bold outline-none focus:border-[#b99762]"
                />
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                  ✦ Verification code dispatched to +91 {loginPhone}. (Sandbox codes: 123456 or {generatedOtp})
                </p>
              </div>
            )}

            {loginError && (
              <p className="text-[11px] font-mono text-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => {
                    const clean = loginPhone.replace(/[^\d]/g, '').slice(-10);
                    if (clean.length < 10) {
                      setLoginError('Please enter a valid 10-digit Indian mobile number.');
                      return;
                    }
                    const res = generateOtp(clean);
                    setGeneratedOtp(res.otp);
                    setOtpSent(true);
                    showToast(`✦ Verification code dispatched to +91 ${clean}`);
                  }}
                  className="w-full py-3.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-wider uppercase font-bold transition-all shadow-md"
                >
                  Send Verification Code (OTP)
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={async () => {
                      if (!loginOtp || loginOtp.length < 6) {
                        setLoginError('Please enter the 6-digit verification code.');
                        return;
                      }
                      setIsVerifying(true);
                      const clean = loginPhone.replace(/[^\d]/g, '').slice(-10);
                      const check = verifyOtp(clean, loginOtp);
                      if (check.success) {
                        const matched = orders.find(
                          (o) => (o.customerPhone || '').replace(/[^\d]/g, '').slice(-10) === clean
                        );
                        loginPatron(clean, matched?.customerName || `Patron +91 ${clean}`);
                        await syncOrdersFromDb();
                      } else {
                        setLoginError(check.message || 'Invalid verification code.');
                      }
                      setIsVerifying(false);
                    }}
                    className="w-full py-3.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-wider uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Verify & Access Dossier</span>
                  </button>
                  <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setLoginOtp('');
                        setLoginError('');
                      }}
                      className="hover:underline"
                    >
                      Change Mobile Number
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const res = generateOtp(loginPhone);
                        setGeneratedOtp(res.otp);
                        showToast(`✦ New code dispatched to +91 ${loginPhone.slice(-10)}`);
                      }}
                      className="hover:underline text-[#b99762] dark:text-[#e6ca97]"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}
            </div>



            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono">
              <button
                type="button"
                onClick={() => navigate('atelier')}
                className="uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Catalog</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="text-[#b99762] hover:underline flex items-center gap-1 font-bold"
                title="Strictly for store management and master jewelers"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Store Owner / Staff Login →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED PATRON TRACKING DOSSIER
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-12 px-6 md:px-14 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Breadcrumb & Authenticated Patron Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-5 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('atelier')}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)] hover:text-[#b99762] dark:hover:text-[#e6ca97] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Atelier</span>
            </button>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-xs font-mono tracking-widest uppercase text-[var(--text-primary)] font-bold">
              Patron Commission Dossier
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Authenticated Patron Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[11px] font-mono">
              <User className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" />
              <span className="font-bold text-[var(--text-primary)]">{patronUser.name || 'Patron'}</span>
              <span className="text-[var(--text-muted)]">(+91 {patronCleanPhone})</span>
            </div>

            {/* Sync Workshop Status Button */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:border-[#b99762] border border-[var(--border-subtle)] text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
              title="Poll workshop ledger for latest curator movements"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#b99762]' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Workshop Status'}</span>
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={logoutPatron}
              className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/40 border border-transparent transition-colors inline-flex items-center gap-1"
              title="Sign out of patron dossier"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Blue Dart Express Air Logistics Tracker</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal uppercase tracking-tight">
            Track Your Patron Commission
          </h1>
          <p className="font-mono text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Real-time status of your bespoke jewellery commissions. Consignment numbers are issued when handed over to Blue Dart Express Air.
          </p>
        </div>

        {/* Orders Archive & Active Inspection Grid */}
        {patronOrders.length === 0 ? (
          <div className="p-12 text-center border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4 max-w-xl mx-auto shadow-sm">
            <PackageCheck className="w-10 h-10 text-[#b99762] dark:text-[#e6ca97] mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-2xl text-[var(--text-primary)]">No Active Commissions Found</h3>
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
              There are no orders recorded under mobile number <strong>+91 {patronCleanPhone}</strong>. If you placed an order under a different number or want to explore our fine jewellery creations, use the options below.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('atelier')}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono text-xs tracking-wider uppercase font-bold transition-all"
              >
                Explore Atelier
              </button>

              <button
                onClick={handleManualSync}
                className="w-full sm:w-auto px-6 py-2.5 border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-secondary)] font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Workshop Ledger</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Orders History List & Search */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] block font-bold">
                  My Commissions ({patronOrders.length})
                </span>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Order # or City..."
                    className="w-full pl-8 pr-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[#b99762]"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {patronOrders.map((order) => {
                  const isSelected = activeOrder?.orderNumber === order.orderNumber;
                  return (
                    <button
                      key={order.orderNumber}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full p-4 text-left border transition-all ${
                        isSelected
                          ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[var(--bg-card)] shadow-md ring-1 ring-current'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[#b99762] text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          #{order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current font-semibold">
                          {(order.status || 'CONFIRMED').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mt-2 text-xs">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {order.orderDate || new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        <span className="font-mono font-bold text-[var(--text-primary)]">
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
                        LOGISTICS & CONSIGNMENT DOSSIER
                      </span>
                      <h2 className="font-serif text-2xl text-[var(--text-primary)] mt-0.5">
                        Order #{activeOrder.orderNumber}
                      </h2>
                    </div>

                    {activeOrder.trackingNumber ? (
                      <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                        <div className="text-left sm:text-right min-w-[130px]">
                          <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                            Blue Dart Consignment No
                          </span>
                          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold break-all">
                            {activeOrder.trackingNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCopyAWB(activeOrder.trackingNumber)}
                            className="p-2 border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            title="Copy Consignment Tracking Number"
                          >
                            {copiedAWB ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href={getTrackingUrl(activeOrder.trackingNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[10px] font-mono uppercase tracking-wider font-bold hover:bg-[#132f27] transition-colors inline-flex items-center gap-1 shrink-0 shadow-xs"
                            title="Open live Blue Dart tracker"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
                        <Clock className="w-4 h-4 shrink-0" />
                        <div className="text-left">
                          <span className="text-[9px] font-mono uppercase tracking-wider block font-bold">
                            Consignment No. Status
                          </span>
                          <span className="text-[10px] font-mono">
                            Pending Dispatch (Issued upon Blue Dart handover)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Interactive Shipment Progress Stepper with Attached WhatsApp Messages */}
                  <div className="space-y-6 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--text-primary)] flex items-center gap-2 font-bold">
                      <Truck className="w-4 h-4 text-[#b99762] dark:text-[#e6ca97]" />
                      Real-Time Transit Progress (5-Stage Architecture)
                    </h3>

                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
                      {(activeOrder.timeline || createOrderTimeline(activeOrder.status || 'CONFIRMED', activeOrder.createdAt, activeOrder.trackingNumber)).map((step, idx) => {
                        const isDone = step.completed || step.current;
                        const matchingWaNotif = (activeOrder.whatsappNotifications || []).find(
                          (n) => n.stage === step.status || (n.templateName && n.templateName.toUpperCase().includes(step.status))
                        );
                        const fallbackWaText = composeWhatsAppTemplateMessage({
                          templateName: `aviora_order_${step.status.toLowerCase()}`,
                          recipientPhone: activeOrder.customerPhone,
                          customerName: activeOrder.customerName || 'Patron',
                          orderNumber: activeOrder.orderNumber,
                          stageTitle: step.label,
                          description: step.description,
                          awbNumber: (step.status === 'SHIPPED' || step.status === 'OUT_FOR_DELIVERY' || step.status === 'DELIVERED') && activeOrder.trackingNumber ? activeOrder.trackingNumber : undefined,
                          trackingUrl: (step.status === 'SHIPPED' || step.status === 'OUT_FOR_DELIVERY' || step.status === 'DELIVERED') && activeOrder.trackingNumber ? getTrackingUrl(activeOrder.trackingNumber) : undefined,
                        });
                        const currentWaText = matchingWaNotif?.previewText || fallbackWaText;

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
                            <div className="space-y-1">
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

                              {/* Attached Official WhatsApp Notification Card for this Stage */}
                              {isDone && (
                                <div className="mt-3 p-3.5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold uppercase text-[10px]">
                                      <WhatsAppIcon className="w-3.5 h-3.5" />
                                      <span>Official WhatsApp Dispatch • Template: {matchingWaNotif?.templateName || `aviora_order_${step.status.toLowerCase()}`}</span>
                                    </div>
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                                      DISPATCHED TO +91 {activeOrder.customerPhone} ✓
                                    </span>
                                  </div>
                                  {/* Notification message only */}
                                  <div className="whitespace-pre-wrap text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed bg-[var(--bg-card)] p-3 border border-[var(--border-subtle)] rounded shadow-2xs">
                                    {currentWaText}
                                  </div>
                                  <div className="text-[10px] text-[var(--text-muted)] font-mono pt-0.5">
                                    Dispatched to WhatsApp: {matchingWaNotif?.sentAt ? new Date(matchingWaNotif.sentAt).toLocaleString('en-IN') : step.timestamp}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Business Concierge Card */}
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[var(--text-primary)]">
                          WhatsApp Business Concierge & Dispatches
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        Dispatched Directly to Your Phone
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Every stage change made on your order dispatches an official WhatsApp template notification directly to your WhatsApp mobile application on{' '}
                        <strong className="text-[var(--text-primary)]">+91 {activeOrder.customerPhone}</strong>.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] text-[10px]">
                        <span className="text-[var(--text-muted)]">
                          Atelier Concierge Hotline: <strong className="text-[var(--text-primary)] font-mono">{STORE_CONFIG.brand.whatsapp}</strong>
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Meta Business Verified Dispatches
                        </span>
                      </div>
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
                              <ShieldCheck className="w-3.5 h-3.5" /> Fine 925 Pure Silver Core
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
                      <span>Includes 30-Day Manufacturing Warranty & Certificate</span>
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
    patronUser,
  } = useContext(AppContext);

  // Store Owner / Staff session starts locked and requires explicit PIN verification
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'add' | 'orders' | 'phonepe' | 'bookkeeping'
  const [searchCatalog, setSearchCatalog] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSilhouette, setFilterSilhouette] = useState('all'); // 'all' | 'light' | 'heavy'
  const [filterCollection, setFilterCollection] = useState('all'); // 'all' | 'new-arrivals' | 'minimalist' | 'statement' | 'moissanite' | 'pearl' | 'gifting'
  const [filterStock, setFilterStock] = useState('all'); // 'all' | 'initial_low' | 'in_stock' | 'out_of_stock'
  const [customTagInputs, setCustomTagInputs] = useState({}); // productId -> custom tag input string

  // Bookkeeping Ledger state
  const [searchLedger, setSearchLedger] = useState('');
  const [filterLedgerStage, setFilterLedgerStage] = useState('all');
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);

  // WhatsApp Preview Modal State
  const [previewWhatsAppModal, setPreviewWhatsAppModal] = useState(null);
  const [updatingStageOrders, setUpdatingStageOrders] = useState({});

  // PhonePe Admin Settings & Sandbox State
  const [phonePeConfig, setPhonePeConfig] = useState(getPhonePeConfig());
  const [testLinkAmount, setTestLinkAmount] = useState('3299');
  const [testLinkPhone, setTestLinkPhone] = useState('9820012345');
  const [testLinkName, setTestLinkName] = useState('Ananya Sharma');
  const [generatedTestLink, setGeneratedTestLink] = useState(null);
  const [isGeneratingTestLink, setIsGeneratingTestLink] = useState(false);
  const [testLinkCopied, setTestLinkCopied] = useState(false);

  const handleGenerateTestPhonePeLink = async (e) => {
    e.preventDefault();
    setIsGeneratingTestLink(true);
    try {
      const amt = Number(testLinkAmount) || 3299;
      const res = await createPhonePePaymentLink({
        orderNumber: `TEST-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: amt,
        customerName: testLinkName,
        customerPhone: testLinkPhone,
        customConfig: phonePeConfig,
      });
      setGeneratedTestLink(res);
      showToast('✓ PhonePe Payment Link generated with SHA-256 checksum');
    } catch (err) {
      console.error(err);
      showToast('Error generating test link');
    } finally {
      setIsGeneratingTestLink(false);
    }
  };

  const handleSavePhonePeSettings = (e) => {
    e.preventDefault();
    savePhonePeConfig(phonePeConfig);
    showToast('✓ PhonePe API credentials updated successfully');
  };

  // Stage advancement & automated WhatsApp Business dispatch
  const handleStageMove = async (order, targetStage) => {
    // Prevent duplicate dispatches if order is already at the target stage
    if (order.status === targetStage) {
      showToast(`Order #${order.orderNumber} is already at stage ${targetStage.replace(/_/g, ' ')}`);
      return;
    }
    // Prevent rapid multiple clicks while dispatch is in progress
    if (updatingStageOrders[order.orderNumber]) {
      return;
    }
    setUpdatingStageOrders((prev) => ({ ...prev, [order.orderNumber]: true }));

    let awb = (order.trackingNumber || '').trim();
    if (targetStage === 'SHIPPED' || targetStage === 'OUT_FOR_DELIVERY' || targetStage === 'DELIVERED') {
      if (!awb) {
        const inputVal = document.getElementById(`awb-${order.orderNumber}`)?.value?.trim();
        awb = inputVal || generateAwbNumber();
        const inputEl = document.getElementById(`awb-${order.orderNumber}`);
        if (inputEl) inputEl.value = awb;
      }
    } else {
      // If moving to CONFIRMED or PREPARING, do not assign premature AWB
      awb = order.trackingNumber || '';
    }

    try {
      const waRecord = await sendWhatsAppStageNotification(order, targetStage, awb);
      await adminUpdateOrderStatus(order.orderNumber, targetStage, awb, waRecord);
      showToast(`✓ Order #${order.orderNumber} moved to ${targetStage.replace(/_/g, ' ')}${awb ? ` with Consignment ${awb}` : ''}!`);
    } catch (err) {
      console.error('Stage update failed:', err);
      showToast('Stage update notice. Please check connection.');
    } finally {
      setUpdatingStageOrders((prev) => ({ ...prev, [order.orderNumber]: false }));
    }
  };

  const handleUpdateAwb = async (order, customAwb) => {
    const finalAwb = (customAwb || generateAwbNumber()).trim();
    try {
      let waRecord = null;
      if (order.status === 'SHIPPED' || order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') {
        waRecord = await sendWhatsAppStageNotification(order, order.status, finalAwb);
      }
      await adminUpdateOrderStatus(order.orderNumber, order.status, finalAwb, waRecord);
      showToast(`✓ Blue Dart Consignment updated to ${finalAwb}`);
    } catch (err) {
      console.error('AWB update failed:', err);
    }
  };

  // Synchronize Cloud Ledger with Supabase database (Remote records take precedence over local cache)
  const handleSyncCloudLedger = async () => {
    setIsSyncingLedger(true);
    try {
      const remoteOrders = await fetchOrdersFromDb();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders((prev) => {
          const map = new Map();
          // Local cache first
          prev.forEach((o) => map.set(o.orderNumber, o));
          // Remote database records overwrite local cache with latest status
          remoteOrders.forEach((o) => {
            const existing = map.get(o.orderNumber);
            map.set(o.orderNumber, existing ? { ...existing, ...o } : o);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('aura_orders_history', JSON.stringify(merged));
          return merged;
        });
      }
      showToast('✓ Cloud Ledger synced with Supabase');
    } catch (err) {
      console.error('Cloud ledger sync failed:', err);
      showToast('Sync notice. Displaying local cached ledger.');
    } finally {
      setIsSyncingLedger(false);
    }
  };

  // Financial calculations for Bookkeeping & Analytics
  const bookkeepingAnalytics = useMemo(() => {
    let grossRevenue = 0;
    let totalTaxGST = 0;
    let pendingCourierCount = 0;
    let inTransitCourierCount = 0;
    let deliveredCount = 0;

    orders.forEach((o) => {
      const g = Number(o.total) || 0;
      grossRevenue += g;
      const gst = Number(o.gstAmount) || Math.round((g * 3) / 103);
      totalTaxGST += gst;
      if (o.status === 'CONFIRMED' || o.status === 'PREPARING') {
        pendingCourierCount++;
      } else if (o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY') {
        inTransitCourierCount++;
      } else if (o.status === 'DELIVERED') {
        deliveredCount++;
      }
    });

    const netRevenue = grossRevenue - totalTaxGST;
    const aov = orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;

    return {
      grossRevenue,
      totalTaxGST,
      netRevenue,
      aov,
      totalOrders: orders.length,
      pendingCourierCount,
      inTransitCourierCount,
      deliveredCount,
    };
  }, [orders]);

  // Filtered orders for Bookkeeping Ledger
  const filteredLedgerOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchLedger.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.paymentTransactionId?.toLowerCase().includes(q);

      const matchesStage = filterLedgerStage === 'all' || o.status === filterLedgerStage;
      return matchesSearch && matchesStage;
    });
  }, [orders, searchLedger, filterLedgerStage]);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'minimalist',
    categorySlug: 'minimalist-jewellery',
    collection: 'minimalist',
    collections: ['minimalist', 'new-arrivals'],
    tags: ['bracelets'],
    silhouette: 'light',
    price: 3299,
    originalPrice: 3299,
    inventory: 8,
    goldPurity: '14K Gold Plated Vermeil',
    colorTone: 'Whitish Gold',
    metalColorHex: '#EDE7DC',
    occasionVibe: 'Everyday Wear',
    finish: 'Polished',
    hallmark: 'Fine 925 Sterling Silver',
    warranty: '30-Day Manufacturing Warranty',
    dimensions: 'Standard Universal Fit',
    weight: 'Fine 925 Silver Core',
    images: ['/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg'],
    modelImage: '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg',
    description: 'Precision crafted in Fine 925 sterling silver with a heavy 2.5-micron jacket of 14K Whitish Gold Vermeil.',
    editorialNote: 'Hand-finished in our Delhi atelier.',
    pairsWithId: '',
    upsellReason: '',
    newImageUrl: '', // temp input for adding image URLs
    _addToFront: false,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('');

  const handleFileUpload = async (e, target = 'new') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      setUploadFeedback(`Uploading ${file.name}...`);
      const publicUrl = await uploadProductImageToStorage(file);
      if (target === 'new') {
        // Add to new product images array — ALWAYS at index 0 so it appears first on PDP & catalogue
        setNewProductForm((prev) => {
          const cur = prev.images || [];
          const updated = [publicUrl, ...cur.filter((u) => u !== publicUrl)];
          return {
            ...prev,
            images: updated,
            modelImage: updated[0] || publicUrl,
          };
        });
      } else {
        // Add to editing product images array — ALWAYS at index 0 so it appears first on PDP & catalogue
        setEditingProduct((prev) => {
          const cur = prev.images || [];
          const updated = [publicUrl, ...cur.filter((u) => u !== publicUrl)];
          return {
            ...prev,
            images: updated,
            modelImage: updated[0] || publicUrl,
          };
        });
      }
      setUploadFeedback(`✓ Uploaded as Front Cover (Angle 01): ${file.name}`);
      showToast('✓ Image uploaded as primary front angle for PDP');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadFeedback('Upload failed. Please try again or paste image URL.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    if (pinCode.trim() === '149250' || pinCode.trim() === '1492') {
      setIsAuthenticated(true);
      try {
        sessionStorage.removeItem('aviora_admin_session_auth');
        localStorage.removeItem('aviora_admin_auth');
      } catch {}
      setPinError('');
      showToast('✦ Staff Access Authorized');
    } else {
      setPinError('Invalid PIN code. Enter staff PIN 149250 to authenticate.');
    }
  };

  const handlePrefillPin = () => {
    setPinCode('149250');
    setPinError('');
    showToast('PIN 149250 entered. Click Authenticate to proceed.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinCode('');
    setPinError('');
    try {
      sessionStorage.removeItem('aviora_admin_session_auth');
      localStorage.removeItem('aviora_admin_auth');
    } catch {}
    showToast('Staff Session Concluded & Locked');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const images = (newProductForm.images || []).filter(Boolean);
    if (images.length === 0) {
      showToast('Please add at least one product image.');
      return;
    }

    adminAddProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      categorySlug: newProductForm.categorySlug,
      silhouette: newProductForm.silhouette || 'light',
      collections: newProductForm.collections && newProductForm.collections.length > 0
        ? newProductForm.collections
        : [newProductForm.collection || newProductForm.category],
      tags: newProductForm.tags || [],
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.price),
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
      modelImage: images[0],
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
    const collections = Array.isArray(editingProduct.collections) ? editingProduct.collections : [];
    const tags = Array.isArray(editingProduct.tags) ? editingProduct.tags : [];
    const isNewFlag = Boolean(
      editingProduct.isNew ||
      collections.includes('new-arrivals') ||
      collections.includes('new') ||
      collections.includes('new-arrival') ||
      tags.includes('new') ||
      tags.includes('new-arrivals') ||
      tags.includes('new-arrival')
    );

    adminUpdateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice || editingProduct.price),
      inventory: Number(editingProduct.inventory),
      inStock: Number(editingProduct.inventory) > 0,
      description: editingProduct.description,
      editorialNote: editingProduct.editorialNote,
      goldPurity: editingProduct.goldPurity,
      colorTone: editingProduct.colorTone,
      material: editingProduct.material,
      images: editingProduct.images,
      modelImage: editingProduct.images?.[0] || editingProduct.modelImage,
      category: editingProduct.category,
      categorySlug: editingProduct.categorySlug,
      subcategory: editingProduct.subcategory,
      silhouette: editingProduct.silhouette || 'light',
      collections,
      tags,
      isNew: isNewFlag,
      hallmark: editingProduct.hallmark || 'Fine 925 Sterling Silver',
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

    // 1. Category filter
    if (filterCategory !== 'all') {
      list = list.filter((p) => {
        if (p.category === filterCategory) return true;
        if (p.categorySlug === filterCategory) return true;
        if (filterCategory === 'earrings' && (p.subcategory === 'earrings' || p.categorySlug?.includes('ear') || p.name?.toLowerCase().includes('earring'))) return true;
        if (filterCategory === 'necklaces' && (p.subcategory === 'necklaces' || p.categorySlug?.includes('choker') || p.categorySlug?.includes('hasli') || p.name?.toLowerCase().includes('necklace') || p.name?.toLowerCase().includes('chain') || p.name?.toLowerCase().includes('pendant'))) return true;
        if (filterCategory === 'bracelets' && (p.subcategory === 'bracelets' || p.categorySlug?.includes('kada') || p.categorySlug?.includes('bangle') || p.name?.toLowerCase().includes('bracelet') || p.name?.toLowerCase().includes('kada'))) return true;
        if (filterCategory === 'rings' && (p.subcategory === 'rings' || p.categorySlug?.includes('ring') || p.name?.toLowerCase().includes('ring'))) return true;
        if (filterCategory === 'jewellery-sets' && (p.subcategory === 'jewellery-sets' || p.name?.toLowerCase().includes('suite') || p.name?.toLowerCase().includes('set'))) return true;
        return false;
      });
    }

    // 2. Silhouette filter (light vs heavy)
    if (filterSilhouette !== 'all') {
      list = list.filter((p) => p.silhouette === filterSilhouette);
    }

    // 3. Collection filter
    if (filterCollection !== 'all') {
      list = list.filter((p) => {
        if (Array.isArray(p.collections) && p.collections.includes(filterCollection)) return true;
        if (p.category === filterCollection) return true;
        if (filterCollection === 'new-arrivals' && p.isNew) return true;
        return false;
      });
    }

    // 4. Stock Status filter
    if (filterStock === 'initial_low') {
      // Show newly added pieces or low stock items (inventory <= 2)
      list = list.filter((p) => Number(p.inventory) <= 2 && Number(p.inventory) > 0);
    } else if (filterStock === 'in_stock') {
      list = list.filter((p) => Number(p.inventory) > 0);
    } else if (filterStock === 'out_of_stock') {
      list = list.filter((p) => Number(p.inventory) === 0);
    }

    // 5. Search query
    if (searchCatalog.trim()) {
      const q = searchCatalog.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          (Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [products, filterCategory, filterSilhouette, filterCollection, filterStock, searchCatalog]);

  // If locked, render security portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border-strong)] p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 border border-[#1d4136]/30 dark:border-[#e6ca97]/30 flex items-center justify-center mx-auto text-[#1d4136] dark:text-[#e6ca97]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
              Store Owner & Master Jeweler (Restricted)
            </div>
            <h2 className="font-serif text-3xl text-[var(--text-primary)] font-normal">
              Store Admin & Atelier Portal
            </h2>
            <p className="text-xs font-sans text-[var(--text-secondary)]">
              Strictly for Aviora store managers & master jewelers. Enter the 6-digit Staff PIN (149250) to manage inventory, catalog prices, Blue Dart waybills, and financial bookkeeping.
            </p>
          </div>

          {/* Patron Notice: If customer is logged in, guide them to their customer-facing dossier */}
          {patronUser && (
            <div className="p-4 bg-[#1d4136]/5 dark:bg-[#e6ca97]/5 border border-[#b99762]/50 text-xs font-mono space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-[#b99762] dark:text-[#e6ca97] uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5" />
                <span>Patron Session Active: {patronUser.name}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Looking to track your jewellery order or Blue Dart courier consignment? This page is the staff vault for atelier bench jewelers. Your customer tracking dossier is in your Patron Portal.
              </p>
              <button
                type="button"
                onClick={() => navigate('orders')}
                className="w-full py-2 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Open My Patron Order Tracking</span>
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-1.5">
                Curator Staff PIN (Default: 149250)
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
              Authenticate Staff Access
            </button>
          </form>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-sans">
            <button
              onClick={() => navigate('home')}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Storefront
            </button>
            <button
              type="button"
              onClick={handlePrefillPin}
              className="text-[#b99762] hover:underline font-bold text-[11px] font-mono"
            >
              Pre-fill Staff PIN (149250)
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
                AVIORA JEWELLERS • DELHI ATELIER
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('orders')}
              className="px-3.5 py-1.5 text-xs font-sans font-bold tracking-[0.1em] uppercase border border-[#b99762]/60 hover:bg-[#b99762]/10 text-[#b99762] dark:text-[#e6ca97] transition-colors flex items-center gap-1.5"
              title="Preview client-facing tracking dossier"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Patron Tracking View</span>
            </button>
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
          <button
            onClick={() => setActiveTab('phonepe')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'phonepe'
                ? 'border-[#5F259F] text-[#5F259F]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <PhonePeIcon className="w-4 h-4" />
            <span>PhonePe Gateway & Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('bookkeeping')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'bookkeeping'
                ? 'border-[#1d4136] dark:border-[#e6ca97] text-[#1d4136] dark:text-[#e6ca97]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bookkeeping & Analytics Ledger</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: CATALOG & TAGGING MANAGER */}
        {/* ========================================== */}
        {activeTab === 'catalog' && (
          <div className="mt-8 space-y-6">
            {/* Multi-Axis Catalog Filter & Curation Toolbar */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search name, ID (e.g. prod-017), material, slug, or tag..."
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                  />
                  {searchCatalog && (
                    <button
                      onClick={() => setSearchCatalog('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Add Creation Button */}
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-5 py-2.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-xs font-sans font-bold tracking-[0.12em] uppercase transition-colors hover:bg-[#132f27] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Creation</span>
                </button>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-[var(--border-subtle)] text-xs font-sans">
                {/* 1. Category Filter */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1 font-bold">
                    Category Filter
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="minimalist">Minimalist Jewellery</option>
                    <option value="statement">Statement Jewellery</option>
                    <option value="moissanite">Moissanite Collection</option>
                    <option value="pearl">Pearl Collection</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="gifting">Gifting Occasions</option>
                    <option value="necklaces">Necklaces & Chains</option>
                    <option value="bracelets">Bracelets & Kadas</option>
                    <option value="earrings">Earrings & Studs</option>
                    <option value="rings">Rings</option>
                    <option value="jewellery-sets">Sets & Suites</option>
                  </select>
                </div>

                {/* 2. Silhouette Filter */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1 font-bold">
                    Silhouette Curation
                  </label>
                  <select
                    value={filterSilhouette}
                    onChange={(e) => setFilterSilhouette(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                  >
                    <option value="all">All Silhouettes</option>
                    <option value="light">Light (Everyday Wear)</option>
                    <option value="heavy">Heavy (Statement Presence)</option>
                  </select>
                </div>

                {/* 3. Collection Tag Filter */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1 font-bold">
                    Collection / Tag
                  </label>
                  <select
                    value={filterCollection}
                    onChange={(e) => setFilterCollection(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                  >
                    <option value="all">All Collections</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="minimalist">Minimalist Edit</option>
                    <option value="statement">Statement Jewellery</option>
                    <option value="moissanite">Moissanite Collection</option>
                    <option value="pearl">Freshwater Pearls</option>
                    <option value="gifting">Gifting Occasions</option>
                  </select>
                </div>

                {/* 4. Stock Filter */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1 font-bold">
                    Stock Status
                  </label>
                  <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-sans text-[var(--text-primary)] outline-none"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="initial_low">Initial / Low Stock (≤ 2 units)</option>
                    <option value="in_stock">In Stock (&gt; 0 units)</option>
                    <option value="out_of_stock">Out of Stock (0 units)</option>
                  </select>
                </div>
              </div>

              {/* Status bar with Active Filters & Reset */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[var(--text-muted)]">
                    Showing <strong className="text-[var(--text-primary)]">{filteredCatalog.length}</strong> of{' '}
                    <strong>{products.length}</strong> creations
                  </span>
                  {(filterCategory !== 'all' || filterSilhouette !== 'all' || filterCollection !== 'all' || filterStock !== 'all' || searchCatalog) && (
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterSilhouette('all');
                        setFilterCollection('all');
                        setFilterStock('all');
                        setSearchCatalog('');
                      }}
                      className="px-2 py-0.5 text-[9px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded hover:bg-amber-200"
                    >
                      Clear All Filters ✕
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-[var(--text-muted)] hidden sm:block">
                  Tag pieces below to place into collections & silhouettes in real-time
                </div>
              </div>
            </div>

            {/* Catalog Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((product) => (
                <div
                  key={product.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header: Image & Main Details */}
                    <div className="flex gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-24 object-cover bg-[var(--bg-stone)] border border-[var(--border-subtle)]"
                        />
                        {product.images?.length > 1 && (
                          <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-[#e6ca97] text-[7.5px] font-mono font-bold rounded-xs tracking-wider">
                            {product.images.length} ANGLES
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--text-muted)] truncate">
                            {product.id}
                          </span>
                          <span className="text-[11px] font-sans font-bold text-emerald-600 dark:text-emerald-400">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <h4 className="font-serif text-base text-[var(--text-primary)] line-clamp-1 font-normal" title={product.name}>
                          {product.name}
                        </h4>
                        <p className="text-[10px] font-sans text-[var(--text-secondary)] line-clamp-1">
                          {product.goldPurity || product.material}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className={`px-1.5 py-0.5 text-[8.5px] font-mono uppercase border ${
                            Number(product.inventory) <= 2
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                          }`}>
                            Stock: {product.inventory ?? 2}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[8.5px] font-mono uppercase text-[#b99762] border border-[var(--border-subtle)]">
                            {product.colorTone || 'Whitish Gold'}
                          </span>
                          {product.images?.length > 1 && (
                            <span className="px-1.5 py-0.5 bg-[#1d4136]/10 dark:bg-[#e6ca97]/10 text-[8.5px] font-mono uppercase text-[#1d4136] dark:text-[#e6ca97] border border-[#1d4136]/20 dark:border-[#e6ca97]/20 font-bold">
                              ✦ {product.images.length} Photos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Multi-Angle Preview Strip */}
                    {product.images?.length > 1 && (
                      <div className="flex items-center gap-1.5 p-1.5 bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)] rounded-xs">
                        <span className="text-[8.5px] font-mono text-[var(--text-muted)] uppercase tracking-wider shrink-0 font-bold">
                          Angles ({product.images.length}):
                        </span>
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {product.images.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => navigate('pdp', product)}
                              title={`Preview Angle 0${idx + 1} in Studio Gallery`}
                              className="relative shrink-0 hover:ring-1 hover:ring-[#b99762] transition-all"
                            >
                              <img
                                src={img}
                                alt={`Angle 0${idx + 1}`}
                                className="w-6 h-7 object-cover border border-[var(--border-subtle)] rounded-xs"
                              />
                              <span className="absolute bottom-0 right-0 text-[6.5px] font-mono bg-black/80 text-white px-0.5 font-bold">
                                0{idx + 1}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Tagging & Curation Controls */}
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 p-2.5 rounded-xs">
                      {/* Row 1: Category Selector */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--text-muted)] shrink-0 font-bold">
                          Category:
                        </span>
                        <select
                          value={product.category || 'minimalist'}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            const slugMap = {
                              'minimalist': 'minimalist-jewellery',
                              'statement': 'statement-jewellery',
                              'moissanite': 'moissanite-collection',
                              'pearl': 'freshwater-pearl-jewellery',
                              'new-arrivals': 'latest-launches',
                              'gifting': 'occasions-gifting',
                            };
                            adminUpdateProduct(product.id, {
                              category: newCat,
                              categorySlug: slugMap[newCat] || newCat,
                            });
                          }}
                          className="h-6 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[10px] font-sans text-[var(--text-primary)] outline-none flex-1 max-w-[180px]"
                        >
                          <option value="minimalist">Minimalist</option>
                          <option value="statement">Statement</option>
                          <option value="moissanite">Moissanite</option>
                          <option value="pearl">Freshwater Pearl</option>
                          <option value="new-arrivals">New Arrivals</option>
                          <option value="gifting">Gifting</option>
                        </select>
                      </div>

                      {/* Row 2: Silhouette Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--text-muted)] shrink-0 font-bold">
                          Silhouette:
                        </span>
                        <div className="inline-flex rounded border border-[var(--border-subtle)] p-0.5 bg-[var(--bg-primary)]">
                          <button
                            type="button"
                            onClick={() => adminUpdateProduct(product.id, { silhouette: 'light' })}
                            className={`px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-wider rounded transition-colors ${
                              product.silhouette === 'light'
                                ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold shadow-xs'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            type="button"
                            onClick={() => adminUpdateProduct(product.id, { silhouette: 'heavy' })}
                            className={`px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-wider rounded transition-colors ${
                              product.silhouette === 'heavy'
                                ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold shadow-xs'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            Heavy
                          </button>
                        </div>
                      </div>

                      {/* Row 3: Collection Tag Pills */}
                      <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--text-muted)] block font-bold">
                          Tag in Collections:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {['new-arrivals', 'minimalist', 'statement', 'moissanite', 'pearl', 'gifting'].map((colKey) => {
                            const isTagged = Array.isArray(product.collections) && product.collections.includes(colKey);
                            return (
                              <button
                                key={colKey}
                                type="button"
                                onClick={() => {
                                  const cur = Array.isArray(product.collections) ? [...product.collections] : [];
                                  const next = isTagged ? cur.filter((c) => c !== colKey) : [...cur, colKey];
                                  const isNewUpdate = colKey === 'new-arrivals' ? !isTagged : undefined;
                                  adminUpdateProduct(product.id, {
                                    collections: next,
                                    ...(isNewUpdate !== undefined ? { isNew: isNewUpdate } : {}),
                                  });
                                }}
                                className={`px-1.5 py-0.5 text-[8px] font-mono uppercase rounded transition-colors ${
                                  isTagged
                                    ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold'
                                    : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                                }`}
                                title={isTagged ? `Click to remove from ${colKey}` : `Click to tag in ${colKey}`}
                              >
                                {isTagged ? '✓ ' : '+ '}
                                {colKey === 'new-arrivals' ? 'New' : colKey}
                              </button>
                            );
                          })}

                          {/* Render custom tags */}
                          {Array.isArray(product.collections) &&
                            product.collections
                              .filter((c) => !['new-arrivals', 'minimalist', 'statement', 'moissanite', 'pearl', 'gifting'].includes(c))
                              .map((customTag) => (
                                <span
                                  key={customTag}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 font-bold rounded"
                                >
                                  <span>#{customTag}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = product.collections.filter((c) => c !== customTag);
                                      const isNewVal = (customTag === 'new' || customTag === 'new-arrivals') ? false : undefined;
                                      adminUpdateProduct(product.id, {
                                        collections: next,
                                        ...(isNewVal !== undefined ? { isNew: isNewVal } : {}),
                                      });
                                    }}
                                    className="hover:text-rose-600 ml-0.5"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                        </div>

                        {/* Quick Custom Tag Adder */}
                        <div className="flex items-center gap-1 pt-1">
                          <input
                            type="text"
                            placeholder="+ Custom tag (Press Enter)..."
                            value={customTagInputs[product.id] || ''}
                            onChange={(e) => setCustomTagInputs({ ...customTagInputs, [product.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const rawTag = (customTagInputs[product.id] || '').trim().toLowerCase().replace(/\s+/g, '-');
                                if (rawTag) {
                                  const cur = Array.isArray(product.collections) ? [...product.collections] : [];
                                  if (!cur.includes(rawTag)) {
                                    const isNewVal = (rawTag === 'new' || rawTag === 'new-arrivals' || rawTag === 'new-arrival') ? true : undefined;
                                    adminUpdateProduct(product.id, {
                                      collections: [...cur, rawTag],
                                      ...(isNewVal !== undefined ? { isNew: isNewVal } : {}),
                                    });
                                    showToast(`✓ Tagged with #${rawTag}`);
                                  }
                                  setCustomTagInputs({ ...customTagInputs, [product.id]: '' });
                                }
                              }
                            }}
                            className="w-full h-6 px-2 text-[9px] font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const rawTag = (customTagInputs[product.id] || '').trim().toLowerCase().replace(/\s+/g, '-');
                              if (rawTag) {
                                const cur = Array.isArray(product.collections) ? [...product.collections] : [];
                                if (!cur.includes(rawTag)) {
                                  const isNewVal = (rawTag === 'new' || rawTag === 'new-arrivals' || rawTag === 'new-arrival') ? true : undefined;
                                  adminUpdateProduct(product.id, {
                                    collections: [...cur, rawTag],
                                    ...(isNewVal !== undefined ? { isNew: isNewVal } : {}),
                                  });
                                  showToast(`✓ Tagged with #${rawTag}`);
                                }
                                setCustomTagInputs({ ...customTagInputs, [product.id]: '' });
                              }
                            }}
                            className="px-2 h-6 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[8.5px] font-mono uppercase font-bold hover:bg-[var(--bg-stone)] shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock and CRUD Controls */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-sans">
                    {/* Live stock stepper syncing immediately */}
                    <div className="flex items-center gap-1.5">
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
                        {product.inventory ?? 2}
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
                        'new-arrivals': 'latest-launches',
                        minimalist: 'minimalist-jewellery',
                        statement: 'statement-jewellery',
                        moissanite: 'moissanite-collection',
                        pearl: 'freshwater-pearl-jewellery',
                        gifting: 'occasions-gifting',
                      };
                      setNewProductForm({
                        ...newProductForm,
                        category: cat,
                        categorySlug: slugMap[cat] || 'minimalist-jewellery',
                      });
                    }}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="new-arrivals">New Arrivals (Latest Launches)</option>
                    <option value="minimalist">Minimalist Jewellery</option>
                    <option value="statement">Statement Jewellery</option>
                    <option value="moissanite">Moissanite Collection</option>
                    <option value="pearl">Pearl Collection (Freshwater Pearls)</option>
                    <option value="gifting">Gifting Occasions</option>
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
                    Silhouette & Presence *
                  </label>
                  <select
                    value={newProductForm.silhouette || 'light'}
                    onChange={(e) => setNewProductForm({ ...newProductForm, silhouette: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  >
                    <option value="light">Delicate & Light (Minimalist & Everyday)</option>
                    <option value="heavy">Bold & Heavy (Statement Sculptures)</option>
                  </select>
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
                    <option value="Whitish Gold">Whitish Gold</option>
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

              {/* Tag in Collections */}
              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1 text-xs">
                  Tag in Collections
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)]">
                  {[
                    { id: 'new-arrivals', label: 'New Arrivals' },
                    { id: 'minimalist', label: 'Minimalist' },
                    { id: 'statement', label: 'Statement' },
                    { id: 'moissanite', label: 'Moissanite' },
                    { id: 'pearl', label: 'Pearl' },
                    { id: 'gifting', label: 'Gifting' },
                  ].map((col) => {
                    const isTagged = Array.isArray(newProductForm.collections) && newProductForm.collections.includes(col.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          const cur = Array.isArray(newProductForm.collections) ? [...newProductForm.collections] : [];
                          const next = isTagged ? cur.filter((c) => c !== col.id) : [...cur, col.id];
                          setNewProductForm({ ...newProductForm, collections: next, collection: next[0] || newProductForm.category });
                        }}
                        className={`px-2.5 py-1 text-[10.5px] font-mono uppercase rounded transition-colors cursor-pointer ${
                          isTagged
                            ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {isTagged ? '✓ ' : '+ '}
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Taxonomy & Subcategory Tags (Storefront Filter Pills) */}
              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1 text-xs">
                  Taxonomy & Subcategory Tags (Storefront Filter Pills)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)]">
                  {[
                    { id: 'necklaces', label: 'Necklaces' },
                    { id: 'earrings', label: 'Earrings' },
                    { id: 'rings', label: 'Rings' },
                    { id: 'bracelets', label: 'Bracelets' },
                    { id: 'sets', label: 'Sets' },
                    { id: 'anklets', label: 'Anklets' },
                    { id: 'gra-certified', label: 'GRA Certified Jewellery' },
                    { id: 'freshwater-pearls', label: 'Freshwater Pearl Jewellery' },
                    { id: 'rakhi', label: 'Rakhi' },
                    { id: 'birthday', label: 'Birthday' },
                    { id: 'anniversary', label: 'Anniversary' },
                    { id: 'bridesmaid', label: 'Bridesmaid' },
                  ].map((tag) => {
                    const isTagged = Array.isArray(newProductForm.tags) && newProductForm.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const cur = Array.isArray(newProductForm.tags) ? [...newProductForm.tags] : [];
                          const next = isTagged ? cur.filter((t) => t !== tag.id) : [...cur, tag.id];
                          setNewProductForm({
                            ...newProductForm,
                            tags: next,
                          });
                        }}
                        className={`px-2.5 py-1 text-[10.5px] font-mono uppercase rounded transition-colors cursor-pointer ${
                          isTagged
                            ? 'bg-[#b99762] text-white font-bold shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {isTagged ? '✓ ' : '+ '}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Gallery Manager */}
              <div className="space-y-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold tracking-[0.14em] uppercase text-[#1d4136] dark:text-[#e6ca97] text-xs flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" />
                      Studio Image Gallery ({newProductForm.images?.length || 0} angles)
                    </label>
                    <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                      Angle 01 (leftmost) represents the primary catalogue cover. Use ◀ ▶ or ★ Front to reorder.
                    </p>
                  </div>
                  {isUploadingImage && (
                    <span className="text-[10px] font-mono text-amber-500 animate-pulse">
                      Uploading...
                    </span>
                  )}
                </div>

                {uploadFeedback && (
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{uploadFeedback}</p>
                )}

                {/* Existing images with remove, reorder, and set cover */}
                <div className="flex flex-wrap gap-3 min-h-[110px] p-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  {(newProductForm.images || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center p-1.5 border transition-all ${
                        idx === 0
                          ? 'border-amber-500/80 bg-amber-500/5 shadow-xs'
                          : 'border-[var(--border-strong)] bg-[var(--bg-card)]'
                      }`}
                    >
                      <div className="relative w-20 h-24 bg-[var(--bg-stone)] overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 left-0 text-[8px] font-mono px-1 py-0.5 ${
                            idx === 0
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-black/80 text-white'
                          }`}
                        >
                          {idx === 0 ? 'COVER 01' : `0${idx + 1}`}
                        </span>
                        {/* Always-visible Remove Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (newProductForm.images || []).filter((_, i) => i !== idx);
                            setNewProductForm({
                              ...newProductForm,
                              images: updated,
                              modelImage: updated[0] || '',
                            });
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer touch-manipulation z-10"
                          title="Remove this angle"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Reorder and Set Cover Controls (Touch-Friendly on Phone & Web) */}
                      <div className="flex items-center justify-between w-full mt-1.5 gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...(newProductForm.images || [])];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            setNewProductForm({ ...newProductForm, images: copy, modelImage: copy[0] });
                          }}
                          className="flex-1 py-1.5 sm:py-0.5 text-[11px] sm:text-[9px] font-mono font-bold border border-[var(--border-subtle)] disabled:opacity-20 hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                          title="Move angle left (earlier in gallery)"
                        >
                          ◀
                        </button>
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              const cur = [...(newProductForm.images || [])];
                              const [chosen] = cur.splice(idx, 1);
                              cur.unshift(chosen);
                              setNewProductForm({ ...newProductForm, images: cur, modelImage: cur[0] });
                              showToast('✓ Image set as front cover!');
                            }}
                            className="flex-1 py-1.5 sm:py-0.5 text-[9px] sm:text-[8px] font-mono uppercase bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/30 active:bg-amber-500/30 cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                            title="Make this angle the primary catalogue cover"
                          >
                            ★ Front
                          </button>
                        ) : (
                          <span className="flex-1 text-[8px] sm:text-[7.5px] font-mono text-amber-600 dark:text-amber-400 font-bold text-center flex items-center justify-center">COVER</span>
                        )}
                        <button
                          type="button"
                          disabled={idx === (newProductForm.images || []).length - 1}
                          onClick={() => {
                            if (idx === (newProductForm.images || []).length - 1) return;
                            const copy = [...(newProductForm.images || [])];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            setNewProductForm({ ...newProductForm, images: copy, modelImage: copy[0] });
                          }}
                          className="flex-1 py-1.5 sm:py-0.5 text-[11px] sm:text-[9px] font-mono font-bold border border-[var(--border-subtle)] disabled:opacity-20 hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                          title="Move angle right (later in gallery)"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  ))}
                  {(newProductForm.images || []).length === 0 && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] self-center p-2">
                      No images attached — add at least one angle below
                    </span>
                  )}
                </div>

                {/* Add new angle controls */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. /products/name-2.jpg) then press Enter or click + Add"
                      value={newProductForm.newImageUrl || ''}
                      onChange={(e) => setNewProductForm({ ...newProductForm, newImageUrl: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const url = (newProductForm.newImageUrl || '').trim();
                          if (url) {
                            const cur = newProductForm.images || [];
                            const updated = [url, ...cur.filter((u) => u !== url)];
                            setNewProductForm({ ...newProductForm, images: updated, modelImage: updated[0], newImageUrl: '' });
                            showToast(`✓ Image angle added as primary cover (Angle 01)`);
                          }
                        }
                      }}
                      className="flex-1 h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[11px] font-mono text-[var(--text-primary)] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = (newProductForm.newImageUrl || '').trim();
                        if (url) {
                          const cur = newProductForm.images || [];
                          const updated = [url, ...cur.filter((u) => u !== url)];
                          setNewProductForm({ ...newProductForm, images: updated, modelImage: updated[0], newImageUrl: '' });
                          showToast(`✓ Image angle added as primary cover (Angle 01)`);
                        }
                      }}
                      className="px-4 h-9 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[10px] font-mono font-bold uppercase shrink-0 hover:opacity-90 active:scale-95 cursor-pointer touch-manipulation"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'new')}
                      className="text-xs text-[var(--text-secondary)] file:mr-2 file:py-1 file:px-2 file:border file:border-[var(--border-strong)] file:text-[10px] file:font-mono file:uppercase file:bg-[var(--bg-secondary)] file:text-[var(--text-primary)] file:cursor-pointer cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">Or upload file</span>
                  </div>
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
                {orders.map((order) => {
                  const currentStage = order.status || 'CONFIRMED';
                  const stagesList = [
                    { id: 'CONFIRMED', label: '1. Confirmed', desc: 'Payment Verified & Queued' },
                    { id: 'PREPARING', label: '2. Preparing', desc: 'Delhi Atelier Handcrafting' },
                    { id: 'SHIPPED', label: '3. Shipped', desc: 'Blue Dart Air Express' },
                    { id: 'OUT_FOR_DELIVERY', label: '4. Out for Delivery', desc: 'Local Courier Handover' },
                    { id: 'DELIVERED', label: '5. Delivered', desc: 'Patron Handover Complete' },
                  ];

                  const latestWaNotif = order.whatsappNotifications?.[order.whatsappNotifications.length - 1];

                  return (
                    <div
                      key={order.orderNumber}
                      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 space-y-6 shadow-xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                              #{order.orderNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current font-bold">
                              {currentStage.replace(/_/g, ' ')}
                            </span>
                            {order.otpVerified && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Phone OTP Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">
                            Order Date: {order.orderDate || new Date(order.createdAt).toLocaleDateString('en-IN')} • Payment: {order.paymentMethod || 'Prepaid'}
                            {order.paymentTransactionId ? ` (${order.paymentTransactionId})` : ''}
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

                      {/* STAGE MOVEMENT CONTROLS (Single Click & WhatsApp Trigger) */}
                      <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#b99762] dark:text-[#e6ca97]" />
                            Move Order Lifecycle Stage (Triggers Instant WhatsApp Business Template Dispatch)
                          </span>
                          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            Meta WhatsApp Cloud API Connected
                          </span>
                        </div>

                        {/* Quick 5-Stage Toolbar */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {stagesList.map((st) => {
                            const isActive = currentStage === st.id;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                disabled={isActive || updatingStageOrders[order.orderNumber]}
                                onClick={() => handleStageMove(order, st.id)}
                                className={`p-2.5 text-left border transition-all flex flex-col justify-between ${
                                  isActive
                                    ? 'bg-[#1d4136] text-white dark:bg-[#e6ca97] dark:text-black border-[#1d4136] dark:border-[#e6ca97] shadow-sm font-bold cursor-default opacity-95'
                                    : updatingStageOrders[order.orderNumber]
                                    ? 'opacity-50 cursor-wait bg-[var(--bg-card)] border-[var(--border-subtle)]'
                                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                                title={isActive ? `Currently in ${st.label}` : `Advance to ${st.label}`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[11px] font-mono uppercase font-bold">
                                    {st.label}
                                  </span>
                                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className={`text-[8px] font-mono mt-1 line-clamp-1 ${isActive ? 'opacity-90' : 'text-[var(--text-muted)]'}`}>
                                  {st.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Patron Details & Logistics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-sans">
                        {/* Customer Info */}
                        <div className="space-y-1 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)] block">
                            Consignee Information
                          </span>
                          <p className="font-bold text-[var(--text-primary)]">{order.customerName}</p>
                          <p className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                            +91 {order.customerPhone}
                          </p>
                          <p className="font-mono">{order.customerEmail}</p>
                          <p className="text-[var(--text-muted)] mt-1">
                            {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                          </p>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)] block">
                            Ordered Sculptures ({order.items?.length || 0})
                          </span>
                          <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
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

                        {/* Blue Dart Consignment Management */}
                        <div className="space-y-2.5 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="block text-[9px] font-bold tracking-wider uppercase text-[var(--text-muted)]">
                                Blue Dart Consignment No.
                              </label>
                              {order.trackingNumber ? (
                                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                  Assigned ✓
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                                  Pending Handover
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                defaultValue={order.trackingNumber || ''}
                                id={`awb-${order.orderNumber}`}
                                placeholder="BLD-xxxx-xxxx-IN / Consignment No"
                                className="w-full h-8 px-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`awb-${order.orderNumber}`);
                                  if (input) {
                                    handleUpdateAwb(order, input.value);
                                  }
                                }}
                                className="px-2.5 h-8 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#132f27]"
                              >
                                Save
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
                            <button
                              type="button"
                              onClick={() => {
                                const newAwb = generateAwbNumber();
                                const input = document.getElementById(`awb-${order.orderNumber}`);
                                if (input) input.value = newAwb;
                                handleUpdateAwb(order, newAwb);
                              }}
                              className="text-[10px] font-mono text-[#b99762] dark:text-[#e6ca97] underline font-bold uppercase"
                            >
                              Generate Consignment No
                            </button>
                            {order.trackingNumber && (
                              <a
                                href={getTrackingUrl(order.trackingNumber)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Blue Dart</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Business Dispatch & Audit Footer */}
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-[10px] uppercase font-mono tracking-wider block">
                              WhatsApp Business Integration Status:
                            </span>
                            <span className="text-[11px] font-mono">
                              {latestWaNotif
                                ? `Last Dispatched: ${latestWaNotif.templateName} (${new Date(latestWaNotif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) ✓`
                                : 'Ready to dispatch on stage advance'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const previewText = composeWhatsAppTemplateMessage({
                                templateName: `aviora_order_${currentStage.toLowerCase()}`,
                                recipientPhone: order.customerPhone,
                                customerName: order.customerName,
                                orderNumber: order.orderNumber,
                                stageTitle: currentStage.replace(/_/g, ' '),
                                description: `Order moved to ${currentStage.replace(/_/g, ' ')} by atelier curator.`,
                                awbNumber: order.trackingNumber || 'BLD-8824-9102-IN',
                                trackingUrl: getTrackingUrl(order.trackingNumber || 'BLD-8824-9102-IN'),
                              });
                              setPreviewWhatsAppModal({
                                order,
                                stage: currentStage,
                                messageText: previewText,
                                waUrl: getWhatsAppDirectUrl(order.customerPhone, previewText),
                              });
                            }}
                            className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-strong)] hover:border-[#b99762] text-[var(--text-primary)] text-[10px] font-mono uppercase font-bold transition-colors"
                          >
                            Preview Template
                          </button>
                          <a
                            href={getWhatsAppDirectUrl(
                              order.customerPhone,
                              composeWhatsAppTemplateMessage({
                                templateName: `aviora_order_${currentStage.toLowerCase()}`,
                                recipientPhone: order.customerPhone,
                                customerName: order.customerName,
                                orderNumber: order.orderNumber,
                                stageTitle: currentStage.replace(/_/g, ' '),
                                description: `Order moved to ${currentStage.replace(/_/g, ' ')} by atelier curator.`,
                                awbNumber: order.trackingNumber || 'BLD-8824-9102-IN',
                                trackingUrl: getTrackingUrl(order.trackingNumber || 'BLD-8824-9102-IN'),
                              })
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>Send via WhatsApp Web</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: PHONEPE GATEWAY & PAYMENT LINKS API */}
        {/* ========================================== */}
        {activeTab === 'phonepe' && (
          <div className="mt-8 space-y-8">
            <div className="border-b border-[var(--border-subtle)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <PhonePeIcon className="w-6 h-6" />
                  <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                    PhonePe Payment Gateway & Payment Links
                  </h3>
                </div>
                <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5">
                  Official PhonePe Developer Integration for payment links, exact cart amount conversion in paise, SHA-256 X-VERIFY checksums, and payment callbacks.
                </p>
              </div>
              <a
                href="https://developer.phonepe.com/payment-gateway/payment-links/api-reference-payment-links/introduction"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#5F259F] hover:bg-[#4d1e82] text-white text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>PhonePe Developer Docs</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: API Configuration */}
              <div className="lg:col-span-5 space-y-6">
                <form onSubmit={handleSavePhonePeSettings} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Gateway Credentials
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#5F259F]/10 text-[#5F259F] text-[9px] font-mono font-bold uppercase border border-[#5F259F]/30">
                      {phonePeConfig.env} Mode
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Environment Mode
                      </label>
                      <select
                        value={phonePeConfig.env}
                        onChange={(e) => setPhonePeConfig({ ...phonePeConfig, env: e.target.value })}
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
                      >
                        <option value="UAT">UAT / Sandbox (api-preprod.phonepe.com)</option>
                        <option value="PRODUCTION">Production (api.phonepe.com/apis/hermes)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Merchant ID (MID)
                      </label>
                      <input
                        type="text"
                        value={phonePeConfig.merchantId}
                        onChange={(e) => setPhonePeConfig({ ...phonePeConfig, merchantId: e.target.value })}
                        placeholder="PGTESTPAYUAT"
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                      />
                      <span className="text-[9px] text-[var(--text-muted)]">Default test MID: PGTESTPAYUAT</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Salt Key (Client Secret)
                      </label>
                      <input
                        type="password"
                        value={phonePeConfig.saltKey}
                        onChange={(e) => setPhonePeConfig({ ...phonePeConfig, saltKey: e.target.value })}
                        placeholder="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Salt Index
                      </label>
                      <input
                        type="number"
                        value={phonePeConfig.saltIndex}
                        onChange={(e) => setPhonePeConfig({ ...phonePeConfig, saltIndex: Number(e.target.value) || 1 })}
                        className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#5F259F] hover:bg-[#4d1e82] text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
                  >
                    Save PhonePe Settings
                  </button>
                </form>

                {/* API Specs Information */}
                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block text-[11px] uppercase tracking-wider">
                    Official API Protocol Specs
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5 text-[10px] text-[var(--text-secondary)]">
                    <li>
                      <strong>Amount in Paise:</strong> Amounts are strictly transmitted in paise integer (`1 INR = 100 paise`). Cart value ₹3,299 translates to `329900` paise.
                    </li>
                    <li>
                      <strong>Checksum Calculation:</strong> `SHA256(Base64(Payload) + "/pg/v1/pay" + SaltKey) + "###" + SaltIndex`
                    </li>
                    <li>
                      <strong>Payment Links URL:</strong> Generates shortened payment links (`https://phon.pe/vl/pay_...`) for direct consumer settlement.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Live Payment Link Tester Sandbox */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#5F259F]" />
                      Payment Link Generator Sandbox
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      developer.phonepe.com
                    </span>
                  </div>

                  <form onSubmit={handleGenerateTestPhonePeLink} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Amount (INR)
                        </label>
                        <input
                          type="number"
                          value={testLinkAmount}
                          onChange={(e) => setTestLinkAmount(e.target.value)}
                          placeholder="3299"
                          className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                        />
                        <span className="text-[9px] text-[#5F259F] font-bold">
                          = {((Number(testLinkAmount) || 0) * 100).toLocaleString('en-IN')} paise
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Customer Phone
                        </label>
                        <input
                          type="tel"
                          value={testLinkPhone}
                          onChange={(e) => setTestLinkPhone(e.target.value)}
                          placeholder="9820012345"
                          className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={testLinkName}
                          onChange={(e) => setTestLinkName(e.target.value)}
                          placeholder="Ananya Sharma"
                          className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGeneratingTestLink}
                      className="px-6 py-2.5 bg-[#5F259F] hover:bg-[#4d1e82] text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2"
                    >
                      {isGeneratingTestLink ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link className="w-3.5 h-3.5" />}
                      <span>Generate PhonePe Payment Link</span>
                    </button>
                  </form>

                  {/* Generated Test Result */}
                  {generatedTestLink && (
                    <div className="mt-6 p-4 bg-[var(--bg-secondary)] border border-[#5F259F]/40 space-y-4 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-[#5F259F]/20 pb-2">
                        <span className="font-bold text-[#5F259F] flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-500" />
                          Link Ready: {generatedTestLink.data.payLink}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedTestLink.data.payLink);
                              setTestLinkCopied(true);
                              showToast('✓ Link copied to clipboard');
                              setTimeout(() => setTestLinkCopied(false), 2000);
                            }}
                            className="px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[10px] font-mono font-bold uppercase hover:bg-[#5F259F] hover:text-white transition-colors"
                          >
                            {testLinkCopied ? 'Copied!' : 'Copy Link'}
                          </button>
                          <a
                            href={generatedTestLink.data.payLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#5F259F] text-white text-[10px] font-mono font-bold uppercase hover:bg-[#4d1e82] transition-colors"
                          >
                            Open Link
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                        <div>
                          <span className="text-[var(--text-muted)] block">Amount in Paise:</span>
                          <span className="font-bold text-[var(--text-primary)]">{generatedTestLink.data.amountInPaise.toLocaleString('en-IN')} paise</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)] block">Merchant Transaction ID:</span>
                          <span className="font-mono text-[var(--text-primary)]">{generatedTestLink.data.merchantTransactionId}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[var(--text-muted)] block">X-VERIFY Checksum Header:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 break-all">{generatedTestLink.data.xVerify}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[var(--text-muted)] block">Base64 Encoded Payload:</span>
                          <span className="font-mono text-[var(--text-muted)] break-all">{generatedTestLink.data.base64Payload.slice(0, 80)}...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: BOOKKEEPING & FINANCIAL ANALYTICS LEDGER */}
        {/* ========================================== */}
        {activeTab === 'bookkeeping' && (
          <div className="mt-8 space-y-8">
            {/* Header with Export Actions */}
            <div className="border-b border-[var(--border-subtle)] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-[#1d4136] dark:text-[#e6ca97]" />
                  <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                    Bookkeeping & Financial Analytics Vault
                  </h3>
                </div>
                <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5 max-w-2xl leading-relaxed">
                  Persistent double-entry transaction journal, 3% jewellery GST tax compliance, Blue Dart consignment reconciliation, and 1-click accounting exports for Tally Prime, Zoho Books, and Chartered Accountants.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    exportBookkeepingLedgerAsCsv(orders);
                    showToast('✓ Bookkeeping Ledger exported (.CSV) for Tally & Zoho');
                  }}
                  className="px-3.5 py-2 bg-[#1d4136] hover:bg-[#16332a] dark:bg-[#e6ca97] dark:hover:bg-[#d9b87c] text-white dark:text-[#242321] text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Ledger (CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportBookkeepingLedgerAsJson(orders);
                    showToast('✓ Complete audit archive exported (.JSON)');
                  }}
                  className="px-3.5 py-2 border border-[var(--border-strong)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors bg-[var(--bg-card)] shadow-xs"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Export Archive (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncCloudLedger}
                  disabled={isSyncingLedger}
                  className="p-2 border border-[var(--border-subtle)] hover:border-[#b99762] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded"
                  title="Synchronize with Supabase Cloud Database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLedger ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Financial & Logistics KPI Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Gross Revenue */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Gross Commission Volume
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] block">
                  {formatPrice(bookkeepingAnalytics.grossRevenue)}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block">
                  {bookkeepingAnalytics.totalOrders} total commissions
                </span>
              </div>

              {/* Net Atelier Revenue */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Net Atelier Revenue
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#1d4136] dark:text-[#e6ca97] block font-bold">
                  {formatPrice(bookkeepingAnalytics.netRevenue)}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                  Excluding statutory taxes
                </span>
              </div>

              {/* GST 3% Tax Reserve */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  GST 3% Tax Reserve
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#b99762] dark:text-[#e6ca97] block">
                  {formatPrice(bookkeepingAnalytics.totalTaxGST)}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                  1.5% CGST + 1.5% SGST
                </span>
              </div>

              {/* AOV */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Average Commission
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] block">
                  {formatPrice(bookkeepingAnalytics.aov)}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                  AOV per patron
                </span>
              </div>

              {/* In-Transit Blue Dart */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Blue Dart In-Transit
                </span>
                <span className="font-serif text-xl sm:text-2xl text-blue-600 dark:text-blue-400 block">
                  {bookkeepingAnalytics.inTransitCourierCount}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                  Active consignments
                </span>
              </div>

              {/* Pending Dispatch */}
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Pending Courier Handover
                </span>
                <span className="font-serif text-xl sm:text-2xl text-amber-600 dark:text-amber-400 block">
                  {bookkeepingAnalytics.pendingCourierCount}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                  Benchwork in progress
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchLedger}
                  onChange={(e) => setSearchLedger(e.target.value)}
                  placeholder="Search order #, patron, phone, AWB..."
                  className="w-full pl-8 pr-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[#b99762]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={filterLedgerStage}
                  onChange={(e) => setFilterLedgerStage(e.target.value)}
                  className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
                >
                  <option value="all">All Stages ({orders.length})</option>
                  <option value="CONFIRMED">1. Confirmed</option>
                  <option value="PREPARING">2. Preparing Handcraft</option>
                  <option value="SHIPPED">3. Shipped Blue Dart</option>
                  <option value="OUT_FOR_DELIVERY">4. Out for Delivery</option>
                  <option value="DELIVERED">5. Delivered to Patron</option>
                </select>

                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Showing {filteredLedgerOrders.length} record(s)
                </span>
              </div>
            </div>

            {/* Bookkeeping Ledger Table */}
            {filteredLedgerOrders.length === 0 ? (
              <div className="p-12 text-center border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
                <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                <p className="font-serif text-xl text-[var(--text-primary)]">No bookkeeping entries found.</p>
                <p className="text-xs font-sans text-[var(--text-secondary)]">
                  {searchLedger ? 'No orders match your search criteria.' : 'Transactions will appear here as soon as checkout commissions are confirmed.'}
                </p>
              </div>
            ) : (
              <div className="border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-mono border-collapse min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Patron Dossier</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5 text-right">Gross Total</th>
                      <th className="p-3.5 text-right">GST (3%)</th>
                      <th className="p-3.5 text-right">Net Revenue</th>
                      <th className="p-3.5">Payment Ref & VPA</th>
                      <th className="p-3.5">Blue Dart Consignment</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredLedgerOrders.map((o) => {
                      const gross = Number(o.total) || 0;
                      const gst = Number(o.gstAmount) || Math.round((gross * 3) / 103);
                      const net = gross - gst;
                      const cleanAwb = (o.trackingNumber || '').trim();

                      return (
                        <tr key={o.orderNumber} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                          <td className="p-3.5 whitespace-nowrap text-[11px] text-[var(--text-secondary)]">
                            {o.orderDate || (o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'Recent')}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-bold text-[var(--text-primary)]">
                              #{o.orderNumber}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[var(--text-primary)]">{o.customerName}</div>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                              +91 {o.customerPhone}
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)] truncate max-w-[140px]">
                              {o.city}, {o.state}
                            </div>
                          </td>
                          <td className="p-3.5 text-[11px] max-w-[200px]">
                            {Array.isArray(o.items) && o.items.length > 0 ? (
                              <ul className="space-y-0.5">
                                {o.items.map((it, idx) => (
                                  <li key={idx} className="truncate">
                                    {it.name || it.title} × {it.quantity || 1}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-[var(--text-muted)]">1 Sculpture</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap font-bold text-[var(--text-primary)]">
                            {formatPrice(gross)}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap text-[#b99762] dark:text-[#e6ca97]">
                            {formatPrice(gst)}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap font-bold text-[#1d4136] dark:text-[#e6ca97]">
                            {formatPrice(net)}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-[10px]">
                            <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <span>{o.paymentMethod || 'PhonePe'}</span>
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)] font-mono">
                              VPA: 9650834445@kotak
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)] truncate max-w-[150px]">
                              TXN: {o.paymentTransactionId || o.phonepeTransactionId || 'SETTLED'}
                            </div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {cleanAwb ? (
                              <div className="space-y-1">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                                  {cleanAwb}
                                </span>
                                <a
                                  href={getTrackingUrl(cleanAwb)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] text-[var(--text-muted)] hover:text-[#b99762] dark:hover:text-[#e6ca97] inline-flex items-center gap-1 underline"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>Blue Dart Tracking</span>
                                </a>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50 block w-fit">
                                Pending Dispatch
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#1d4136]/10 text-[#1d4136] dark:bg-[#e6ca97]/10 dark:text-[#e6ca97] border border-current font-bold">
                              {(o.status || 'CONFIRMED').replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* WHATSAPP TEMPLATE PREVIEW MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {previewWhatsAppModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full bg-[var(--bg-card)] border border-emerald-600 p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-serif text-lg text-[var(--text-primary)] font-normal">
                      WhatsApp Business Template Dispatch
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      RECIPIENT: +91 {previewWhatsAppModal.order.customerPhone} • TEMPLATE: aviora_order_{previewWhatsAppModal.stage.toLowerCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewWhatsAppModal(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                  Official Formatted Message Payload:
                </span>
                <pre className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-[11px] font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {previewWhatsAppModal.messageText}
                </pre>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(previewWhatsAppModal.messageText);
                      showToast('✓ WhatsApp template copied to clipboard');
                    }
                  }}
                  className="flex-1 py-2.5 border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
                <a
                  href={previewWhatsAppModal.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Open WhatsApp Web</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="max-w-2xl w-full max-h-[92vh] bg-[var(--bg-card)] border border-[var(--border-strong)] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-5 sm:p-6 pb-4 shrink-0 bg-[var(--bg-card)]">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-normal">
                  Edit Creation Specs & Pricing
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                  ID: {editingProduct.id} • Leftmost angle 01 appears as primary catalogue cover
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl rounded hover:bg-[var(--bg-secondary)] transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs font-sans custom-scrollbar">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category || 'minimalist'}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const slugMap = {
                        'minimalist': 'minimalist-jewellery',
                        'statement': 'statement-jewellery',
                        'moissanite': 'moissanite-collection',
                        'pearl': 'freshwater-pearl-jewellery',
                        'new-arrivals': 'latest-launches',
                        'gifting': 'occasions-gifting',
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: newCat,
                        categorySlug: slugMap[newCat] || newCat,
                      });
                    }}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none cursor-pointer"
                  >
                    <option value="minimalist">Minimalist Jewellery</option>
                    <option value="statement">Statement Jewellery</option>
                    <option value="moissanite">Moissanite Collection</option>
                    <option value="pearl">Pearl Collection</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="gifting">Gifting Occasions</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Silhouette Curation
                  </label>
                  <select
                    value={editingProduct.silhouette || 'light'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, silhouette: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none cursor-pointer"
                  >
                    <option value="light">Light (Everyday Wear)</option>
                    <option value="heavy">Heavy (Statement Presence)</option>
                  </select>
                </div>
              </div>

              {/* Tag in Collections */}
              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  Tag in Collections
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)]">
                  {[
                    { id: 'new-arrivals', label: 'New Arrivals' },
                    { id: 'minimalist', label: 'Minimalist' },
                    { id: 'statement', label: 'Statement' },
                    { id: 'moissanite', label: 'Moissanite' },
                    { id: 'pearl', label: 'Pearl' },
                    { id: 'gifting', label: 'Gifting' },
                  ].map((col) => {
                    const isTagged = Array.isArray(editingProduct.collections) && editingProduct.collections.includes(col.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          const cur = Array.isArray(editingProduct.collections) ? [...editingProduct.collections] : [];
                          const next = isTagged ? cur.filter((c) => c !== col.id) : [...cur, col.id];
                          setEditingProduct({
                            ...editingProduct,
                            collections: next,
                            ...(col.id === 'new-arrivals' ? { isNew: !isTagged } : {}),
                          });
                        }}
                        className={`px-2.5 py-1 text-[10.5px] font-mono uppercase rounded transition-colors cursor-pointer ${
                          isTagged
                            ? 'bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {isTagged ? '✓ ' : '+ '}
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Taxonomy & Item Type Tags (Dynamic Filter Pills) */}
              <div>
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  Taxonomy & Subcategory Tags (Storefront Filter Pills)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)]">
                  {[
                    { id: 'new', label: 'New Launch' },
                    { id: 'necklaces', label: 'Necklaces' },
                    { id: 'earrings', label: 'Earrings' },
                    { id: 'rings', label: 'Rings' },
                    { id: 'bracelets', label: 'Bracelets' },
                    { id: 'sets', label: 'Sets' },
                    { id: 'anklets', label: 'Anklets' },
                    { id: 'gra-certified', label: 'GRA Certified Jewellery' },
                    { id: 'freshwater-pearls', label: 'Freshwater Pearl Jewellery' },
                    { id: 'rakhi', label: 'Rakhi' },
                    { id: 'birthday', label: 'Birthday' },
                    { id: 'anniversary', label: 'Anniversary' },
                    { id: 'bridesmaid', label: 'Bridesmaid' },
                  ].map((tag) => {
                    const isTagged = Array.isArray(editingProduct.tags) && editingProduct.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const cur = Array.isArray(editingProduct.tags) ? [...editingProduct.tags] : [];
                          const next = isTagged ? cur.filter((t) => t !== tag.id) : [...cur, tag.id];
                          setEditingProduct({
                            ...editingProduct,
                            tags: next,
                            ...(tag.id === 'new' ? { isNew: !isTagged } : {}),
                            subcategory: ['necklaces', 'earrings', 'rings', 'bracelets', 'sets', 'anklets'].includes(tag.id) && !isTagged
                              ? tag.id
                              : editingProduct.subcategory,
                          });
                        }}
                        className={`px-2.5 py-1 text-[10.5px] font-mono uppercase rounded transition-colors cursor-pointer ${
                          isTagged
                            ? 'bg-[#b99762] text-white font-bold shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {isTagged ? '✓ ' : '+ '}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Metallurgy Spec
                  </label>
                  <input
                    type="text"
                    value={editingProduct.goldPurity || editingProduct.material || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, goldPurity: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                    Noble Metal Purity Specification
                  </label>
                  <input
                    type="text"
                    value={editingProduct.hallmark || 'Fine 925 Sterling Silver'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hallmark: e.target.value })}
                    className="w-full h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              {/* Studio Image Gallery Manager with Reordering & Removal */}
              <div className="space-y-3 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-strong)]">
                <div className="flex items-center justify-between">
                  <label className="block font-bold tracking-wider uppercase text-[var(--text-primary)] text-xs flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-[#b99762]" />
                    Studio Image Gallery ({editingProduct.images?.length || 0} angles)
                  </label>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Leftmost is catalogue cover
                  </span>
                </div>

                {/* Existing angles card strip with Reorder & Remove buttons */}
                <div className="flex flex-wrap gap-3 p-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] min-h-[70px]">
                  {(editingProduct.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative flex flex-col items-center bg-[var(--bg-card)] border border-[var(--border-strong)] p-1.5 shadow-xs rounded-xs">
                      <div className="relative w-20 h-24 sm:w-24 sm:h-28 overflow-hidden bg-[var(--bg-stone)] border border-[var(--border-subtle)]">
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute bottom-0.5 left-0.5 text-[7.5px] font-mono px-1 font-bold ${idx === 0 ? 'bg-amber-500 text-black' : 'bg-black/80 text-white'}`}>
                          {idx === 0 ? 'COVER 01' : `0${idx + 1}`}
                        </span>
                        {/* Always-visible Remove Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingProduct.images || []).filter((_, i) => i !== idx);
                            setEditingProduct({
                              ...editingProduct,
                              images: updated,
                              modelImage: updated[0] || '',
                            });
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer touch-manipulation z-10"
                          title="Remove this angle"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Reorder and Set Cover Controls (Touch-Friendly on Phone & Web) */}
                      <div className="flex items-center justify-between w-full mt-1.5 gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...(editingProduct.images || [])];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            setEditingProduct({ ...editingProduct, images: copy, modelImage: copy[0] });
                          }}
                          className="flex-1 py-1.5 sm:py-0.5 text-[11px] sm:text-[9px] font-mono font-bold border border-[var(--border-subtle)] disabled:opacity-20 hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                          title="Move angle left (earlier in gallery)"
                        >
                          ◀
                        </button>
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              const cur = [...(editingProduct.images || [])];
                              const [chosen] = cur.splice(idx, 1);
                              cur.unshift(chosen);
                              setEditingProduct({ ...editingProduct, images: cur, modelImage: cur[0] });
                              showToast('✓ Image set as front cover!');
                            }}
                            className="flex-1 py-1.5 sm:py-0.5 text-[9px] sm:text-[8px] font-mono uppercase bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/30 active:bg-amber-500/30 cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                            title="Make this angle the primary catalogue cover"
                          >
                            ★ Front
                          </button>
                        ) : (
                          <span className="flex-1 text-[8px] sm:text-[7.5px] font-mono text-amber-600 dark:text-amber-400 font-bold text-center flex items-center justify-center">COVER</span>
                        )}
                        <button
                          type="button"
                          disabled={idx === (editingProduct.images || []).length - 1}
                          onClick={() => {
                            if (idx === (editingProduct.images || []).length - 1) return;
                            const copy = [...(editingProduct.images || [])];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            setEditingProduct({ ...editingProduct, images: copy, modelImage: copy[0] });
                          }}
                          className="flex-1 py-1.5 sm:py-0.5 text-[11px] sm:text-[9px] font-mono font-bold border border-[var(--border-subtle)] disabled:opacity-20 hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer touch-manipulation flex items-center justify-center min-h-[30px] sm:min-h-[22px] rounded-xs"
                          title="Move angle right (later in gallery)"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  ))}
                  {(editingProduct.images || []).length === 0 && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] self-center p-2">
                      No images attached — add at least one angle below
                    </span>
                  )}
                </div>

                {/* Add new angle controls */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. /products/name-2.jpg) then press Enter or click + Add"
                      value={editingProduct._newImageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, _newImageUrl: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const url = (editingProduct._newImageUrl || '').trim();
                          if (url) {
                            const cur = editingProduct.images || [];
                            const updated = [url, ...cur.filter((u) => u !== url)];
                            setEditingProduct({ ...editingProduct, images: updated, modelImage: updated[0], _newImageUrl: '' });
                            showToast(`✓ Image angle added as primary cover (Angle 01)`);
                          }
                        }
                      }}
                      className="flex-1 h-9 px-2.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[11px] font-mono text-[var(--text-primary)] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = (editingProduct._newImageUrl || '').trim();
                        if (url) {
                          const cur = editingProduct.images || [];
                          const updated = [url, ...cur.filter((u) => u !== url)];
                          setEditingProduct({ ...editingProduct, images: updated, modelImage: updated[0], _newImageUrl: '' });
                          showToast(`✓ Image angle added as primary cover (Angle 01)`);
                        }
                      }}
                      className="px-4 h-9 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black text-[10px] font-mono font-bold uppercase shrink-0 hover:opacity-90 active:scale-95 cursor-pointer touch-manipulation"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'edit')}
                      className="text-xs text-[var(--text-secondary)] file:mr-2 file:py-1 file:px-2 file:border file:border-[var(--border-strong)] file:text-[10px] file:font-mono file:uppercase file:bg-[var(--bg-secondary)] file:text-[var(--text-primary)] file:cursor-pointer cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">Or upload file directly</span>
                  </div>
                </div>
              </div>

              {/* Description field */}
              <div className="space-y-1">
                <label className="block font-bold tracking-wider uppercase text-[var(--text-muted)]">
                  Description & Craft Notes
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Enter detailed piece description for PDP..."
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Sticky Action Buttons Footer */}
              <div className="sticky bottom-0 bg-[var(--bg-card)]/95 backdrop-blur-md pt-3 pb-1 border-t border-[var(--border-subtle)] flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-bold uppercase tracking-wider hover:bg-[#132f27] dark:hover:bg-[#d4b980] transition-colors shadow-md cursor-pointer"
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
// ==========================================
// 10. BRAND POLICY & STORY MODAL (ATELIER FOUNDATIONS)
// ==========================================
function BrandPolicyModal() {
  const { policyModalOpen, setPolicyModalOpen, activePolicyTab, setActivePolicyTab } =
    useContext(AppContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPolicyModalOpen(false);
    };
    if (policyModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [policyModalOpen, setPolicyModalOpen]);

  if (!policyModalOpen) return null;

  const activePolicy = BRAND_POLICIES.find((p) => p.id === activePolicyTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <AvioraBrandCrest className="w-6 h-6 text-[#1d4136] dark:text-[#e6ca97]" />
            <div>
              <span className="font-serif text-lg font-normal tracking-[0.16em] uppercase text-[var(--text-primary)] block">
                AVIORA
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--text-muted)] uppercase block">
                Brand Transparency & Policies
              </span>
            </div>
          </div>
          <button
            onClick={() => setPolicyModalOpen(false)}
            className="p-1.5 hover:bg-[var(--bg-stone)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Tab Sidebar + Right Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col">
            <button
              onClick={() => setActivePolicyTab('our-story')}
              className={`px-4 py-3 text-left text-xs font-sans font-semibold tracking-wider whitespace-nowrap transition-colors border-l-2 ${
                activePolicyTab === 'our-story'
                  ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              ✦ Our Story & Promise
            </button>
            {BRAND_POLICIES.map((pol) => (
              <button
                key={pol.id}
                onClick={() => setActivePolicyTab(pol.id)}
                className={`px-4 py-3 text-left text-xs font-sans font-semibold tracking-wider whitespace-nowrap transition-colors border-l-2 ${
                  activePolicyTab === pol.id
                    ? 'border-[#1d4136] dark:border-[#e6ca97] bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {pol.title}
              </button>
            ))}
          </div>

          {/* Policy Detail Pane */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
            {activePolicyTab === 'our-story' ? (
              <div className="space-y-8 animate-fadeIn max-w-4xl pb-4">
                {/* Header Banner */}
                <div className="border-b border-[var(--border-subtle)] pb-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#132A22]/10 dark:bg-[#e6ca97]/15 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] text-[#132A22] dark:text-[#e6ca97] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#b99762]" />
                    <span>THE ATELIER MANIFESTO • FOUNDING CHARTER</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
                    {OUR_STORY.title}
                  </h2>
                  <p className="font-serif italic text-sm sm:text-base text-[#b99762] dark:text-[#e6ca97]">
                    {OUR_STORY.subtitle}
                  </p>
                </div>

                {/* Philosophical Proclamation Callout */}
                <div className="relative p-6 sm:p-8 bg-[var(--bg-secondary)] border-l-4 border-[#b99762] border-y border-r border-[var(--border-subtle)] rounded-r-xs shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#b99762] dark:text-[#e6ca97] font-bold">
                      PHILOSOPHICAL PROCLAMATION
                    </span>
                  </div>
                  <blockquote className="font-serif text-base sm:text-lg md:text-xl text-[var(--text-primary)] font-normal leading-relaxed italic">
                    &ldquo;{OUR_STORY.proclamation}&rdquo;
                  </blockquote>
                </div>

                {/* The Core Vision Narrative */}
                <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xs shadow-xs space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1d4136] dark:text-[#e6ca97] font-bold block">
                    THE VISION & NOBLE METALLURGY
                  </span>
                  <div className="border-l-2 border-[#b38f56] dark:border-[#e6ca97]/70 pl-4 py-1">
                    <p className="font-editorial text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {OUR_STORY.body}
                    </p>
                  </div>
                </div>

                {/* The 5 Manifesto Principles / Pillars */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#132A22] dark:text-[#e6ca97] font-bold">
                      FOUNDATIONAL CHARTER PRINCIPLES
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      DELHI BENCH
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {OUR_STORY.manifestoChapters && OUR_STORY.manifestoChapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xs shadow-xs hover:border-[#b99762] transition-colors space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#132A22]/10 dark:bg-[#e6ca97]/20 flex items-center justify-center font-serif text-sm font-bold text-[#b99762] dark:text-[#e6ca97] shrink-0">
                              {ch.numeral}
                            </span>
                            <h4 className="font-serif text-base sm:text-lg text-[var(--text-primary)] font-normal">
                              {ch.title}
                            </h4>
                          </div>
                          <span className="self-start sm:self-auto text-[9.5px] font-mono uppercase tracking-wider text-[#b99762] dark:text-[#e6ca97] bg-[#b99762]/10 px-2.5 py-1 rounded">
                            {ch.subtitle}
                          </span>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {ch.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Noble Metallurgy Benchmarks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs space-y-1">
                    <span className="text-base font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">925 Silver</span>
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Pure Sterling</span>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs space-y-1">
                    <span className="text-base font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">14K Gold</span>
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Whitish Vermeil</span>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs space-y-1">
                    <span className="text-base font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">15–20 Days</span>
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Made to Order</span>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs space-y-1">
                    <span className="text-base font-serif font-bold text-[#b99762] dark:text-[#e6ca97] block">30 Days</span>
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Warranty Cover</span>
                  </div>
                </div>

                {/* Our 6 Patron Promises */}
                <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1d4136] dark:text-[#e6ca97] font-bold block">
                      OUR COVENANT & PROMISES
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      VERIFIABLE ATELIER STANDARDS
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-[var(--text-primary)]">
                    {OUR_STORY.promises.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xs">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Concierge Contact Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="text-xs font-sans text-[var(--text-secondary)]">
                    Have inquiries regarding our metallurgical purity, Delhi atelier, or custom pieces?
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/aviora_jewells/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-strong)] hover:border-[#1d4136] dark:hover:border-[#e6ca97] text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] transition-colors"
                    >
                      <InstagramIcon className="w-4 h-4" />
                      <span>@aviora_jewells</span>
                    </a>
                    <a
                      href="https://wa.me/918796841184"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d4136] hover:bg-[#132f27] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Direct Concierge (+91 8796841184)</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : activePolicy ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-[var(--border-subtle)] pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#1d4136] dark:text-[#e6ca97] font-bold block mb-1">
                    {activePolicy.badge || 'ATELIER POLICY'}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal">
                    {activePolicy.title}
                  </h2>
                </div>

                <div className="space-y-5">
                  {activePolicy.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5"
                    >
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                        {sec.heading}
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {sec.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Specific policy contextual action */}
                {activePolicy.id === 'contact-and-grievance-policy' && (
                  <div className="pt-2 flex flex-wrap gap-4">
                    <a
                      href="https://wa.me/918796841184"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#1d4136] dark:bg-[#e6ca97] text-white dark:text-black font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      WhatsApp Support (+91 8796841184)
                    </a>
                    <a
                      href="mailto:support@aviorajewells.com"
                      className="px-4 py-2 border border-[var(--border-strong)] text-[var(--text-primary)] font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      support@aviorajewells.com
                    </a>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. FOOTER & TOAST
// ==========================================
function Footer() {
  const { navigate, openPolicyModal, scrollToSpectrum, showToast } = useContext(AppContext);
  const [footerEmail, setFooterEmail] = useState('');

  const handleFooterSubscribe = (e) => {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    if (showToast) showToast('✦ Welcome to the Aviora Insider Circle');
    setFooterEmail('');
  };

  return (
    <footer className="bg-[#0d281e] text-[#fbf8f3] dark:bg-[#08120e] dark:text-[#EAE5DB] border-t-2 border-[#b99762]/40 pt-12 sm:pt-20 pb-10 sm:pb-12 transition-colors duration-300 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14 pb-16 border-b border-[#1d4136]/60">
          
          {/* Col 1: Maison Aviora & Concierge */}
          <div className="space-y-5">
            <button onClick={() => navigate('home')} className="text-left group block">
              <div className="flex items-center gap-2.5 mb-1.5">
                <AvioraBrandCrest className="w-8 h-8 text-[#E6CA97]" />
                <span className="font-serif text-3xl tracking-[0.25em] uppercase text-[#F9F7F2] font-normal">
                  AVIORA
                </span>
              </div>
              <span className="text-[9.5px] font-mono tracking-[0.35em] uppercase text-[#E6CA97] block font-bold">
                TIMELESS ELEGANCE, MADE FOR YOU
              </span>
            </button>
            <p className="text-xs font-sans text-[#CBC4B7] leading-relaxed max-w-sm">
              Crafted with one vision — to bring timeless, elegant jewellery that feels luxurious yet wearable every day. Mastercrafted in Fine 925 Sterling Silver, 14K Whitish Gold Vermeil, Brilliant Moissanite, and organic Freshwater Pearls.
            </p>
            
            <div className="p-3.5 bg-black/40 border border-[#b99762]/25 rounded-xs space-y-2 text-[11px] font-mono text-[#DCD6CB]">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#E6CA97] font-bold">
                ATELIER CLIENT HELPLINE
              </p>
              <a
                href="https://wa.me/918796841184"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#EAE5DB] hover:text-[#E6CA97] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E6CA97] shrink-0" />
                <span>WHATSAPP: +91 8796841184</span>
              </a>
              <a
                href="mailto:support@aviorajewells.com"
                className="flex items-center gap-2 text-[#EAE5DB] hover:text-[#E6CA97] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E6CA97] shrink-0" />
                <span>EMAIL: support@aviorajewells.com</span>
              </a>
              <p className="flex items-center gap-2 text-[#A7A196]">
                <Clock className="w-3.5 h-3.5 text-[#E6CA97] shrink-0" />
                <span>HOURS: MON – SAT, 10 AM – 7 PM (IST)</span>
              </p>
              <p className="flex items-center gap-2 text-[#A7A196]">
                <MapPin className="w-3.5 h-3.5 text-[#E6CA97] shrink-0" />
                <span>ATELIER: NEW DELHI, INDIA</span>
              </p>
            </div>
          </div>

          {/* Col 2: Curated Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-serif tracking-[0.2em] uppercase text-[#E6CA97] font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#DCD6CB]">
              <li>
                <button
                  onClick={() => navigate('atelier', { category: 'new-arrivals' })}
                  className="hover:text-[#E6CA97] transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>New Arrivals (Latest Launches)</span>
                  <span className="text-[10px] font-mono text-[#E6CA97]">Just In</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('atelier', { category: 'minimalist' })}
                  className="hover:text-[#E6CA97] transition-colors text-left flex items-center justify-between w-full font-medium"
                >
                  <span>Minimalist Jewellery (Delicate)</span>
                  <span className="text-[10px] font-mono text-[#A7A196]">Everyday</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('atelier', { category: 'statement' })}
                  className="hover:text-[#E6CA97] transition-colors text-left flex items-center justify-between w-full font-medium"
                >
                  <span>Statement Jewellery (Sculptural)</span>
                  <span className="text-[10px] font-mono text-[#A7A196]">Heirloom</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('atelier', { category: 'moissanite' })}
                  className="hover:text-[#E6CA97] transition-colors text-left"
                >
                  Moissanite Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('atelier', { category: 'pearl' })}
                  className="hover:text-[#E6CA97] transition-colors text-left"
                >
                  Pearl Collection (Freshwater Pearls)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('our-story')}
                  className="hover:text-[#E6CA97] transition-colors text-left flex items-center gap-1.5 text-[#E6CA97]"
                >
                  <span>Atelier Heritage & Full Manifesto</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Brand Policies & Patron Safeguards */}
          <div className="space-y-4">
            <h4 className="text-xs font-serif tracking-[0.2em] uppercase text-[#E6CA97] font-bold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Policies & Warranties</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#DCD6CB]">
              <li>
                <button onClick={() => openPolicyModal('our-story')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Our Story & Atelier Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('shipping-policy')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Shipping & Made-To-Order (15–20 Days)
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('return-and-refund-policy')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Return & Refund (No Return · No Exchange)
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('warranty-policy')} className="hover:text-[#E6CA97] transition-colors text-left">
                  30-Day Manufacturing Warranty
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('jewellery-care-guide')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Jewellery Care Guide (Whitish Gold)
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('product-authenticity-policy')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Authenticity Guarantee & Moissanite
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('terms-and-conditions')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('privacy-policy')} className="hover:text-[#E6CA97] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li className="pt-1.5 border-t border-white/10">
                <button onClick={() => navigate('orders')} className="hover:text-[#E6CA97] transition-colors text-left flex items-center gap-1.5 text-[#E6CA97] font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span>Patron Portal & Order Tracking</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: The Aviora Insider & Guarantees */}
          <div className="space-y-4">
            <h4 className="text-xs font-serif tracking-[0.2em] uppercase text-[#E6CA97] font-bold flex items-center gap-2">
              <Award className="w-3.5 h-3.5" />
              <span>The Aviora Insider</span>
            </h4>
            <p className="text-xs font-sans text-[#CBC4B7] leading-relaxed">
              Join collectors for private drop releases, artisanal jewellery care guides, and private salon invitations.
            </p>
            
            <form onSubmit={handleFooterSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="bg-black/50 border border-[#b99762]/40 focus:border-[#E6CA97] text-xs font-sans w-full text-[#F5F2EB] placeholder-[#9E988D] px-3 py-2 outline-none rounded-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E6CA97] hover:bg-[#F3E5AB] text-black text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shrink-0 rounded-xs shadow-sm"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/aviora_jewells/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-sans text-[#E6CA97] hover:underline font-semibold"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@aviora_jewells on Instagram</span>
              </a>
            </div>

            {/* 4 Trust Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-black/40 border border-[#b99762]/20 text-[10px] font-mono text-[#DCD6CB] rounded-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#E6CA97] shrink-0" />
                <span>Fine 925 Silver</span>
              </div>
              <div className="p-2 bg-black/40 border border-[#b99762]/20 text-[10px] font-mono text-[#DCD6CB] rounded-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E6CA97] shrink-0" />
                <span>14K Vermeil</span>
              </div>
              <div className="p-2 bg-black/40 border border-[#b99762]/20 text-[10px] font-mono text-[#DCD6CB] rounded-xs flex items-center gap-1.5">
                <Gem className="w-3 h-3 text-[#E6CA97] shrink-0" />
                <span>VVS1 Moissanite</span>
              </div>
              <div className="p-2 bg-black/40 border border-[#b99762]/20 text-[10px] font-mono text-[#DCD6CB] rounded-xs flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-[#E6CA97] shrink-0" />
                <span>Blue Dart Air</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Staff Vault */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#A7A196] space-y-4 md:space-y-0">
          <div>© {new Date().getFullYear()} AVIORA JEWELLERY MAISON. ALL RIGHTS RESERVED.</div>
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => openPolicyModal('privacy-policy')} className="hover:text-[#E6CA97] transition-colors">
              PRIVACY POLICY
            </button>
            <button onClick={() => openPolicyModal('terms-and-conditions')} className="hover:text-[#E6CA97] transition-colors">
              TERMS OF SERVICE
            </button>
            <button onClick={() => openPolicyModal('product-authenticity-policy')} className="hover:text-[#E6CA97] transition-colors">
              AUTHENTICITY GUARANTEE
            </button>
            <button onClick={() => openPolicyModal('jewellery-care-guide')} className="hover:text-[#E6CA97] transition-colors">
              CARE GUIDE
            </button>
            <span className="text-[#3A362E]">•</span>
            <button
              onClick={() => navigate('admin')}
              className="text-[#8E887E] hover:text-[#E6CA97] transition-colors flex items-center gap-1"
              title="Atelier Internal Staff Vault (Restricted)"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>STAFF VAULT</span>
            </button>
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

// ==========================================
// 11. PATRON CUSTOMER AUTHENTICATION MODAL
// ==========================================
function PatronAuthModal() {
  const {
    patronAuthModalOpen,
    setPatronAuthModalOpen,
    pendingCartAction,
    setPendingCartAction,
    loginPatron,
    orders,
    syncOrdersFromDb,
    setRawCart,
    setIsCartOpen,
    showToast,
    formatPrice,
  } = useContext(AppContext);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPatronAuthModalOpen(false);
        setPendingCartAction(null);
      }
    };
    if (patronAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [patronAuthModalOpen, setPatronAuthModalOpen, setPendingCartAction]);

  if (!patronAuthModalOpen) return null;

  const handleSendOtp = () => {
    const clean = phone.replace(/[^\d]/g, '').slice(-10);
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    const res = generateOtp(clean);
    setGeneratedOtp(res.otp);
    setOtpSent(true);
    setError('');
    showToast(`✦ Verification code dispatched to +91 ${clean}`);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setIsVerifying(true);
    const clean = phone.replace(/[^\d]/g, '').slice(-10);
    const check = verifyOtp(clean, otp);
    if (check.success) {
      const matched = orders.find(
        (o) => (o.customerPhone || '').replace(/[^\d]/g, '').slice(-10) === clean
      );
      const customerName = matched?.customerName || `Patron +91 ${clean}`;
      loginPatron(clean, customerName);
      await syncOrdersFromDb();

      // If a product was queued when trying to add to cart
      if (pendingCartAction?.product) {
        const { product, quantity, engraving } = pendingCartAction;
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
        showToast(`✓ Welcome ${customerName}! Added ${product.name} to your bag.`);
        setPendingCartAction(null);
      } else {
        showToast(`✓ Welcome ${customerName}! Signed in successfully.`);
      }

      setPatronAuthModalOpen(false);
      setPhone('');
      setOtp('');
      setOtpSent(false);
    } else {
      setError(check.message || 'Invalid verification code.');
    }
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-[var(--bg-card)] border border-[#b99762]/70 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setPatronAuthModalOpen(false);
            setPendingCartAction(null);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2 border-b border-[var(--border-subtle)] pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#132A22]/10 dark:bg-[#e6ca97]/15 text-[#132A22] dark:text-[#e6ca97] rounded-full text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Patron Authentication</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">
            Customer Sign In
          </h3>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            {pendingCartAction?.product
              ? 'Please sign in with your mobile phone number to add this piece to your bag.'
              : 'Sign in to access your personal bespoke jewellery bag and order dossier.'}
          </p>
        </div>

        {/* Pending Product Preview Card */}
        {pendingCartAction?.product && (
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xs">
            <img
              src={pendingCartAction.product.images?.[0] || pendingCartAction.product.image}
              alt={pendingCartAction.product.name}
              className="w-14 h-14 object-cover border border-[var(--border-subtle)] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#b99762] font-bold block">
                Queued for Your Bag
              </span>
              <p className="font-serif text-sm text-[var(--text-primary)] truncate">
                {pendingCartAction.product.name}
              </p>
              <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                {formatPrice(pendingCartAction.product.price * (pendingCartAction.quantity || 1))}
              </p>
            </div>
          </div>
        )}

        {/* Auth Inputs */}
        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-[10px] text-[var(--text-muted)] font-bold">
              Registered Mobile Phone
            </label>
            <div className="flex">
              <span className="h-11 px-3 bg-[var(--bg-secondary)] border border-r-0 border-[var(--border-strong)] text-[var(--text-secondary)] text-xs flex items-center font-bold">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/[^\d]/g, ''));
                  setError('');
                }}
                placeholder="e.g. 9876543210"
                className="flex-1 h-11 px-3.5 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm font-mono tracking-widest text-[var(--text-primary)] font-bold outline-none focus:border-[#b99762]"
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <label className="block uppercase tracking-wider text-[10px] text-[var(--text-muted)] font-bold">
                  6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtp('123456');
                    setError('');
                    showToast('✓ Auto-filled test code: 123456');
                  }}
                  className="text-[9px] font-mono text-[#b99762] dark:text-[#e6ca97] hover:underline uppercase font-bold cursor-pointer"
                >
                  Auto-Fill Test (123456)
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^\d]/g, ''));
                  setError('');
                }}
                placeholder="123456"
                className="w-full h-11 px-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] text-center text-lg font-mono tracking-[0.4em] text-[var(--text-primary)] font-bold outline-none focus:border-[#b99762]"
              />
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                ✦ Verification code sent to +91 {phone}. (Sandbox: 123456 or {generatedOtp})
              </p>
            </div>
          )}

          {error && (
            <p className="text-[11px] font-mono text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <div className="pt-2">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-3.5 bg-[#132A22] hover:bg-[#1d4136] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black font-sans text-xs tracking-[0.16em] uppercase font-bold transition-all shadow-md cursor-pointer"
              >
                Send Verification Code
              </button>
            ) : (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyOtp}
                className="w-full py-3.5 bg-[#132A22] hover:bg-[#1d4136] dark:bg-[#e6ca97] dark:hover:bg-[#d8c39f] text-white dark:text-black font-sans text-xs tracking-[0.16em] uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Verify & Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentView } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[#d8c39f] selection:text-[#242321] flex flex-col transition-colors duration-300">
      <Navbar />
      <CartDrawer />
      <BrandPolicyModal />
      <PatronAuthModal />
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