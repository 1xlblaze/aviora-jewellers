export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface MetalSwatch {
  name: string;
  hex: string;
  borderClass: string;
}

export const METAL_SWATCHES: MetalSwatch[] = [
  { name: '14K Whitish Gold', hex: '#EDE7DC', borderClass: 'border-[#EDE7DC]' },
  { name: 'Pure 925 Silver', hex: '#D8D9DC', borderClass: 'border-[#D8D9DC]' },
  { name: '14K Rose Gold', hex: '#E3A897', borderClass: 'border-[#E3A897]' },
  { name: 'Obsidian Black', hex: '#1C1C20', borderClass: 'border-zinc-700' },
];

export const OCCASION_VIBES = [
  'All Vibes',
  'Minimalist',
  'Statement',
  'Bridal',
  'Everyday Wear',
  'Layering',
] as const;

export type OccasionVibe = (typeof OCCASION_VIBES)[number];

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  editorialNote: string;
  edition: string;
  
  // Materiality & Taxonomy
  material: string;
  goldPurity: string;
  colorTone: string;
  metalColorHex: string;
  occasionVibe: OccasionVibe;
  category: string; // 'new-arrivals' | 'minimalist' | 'statement' | 'moissanite' | 'pearl' | 'gifting'
  subcategory?: string;
  silhouette: 'light' | 'heavy'; // Aesthetic styling curation (NO weight/gram bifurcation)
  materials?: string[];
  collections?: string[];
  finish?: string;
  colour?: string;
  isNew?: boolean;
  featuredRank?: number;
  
  dimensions: string;
  weight?: string; // Optional internal spec only (hidden from Add to Cart)
  craftsmanship: string;
  images: string[];
  modelImage: string;
  videoUrl?: string; // Video preview ready
  
  featured: boolean;
  inStock: boolean;
  inventory: number;
  isEngravable?: boolean;
  
  categorySlug: string;
  categoryName: string;
  hallmark: string; // Noble metal specification & purity (NO BIS hallmark)
  warranty: string; // 30-Day Manufacturing Warranty
  
  // Cart Drawer Upsell
  pairsWithId?: string;
  upsellReason?: string;
}

export const STORE_CONFIG = {
  brand: {
    name: 'AVIORA',
    tagline: 'TIMELESS ELEGANCE, MADE FOR YOU',
    instagram: '@aviora_jewells',
    instagramUrl: 'https://www.instagram.com/aviora_jewells/',
    email: 'support@aviorajewells.com',
    whatsapp: '+91 8796841184',
    hours: 'Monday – Saturday, 10:00 AM – 7:00 PM (IST)',
  },
  currency: {
    code: 'INR',
    label: 'INR (₹)',
    locale: 'en-IN',
  },
  announcement: '✦ TIMELESS JEWELLERY, MADE FOR YOU • FINE 925 STERLING SILVER & 14K/18K GOLD • PAN-INDIA DELIVERY ✦',
  hero: {
    eyebrow: 'THE AVIORA EDIT',
    title: 'Timeless elegance, made for you.',
    body: 'Delicate jewellery designed to be worn and treasured every day. Crafted in Fine 925 Sterling Silver, 14K/18K Gold-Plated Vermeil, Brilliant Moissanite, and Freshwater Pearls.',
    image: '/products/14k-gold-plated-double-layer-necklace-4200-1.jpg',
    alt: 'Aviora luxury fine jewellery editorial photography',
  },
  editorial: {
    title: 'Made to become yours.',
    body: 'Discover pieces that bring effortless elegance to everyday moments and meaningful occasions.',
    image: '/products/14k-gold-plated-heart-petal-floral-necklace-1.jpg',
    alt: 'Aviora fine jewellery on neutral stone backdrop',
  },
  categories: [
    { id: 'new-arrivals', label: 'New Arrivals', image: '/products/14k-gold-plated-double-layer-necklace-3828-1.jpg', alt: 'New arrivals latest launches' },
    { id: 'minimalist', label: 'Minimalist Jewellery', image: '/products/genuine-natural-turquoise-drop-pendant-1.jpg', alt: 'Minimalist delicate jewellery' },
    { id: 'statement', label: 'Statement Jewellery', image: '/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg', alt: 'Bold statement jewellery' },
    { id: 'moissanite', label: 'Moissanite Collection', image: '/products/14k-gold-plated-vvs-moissanite-ring-5300-1.jpg', alt: 'Brilliant moissanite jewellery' },
    { id: 'pearl', label: 'Pearl Collection', image: '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg', alt: 'Freshwater pearl jewellery' },
  ],
  collections: [
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'minimalist', label: 'Minimalist Edit' },
    { id: 'statement', label: 'Statement Jewellery' },
    { id: 'moissanite', label: 'Moissanite Collection' },
    { id: 'pearl', label: 'Freshwater Pearls' },
  ],
  gifting: {
    title: 'Handcrafted with devotion. Made to be cherished.',
    image: '/products/emerald-green-white-cz-tennis-bracelet-1.jpg',
    alt: 'Aviora Atelier fine jewellery craftsmanship',
  },
  materials: [
    { id: 'sterling-silver-925', label: '925 Sterling Silver', desc: 'Solid 925 sterling silver crafted for timeless durability and lustrous finish.', image: '/products/moissanite-rhodium-tennis-bracelet-11690-1.jpg' },
    { id: 'gold-plated-14k', label: '14K & 18K Gold-Plated', desc: 'Thick gold vermeil plating over pure 925 silver for enduring lustre.', image: '/products/14k-gold-plated-double-layer-necklace-3828-1.jpg' },
    { id: 'moissanite', label: 'Brilliant Moissanite', desc: 'Each moissanite is chosen for exceptional optical fire and flawless clarity.', image: '/products/14k-gold-plated-vvs-moissanite-ring-5300-1.jpg' },
    { id: 'freshwater-pearls', label: 'Freshwater Pearls', desc: 'Hand-selected luminous organic pearls with timeless luster.', image: '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg' },
  ],
  promises: [
    { title: 'Fine 925 Sterling Silver', desc: 'Crafted from authentic 925 sterling silver with enduring noble metal purity.' },
    { title: '14K & 18K Gold Plated Vermeil', desc: 'Premium thick gold plating layered over solid 925 silver for everyday luxury.' },
    { title: '30-Day Manufacturing Warranty', desc: 'Covers clasp integrity, stone setting, and craftsmanship defects for complete confidence.' },
    { title: 'Made to Order Craftsmanship', desc: 'Every creation is handcrafted especially for you (15–20 days crafting + 1–5 days insured shipping).' },
  ],
};

// ==========================================
// BRAND STORY & COMPREHENSIVE POLICIES
// ==========================================
export const OUR_STORY = {
  title: 'Our Story',
  subtitle: 'The Atelier Manifesto • A Philosophy of Enduring Beauty',
  body: 'AVIORA was created with one vision — to bring timeless, elegant jewellery that feels luxurious yet wearable every day. Our collections feature carefully selected pieces crafted from 925 Sterling Silver, 14K Whitish Gold-Plated Sterling Silver, Moissanite, Freshwater Pearls, and other premium materials mentioned on individual product pages. Every design is chosen for elegance, craftsmanship, and comfort.',
  proclamation: 'We believe fine jewellery should never be imprisoned inside bank lockers or saved solely for distant galas. True luxury is designed to be lived in — catching morning light on your skin, stacking effortlessly across every ambition, and gathering the quiet poetry of personal memories.',
  manifestoChapters: [
    {
      numeral: 'I',
      title: 'The Founding Vision & Transparent Valuation',
      subtitle: 'Disrupting 10x Retail Markups',
      text: 'For generations, traditional jewellery houses imposed 800% to 1000% retail markups on consumers to finance lavish high-street storefronts, legacy overhead, and celebrity campaigns. Aviora was established in 2024 to dismantle this paradigm. By operating directly from our artisan atelier in Delhi straight to our patrons, we deliver certified noble metals and stones with complete price transparency and honest metallurgical integrity.',
    },
    {
      numeral: 'II',
      title: 'The Noble Metallurgy & Whitish Gold Standard',
      subtitle: 'Fine 925 Silver & 14K Whitish Vermeil',
      text: 'Every Aviora creation begins with a solid foundation of Fine 925 Sterling Silver, renowned for its enduring strength and purity. For our gold creations, we developed our proprietary Whitish Gold Vermeil (#EDE7DC) — a refined European tone crafted without yellow brass tints, nickel, or cheap copper alloys. It is 100% hypoallergenic, gentle against sensitive skin, and built for permanent beauty.',
    },
    {
      numeral: 'III',
      title: 'The Made-to-Order Atelier Rhythm',
      subtitle: '15–20 Days Dedicated Handcrafting',
      text: 'We reject industrial assembly lines and mass plastic injection casting. When you commission a piece at Aviora, our master bench jewelers cast, file, bezel-set, and polish your jewellery individually over 15–20 business days. This slow, intentional craft ensures structural perfection, zero porosity, and stones that remain securely anchored for a lifetime.',
    },
    {
      numeral: 'IV',
      title: 'Ethical Gemological Integrity',
      subtitle: 'Brilliant Moissanite & Organic Pearls',
      text: 'We select only D-Colorless, VVS1 clarity Moissanite gemstones that rival natural diamonds in optical brilliance and dispersion (fire: 0.104 vs diamond 0.044). Our pearls are Grade-AAA hand-selected organic freshwater pearls, harvested with sustainable aquaculture practices and radiant natural orient.',
    },
    {
      numeral: 'V',
      title: 'The Patron Covenant & Security',
      subtitle: '30-Day Manufacturing Warranty & Wax-Sealed Transit',
      text: 'We stand 100% behind our creations with an authentic 30-Day Manufacturing Warranty against bench defects. Every commission is dispatched in tamper-evident wax-sealed packaging via Blue Dart Air Express with comprehensive transit insurance, backed by a dedicated 48-hour unboxing resolution protocol through our verified WhatsApp concierge.',
    },
  ],
  promises: [
    'Authentic Fine 925 Sterling Silver crafted with noble metal purity.',
    '14K Whitish Gold Vermeil in refined #EDE7DC tone (100% nickel-free & hypoallergenic).',
    'D-Colorless Brilliant Moissanite with exceptional optical fire.',
    'Slow Made-to-Order handcrafting by our Delhi master jewelers.',
    'Tamper-proof wax-sealed Blue Dart Express Air delivery across India.',
    '30-Day Manufacturing Warranty and dedicated WhatsApp concierge support.',
  ],
};

export const BRAND_POLICIES = [
  {
    id: 'terms-and-conditions',
    badge: 'Terms of Craft',
    title: 'Terms & Conditions',
    sections: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing or purchasing from AVIORA, you agree to these Terms and Conditions.',
      },
      {
        heading: 'Product Information',
        text: 'We make every effort to display products accurately. However, screen colours may vary slightly, handmade products may have slight variations, and measurements are approximate.',
      },
      {
        heading: 'Pricing',
        text: 'Prices are displayed in INR. Prices include applicable taxes unless stated otherwise. AVIORA reserves the right to change prices without notice.',
      },
      {
        heading: 'Intellectual Property',
        text: 'All photographs, videos, product descriptions, graphics, logos, and branding belong to AVIORA and may not be copied or reproduced without written permission.',
      },
    ],
  },
  {
    id: 'privacy-policy',
    badge: 'Patron Discretion',
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information We Collect',
        text: 'We may collect your Name, Mobile number, Email address, Shipping and billing address, and Payment confirmation information.',
      },
      {
        heading: 'Why We Collect It',
        text: 'To process your orders, provide dedicated customer support, send dispatch and shipping updates, and share curated offers if you subscribe.',
      },
      {
        heading: 'Data Security',
        text: 'Customer information is stored securely and used exclusively for legitimate business and fulfillment purposes.',
      },
    ],
  },
  {
    id: 'shipping-policy',
    badge: 'Logistics',
    title: 'Shipping Policy',
    sections: [
      {
        heading: 'Order Preparation (Made to Order)',
        text: 'All AVIORA pieces are customised and made to order especially for you. Order preparation and production takes 15–20 business days from the date of successful payment confirmation. During festive seasons, launches, or high-demand periods, preparation time may be slightly longer. If there is a significant delay, we will inform you proactively.',
      },
      {
        heading: 'Shipping & Delivery',
        text: 'Once your order is ready, it is dispatched through our trusted courier partners. Shipping time is 1–5 business days across India, depending on your delivery location. You will receive an active tracking link via Email, SMS, or WhatsApp once your order has been dispatched.',
      },
      {
        heading: 'Important Delivery Information',
        text: 'We currently offer Pan India shipping. Please ensure your shipping address and contact number are accurate at checkout, as changes may not be possible after dispatch. Delivery timelines may vary due to weather conditions, public holidays, festivals, or courier service delays.',
      },
      {
        heading: 'Made-To-Order Notice for Product Pages',
        text: 'Every AVIORA piece is made especially for you. Kindly allow 15–20 business days for crafting and preparation, followed by 1–5 business days for insured shipping.',
      },
    ],
  },
  {
    id: 'return-and-refund-policy',
    badge: 'Bespoke Resolution',
    title: 'Return & Refund Policy',
    sections: [
      {
        heading: 'No Return • No Exchange',
        text: 'At AVIORA, all jewellery is customised and made to order especially for each collector. Therefore, all sales are final. We do not accept returns or exchanges for any customised or made-to-order jewellery.',
      },
      {
        heading: 'Damaged or Incorrect Order Resolution',
        text: 'If you receive a damaged or incorrect product, please contact us on WhatsApp (+91 8796841184) within 48 hours of delivery with an unboxing video and clear photos. We will review the issue thoroughly and provide an appropriate resolution if the claim is verified.',
      },
    ],
  },
  {
    id: 'cancellation-policy',
    badge: 'Cancellation Guidelines',
    title: 'Cancellation Policy',
    sections: [
      {
        heading: 'Cancellation Guidelines',
        text: 'Orders may be cancelled before dispatch. Customised products cannot be cancelled once production begins. Orders cannot be cancelled after shipping.',
      },
    ],
  },
  {
    id: 'warranty-policy',
    badge: 'Warranty Protocol',
    title: '30-Day Manufacturing Warranty Policy',
    sections: [
      {
        heading: '30-Day Manufacturing Warranty',
        text: 'Covers manufacturing and craftsmanship defects only from the date of delivery.',
      },
      {
        heading: 'Covered',
        text: 'Faulty clasp, loose stone due to manufacturing, manufacturing defect in jewellery construction.',
      },
      {
        heading: 'Not Covered',
        text: 'Tarnishing, gold plating wear from daily friction, water damage, perfume/cosmetic damage, accidental breakage, and improper handling.',
      },
    ],
  },
  {
    id: 'jewellery-care-guide',
    badge: 'Longevity Guide',
    title: 'Jewellery Care Guide',
    sections: [
      {
        heading: 'Sterling Silver Care',
        text: 'Store in a clean, dry airtight pouch. Clean gently with a soft microfiber cloth after wear to preserve mirror shine.',
      },
      {
        heading: 'Gold-Plated Jewellery Care',
        text: 'Avoid water, harsh chemicals, lotions, and perfumes. Always remove before bathing, swimming, or vigorous exercise.',
      },
      {
        heading: 'Freshwater Pearl Care',
        text: 'Avoid chemical exposure. Put pearls on after makeup and perfume. Store separately in a soft cloth pouch away from hard metals.',
      },
      {
        heading: 'Moissanite Care',
        text: 'Clean gently with mild soap and warm water with a soft-bristle brush when needed. Dry completely before storing.',
      },
    ],
  },
  {
    id: 'product-authenticity-policy',
    badge: 'Authenticity Guarantee',
    title: 'Product Authenticity Policy',
    sections: [
      {
        heading: 'Authenticity Guarantee',
        text: 'At AVIORA, we are committed to offering genuine, high-quality jewellery with complete transparency.',
      },
      {
        heading: 'Our Materials',
        text: '925 Sterling Silver, 14K Gold-Plated 925 Sterling Silver, Brilliant Moissanite, Freshwater Pearls, and Cubic Zirconia (where specified on the product page).',
      },
      {
        heading: 'Brilliant Moissanite',
        text: 'All moissanite jewellery offered by AVIORA features hand-selected D-Colorless, VVS1 clarity gemstones that rival natural diamonds in brilliance and fire for complete authenticity.',
      },
      {
        heading: '925 Sterling Silver',
        text: 'All jewellery made from sterling silver is crafted using authentic Fine 925 Sterling Silver, renowned for longevity, hypoallergenic comfort, and noble luster.',
      },
      {
        heading: 'Natural Materials',
        text: 'Freshwater pearls and natural stones may exhibit slight variations in colour, shape, texture, or surface appearance. These organic characteristics make each piece truly unique and are not considered defects.',
      },
    ],
  },
  {
    id: 'payment-policy',
    badge: 'Payment Terms',
    title: 'Payment Policy',
    sections: [
      {
        heading: 'Accepted Payment Methods',
        text: 'Accepted payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, and major cards through secure RBI-compliant payment gateways.',
      },
    ],
  },
  {
    id: 'contact-and-grievance-policy',
    badge: 'Support & Help',
    title: 'Contact & Grievance Policy',
    sections: [
      {
        heading: 'Customer Support',
        text: 'Brand: AVIORA\nInstagram: @aviora_jewells\nEmail: support@aviorajewells.com\nWhatsApp: +91 8796841184\nSupport Hours: Monday – Saturday, 10:00 AM – 7:00 PM (IST)',
      },
      {
        heading: 'Grievance Redressal',
        text: 'Customers may contact AVIORA through email or WhatsApp for inquiries or complaints regarding orders, payments, shipping, or product quality. We aim to acknowledge communications within 48 business hours and resolve eligible cases as quickly as possible.',
      },
    ],
  },
];

export type OrderLifecycleStatus =
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'IN_FABRICATION'
  | 'QUALITY_INSPECTION'
  | 'IN_TRANSIT';

export interface OrderStatusStep {
  status: OrderLifecycleStatus;
  label: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current: boolean;
  trackingUrl?: string;
}

export interface WhatsAppNotificationRecord {
  id: string;
  templateName: string;
  stage: OrderLifecycleStatus;
  sentAt: string;
  recipientPhone: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  previewText: string;
  externalMessageId?: string;
}

export interface OrderItemRecord {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  material: string;
  engraving?: string;
  hallmark?: string;
}

export type PaymentMethod = 'PHONEPE' | 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderDate?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderLifecycleStatus;
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItemRecord[];
  timeline: OrderStatusStep[];
  otpVerified?: boolean;
  paymentTransactionId?: string;
  paymentSignature?: string;
  whatsappNotifications?: WhatsAppNotificationRecord[];
  // PhonePe Payment Gateway & Payment Links metadata
  phonepeTransactionId?: string;
  phonepeMerchantTransactionId?: string;
  phonepePaymentLinkId?: string;
  phonepeAmountInPaise?: number;
  bluedartConsignmentNo?: string;
  gstAmount?: number;
  shippedAt?: string;
  deliveredAt?: string;
}

export function createOrderTimeline(status: OrderLifecycleStatus, orderDate: string, awbNumber?: string): OrderStatusStep[] {
  // Canonical 5 lifecycle stages requested by patron & admin portal
  let canonicalStatus: 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' = 'CONFIRMED';
  if (status === 'IN_FABRICATION' || status === 'QUALITY_INSPECTION' || status === 'PREPARING') {
    canonicalStatus = 'PREPARING';
  } else if (status === 'IN_TRANSIT' || status === 'SHIPPED') {
    canonicalStatus = 'SHIPPED';
  } else if (status === 'OUT_FOR_DELIVERY') {
    canonicalStatus = 'OUT_FOR_DELIVERY';
  } else if (status === 'DELIVERED') {
    canonicalStatus = 'DELIVERED';
  } else {
    canonicalStatus = 'CONFIRMED';
  }

  const awb = (awbNumber || '').trim();

  const steps: { status: OrderLifecycleStatus; label: string; location: string; description: string; trackingUrl?: string }[] = [
    {
      status: 'CONFIRMED',
      label: 'Payment Confirmed & Order Accepted',
      location: 'Atelier Vault, Delhi',
      description: 'Payment verified via secure gateway callback. Made-to-order benchwork queue initiated.',
    },
    {
      status: 'PREPARING',
      label: 'Preparing & Handcrafting in Studio',
      location: 'Foundry & Bench, Delhi Atelier',
      description: 'Master artisans casting and hand-forging piece in Fine 925 Sterling Silver (15–20 business days).',
    },
    {
      status: 'SHIPPED',
      label: 'Shipped via Blue Dart Express Air',
      location: 'Delhi Air Cargo Hub',
      description: awb
        ? `Dispatched in signature tamper-proof insured box with Blue Dart Consignment No: ${awb}.`
        : 'Consignment number will be assigned upon dispatch & courier handover to Blue Dart Express Air.',
      trackingUrl: awb ? `https://www.bluedart.com/tracking?awb=${encodeURIComponent(awb)}` : undefined,
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Doorstep Handover',
      location: 'Local Delivery Hub',
      description: 'Blue Dart courier associate out for doorstep delivery with customer OTP verification.',
      trackingUrl: awb ? `https://www.bluedart.com/tracking?awb=${encodeURIComponent(awb)}` : undefined,
    },
    {
      status: 'DELIVERED',
      label: 'Delivered to Patron',
      location: 'Destination Address',
      description: 'Package delivered safely. 30-Day Manufacturing Warranty is now active.',
      trackingUrl: awb ? `https://www.bluedart.com/tracking?awb=${encodeURIComponent(awb)}` : undefined,
    },
  ];

  const canonicalOrder = ['CONFIRMED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = canonicalOrder.indexOf(canonicalStatus);

  return steps.map((s, idx) => ({
    ...s,
    timestamp: idx <= currentIndex ? orderDate : 'Pending',
    completed: idx < currentIndex,
    current: idx === currentIndex,
  }));
}

export interface CartItem {
  productId?: string;
  product: Product;
  quantity: number;
  engraving?: string;
}

export interface HotspotItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  material: string;
  xPercent: number;
  yPercent: number;
}

export interface CollectorTestimonial {
  id: string;
  patron: string;
  location: string;
  image: string;
  quote: string;
  productName: string;
  verifiedPatron: boolean;
}

export const WHY_14K_GOLD_COPY = {
  title: 'Crafted in 14K Gold Plated Vermeil',
  body: 'We craft our pieces in 14K & 18K gold vermeil because it offers the ideal balance of everyday durability, delicate aesthetic restraint, and a soft, luminous whitish gold hue without excessive brassiness.',
  pillars: [
    { label: 'Whitish Gold Tone', desc: 'Modern, luminous soft golden glow' },
    { label: 'Solid 925 Core', desc: 'Durable hypoallergenic 925 sterling silver foundation' },
    { label: 'Everyday Luxury', desc: 'Carefully checked for comfort and wearability' },
  ],
};

export const COLLECTOR_TESTIMONIALS: CollectorTestimonial[] = [
  {
    id: 'test-1',
    patron: 'Rhea Mehra',
    location: 'Bandra, Mumbai',
    image: '/products/14k-gold-plated-triple-layer-silver-chain-1.jpg',
    quote: 'The 14K whitish gold finish is so subtle and sophisticated—not that overly yellow fake tone. The craftsmanship on the triple layer chain is stunning.',
    productName: '14K Gold Plated Triple Layer Silver Chain',
    verifiedPatron: true,
  },
  {
    id: 'test-2',
    patron: 'Devika Singhania',
    location: 'Lutyens, New Delhi',
    image: '/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg',
    quote: 'Wore the freshwater pearl three layer necklace to my sister\'s sangeet and styled it with an oversized blazer the next day. A true art object.',
    productName: 'Freshwater Pearl Three Layer Statement Necklace',
    verifiedPatron: true,
  },
  {
    id: 'test-3',
    patron: 'Tara Alvares',
    location: 'Indiranagar, Bengaluru',
    image: '/products/14k-gold-plated-vvs-moissanite-ring-5300-1.jpg',
    quote: 'The tension setting on the Saturn ring is brilliant. Passes diamond tester with 100% precision and never catches on silk.',
    productName: '14K Gold Plated VVS Moissanite Solitaire Ring',
    verifiedPatron: true,
  },
  {
    id: 'test-4',
    patron: 'Ananya Roy',
    location: 'Kolkata',
    image: '/products/ruby-cluster-drop-earrings-1.jpg',
    quote: 'Delivered securely in a gorgeous keepsake box with the authenticity card and warranty verification.',
    productName: 'Royal Ruby & Crystal Chandelier Drop Earrings',
    verifiedPatron: true,
  },
];

// Updated Category Taxonomy matching user hierarchy
export const CATEGORIES: Category[] = [
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'The latest launches and newest creations in the Aviora collection.',
    heroImage: '/products/14k-gold-plated-double-layer-necklace-3828-1.jpg',
    subcategories: [
      { id: 'latest-launches', name: 'Latest Launches', slug: 'latest-launches' },
    ],
  },
  {
    id: 'minimalist',
    name: 'Minimalist Jewellery',
    slug: 'minimalist',
    description: 'Feathertouch delicate pieces designed for everyday elegance and subtle styling.',
    heroImage: '/products/genuine-natural-turquoise-drop-pendant-1.jpg',
    subcategories: [
      { id: 'min-necklaces', name: 'Necklaces', slug: 'necklaces' },
      { id: 'min-earrings', name: 'Earrings', slug: 'earrings' },
      { id: 'min-rings', name: 'Rings', slug: 'rings' },
      { id: 'min-bracelets', name: 'Bracelets', slug: 'bracelets' },
      { id: 'min-anklets', name: 'Anklets', slug: 'anklets' },
    ],
  },
  {
    id: 'statement',
    name: 'Statement Jewellery',
    slug: 'statement',
    description: 'Sculptural, bold silhouettes and head-turning heirlooms forged for unforgettable occasions.',
    heroImage: '/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg',
    subcategories: [
      { id: 'stmt-necklaces', name: 'Necklaces', slug: 'necklaces' },
      { id: 'stmt-earrings', name: 'Earrings', slug: 'earrings' },
      { id: 'stmt-bracelets', name: 'Bracelets', slug: 'bracelets' },
      { id: 'stmt-rings', name: 'Rings', slug: 'rings' },
      { id: 'stmt-sets', name: 'Sets', slug: 'jewellery-sets' },
    ],
  },
  {
    id: 'moissanite',
    name: 'Moissanite Collection',
    slug: 'moissanite',
    description: 'D Colorless VVS1 brilliance crafted in Fine 925 Sterling Silver.',
    heroImage: '/products/14k-gold-plated-vvs-moissanite-ring-5300-1.jpg',
    subcategories: [
      { id: 'brilliant-moissanite', name: 'Brilliant Moissanite Jewellery', slug: 'moissanite' },
    ],
  },
  {
    id: 'pearl',
    name: 'Pearl Collection',
    slug: 'pearl',
    description: 'Hand-selected organic Grade-AAA freshwater pearls with luminous, timeless luster.',
    heroImage: '/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg',
    subcategories: [
      { id: 'freshwater-pearl', name: 'Freshwater Pearl Jewellery', slug: 'freshwater-pearls' },
    ],
  },
  {
    id: 'gifting',
    name: 'Gifting Occasions',
    slug: 'gifting',
    description: 'Thoughtfully curated heirlooms for life’s most cherished celebrations.',
    heroImage: '/products/emerald-green-white-cz-tennis-bracelet-1.jpg',
    subcategories: [
      { id: 'gift-rakhi', name: 'Rakhi', slug: 'rakhi' },
      { id: 'gift-birthday', name: 'Birthday', slug: 'birthday' },
      { id: 'gift-anniversary', name: 'Anniversary', slug: 'anniversary' },
      { id: 'gift-bridesmaid', name: 'Bridesmaid', slug: 'bridesmaid' },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    "id": "prod-001",
    "name": "14K Gold Plated Triple Layer Silver Chain",
    "slug": "14k-gold-plated-triple-layer-silver-chain",
    "subtitle": "OBJET // 001 — CASCADE TIERED CHAIN",
    "price": 5050,
    "currency": "INR",
    "description": "A breathtaking triple-tiered necklace handcrafted in solid 925 sterling silver and plated in rich 14K gold. Designed with differing chain textures for effortless luxury layering.",
    "editorialNote": "Triple-tier architecture delivers maximal impact with a lightweight, comfortable feel for all-day wear.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil over Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist"
    ],
    "finish": "High Polish Vermeil",
    "colour": "Whitish Gold",
    "isNew": true,
    "featuredRank": 1,
    "dimensions": "Tier 1: 16in | Tier 2: 18in | Tier 3: 20in + 2in Extension",
    "craftsmanship": "Individually linked multi-gauge chains hand-polished in our Delhi atelier.",
    "images": [
      "/products/14k-gold-plated-triple-layer-silver-chain-1.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-triple-layer-silver-chain-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty",
    "pairsWithId": "prod-008",
    "upsellReason": "Pair with the Moissanite Tennis Bracelet for coordinated brilliance"
  },
  {
    "id": "prod-002",
    "name": "14K Gold Double Layer Freshwater Pearl Necklace",
    "slug": "14k-gold-double-layer-freshwater-pearl-necklace",
    "subtitle": "OBJET // 002 — LUMINOUS LUSTRE DUET",
    "price": 3814,
    "currency": "INR",
    "description": "Hand-selected organic freshwater pearls anchored along a dual-strand 14K gold-plated sterling silver delicate chain.",
    "editorialNote": "A romantic bridge between classic pearl heirlooms and modern Parisian delicate aesthetics.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil, Cultured Freshwater Pearls & 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "pearl",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "freshwater-pearl",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "pearl",
      "minimalist"
    ],
    "finish": "Polished Vermeil",
    "colour": "Whitish Gold & Luminous Pearl",
    "isNew": true,
    "featuredRank": 2,
    "dimensions": "Choker strand: 15in | Droplet strand: 17in + 2in extender",
    "craftsmanship": "Individual hand-knotting with organic freshwater pearls on reinforced noble wire.",
    "images": [
      "/products/14k-gold-double-layer-freshwater-pearl-necklace-1.jpg"
    ],
    "modelImage": "/products/14k-gold-double-layer-freshwater-pearl-necklace-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "pearl",
    "categoryName": "Freshwater Pearls",
    "hallmark": "Fine 925 Silver & Natural Pearl",
    "warranty": "30-Day Manufacturing Warranty",
    "pairsWithId": "prod-014",
    "upsellReason": "Pair with the Mother of Pearl Clover Bracelet"
  },
  {
    "id": "prod-003",
    "name": "14K Gold Plated Double Layer Sleek Chain Necklace",
    "slug": "14k-gold-plated-double-layer-necklace-3828",
    "subtitle": "OBJET // 003 — MINIMALIST HORIZON STRANDS",
    "price": 3828,
    "currency": "INR",
    "description": "An elegant dual-tier fine chain in 14K gold over solid 925 sterling silver, providing understated sophistication for everyday decolletage.",
    "editorialNote": "Light, comfortable, and tailored for effortless layering with higher-profile pendants.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil over Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Minimalist",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Polished",
    "colour": "Whitish Gold",
    "isNew": true,
    "featuredRank": 3,
    "dimensions": "Short chain: 16in | Long chain: 18in + 2in extender",
    "craftsmanship": "Hand-assembled links burnished for mirror shine in our Delhi studio.",
    "images": [
      "/products/14k-gold-plated-double-layer-necklace-3828-1.jpg",
      "/products/14k-gold-plated-double-layer-necklace-3828-2.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-double-layer-necklace-3828-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-004",
    "name": "14K Gold Plated Double Layer Figaro & Box Chain",
    "slug": "14k-gold-plated-double-layer-necklace-4200",
    "subtitle": "OBJET // 004 — TEXTURAL DUAL HARMONY",
    "price": 4200,
    "currency": "INR",
    "description": "A bespoke dual-layer chain pairing an Italian Figaro link with a sleek geometric box chain, cast in pure 925 silver with 14K gold plating.",
    "editorialNote": "Distinct link geometries bounce light with rhythmic elegance.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil over Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Statement",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist",
      "statement"
    ],
    "finish": "Diamond Cut Polish",
    "colour": "Whitish Gold",
    "isNew": true,
    "featuredRank": 4,
    "dimensions": "Inner chain: 16in | Outer chain: 19in + 2in extender",
    "craftsmanship": "Precision diamond-cut faceting across dual chain lines.",
    "images": [
      "/products/14k-gold-plated-double-layer-necklace-4200-1.jpg",
      "/products/14k-gold-plated-double-layer-necklace-4200-2.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-double-layer-necklace-4200-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-005",
    "name": "14K Gold Plated Heart Petal Floral Pendant Necklace",
    "slug": "14k-gold-plated-heart-petal-floral-necklace",
    "subtitle": "OBJET // 005 — BOTANICAL HARMONY PENDANT",
    "price": 3200,
    "currency": "INR",
    "description": "Four micro-sculpted heart petals forming a floral blossom pendant in 14K gold vermeil over solid 925 sterling silver, suspended from a diamond-cut chain.",
    "editorialNote": "Delicate feminine contours evoke natural floral symmetry.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil over Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist",
      "gifting"
    ],
    "finish": "Satin & High Polish",
    "colour": "Whitish Gold",
    "isNew": true,
    "featuredRank": 5,
    "dimensions": "Pendant: 14mm x 14mm | Chain: 16in + 2in extender",
    "craftsmanship": "Micro-cast lost wax floral motif finished with hand-burnished edges.",
    "images": [
      "/products/14k-gold-plated-heart-petal-floral-necklace-1.jpg",
      "/products/14k-gold-plated-heart-petal-floral-necklace-2.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-heart-petal-floral-necklace-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-006",
    "name": "14K Gold Plated VVS Moissanite Solitaire Ring",
    "slug": "14k-gold-plated-vvs-moissanite-ring-5300",
    "subtitle": "OBJET // 006 — SOLITAIRE BRILLIANCE",
    "price": 5300,
    "currency": "INR",
    "description": "A breathtaking VVS Moissanite brilliant-cut solitaire set on a tapered cathedral band in 14K gold vermeil over solid 925 silver.",
    "editorialNote": "Classic engagement and promise ring aesthetics with ethical lab-grown fire and brilliance.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "VVS Moissanite, 14K Gold Vermeil & Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Bridal",
    "category": "moissanite",
    "subcategory": "rings",
    "silhouette": "light",
    "materials": [
      "moissanite",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "moissanite",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Mirror Polish",
    "colour": "Whitish Gold & Colorless Moissanite",
    "isNew": true,
    "featuredRank": 6,
    "dimensions": "Solitaire: 1.5 Carat Equivalent | Band: 2.2mm comfort fit",
    "craftsmanship": "Four-prong claw setting hand-tightened under optical magnification.",
    "images": [
      "/products/14k-gold-plated-vvs-moissanite-ring-1.jpg",
      "/products/14k-gold-plated-vvs-moissanite-ring-2.jpg",
      "/products/14k-gold-plated-vvs-moissanite-ring-silver-3.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-vvs-moissanite-ring-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": true,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-007",
    "name": "14K Gold Plated Cubic Zirconia Double Chain Necklace",
    "slug": "14k-gold-plated-zirconia-double-chain-necklace",
    "subtitle": "OBJET // 007 — PAVÉ PRISM PENDANT",
    "price": 3850,
    "currency": "INR",
    "description": "A sparkling double-chain configuration featuring faceted cubic zirconia charms suspended at varied elevations along a 14K gold vermeil silver necklace.",
    "editorialNote": "Adds subtle radiance to cocktail dresses and tailored blazers alike.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "14K Gold Vermeil, Cubic Zirconia & 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist",
      "gifting"
    ],
    "finish": "Mirror Polish",
    "colour": "Whitish Gold & Crystal",
    "isNew": true,
    "featuredRank": 7,
    "dimensions": "16in and 18in layered drops + 2in adjustment tail",
    "craftsmanship": "Bezel set optical stones anchored to micro-soldered jump rings.",
    "images": [
      "/products/14k-gold-plated-zirconia-double-chain-necklace-1.jpg",
      "/products/14k-gold-plated-zirconia-double-chain-necklace-2.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-zirconia-double-chain-necklace-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-008",
    "name": "Moissanite Tennis Bracelet 3mm (7 Inch)",
    "slug": "moissanite-tennis-bracelet-3mm-9450",
    "subtitle": "OBJET // 008 — CONSTANT FIRE CONTINUUM",
    "price": 9450,
    "currency": "INR",
    "description": "A continuous river of 3mm brilliant-cut VVS Moissanite gems prong-set in pure 925 sterling silver with a double safety box clasp.",
    "editorialNote": "The ultimate modern classic. Each Moissanite stone displays exceptional dispersion and brilliance exceeding traditional diamonds.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "3mm VVS Moissanite & Fine 925 Sterling Silver",
    "goldPurity": "Rhodium Plated 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "moissanite",
    "subcategory": "bracelets",
    "silhouette": "light",
    "materials": [
      "moissanite",
      "sterling-silver-925",
      "rhodium-plated"
    ],
    "collections": [
      "moissanite",
      "statement",
      "new-arrivals"
    ],
    "finish": "Rhodium Mirror Finish",
    "colour": "Silver & D Colorless Moissanite",
    "isNew": true,
    "featuredRank": 8,
    "dimensions": "Length: 7.0 Inches | Stone Width: 3.0mm",
    "craftsmanship": "Hand-set 4-prong collets with precision articulated links and double-click safety clasp.",
    "images": [
      "/products/moissanite-tennis-bracelet-3mm-9450-1.jpg",
      "/products/moissanite-tennis-bracelet-3mm-9450-2.jpg"
    ],
    "modelImage": "/products/moissanite-tennis-bracelet-3mm-9450-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-009",
    "name": "Clover Freshwater Pearl & Natural Blue Apatite Necklace",
    "slug": "clover-freshwater-pearl-blue-apatite-necklace",
    "subtitle": "OBJET // 009 — AZURE MEDITERRANEAN CHARTER",
    "price": 2898,
    "currency": "INR",
    "description": "Lustrous genuine freshwater pearls paired with natural deep blue apatite gemstone beads, accented with a four-leaf clover motif in 14K gold vermeil.",
    "editorialNote": "Inspired by the azure Mediterranean coastline, balancing vibrant blue apatite with soothing baroque pearls.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Cultured Freshwater Pearls, Natural Blue Apatite, 14K Gold Vermeil & 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "pearl",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "freshwater-pearl",
      "apatite",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "pearl",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Polished",
    "colour": "Ocean Blue, Ivory Pearl & Whitish Gold",
    "isNew": true,
    "featuredRank": 9,
    "dimensions": "Length: 16in + 2in adjustment extender",
    "craftsmanship": "Silk thread knotted gemstone alignment with micro-engraved clover station.",
    "images": [
      "/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg",
      "/products/clover-freshwater-pearl-blue-apatite-necklace-2.jpg",
      "/products/clover-freshwater-pearl-blue-apatite-necklace-3.jpg",
      "/products/clover-freshwater-pearl-blue-apatite-necklace-4.jpg"
    ],
    "modelImage": "/products/clover-freshwater-pearl-blue-apatite-necklace-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "pearl",
    "categoryName": "Freshwater Pearls",
    "hallmark": "Fine 925 Silver & Natural Gems",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-010",
    "name": "Freshwater Pearl Three Layer Statement Necklace",
    "slug": "freshwater-pearl-three-layer-zircon-necklace",
    "subtitle": "OBJET // 010 — TRIPLE TIER OPULENCE",
    "price": 3596,
    "currency": "INR",
    "description": "Three majestic strands of hand-selected freshwater pearls accented with brilliant pavé zircon stations and a solid 925 silver clasp.",
    "editorialNote": "Old-money Parisian glamour reimagined for modern evening wear.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Freshwater Pearls, Pavé Zircon & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "pearl",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "freshwater-pearl",
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "pearl",
      "statement",
      "new-arrivals"
    ],
    "finish": "Lustrous & Rhodium Plated",
    "colour": "Ivory Pearl & Silver",
    "isNew": true,
    "featuredRank": 10,
    "dimensions": "Graduated Strands: 15in, 17in, 19in",
    "craftsmanship": "Hand-strung with traditional gimp wire ends and bespoke safety clasp.",
    "images": [
      "/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg",
      "/products/freshwater-pearl-three-layer-zircon-necklace-2.jpg",
      "/products/freshwater-pearl-three-layer-zircon-necklace-3.jpg"
    ],
    "modelImage": "/products/freshwater-pearl-three-layer-zircon-necklace-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "pearl",
    "categoryName": "Freshwater Pearls",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-011",
    "name": "Genuine Natural Turquoise Drop Solitaire Pendant",
    "slug": "genuine-natural-turquoise-drop-pendant",
    "subtitle": "OBJET // 011 — SLEEK MINERAL SOLITAIRE",
    "price": 4870,
    "currency": "INR",
    "description": "An untreated cabochon teardrop of natural turquoise with natural veining, framed in pure solid 925 sterling silver on a box link chain.",
    "editorialNote": "Every individual turquoise stone is an unrepeatable geological masterpiece.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Natural Turquoise Gemstone & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "turquoise",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "statement",
      "gifting"
    ],
    "finish": "High Polish",
    "colour": "Turquoise Blue & Silver",
    "isNew": true,
    "featuredRank": 11,
    "dimensions": "Teardrop Cabochon: 18mm x 12mm | Chain: 18in",
    "craftsmanship": "Bezel casing hand-formed directly around natural gem contours.",
    "images": [
      "/products/genuine-natural-turquoise-drop-pendant-1.jpg",
      "/products/genuine-natural-turquoise-drop-pendant-2.jpg",
      "/products/genuine-natural-turquoise-drop-pendant-3.jpg"
    ],
    "modelImage": "/products/genuine-natural-turquoise-drop-pendant-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-012",
    "name": "Emerald Green & White Cubic Zirconia 3mm Tennis Bracelet",
    "slug": "emerald-green-white-cz-tennis-bracelet",
    "subtitle": "OBJET // 012 — JADE PRISM ALTERNATION",
    "price": 3999,
    "currency": "INR",
    "description": "Alternating emerald-green and diamond-white 3mm faceted stones in a continuous tennis link crafted from solid 925 silver.",
    "editorialNote": "Lush botanical green alternating with crystal white evokes royal Mughal court aesthetics.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Faceted Emerald CZ, White CZ & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "bracelets",
    "subcategory": "bracelets",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "statement",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Rhodium Polish",
    "colour": "Emerald Green, White & Silver",
    "isNew": true,
    "featuredRank": 12,
    "dimensions": "Length: 7.0 Inches | Stone Width: 3.0mm",
    "craftsmanship": "Individual 4-prong collet casting with articulated pin assembly.",
    "images": [
      "/products/emerald-green-white-cz-tennis-bracelet-1.jpg",
      "/products/emerald-green-white-cz-tennis-bracelet-2.jpg",
      "/products/emerald-green-white-cz-tennis-bracelet-3.jpg"
    ],
    "modelImage": "/products/emerald-green-white-cz-tennis-bracelet-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "bracelets",
    "categoryName": "Bracelets & Cuffs",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-013",
    "name": "Moissanite Classic Rhodium Tennis Bracelet (7 Inch)",
    "slug": "moissanite-rhodium-tennis-bracelet-11690",
    "subtitle": "OBJET // 013 — HIGH COUTURE MONOLITH",
    "price": 11690,
    "currency": "INR",
    "description": "An extraordinary high-carat tennis bracelet featuring premium VVS Moissanite gems prong-set into a heavy rhodium-over-sterling silver architecture.",
    "editorialNote": "A heavyweight statement piece for galas and life milestones. Radiance that effortlessly outshines mined diamonds.",
    "edition": "Delhi Atelier Haute Joaillerie Edition",
    "material": "VVS Moissanite, Rhodium Finish & Heavy 925 Sterling Silver",
    "goldPurity": "Rhodium Plated 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "moissanite",
    "subcategory": "bracelets",
    "silhouette": "heavy",
    "materials": [
      "moissanite",
      "sterling-silver-925",
      "rhodium-plated"
    ],
    "collections": [
      "new-arrivals",
      "moissanite",
      "statement"
    ],
    "finish": "Platinum Rhodium Finish",
    "colour": "Pure Silver & D Colorless Moissanite",
    "isNew": true,
    "featuredRank": 13,
    "dimensions": "Length: 7.0 Inches | Stone Width: 3.5mm",
    "craftsmanship": "Individually calibrated collets hand-burnished for zero catch on fine fabrics.",
    "images": [
      "/products/moissanite-rhodium-tennis-bracelet-11690-1.jpg",
      "/products/moissanite-rhodium-tennis-bracelet-11690-2.jpg",
      "/products/moissanite-rhodium-tennis-bracelet-11690-3.jpg"
    ],
    "modelImage": "/products/moissanite-rhodium-tennis-bracelet-11690-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-014",
    "name": "Mother of Pearl & Freshwater Pearl Four-Leaf Clover Bracelet",
    "slug": "mop-freshwater-pearl-clover-bracelet",
    "subtitle": "OBJET // 014 — TALISMANIC CLOVER CHAIN",
    "price": 5050,
    "currency": "INR",
    "description": "Four-leaf clover motifs carved from iridescent mother of pearl paired with organic freshwater pearls along a 14K gold-plated silver chain.",
    "editorialNote": "Symbolizing luck, hope, love, and health with iridescent mother-of-pearl reflections.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Natural Mother of Pearl, Freshwater Pearls, 14K Gold Vermeil & 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "pearl",
    "subcategory": "bracelets",
    "silhouette": "light",
    "materials": [
      "freshwater-pearl",
      "mother-of-pearl",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "pearl",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "High Polish Vermeil",
    "colour": "Whitish Gold & Iridescent Pearl",
    "isNew": true,
    "featuredRank": 14,
    "dimensions": "Length: 6.5in + 1.5in extender",
    "craftsmanship": "Precision lapidary carving of genuine mother-of-pearl inserts.",
    "images": [
      "/products/mop-freshwater-pearl-clover-bracelet-1.jpg",
      "/products/mop-freshwater-pearl-clover-bracelet-2.jpg"
    ],
    "modelImage": "/products/mop-freshwater-pearl-clover-bracelet-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "pearl",
    "categoryName": "Freshwater Pearls",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-015",
    "name": "Pear Shaped Radiant Canary Yellow Droplet Earrings",
    "slug": "pear-shaped-radiant-yellow-droplet-earrings",
    "subtitle": "OBJET // 015 — CANARY SOLAR PRISM",
    "price": 7100,
    "currency": "INR",
    "description": "Mesmerizing canary-yellow radiant teardrop gemstones haloed by optical micro-pavé stones in fine 925 sterling silver with secure lever-back clasps.",
    "editorialNote": "Vibrant yellow warmth that catches and refracts candlelight beautifully.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Canary Cubic Zirconia, Pavé Stones & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "earrings",
    "subcategory": "earrings",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "statement",
      "gifting"
    ],
    "finish": "Mirror Rhodium Polish",
    "colour": "Canary Yellow & Silver",
    "isNew": true,
    "featuredRank": 15,
    "dimensions": "Drop Length: 26mm | Center Stone: 10mm x 7mm",
    "craftsmanship": "Pavé-halo gallery setting hand-assembled under stereoscopic vision.",
    "images": [
      "/products/pear-shaped-radiant-yellow-droplet-earrings-1.jpg",
      "/products/pear-shaped-radiant-yellow-droplet-earrings-2.jpg"
    ],
    "modelImage": "/products/pear-shaped-radiant-yellow-droplet-earrings-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "earrings",
    "categoryName": "Earrings & Drops",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-016",
    "name": "Blush Pink Zircon Cascade Drop Earrings",
    "slug": "pink-zircon-cascade-drop-earrings",
    "subtitle": "OBJET // 016 — MORNING ROSE CHANDELIER",
    "price": 6100,
    "currency": "INR",
    "description": "Soft rose-pink zircon crystals arranged in an articulated chandelier cascade, mounted on hypoallergenic solid 925 sterling silver posts.",
    "editorialNote": "Gentle pastel blush tones bring graceful warmth to wedding guest and festive ensembles.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Rose Pink Zircon Crystals & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "earrings",
    "subcategory": "earrings",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "statement",
      "gifting"
    ],
    "finish": "High Polish",
    "colour": "Rose Pink & Silver",
    "isNew": true,
    "featuredRank": 16,
    "dimensions": "Drop Length: 32mm | Width: 12mm",
    "craftsmanship": "Articulated links allowing organic kinetic sway during movement.",
    "images": [
      "/products/pink-zircon-cascade-drop-earrings-1.jpg",
      "/products/pink-zircon-cascade-drop-earrings-2.jpg"
    ],
    "modelImage": "/products/pink-zircon-cascade-drop-earrings-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "earrings",
    "categoryName": "Earrings & Drops",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-017",
    "name": "Rhodium Plated Dainty Zircon Tennis Bracelet (1.5mm)",
    "slug": "rhodium-plated-zircon-bracelet-1-5mm",
    "subtitle": "OBJET // 017 — WHISPER PAVÉ RIBBON",
    "price": 3300,
    "currency": "INR",
    "description": "An ultra-slender 1.5mm micro-pavé zircon tennis line bracelet in pure 925 silver with a slide adjuster clasp for universal wrist fit.",
    "editorialNote": "The epitome of delicate everyday luxury. Ideal for wrist stacking.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "1.5mm Optical Zircon & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Minimalist",
    "category": "bracelets",
    "subcategory": "bracelets",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist",
      "gifting"
    ],
    "finish": "Rhodium Mirror",
    "colour": "Silver & White",
    "isNew": true,
    "featuredRank": 17,
    "dimensions": "Width: 1.5mm | Adjustable up to 8.5in wrist",
    "craftsmanship": "Precision continuous micro-collet setting with silicone slide ball stopper.",
    "images": [
      "/products/rhodium-plated-zircon-bracelet-1-5mm-1.jpg"
    ],
    "modelImage": "/products/rhodium-plated-zircon-bracelet-1-5mm-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "bracelets",
    "categoryName": "Bracelets & Cuffs",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-018",
    "name": "Rhodium Plated Freshwater Pearl Solitaire Necklace",
    "slug": "rhodium-plated-freshwater-pearl-necklace",
    "subtitle": "OBJET // 018 — POETIC LUNAR SOLITAIRE",
    "price": 3650,
    "currency": "INR",
    "description": "A single AAA grade baroque freshwater pearl suspended on a diamond-cut rhodium plated 925 sterling silver chain.",
    "editorialNote": "Pure simplicity. Let the natural organic lustre of high-grade pearl speak for itself.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "AAA Cultured Freshwater Pearl & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Everyday Wear",
    "category": "pearl",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "freshwater-pearl",
      "sterling-silver-925"
    ],
    "collections": [
      "pearl",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Mirror Polish",
    "colour": "White Pearl & Pure Silver",
    "isNew": true,
    "featuredRank": 18,
    "dimensions": "Pearl: 8.5mm Diameter | Chain: 16in + 2in extender",
    "craftsmanship": "Concealed bail pin hand-set through pearl core with jeweler epoxy.",
    "images": [
      "/products/rhodium-plated-freshwater-pearl-necklace-1.jpg"
    ],
    "modelImage": "/products/rhodium-plated-freshwater-pearl-necklace-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "pearl",
    "categoryName": "Freshwater Pearls",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-019",
    "name": "Rhodium Plated Royal Sapphire Solitaire Pendant",
    "slug": "rhodium-plated-sapphire-pendant",
    "subtitle": "OBJET // 019 — DEEP OCEAN TEARDROP",
    "price": 2572,
    "currency": "INR",
    "description": "A faceted royal sapphire blue stone surrounded by a delicate halo of optical crystals on solid 925 silver chain.",
    "editorialNote": "A regal pop of royal blue bringing instant majesty to everyday attire.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Royal Sapphire CZ, Pavé Zircon & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Minimalist",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "minimalist",
      "gifting"
    ],
    "finish": "Rhodium Polish",
    "colour": "Royal Blue & Silver",
    "isNew": true,
    "featuredRank": 19,
    "dimensions": "Pendant: 12mm x 9mm | Chain: 16in + 2in extender",
    "craftsmanship": "Prong setting cast with solid silver backplate for durability.",
    "images": [
      "/products/rhodium-plated-sapphire-pendant-1.jpg",
      "/products/rhodium-plated-sapphire-pendant-2.jpg"
    ],
    "modelImage": "/products/rhodium-plated-sapphire-pendant-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-020",
    "name": "Royal Ruby & Crystal Chandelier Drop Earrings",
    "slug": "ruby-cluster-drop-earrings",
    "subtitle": "OBJET // 020 — REGAL CRIMSON CASCADE",
    "price": 6700,
    "currency": "INR",
    "description": "Deep crimson ruby-red pear cut gemstones suspended from geometric crystal pavé clusters in solid 925 silver.",
    "editorialNote": "Dramatic red-carpet presence that commands the room with royal dignity.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Crimson Ruby CZ, Optical Pavé & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "earrings",
    "subcategory": "earrings",
    "silhouette": "heavy",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "statement",
      "gifting",
      "new-arrivals"
    ],
    "finish": "Platinum Rhodium",
    "colour": "Ruby Crimson & Silver",
    "isNew": true,
    "featuredRank": 20,
    "dimensions": "Drop Length: 36mm | Max Width: 15mm",
    "craftsmanship": "Double-hinge articulated drop setting with heavy silver backing.",
    "images": [
      "/products/ruby-cluster-drop-earrings-1.jpg",
      "/products/ruby-cluster-drop-earrings-2.jpg"
    ],
    "modelImage": "/products/ruby-cluster-drop-earrings-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "earrings",
    "categoryName": "Earrings & Drops",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-021",
    "name": "Midnight Sapphire & Zirconia Halo Earrings",
    "slug": "sapphire-zirconia-halo-earrings",
    "subtitle": "OBJET // 021 — NOCTURNE GEM DROPS",
    "price": 3600,
    "currency": "INR",
    "description": "Oval cut midnight sapphire cubic gemstones encircled by 18 micro-pavé zirconia stones on sterling silver posts.",
    "editorialNote": "A classic royal silhouette echoing heritage European aristocracy.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Midnight Sapphire CZ, Micro Pavé & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Statement",
    "category": "earrings",
    "subcategory": "earrings",
    "silhouette": "heavy",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "statement",
      "gifting"
    ],
    "finish": "Mirror Polish",
    "colour": "Midnight Blue & Silver",
    "isNew": true,
    "featuredRank": 21,
    "dimensions": "14mm x 11mm Oval Profile",
    "craftsmanship": "Center oval gem bordered by 18 micro-pavé optical stones with hypoallergenic posts.",
    "images": [
      "/products/sapphire-zirconia-halo-earrings-1.jpg",
      "/products/sapphire-zirconia-halo-earrings-2.jpg",
      "/products/sapphire-zirconia-halo-earrings-3.jpg"
    ],
    "modelImage": "/products/sapphire-zirconia-halo-earrings-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "earrings",
    "categoryName": "Earrings & Drops",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-022",
    "name": "Brilliant Multi-Faceted Zircon Stud Earrings",
    "slug": "brilliant-zircon-stud-earrings",
    "subtitle": "OBJET // 022 — TIMELESS SOLITAIRE STUDS",
    "price": 5750,
    "currency": "INR",
    "description": "Ultra-clear multi-faceted round cut zircon studs set in four-prong solid 925 sterling silver baskets with double-notched security backings.",
    "editorialNote": "Essential luxury. Clean, pure, and luminous every single morning.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Brilliant Zircon & Solid 925 Sterling Silver",
    "goldPurity": "Pure 925 Silver",
    "colorTone": "Silver Lustre",
    "metalColorHex": "#D8D9DC",
    "occasionVibe": "Everyday Wear",
    "category": "earrings",
    "subcategory": "earrings",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "sterling-silver-925"
    ],
    "collections": [
      "minimalist",
      "new-arrivals"
    ],
    "finish": "High Polish",
    "colour": "Crystal White & Silver",
    "isNew": true,
    "featuredRank": 22,
    "dimensions": "Diameter: 6.5mm (1.0 Carat Equivalent per ear)",
    "craftsmanship": "Four-prong knife-edge collet cast in solid 925 sterling silver.",
    "images": [
      "/products/brilliant-zircon-stud-earrings-1.jpg",
      "/products/brilliant-zircon-stud-earrings-2.jpg"
    ],
    "modelImage": "/products/brilliant-zircon-stud-earrings-1.jpg",
    "featured": false,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "earrings",
    "categoryName": "Earrings & Drops",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-023",
    "name": "14K Gold VVS Moissanite Solitaire Accent Ring",
    "slug": "14k-gold-vvs-moissanite-ring-3300",
    "subtitle": "OBJET // 023 — MINIMALIST TENSION PROMISE",
    "price": 3300,
    "currency": "INR",
    "description": "A sparkling VVS Moissanite gemstone set in a low-profile 14K gold vermeil band over solid 925 sterling silver. Tailored for comfort and everyday luxury.",
    "editorialNote": "Low profile setting guarantees snag-free wear while showcasing remarkable Moissanite fire.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "VVS Moissanite, 14K Gold Vermeil & Solid 925 Sterling Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "moissanite",
    "subcategory": "rings",
    "silhouette": "light",
    "materials": [
      "moissanite",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "moissanite",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Polished",
    "colour": "Whitish Gold",
    "isNew": true,
    "featuredRank": 23,
    "dimensions": "Stone: 5.0mm | Band: 2.0mm Comfort Band",
    "craftsmanship": "Precision bezel-basket setting hand-buffed with agate stones in Delhi.",
    "images": [
      "/products/14k-gold-vvs-moissanite-ring-3300-1.jpg",
      "/products/14k-gold-vvs-moissanite-ring-3300-2.jpg",
      "/products/14k-gold-vvs-moissanite-ring-3300-3.jpg",
      "/products/14k-gold-vvs-moissanite-ring-3300-4.jpg"
    ],
    "modelImage": "/products/14k-gold-vvs-moissanite-ring-3300-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": true,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-024",
    "name": "14K Gold Plated D Color VVS Moissanite Earrings",
    "slug": "14k-gold-plated-earrings-d-color-vvs-moissanite-2650",
    "subtitle": "OBJET // 024 — D COLORLESS CELESTIAL STUDS",
    "price": 2650,
    "currency": "INR",
    "description": "Flawless D-colorless VVS Moissanite gems prong-mounted on 14K gold plated solid 925 sterling silver posts.",
    "editorialNote": "D-colorless Moissanite provides crisp optical brilliance identical to highest tier diamonds.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "D Color VVS Moissanite, 14K Gold Vermeil & Solid 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Everyday Wear",
    "category": "moissanite",
    "subcategory": "earrings",
    "silhouette": "light",
    "materials": [
      "moissanite",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "new-arrivals",
      "moissanite",
      "minimalist",
      "gifting"
    ],
    "finish": "Mirror Finish",
    "colour": "Whitish Gold & Colorless Moissanite",
    "isNew": true,
    "featuredRank": 24,
    "dimensions": "Stone: 4.5mm (0.4ct each ear) | Post: 11mm with friction back",
    "craftsmanship": "Four-prong basket setting hand-tightened for lifelong gem retention.",
    "images": [
      "/products/14k-gold-plated-earrings-d-color-vvs-moissanite-2650-1.jpg",
      "/products/14k-gold-plated-earrings-d-color-vvs-moissanite-2650-2.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-earrings-d-color-vvs-moissanite-2650-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-025",
    "name": "14K Gold Plated D Color VVS Moissanite Pendant",
    "slug": "14k-gold-plated-pendant-d-color-vvs-moissanite-2700",
    "subtitle": "OBJET // 025 — COLORLESS RADIANCE PENDANT",
    "price": 2700,
    "currency": "INR",
    "description": "A pure D-colorless VVS Moissanite pendant floating on a diamond-cut 14K gold plated 925 sterling silver chain.",
    "editorialNote": "A daily talisman of light. D-colorless clarity brings immaculate fire to your neckline.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "D Color VVS Moissanite, 14K Gold Vermeil & Solid 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Minimalist",
    "category": "moissanite",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "moissanite",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "moissanite",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Polished",
    "colour": "Whitish Gold & Colorless Moissanite",
    "isNew": true,
    "featuredRank": 25,
    "dimensions": "Solitaire: 5.5mm (0.65ct equivalent) | Chain: 16in + 2in extender",
    "craftsmanship": "Concealed slide bail allowing organic kinetic glide along the chain.",
    "images": [
      "/products/14k-gold-plated-pendant-d-color-vvs-moissanite-2700-1.jpg",
      "/products/14k-gold-plated-pendant-d-color-vvs-moissanite-2700-2.jpg",
      "/products/14k-gold-plated-pendant-d-color-vvs-moissanite-2700-3.jpg"
    ],
    "modelImage": "/products/14k-gold-plated-pendant-d-color-vvs-moissanite-2700-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "moissanite",
    "categoryName": "Moissanite Collection",
    "hallmark": "Fine 925 Silver & Moissanite",
    "warranty": "30-Day Manufacturing Warranty"
  },
  {
    "id": "prod-026",
    "name": "Emerald Radiant & 14K Gold Plated Zircon Pendant",
    "slug": "green-gold-plated-zircon-pendant-4500",
    "subtitle": "OBJET // 026 — JADE SOVEREIGN SOLITAIRE",
    "price": 4500,
    "currency": "INR",
    "description": "An emerald-cut deep green radiant crystal crowned by micro-pavé zircon accents in 14K gold plated solid 925 silver.",
    "editorialNote": "A statement of regal vintage glamour. The emerald green color evokes antique royal jewels.",
    "edition": "Delhi Atelier Curated Edition",
    "material": "Emerald Cut Green Crystal, Pavé Zircon, 14K Gold Vermeil & 925 Silver",
    "goldPurity": "14K Gold Vermeil",
    "colorTone": "Whitish Gold",
    "metalColorHex": "#EDE7DC",
    "occasionVibe": "Statement",
    "category": "necklaces",
    "subcategory": "necklaces",
    "silhouette": "light",
    "materials": [
      "cubic-zirconia",
      "gold-plated-14k",
      "sterling-silver-925"
    ],
    "collections": [
      "statement",
      "minimalist",
      "new-arrivals"
    ],
    "finish": "Mirror Vermeil Finish",
    "colour": "Emerald Green & Whitish Gold",
    "isNew": true,
    "featuredRank": 26,
    "dimensions": "Emerald Cut Gem: 12mm x 9mm | Chain: 18in + 2in extender",
    "craftsmanship": "Octagonal radiant-cut gem set into a hand-filed four-prong basket.",
    "images": [
      "/products/green-gold-plated-zircon-pendant-4500-1.jpg",
      "/products/green-gold-plated-zircon-pendant-4500-2.jpg"
    ],
    "modelImage": "/products/green-gold-plated-zircon-pendant-4500-1.jpg",
    "featured": true,
    "inStock": true,
    "inventory": 2,
    "isEngravable": false,
    "categorySlug": "necklaces",
    "categoryName": "Necklaces & Chains",
    "hallmark": "Fine 925 Sterling Silver",
    "warranty": "30-Day Manufacturing Warranty"
  }
];

export const INDIAN_STATES = [
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Goa',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Chandigarh',
] as const;
