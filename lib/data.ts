export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
}

export interface MetalSwatch {
  name: string;
  hex: string;
  borderClass: string;
}

export const METAL_SWATCHES: MetalSwatch[] = [
  { name: '14K Champagne Gold', hex: '#E6CA97', borderClass: 'border-[#E6CA97]' },
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
  originalPrice: number;
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
  category?: string; // 'earrings' | 'necklaces' | 'bracelets' | 'rings' | 'jewellery-sets'
  materials?: string[];
  collections?: string[];
  finish?: string;
  colour?: string;
  isNew?: boolean;
  featuredRank?: number;
  
  dimensions: string;
  weight: string;
  craftsmanship: string;
  images: string[];
  modelImage: string; // For "View on Model" toggle
  videoUrl?: string; // Looping video
  
  featured: boolean;
  inStock: boolean;
  inventory: number; // If < 3, triggers "Archival piece: Only X left in stock"
  isEngravable?: boolean;
  
  categorySlug: string;
  categoryName: string;
  hallmark: string;
  warranty: string;
  
  // Cart Drawer Upsell
  pairsWithId?: string;
  upsellReason?: string;
}

export const STORE_CONFIG = {
  brand: {
    name: 'AVIORA JEWELLS',
    instagram: '@aviora_jewells',
    instagramUrl: 'https://www.instagram.com/aviora_jewells/',
  },
  currency: {
    code: 'INR',
    label: 'INR (₹)',
    locale: 'en-IN',
  },
  announcement: '✦ TIMELESS JEWELLERY, MADE TO BE YOURS • 14K GOLD PLATED 925 SILVER • BIS HALLMARKED ✦',
  hero: {
    eyebrow: 'THE AVIORA EDIT',
    title: 'Timeless pieces for every moment.',
    body: 'Delicate jewellery designed to be worn, gifted, and treasured. Crafted in 14K gold plated vermeil and BIS hallmarked 925 sterling silver.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2200&q=84',
    alt: 'Aviora Jewells editorial jewellery photography on a warm neutral backdrop',
  },
  editorial: {
    title: 'Made to become yours.',
    body: 'Discover pieces that bring effortless elegance to everyday moments and meaningful occasions.',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1600&q=84',
    alt: 'Sample close-up of delicate jewellery on a neutral surface',
  },
  gifting: {
    title: 'Give something special.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=84',
    alt: 'Gold jewellery styled for gifting',
  },
  categories: [
    { id: 'earrings', label: 'Earrings', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=84', alt: 'Sample earring product photography' },
    { id: 'necklaces', label: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=84', alt: 'Sample necklace product photography' },
    { id: 'bracelets', label: 'Bracelets', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=84', alt: 'Sample bracelet product photography' },
    { id: 'rings', label: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=84', alt: 'Sample ring product photography' },
    { id: 'jewellery-sets', label: 'Jewellery Sets', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=84', alt: 'Sample jewellery set photography' },
  ],
  materials: [
    { id: 'sterling-silver-925', label: '925 Sterling Silver', desc: 'Solid BIS Hallmarked silver core, hypoallergenic & durable.', image: 'https://images.unsplash.com/photo-1654700005435-8af6c06f3716?auto=format&fit=crop&w=1200&q=84' },
    { id: 'gold-plated-14k', label: '14K Gold-Plated', desc: 'Heavy 2.5µm vermeil jacket, 100% waterproof & sweat-proof.', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=84' },
    { id: 'moissanite', label: 'Moissanite & Gems', desc: 'D Colorless VVS1 brilliance that passes diamond testers.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=84' },
    { id: 'freshwater-pearls', label: 'Freshwater Pearls', desc: 'Hand-selected luminous organic pearls with timeless luster.', image: 'https://images.unsplash.com/photo-1654700005435-8af6c06f3716?auto=format&fit=crop&w=1200&q=84' },
  ],
  collections: [
    { id: 'new-arrivals', label: 'New Arrivals', description: 'The newest pieces in the Aviora edit.' },
    { id: 'everyday-edit', label: 'Everyday Edit', description: 'Delicate silhouettes for the everyday rotation.' },
    { id: 'quiet-shine', label: 'Quiet Shine', description: 'Subtle light-catching pieces with a polished point of view.' },
    { id: 'pearl-study', label: 'Pearl Study', description: 'A considered edit centred on the organic beauty of pearls.' },
    { id: 'gift-edit', label: 'Gift Edit', description: 'Meaningful pieces selected for every kind of occasion.' },
  ],
  promises: [
    { title: 'BIS 925 Hallmarked Silver', desc: 'Every creation is certified for 925 sterling silver purity by government-authorized assay centers.' },
    { title: '14K Gold Plated Vermeil', desc: '2.5-micron thick gold dipping engineered for daily waterproof wear without fading or tarnishing.' },
    { title: 'Lifetime Anti-Tarnish Warranty', desc: 'Impervious to water, perfume, and sweat, accompanied by an official certificate of authenticity.' },
    { title: 'Complimentary Monogramming', desc: 'Personalized precision laser engraving on the inner band of eligible creations.' },
  ],
};

export type OrderLifecycleStatus =
  | 'CONFIRMED'
  | 'IN_FABRICATION'
  | 'BIS_HALLMARKING'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface OrderStatusStep {
  status: OrderLifecycleStatus;
  label: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current: boolean;
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

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
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
}

export function createOrderTimeline(status: OrderLifecycleStatus, orderDate: string): OrderStatusStep[] {
  const steps: { status: OrderLifecycleStatus; label: string; location: string; description: string }[] = [
    {
      status: 'CONFIRMED',
      label: 'Order Confirmed & Assayed',
      location: 'Atelier Vault, Mumbai',
      description: 'Order received and 14K gold casting specifications queued.',
    },
    {
      status: 'IN_FABRICATION',
      label: '14K Lost-Wax Casting & Burnishing',
      location: 'Foundry & Bench, Mumbai',
      description: 'Artisan hand-burnishing with natural agate stones.',
    },
    {
      status: 'BIS_HALLMARKING',
      label: 'BIS 925 Hallmarking Assay',
      location: 'Govt Assay Center, Mumbai',
      description: 'Laser assay verification and official hallmark stamping.',
    },
    {
      status: 'IN_TRANSIT',
      label: 'Dispatched via Blue Dart Air Express',
      location: 'Mumbai Hub to Destination',
      description: 'Handed to Blue Dart air courier under tamper-proof wax seal.',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Doorstep Handover',
      location: 'Local Delivery Hub',
      description: 'Courier out for delivery with OTP verification / COD.',
    },
    {
      status: 'DELIVERED',
      label: 'Delivered & Patron Certificate Presented',
      location: 'Destination Address',
      description: 'Collector unboxing and lifetime warranty activation.',
    },
  ];

  const statusOrder: OrderLifecycleStatus[] = [
    'CONFIRMED',
    'IN_FABRICATION',
    'BIS_HALLMARKING',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const currentIndex = statusOrder.indexOf(status);

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
  xPercent: number; // Position on image (0 - 100)
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
  title: 'Why We Cast in 14K Gold',
  body: 'We exclusively craft our pieces in 14K gold because it is the ultimate alloy for everyday wear. Unlike 18K or 24K gold, which is soft and prone to scratching, 14K gold offers superior durability and a subtle, elegant champagne hue. It is sweat-proof, water-resistant, and designed to be lived in—not locked in a safe.',
  pillars: [
    { label: 'Champagne Hue', desc: 'Modern, soft golden tone avoiding brassy yellow' },
    { label: 'Scratch-Proof', desc: 'Higher tensile hardness than 18K/24K gold' },
    { label: 'Life-Proof', desc: '100% safe in showers, humidity, and gym sessions' },
  ],
};

export const SHOP_THE_LOOK_HOTSPOTS: HotspotItem[] = [
  {
    id: 'spot-1',
    productId: 'prod-001',
    title: 'The Molten 14K Kada Cuff',
    price: 4899,
    material: '14K Champagne Gold Vermeil',
    xPercent: 44,
    yPercent: 62,
  },
  {
    id: 'spot-2',
    productId: 'prod-002',
    title: 'Tear of Saturn Moissanite Ring',
    price: 6499,
    material: '14K Gold & 2.0ct Moissanite',
    xPercent: 58,
    yPercent: 78,
  },
  {
    id: 'spot-3',
    productId: 'prod-006',
    title: 'Liquid Mercury Hasli Torque',
    price: 7499,
    material: 'Mirror Rhodium Pure 925 Silver',
    xPercent: 52,
    yPercent: 32,
  },
];

export const COLLECTOR_TESTIMONIALS: CollectorTestimonial[] = [
  {
    id: 'test-1',
    patron: 'Rhea Mehra',
    location: 'Bandra, Mumbai',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    quote: 'The 14K champagne gold color is so sophisticated—not that overly yellow fake gold tone. I have worn the Molten Kada to gym and pool daily for 3 months; zero tarnish.',
    productName: 'The Molten 14K Kada Cuff',
    verifiedPatron: true,
  },
  {
    id: 'test-2',
    patron: 'Devika Singhania',
    location: 'Lutyens, New Delhi',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    quote: 'Wore the Indus choker to my sister\'s sangeet and styled it with an oversized blazer the next day. A true art object.',
    productName: 'Indus Vertebrae Choker',
    verifiedPatron: true,
  },
  {
    id: 'test-3',
    patron: 'Tara Alvares',
    location: 'Indiranagar, Bengaluru',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    quote: 'The tension setting on the Saturn ring is genius. Passes diamond tester, blinds under ambient lights, and never snags on silk.',
    productName: 'Tear of Saturn Moissanite Ring',
    verifiedPatron: true,
  },
  {
    id: 'test-4',
    patron: 'Ananya Roy',
    location: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    quote: 'Ordered with COD and checked PIN code delivery. Blue Dart delivered in 48 hrs in a gorgeous wax-sealed wooden box.',
    productName: 'Surya Arc Ear Sculpture',
    verifiedPatron: true,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Anatomical Kadas & Cuffs',
    slug: 'anatomical-kadas-cuffs',
    description: 'Sculptural kadas and armatures cast in 14k champagne gold vermeil and hallmarked 925 silver.',
    heroImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'cat-2',
    name: 'Statement Rings & Solitaires',
    slug: 'statement-rings-solitaires',
    description: 'VVS1 Moissanite, natural onyx, and architectural 14k gold vermeil solitaires.',
    heroImage: 'https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'cat-3',
    name: 'Haslis & Sculptural Chokers',
    slug: 'haslis-sculptural-chokers',
    description: 'Modern interpretations of the regal Indian hasli in liquid mirror rhodium and dark titanium.',
    heroImage: 'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'cat-4',
    name: 'Negative Space Ear Cuffs',
    slug: 'negative-space-ear-cuffs',
    description: 'No-piercing auricular sculptures celebrating the void between 14K champagne gold and skin.',
    heroImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'The Molten 14K Kada Cuff',
    slug: 'the-molten-kada-cuff',
    subtitle: 'OBJET // 001 — VOLCANIC KINETIC ARMATURE',
    price: 4899,
    originalPrice: 6999,
    currency: 'INR',
    description: 'A monolithic wrist kada hand-forged from BIS Hallmarked 925 sterling silver, layered with a heavy 2.5-micron jacket of 14K Champagne Gold Vermeil. Unlike soft 18K/24K gold, this 14K formulation is engineered for extreme scratch resistance, making it 100% waterproof and sweat-proof for everyday luxury.',
    editorialNote: 'Reimagining the timeless Indian kada as wearable brutalist sculpture with a soft champagne luster.',
    edition: 'Artisan Batch // 250 Castings',
    material: '14K Champagne Gold Vermeil over BIS 925 Sterling Silver',
    goldPurity: '14K Gold Vermeil (2.5μm)',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Statement',
    category: 'bracelets',
    materials: ['gold-plated-14k', 'sterling-silver-925'],
    collections: ['new-arrivals', 'everyday-edit'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: true,
    featuredRank: 1,
    dimensions: 'Circumference: 62mm Inner Diameter (Flexible Comfort) | Thickness: 6.5mm',
    weight: '28.4 grams solid',
    craftsmanship: 'Centrifugally cast in lost wax, submerged in glacial spring water, then hand-burnished with agate stones over 48 artisan hours.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1573408301145-b98c4af00620?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 2, // Low stock urgency triggered!
    isEngravable: true,
    categorySlug: 'anatomical-kadas-cuffs',
    categoryName: 'Anatomical Kadas & Cuffs',
    hallmark: 'BIS Hallmarked 925 Pure Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty & Free Replating',
    pairsWithId: 'prod-002',
    upsellReason: 'Complete the 14K Champagne Suite with the matching Saturn Ring',
  },
  {
    id: 'prod-002',
    name: 'Tear of Saturn Moissanite Ring',
    slug: 'tear-of-saturn-moissanite-ring',
    subtitle: 'OBJET // 002 — ORBITAL TENSION SOLITAIRE',
    price: 6499,
    originalPrice: 8999,
    currency: 'INR',
    description: 'A blinding 2.0-carat VVS1 brilliant-cut Moissanite suspended in an orbital tension ring crafted from durable 14K Pale Gold Vermeil. Passes thermal diamond testers with 100% precision, offering diamond-grade sparkle without ethical compromise.',
    editorialNote: 'Designed for everyday wear. No high prongs to catch on clothes; 14K champagne gold provides the rigid hardness required for secure tension holding.',
    edition: 'Édition Limitée // 150 Pieces Worldwide',
    material: '2.0ct VVS1 Moissanite (D Colorless), 14K Gold Vermeil & 925 Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Bridal',
    category: 'rings',
    materials: ['moissanite', 'gold-plated-14k', 'sterling-silver-925'],
    collections: ['quiet-shine', 'gift-edit', 'new-arrivals'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: true,
    featuredRank: 2,
    dimensions: 'Center Gem: 8mm Diameter | Band Width: 3.5mm Tapered',
    weight: '6.2 grams',
    craftsmanship: 'Micro-tension seated with zero prongs to prevent snagging on silk saris, cashmere, or western suits.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 4,
    isEngravable: true,
    categorySlug: 'statement-rings-solitaires',
    categoryName: 'Statement Rings & Solitaires',
    hallmark: 'BIS Hallmarked 925 & GRA Certified Gem',
    warranty: 'Lifetime Stone Brilliance & Plating Guarantee',
    pairsWithId: 'prod-007',
    upsellReason: 'Pairs boldly with the Eclipse Onyx Signet for a stacked hand curation',
  },
  {
    id: 'prod-003',
    name: 'Indus Vertebrae Choker',
    slug: 'indus-vertebrae-choker',
    subtitle: 'OBJET // 003 — ARTICULATED SKELETAL COLLAR',
    price: 8999,
    originalPrice: 12499,
    currency: 'INR',
    description: 'Twenty-four articulated vertebrae carved from hypoallergenic blackened aerospace titanium and hallmarked 925 sterling silver, detailed with 14K champagne gold rivets and inverted rose-cut black moissanites.',
    editorialNote: 'Inspired by ancient Indus Valley bead articulation, reinvented with cyberpunk architectural poise. Hugs the collarbone like liquid silk.',
    edition: 'Atelier Commission // 40 Numbered Castings',
    material: 'Blackened Aerospace Titanium, 14K Gold Pins, 925 Silver, Black Moissanite',
    goldPurity: '14K Gold Accents & Titanium',
    colorTone: 'Obsidian Black',
    metalColorHex: '#1C1C20',
    occasionVibe: 'Statement',
    category: 'necklaces',
    materials: ['sterling-silver-925'],
    collections: ['quiet-shine'],
    colour: 'Obsidian Black',
    finish: 'Brushed',
    isNew: false,
    featuredRank: 5,
    dimensions: 'Internal Diameter: 125mm with 50mm Adjustable Extension Chain',
    weight: '34.2 grams',
    craftsmanship: 'Individually pinned with platinum and 14K gold rivets allowing 360-degree organic drape on the clavicle.',
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 1, // Scarcity alert!
    categorySlug: 'haslis-sculptural-chokers',
    categoryName: 'Haslis & Sculptural Chokers',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Structural Integrity & Plating Warranty',
    pairsWithId: 'prod-006',
    upsellReason: 'Layer effortlessly with the Liquid Mercury Hasli for double collar impact',
  },
  {
    id: 'prod-004',
    name: 'The Kashi Void Talisman',
    slug: 'the-kashi-void-talisman',
    subtitle: 'OBJET // 004 — AERATED NEGATIVE-SPACE MEDALLION',
    price: 3799,
    originalPrice: 5299,
    currency: 'INR',
    description: 'An architectural geometric talisman celebrating negative space. Cast in durable 14K Rose Gold Vermeil over sterling silver, suspended on a hand-braided waterproof black silk cord.',
    editorialNote: 'An ode to mindfulness and eternal stillness. The central void highlights bare skin or layered sheer kurtas.',
    edition: 'Vault Selection // 100 Castings',
    material: '14K Rose Gold Vermeil, BIS 925 Silver, Waxed Japanese Silk',
    goldPurity: '14K Rose Gold Vermeil',
    colorTone: '14K Rose Gold',
    metalColorHex: '#E3A897',
    occasionVibe: 'Minimalist',
    category: 'necklaces',
    materials: ['gold-plated-14k', 'sterling-silver-925'],
    collections: ['everyday-edit'],
    colour: 'Rose Gold',
    finish: 'Polished',
    isNew: false,
    featuredRank: 6,
    dimensions: 'Medallion Drop: 48mm | Central Void: 20mm | Cord: 650mm adjustable',
    weight: '14.8 grams',
    craftsmanship: 'Aero-cored interior chambers precision cast with lost-wax technology to ensure lightweight all-day comfort.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1573408301145-b98c4af00620?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 5,
    categorySlug: 'haslis-sculptural-chokers',
    categoryName: 'Haslis & Sculptural Chokers',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
    pairsWithId: 'prod-005',
    upsellReason: 'Complete the celestial negative space stack with the Surya Arc Ear Sculpture',
  },
  {
    id: 'prod-005',
    name: 'Surya Arc Ear Sculpture',
    slug: 'surya-arc-ear-sculpture',
    subtitle: 'OBJET // 005 — HELICAL PIERCE-FREE AURICULAR ARCHITECTURE',
    price: 3299,
    originalPrice: 4699,
    currency: 'INR',
    description: 'An anatomically tension-curved ear sculpture requiring zero piercings. Glides effortlessly along the outer helix, casting razor-sharp golden reflections. Cast in resilient 14K Champagne Gold Vermeil over 925 silver.',
    editorialNote: 'Created for patrons without cartilage piercings who desire high-fashion architectural ear curation.',
    edition: 'Curator Series // 300 Pairs',
    material: '14K Champagne Gold Vermeil over BIS 925 Sterling Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Everyday Wear',
    category: 'earrings',
    materials: ['gold-plated-14k', 'sterling-silver-925'],
    collections: ['new-arrivals', 'everyday-edit'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: true,
    featuredRank: 3,
    dimensions: 'Total Length: 38mm | Ergonomic Spring Gap: 4mm',
    weight: '4.8 grams per ear',
    craftsmanship: 'Laser micro-scored flexure allows infinite micro-adjustments to hug any ear morphology securely.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 8,
    categorySlug: 'negative-space-ear-cuffs',
    categoryName: 'Negative Space Ear Cuffs',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Form & Finish Warranty',
    pairsWithId: 'prod-001',
    upsellReason: 'Harmonizes with the Molten 14K Kada for daytime champagne gold accents',
  },
  {
    id: 'prod-006',
    name: 'Liquid Mercury Hasli Torque',
    slug: 'liquid-mercury-hasli-torque',
    subtitle: 'OBJET // 006 — MONOLITHIC MIRROR RHODIUM HASLI',
    price: 7499,
    originalPrice: 10499,
    currency: 'INR',
    description: 'A contemporary tribute to the Indian royal Hasli collar. Seamless, fluid, and tapering elegantly towards the clavicle, electroplated with triple-thick lustrous Rhodium over solid 925 silver for an optical mirror finish.',
    editorialNote: 'Looks sensational worn over a deep-neck choli, a crisp oversized linen shirt, or a sculpted evening blazer.',
    edition: 'Atelier Signature // 50 Castings',
    material: 'Triple Rhodium Plated BIS 925 Sterling Silver (Mirror Polish)',
    goldPurity: 'Pure 925 Silver & Rhodium',
    colorTone: 'Pure 925 Silver',
    metalColorHex: '#D8D9DC',
    occasionVibe: 'Layering',
    category: 'necklaces',
    materials: ['sterling-silver-925'],
    collections: ['quiet-shine'],
    colour: 'Silver',
    finish: 'Polished',
    isNew: false,
    featuredRank: 7,
    dimensions: 'Inner Diameter: 130mm | Variable Taper: 4mm to 16mm',
    weight: '38.5 grams solid',
    craftsmanship: 'Hydroformed under high pressure to ensure seamless continuity and smooth collarbone contact.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 3,
    categorySlug: 'haslis-sculptural-chokers',
    categoryName: 'Haslis & Sculptural Chokers',
    hallmark: 'BIS Hallmarked 925 Pure Silver',
    warranty: 'Lifetime Mirror Finish & Anti-Tarnish Warranty',
    pairsWithId: 'prod-008',
    upsellReason: 'Stacks dynamically with the Tectonic Horizon Bangle for mixed metal contrast',
  },
  {
    id: 'prod-007',
    name: 'Eclipse Onyx 14K Signet Ring',
    slug: 'eclipse-onyx-signet-ring',
    subtitle: 'OBJET // 007 — MATTE ONYX & PAVÉ MOISSANITE',
    price: 4199,
    originalPrice: 5999,
    currency: 'INR',
    description: 'A carved dish of natural matte black onyx embedded in a 14K Champagne Gold Vermeil band, crowned by a celestial arc of pavé-set moissanites resembling a total solar eclipse.',
    editorialNote: 'Bold, androgynous, and scratch-resistant. The 14K gold structure is engineered for permanent hand wear without bending or denting.',
    edition: 'Signature Vault // 120 Pieces',
    material: 'Natural Matte Black Onyx, VVS Moissanite, 14K Champagne Gold Vermeil',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Everyday Wear',
    category: 'rings',
    materials: ['gold-plated-14k', 'sterling-silver-925', 'moissanite'],
    collections: ['everyday-edit'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: false,
    featuredRank: 8,
    dimensions: 'Onyx Dish: 18mm x 14mm Oval | Shank: 6mm Comfort Fit',
    weight: '11.4 grams',
    craftsmanship: 'Hand-lapped natural stone set with microscopic prongs under 40x magnification.',
    images: [
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 6,
    isEngravable: true,
    categorySlug: 'statement-rings-solitaires',
    categoryName: 'Statement Rings & Solitaires',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
    pairsWithId: 'prod-002',
    upsellReason: 'Wear on pointer finger opposite the Saturn Solitaire for balanced ring curation',
  },
  {
    id: 'prod-008',
    name: 'Tectonic Horizon 14K Bangle',
    slug: 'tectonic-horizon-bangle',
    subtitle: 'OBJET // 008 — FISSURED BRUSHED GOLD & RAW QUARTZ',
    price: 5499,
    originalPrice: 7899,
    currency: 'INR',
    description: 'An architectural wrist sculpture inspired by continental rift valleys. A heavy 14K Champagne Gold Vermeil oval band features an organic fissure set with natural unheated smoky quartz crystals.',
    editorialNote: 'Combines raw mineral power with the sleek geometry of modern Indian architecture.',
    edition: 'Limited Series // 60 Unique Inclusions',
    material: 'Brushed 14K Champagne Gold Vermeil, Natural Raw Smoky Quartz, 925 Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Layering',
    category: 'bracelets',
    materials: ['gold-plated-14k', 'sterling-silver-925'],
    collections: ['everyday-edit'],
    colour: 'Champagne Gold',
    finish: 'Brushed',
    isNew: false,
    featuredRank: 9,
    dimensions: 'Inner Oval: 58mm x 48mm | Architectural Width: 14mm',
    weight: '26.8 grams',
    craftsmanship: 'Direct lost-wax casting around hand-selected natural quartz crystal clusters.',
    images: [
      'https://images.unsplash.com/photo-1573408301145-b98c4af00620?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 2, // Scarcity alert!
    categorySlug: 'anatomical-kadas-cuffs',
    categoryName: 'Anatomical Kadas & Cuffs',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
    pairsWithId: 'prod-001',
    upsellReason: 'Stack directly alongside the Molten Kada for an asymmetrical wrist armor look',
  },
  {
    id: 'prod-009',
    name: 'Luna Huggie Earrings',
    slug: 'luna-huggie-earrings',
    subtitle: 'OBJET // 009 — COMPACT 14K EVERYDAY HUGIES',
    price: 2490,
    originalPrice: 3490,
    currency: 'INR',
    description: 'A compact hoop silhouette for effortless everyday styling. Cast in durable 14K Gold Vermeil over BIS 925 sterling silver with a secure click closure.',
    editorialNote: 'Designed to be lived in 24/7—sleep-proof, shower-proof, and sweat-proof.',
    edition: 'Everyday Classic // Perpetual',
    material: '14K Gold-Plated over 925 Sterling Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Everyday Wear',
    category: 'earrings',
    materials: ['gold-plated-14k', 'sterling-silver-925'],
    collections: ['new-arrivals', 'everyday-edit'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: true,
    featuredRank: 4,
    dimensions: 'Diameter: 12mm | Thickness: 2.2mm',
    weight: '3.4 grams per pair',
    craftsmanship: 'Seamless snap closure engineered for zero pinch and permanent hold.',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 12,
    categorySlug: 'negative-space-ear-cuffs',
    categoryName: 'Earrings & Ear Cuffs',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
  },
  {
    id: 'prod-010',
    name: 'Seren Pearl Drop Earrings',
    slug: 'seren-pearl-drop-earrings',
    subtitle: 'OBJET // 010 — LUMINOUS FRESHWATER PEARL DROPS',
    price: 3190,
    originalPrice: 4290,
    currency: 'INR',
    description: 'A refined drop silhouette pairing organic grade-AAA freshwater pearls with 14K Champagne Gold Vermeil wires.',
    editorialNote: 'A poetic gift piece that captures the natural asymmetry and soft luster of genuine pearls.',
    edition: 'Pearl Study // Limited Selection',
    material: 'Freshwater Pearls, 14K Gold Vermeil & 925 Sterling Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Pearl White',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Bridal',
    category: 'earrings',
    materials: ['freshwater-pearls', 'gold-plated-14k', 'sterling-silver-925'],
    collections: ['pearl-study', 'gift-edit'],
    colour: 'Pearl White',
    finish: 'Natural',
    isNew: false,
    featuredRank: 10,
    dimensions: 'Drop: 24mm | Pearl Size: 8.5mm teardrop',
    weight: '4.6 grams per pair',
    craftsmanship: 'Hand-selected baroque pearls paired for tonal harmony and gentle light reflection.',
    images: [
      'https://images.unsplash.com/photo-1654700005435-8af6c06f3716?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 7,
    categorySlug: 'negative-space-ear-cuffs',
    categoryName: 'Earrings & Ear Cuffs',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Guarantee',
  },
  {
    id: 'prod-011',
    name: 'Celia Moissanite Studs',
    slug: 'celia-moissanite-studs',
    subtitle: 'OBJET // 011 — 1.0CT BRILLIANT CUT SOLITAIRE STUDS',
    price: 3650,
    originalPrice: 4990,
    currency: 'INR',
    description: 'A light-catching stud profile with dual 0.5ct (1.0ct total) brilliant-cut VVS1 Moissanites set in four-prong 925 silver baskets.',
    editorialNote: 'The ultimate minimalist staple. Dazzles with fire surpassing natural diamonds.',
    edition: 'Quiet Shine Collection',
    material: 'VVS1 Moissanite, BIS 925 Sterling Silver',
    goldPurity: 'Pure 925 Silver & Moissanite',
    colorTone: 'Pure 925 Silver',
    metalColorHex: '#D8D9DC',
    occasionVibe: 'Minimalist',
    category: 'earrings',
    materials: ['moissanite', 'sterling-silver-925'],
    collections: ['quiet-shine', 'new-arrivals', 'everyday-edit'],
    colour: 'Silver',
    finish: 'Polished',
    isNew: true,
    featuredRank: 11,
    dimensions: 'Gems: 5mm each | Low-profile 4-prong setting',
    weight: '2.4 grams total',
    craftsmanship: 'Custom silicone-embedded silver safety backs prevent dropping and irritation.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 9,
    categorySlug: 'negative-space-ear-cuffs',
    categoryName: 'Earrings & Ear Cuffs',
    hallmark: 'BIS Hallmarked 925 & GRA Certified',
    warranty: 'Lifetime Anti-Tarnish Warranty',
  },
  {
    id: 'prod-012',
    name: 'Vela 925 Silver Chain Necklace',
    slug: 'vela-chain-necklace',
    subtitle: 'OBJET // 012 — SOLID SILVER ARCHITECTURAL LINK',
    price: 2890,
    originalPrice: 3890,
    currency: 'INR',
    description: 'A fine silver link chain crafted from solid 925 sterling silver with a liquid rhodium anti-tarnish finish. Perfect for wearing solo or stacking.',
    editorialNote: 'A versatile foundation piece with subtle sparkle and smooth skin feel.',
    edition: 'Everyday Essentials',
    material: 'Triple Rhodium Plated BIS 925 Sterling Silver',
    goldPurity: 'Pure 925 Silver',
    colorTone: 'Pure 925 Silver',
    metalColorHex: '#D8D9DC',
    occasionVibe: 'Everyday Wear',
    category: 'necklaces',
    materials: ['sterling-silver-925'],
    collections: ['everyday-edit'],
    colour: 'Silver',
    finish: 'Polished',
    isNew: false,
    featuredRank: 12,
    dimensions: 'Length: 42cm + 5cm extension | Width: 2mm',
    weight: '8.5 grams',
    craftsmanship: 'Diamond-cut links reflect light with every movement.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 14,
    categorySlug: 'haslis-sculptural-chokers',
    categoryName: 'Haslis & Sculptural Chokers',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Anti-Tarnish Warranty',
  },
  {
    id: 'prod-013',
    name: 'Elara Solitaire Moissanite Pendant',
    slug: 'elara-solitaire-pendant',
    subtitle: 'OBJET // 013 — FLOATING 1.5CT MOISSANITE BEZEL',
    price: 4950,
    originalPrice: 6890,
    currency: 'INR',
    description: 'A singular point of brilliant light. A 1.5-carat D-colorless moissanite encased in a sleek 14K Gold Vermeil bezel on a gossamer silver chain.',
    editorialNote: 'Understated luxury that transitions from desk to black-tie gala.',
    edition: 'Quiet Shine Edit',
    material: '1.5ct VVS1 Moissanite, 14K Gold Vermeil, BIS 925 Silver',
    goldPurity: '14K Gold Vermeil',
    colorTone: 'Champagne Gold',
    metalColorHex: '#E6CA97',
    occasionVibe: 'Minimalist',
    category: 'necklaces',
    materials: ['moissanite', 'gold-plated-14k', 'sterling-silver-925'],
    collections: ['quiet-shine', 'gift-edit'],
    colour: 'Champagne Gold',
    finish: 'Polished',
    isNew: false,
    featuredRank: 13,
    dimensions: 'Stone: 7.5mm | Chain: 40cm + 5cm extension',
    weight: '5.2 grams',
    craftsmanship: 'Low-profile bezel setting sits flush against collarbone.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    inStock: true,
    inventory: 6,
    categorySlug: 'haslis-sculptural-chokers',
    categoryName: 'Haslis & Sculptural Chokers',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Brilliance Guarantee',
  },
  {
    id: 'prod-014',
    name: 'Aura Moissanite Tennis Bracelet',
    slug: 'aura-tennis-bracelet',
    subtitle: 'OBJET // 014 — ENDLESS RIVER OF SPARKLE',
    price: 7990,
    originalPrice: 11490,
    currency: 'INR',
    description: 'An unbroken stream of brilliant-cut moissanites in four-prong 925 sterling silver settings with double safety box clasp. 100% waterproof luxury.',
    editorialNote: 'An heirloom tennis bracelet crafted for modern living.',
    edition: 'Signature Fine Jewellery',
    material: 'VVS1 Moissanite (3.0mm stones), BIS 925 Sterling Silver',
    goldPurity: 'Pure 925 Silver & Moissanite',
    colorTone: 'Pure 925 Silver',
    metalColorHex: '#D8D9DC',
    occasionVibe: 'Statement',
    category: 'bracelets',
    materials: ['moissanite', 'sterling-silver-925'],
    collections: ['quiet-shine', 'gift-edit'],
    colour: 'Silver',
    finish: 'Polished',
    isNew: true,
    featuredRank: 14,
    dimensions: 'Length: 17.5cm (Standard 7-inch) | Width: 3.2mm',
    weight: '16.4 grams',
    craftsmanship: 'Articulated box links with dual side safety latches.',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
    ],
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    featured: true,
    inStock: true,
    inventory: 4,
    categorySlug: 'anatomical-kadas-cuffs',
    categoryName: 'Anatomical Kadas & Cuffs',
    hallmark: 'BIS Hallmarked 925 Silver',
    warranty: 'Lifetime Warranty',
  },
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

