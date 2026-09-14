# AVIORA JEWELLERS — Demi-Fine 14K Gold Plated 925 Sterling Silver

> **Editorial, Museum-Curated, Demi-Fine Luxury Jewelry House for the Contemporary Indian Market**  
> Inspired by the craft and direct-to-consumer excellence of **Palmonas**, **GIVA**, and **Missoma**, engineered in authentic BIS Hallmarked 925 Sterling Silver with thick 14K/18K Gold Plated Vermeil.
> **Live Production URL**: [https://aviora-jewellers.vercel.app](https://aviora-jewellers.vercel.app)

---

## 📑 Table of Contents

1. [Executive Summary & Brand Positioning](#-executive-summary--brand-positioning)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Full Directory Structure](#-full-directory-structure)
4. [Prisma Data Models & Schema (`schema.prisma`)](#-prisma-data-models--schema-schemaprisma)
5. [Database Seeding & Curated Catalog (`seed.ts`)](#-database-seeding--curated-catalog-seedts)
6. [Backend API Routes & Server Actions](#-backend-api-routes--server-actions)
7. [Resilient Image System with Generative Fallbacks](#-resilient-image-system-with-generative-fallbacks)
8. [The Indian Consumer Experience (Palmonas Model)](#-the-indian-consumer-experience-palmonas-model)
9. [Frontend Components & Page Flow](#-frontend-components--page-flow)
   - [1. Immersive Parallax Hero & 4-Pillar Trust Bar](#1-immersive-parallax-hero--4-pillar-trust-bar)
   - [2. The Manifesto & Curated Masonry Gallery](#2-the-manifesto--curated-masonry-gallery)
   - [3. The Atelier (Shop & Filter Sidebar)](#3-the-atelier-shop--filter-sidebar)
   - [4. Cinematic Product Detail Page (PDP)](#4-cinematic-product-detail-page-pdp)
   - [5. Dark-Mode Side Bag (Cart Drawer)](#5-dark-mode-side-bag-cart-drawer)
   - [6. Express Indian Checkout & Confirmation](#6-express-indian-checkout--confirmation)
10. [Verification, Build & Commands](#-verification-build--commands)

---

## 🏛️ Executive Summary & Brand Positioning

**AURA** is built to move away from standard, generic e-commerce templates. It operates as a digital art gallery and editorial fashion magazine where fine jewelry is presented as sculptural art rather than commercial trinkets.

### The Problem in Indian Fashion Jewelry
- Cheap brass/copper jewelry with paper-thin flash plating tarnishes within weeks in Indian humid weather, turning skin green.
- Real 22K/24K gold jewelry is prohibitively expensive for everyday wear, modern office styling, and travel.

### The AURA Solution (Palmonas Benchmark)
- **Base Metal**: 100% Certified **BIS Hallmarked 925 Sterling Silver**.
- **Plating**: Thick **2.5-micron 18K / 22K Gold Vermeil** sealed with a proprietary nano-ceramic PVD layer.
- **Key Claims**: **100% Waterproof**, **Sweat-Proof**, **Hypoallergenic**, and backed by a **Lifetime Anti-Tarnish Warranty** with free replating.
- **Accessible Luxury**: ₹3,299 – ₹8,999 price range with Cash on Delivery (COD) and 5% instant discount on UPI.

---

## ⚡ Tech Stack & Architecture

- **Framework**: **Next.js 14+ (App Router)** & **Vite React 19** (Dual-engine compatibility for instant live preview and server-side production scaling).
- **Styling**: **Tailwind CSS**, **Tailwind Merge (`twMerge`)**, and **clsx**.
- **Animations**: **Framer Motion** (gsap-style parallax, smooth spring drawer physics, staggered reveals, and hover-triggered elevations).
- **Database & ORM**: **Prisma ORM** (Universal schema compatible with PostgreSQL, Supabase, and SQLite for zero-config local testing).
- **Typography**: Display serif fonts (**Cinzel**, **Playfair Display**) paired with technical monospace (**Space Mono**) and sans-serif (**Inter**).
- **Icons**: **Lucide React**.
- **State Management**: React Context (`CartProvider`) with client-side localStorage synchronization.

---

## 📂 Full Directory Structure

```
aura-jewelry/
├── prisma/
│   ├── schema.prisma             # Universal Prisma schema (Product, Category, Order, User)
│   └── seed.ts                   # Seeds 8 Indian fine jewelry pieces into database
├── lib/
│   ├── prisma.ts                 # Global PrismaClient singleton (dev-safe)
│   ├── utils.ts                  # clsx, twMerge, and Indian Rupee (₹) price formatting
│   ├── data.ts                   # In-memory Indian catalog, states, types & categories
│   ├── cart-context.tsx          # Global cart state with local storage persistence
│   └── actions.ts                # Server Actions for zero-layout-shift data fetching
├── app/
│   ├── layout.tsx                # Next.js Root Layout with fonts, SEO tags & providers
│   ├── globals.css               # Editorial CSS design tokens & custom dark scrollbar
│   ├── page.tsx                  # Parallax Hero + 4-Pillar Trust Bar + Asymmetrical Gallery
│   ├── atelier/
│   │   ├── page.tsx              # Shop view with smooth filtering sidebar
│   │   └── [slug]/
│   │       └── page.tsx          # Cinematic PDP: Stacked full-height images + PIN code checker
│   ├── checkout/
│   │   └── page.tsx              # Distraction-free Indian checkout (UPI 5% off, COD, RuPay)
│   └── api/
│       ├── products/route.ts     # GET /api/products route with category/search filtering
│       └── checkout/route.ts     # POST /api/checkout transactional order creation route
├── components/
│   ├── ui/
│   │   ├── artistic-image.tsx    # Resilient image with SVG architectural fallback generator
│   │   ├── navigation.tsx        # Top Indian trust marquee, brand identity & live bag badge
│   │   ├── cart-drawer.tsx       # Dark-mode drawer with free delivery meter
│   │   └── footer.tsx            # Mumbai & Jaipur atelier colophon
│   └── shop/
│       ├── product-card.tsx      # Raw artwork cards with Indian pricing & discount tags
│       └── filter-sidebar.tsx    # Minimalist filter by discipline & material
├── src/
│   ├── App.jsx                   # Active live-preview component matching the full Indian vision
│   ├── main.jsx                  # React DOM mount point
│   └── index.css                 # Typography and styling tokens
├── index.html                    # Linked Google Fonts (Cinzel, Playfair Display, Space Mono)
├── package.json                  # Dependencies: Next, React 19, Tailwind, Prisma, Framer Motion
└── README.md                     # Comprehensive documentation
```

---

## 🗄️ Prisma Data Models & Schema (`schema.prisma`)

File: [`prisma/schema.prisma`](file:///Users/mayanksaxena/aura-jewelry/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_FABRICATION
  DISPATCHED
  DELIVERED
  CANCELLED
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  heroImage   String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id             String      @id @default(cuid())
  name           String
  slug           String      @unique
  subtitle       String?
  price          Float       // Current selling price in INR
  originalPrice  Float?      // Strike-through MRP in INR
  currency       String      @default("INR")
  description    String
  editorialNote  String?
  edition        String?     // e.g., "Artisan Batch // 250 Castings"
  material       String      // e.g., "18K Gold Vermeil over BIS 925 Silver"
  dimensions     String?     // e.g., "Inner Diameter: 62mm"
  weight         String?     // e.g., "28.4 grams solid"
  craftsmanship  String?     // Narrative on lost-wax casting and PVD sealing
  images         String      // Stored as JSON string array
  featured       Boolean     @default(false)
  inStock        Boolean     @default(true)
  inventory      Int         @default(5)
  hallmark       String?     @default("BIS Hallmarked 925 Pure Silver")
  warranty       String?     @default("Lifetime Anti-Tarnish Warranty")
  
  categoryId     String
  category       Category    @relation(fields: [categoryId], references: [id])
  orderItems     OrderItem[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  phone     String?
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // e.g., "AUR-IN-8942"
  customerEmail   String
  customerName    String
  customerPhone   String?
  shippingAddress String
  city            String
  state           String?
  postalCode      String      // 6-digit Indian PIN code
  country         String      @default("India")
  paymentMethod   String      @default("UPI") // UPI, CARD, COD, NETBANKING
  total           Float
  currency        String      @default("INR")
  status          OrderStatus @default(CONFIRMED)
  
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  price     Float    // Snapshot of price in INR
}
```

---

## 💎 Database Seeding & Curated Catalog (`seed.ts`)

File: [`prisma/seed.ts`](file:///Users/mayanksaxena/aura-jewelry/prisma/seed.ts)

Injects **8 highly artistic, uniquely named Indian jewelry masterpieces**:

| ID | Masterpiece Name | Category | Materiality | Price (INR) | Original MRP | Hallmark / Warranty |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **001** | **The Molten Kada Cuff** | Anatomical Kadas & Cuffs | 18K Gold Vermeil & 925 Silver | **₹4,899** | ~~₹6,999~~ (30% off) | BIS 925 / Lifetime Warranty |
| **002** | **Tear of Saturn Moissanite Ring** | Statement Rings & Solitaires | 2.0ct VVS1 Moissanite, 18K Pale Gold | **₹6,499** | ~~₹8,999~~ (28% off) | GRA Certified / Lifetime Brilliance |
| **003** | **Indus Vertebrae Choker** | Haslis & Sculptural Chokers | Blackened Titanium & Black Moissanite | **₹8,999** | ~~₹12,499~~ (28% off) | BIS 925 / Structural Warranty |
| **004** | **The Kashi Void Talisman** | Negative Space Ear Cuffs | 18K Rose Gold Vermeil & Japanese Silk | **₹3,799** | ~~₹5,299~~ (28% off) | BIS 925 / Anti-Tarnish |
| **005** | **Surya Arc Ear Sculpture** | Negative Space Ear Cuffs | 22K Rich Gold Vermeil (No-Piercing) | **₹3,299** | ~~₹4,499~~ (27% off) | BIS 925 / 12h Ergonomic Fit |
| **006** | **Liquid Mercury Hasli Torque** | Haslis & Sculptural Chokers | Triple Rhodium Plated BIS 925 Silver | **₹7,499** | ~~₹10,499~~ (29% off) | BIS 925 / Mirror Polish |
| **007** | **Eclipse Onyx Signet Ring** | Statement Rings & Solitaires | Natural Matte Black Onyx & Moissanite | **₹4,199** | ~~₹5,999~~ (30% off) | BIS 925 / Anti-Tarnish |
| **008** | **Tectonic Horizon Bangle** | Anatomical Kadas & Cuffs | Brushed 18K Gold Vermeil & Smoky Quartz | **₹5,499** | ~~₹7,899~~ (30% off) | BIS 925 / Lifetime Guarantee |

---

## 🔌 Backend API Routes & Server Actions

### 1. `GET /api/products`
File: [`app/api/products/route.ts`](file:///Users/mayanksaxena/aura-jewelry/app/api/products/route.ts)
- Supports query parameters:
  - `?category=<slug>`: Filter by discipline.
  - `?q=<search_query>`: Search product name, description, and metallurgy.
  - `?sort=price-asc|price-desc|featured`: Sort order.
- Returns JSON array with zero layout shift.

### 2. `POST /api/checkout`
File: [`app/api/checkout/route.ts`](file:///Users/mayanksaxena/aura-jewelry/app/api/checkout/route.ts)
- Validates Indian buyer data: Customer name, email, 10-digit mobile number, street address, 6-digit PIN code, state, and payment method (`UPI`, `COD`, `CARD`, `NETBANKING`).
- Validates line item pricing against database catalog.
- Creates transactional `Order` and `OrderItem` records via Prisma ORM.
- Generates archival confirmation number (`AUR-IN-XXXXXX`).

### 3. Server Actions & Prisma Singleton
Files: [`lib/prisma.ts`](file:///Users/mayanksaxena/aura-jewelry/lib/prisma.ts), [`lib/actions.ts`](file:///Users/mayanksaxena/aura-jewelry/lib/actions.ts)
- Development-safe singleton prevents multiple connection pools on hot reload.
- Server actions (`getProducts`, `getProductBySlug`, `createOrder`, `getCategories`) include graceful in-memory fallbacks so the app renders immediately without database configuration hurdles.

---

## 🖼️ Resilient Image System with Generative Fallbacks

File: [`components/ui/artistic-image.tsx`](file:///Users/mayanksaxena/aura-jewelry/components/ui/artistic-image.tsx)

### Critical Image Resilience Requirement
- **Images must NEVER appear broken**.
- If a remote photo fails to load or experiences a network error, the component seamlessly transitions to a **Generative Architectural SVG Canvas**:
  - Deep obsidian background with radial gold-flecked gradients.
  - Fine-line geometric vector wireframes and molten contours.
  - Archival typography displaying the specimen name, casting coordinates, and hallmarking badge.
- **Editorial Photoshoot Grade Filter**: Applied across all imagery via CSS (`contrast-[1.08] saturate-[0.88] brightness-[0.98]`) ensuring consistent high-contrast, dramatic lighting.

---

## 🇮🇳 The Indian Consumer Experience (Palmonas Model)

| Feature | Implementation in AURA | Why It Drives Indian Conversions |
| :--- | :--- | :--- |
| **Pricing in INR (`₹`)** | Formatted via `Intl.NumberFormat('en-IN')` | Builds local trust and removes USD/EUR cognitive conversion friction |
| **Strike-Through MRP** | e.g. **₹4,899** <span style="text-decoration:line-through">₹6,999</span> (30% OFF) | High conversion driver in Indian direct-to-consumer jewelry |
| **100% Waterproof** | Prominent droplet icon and test callouts on PDP | Safe to wear in Indian monsoons, daily hot showers, and workouts |
| **Lifetime Anti-Tarnish** | Free replating certificate tab | Eliminates fear of gold plating wearing off or blackening |
| **Govt-Certified BIS 925** | Prominent BIS hallmark badge on every piece | The gold standard of silver purity assurance in India |
| **PIN Code Delivery Check** | Interactive 6-digit PIN input with real-time ETA | Customers immediately verify courier turnaround (Blue Dart / Delhivery) |
| **5% Extra Off on UPI** | Direct discount on Google Pay, PhonePe, Paytm | Reduces COD returns (RTO) and encourages pre-paid checkouts |
| **Cash on Delivery (COD)** | Full COD support in drawer & checkout | Critical for first-time buyers in Tier-1, Tier-2, and Tier-3 Indian cities |

---

## 🖥️ Frontend Components & Page Flow

### 1. Immersive Parallax Hero & 4-Pillar Trust Bar
- **Parallax Hero**: Slow-moving atmospheric background visual, massive display typography (**SCULPTED FOR EVERYDAY**), archival dispatch coordinates (`MUMBAI — DELHI — BENGALURU`).
- **4-Pillar Trust Bar**:
  1. *100% Waterproof* (Wear in shower, pool & gym)
  2. *Anti-Tarnish Warranty* (Free lifetime replating promise)
  3. *BIS 925 Hallmarked* (Govt certified pure silver core)
  4. *Free Express & COD* (Pan-India delivery in 2-4 days)

### 2. The Manifesto & Curated Masonry Gallery
- **Editorial Manifesto**: Viewport-triggered reveal quotes on modern Indian craftsmanship and Rajasthan metallurgy.
- **Asymmetrical Gallery**: Staggered masonry layout pairing vertical monoliths (7 columns) with offset vertical details (5 columns), replacing boring standard grids.

### 3. The Atelier (Shop & Filter Sidebar)
- **Minimalist Sidebar**:
  - Live index search.
  - Discipline filter (Kadas, Statement Rings, Haslis, Ear Cuffs).
  - Material filter (18K Gold Vermeil, BIS 925, Moissanite, Titanium, Onyx, Smoky Quartz).
  - Price sequence sort (Low to High, High to Low, Archival Priority).
- **Product Cards**: Raw exhibition artwork without boxy borders, revealing title, metal, strike-through MRP, and instant "Add to Bag" on hover.

### 4. Cinematic Product Detail Page (PDP)
- **Left Column**: Full-viewport height stacked macro plates (model fit, material close-up, back profile) with smooth sticky scrolling.
- **Right Column (Sticky Dossier)**:
  - Title, BIS Hallmark tag, and stock dispatch notice.
  - Price in INR with discount pill.
  - 3-Badge Pill (Waterproof, Anti-Tarnish, BIS 925).
  - **Interactive 6-Digit PIN Code Delivery Checker**.
  - Accordion for *Lifetime Anti-Tarnish & Hallmarking*, *Materiality & Gemstones*, and *Dimensions & Sizing Guide*.
  - Quantity selector and **Add to Bag** CTA.

### 5. Dark-Mode Side Bag (Cart Drawer)
- Slides in from the right via Framer Motion spring physics.
- **Free Pan-India Delivery Progress Meter**: Dynamically tracks progress towards unlocking free express shipping (`Add ₹X more to unlock FREE Express Delivery`).
- Quantity stepper, piece thumbnail, and item removal.
- Subtotal breakdown: Includes 3% GST and certified hallmarking packaging.

### 6. Express Indian Checkout & Confirmation
- **Collector Credentials**: Full name, email for BIS invoice, and 10-digit mobile number for WhatsApp delivery updates.
- **Delivery Address**: Street address, 6-digit Indian PIN code, city, and state selector covering 14 Indian states.
- **Payment Selection**:
  - **UPI / GPay / PhonePe / Paytm** (Unlocks instant 5% pre-paid discount).
  - **Cash on Delivery (COD)** (Pay at doorstep via cash or delivery agent UPI QR).
  - **Cards / RuPay** (Credit & Debit).
  - **NetBanking** (All major Indian banks).
- **Archival Certificate Receipt**: Displays order reference (`AUR-IN-XXXXXX`), customer details, dispatch status, and Blue Dart tracking notice.

---

## 🚀 Verification, Build & Commands

### Running Locally
To launch the active development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience the live application.

### Building for Production
To validate TypeScript types, bundle size, and build correctness:
```bash
npm run build
```
*Current build status*: **Built successfully in 634ms with 0 errors**.

### Seeding the Database
To populate the 8 Indian jewelry pieces in your Prisma database:
```bash
npx tsx prisma/seed.ts
```

---

## 📜 Copyright & Legal
© 2026 AURA JEWELLERY INDIA PVT LTD. All Rights Reserved.  
*Salon Privé: Bandra West, Mumbai | Atelier: C-Scheme, Jaipur & Indiranagar, Bengaluru.*
