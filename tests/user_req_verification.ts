import { PRODUCTS, CATEGORIES, STORE_CONFIG } from '../lib/data';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('--- RUNNING USER REQUIREMENT VERIFICATIONS ---');

// 1. Check prod-014 test case
const prod014 = PRODUCTS.find((p) => p.id === 'prod-014');
assert(!!prod014, 'Product prod-014 found in catalog');
console.log(`prod-014: ${prod014?.name}`);
console.log(`prod-014 collections: ${JSON.stringify(prod014?.collections)}`);
console.log(`prod-014 tags: ${JSON.stringify(prod014?.tags)}`);

// Test case checks:
// Minimalist jewellery can have pearl bracelet:
const appearsUnderMinimalist =
  (prod014?.collections?.includes('minimalist') || prod014?.category === 'minimalist') &&
  (prod014?.tags?.includes('bracelets') || prod014?.subcategory === 'bracelets');
assert(Boolean(appearsUnderMinimalist), 'Test case: prod-014 is discoverable under Minimalist with "bracelets" tag');

// Pearl collection has freshwater pearl jewellery:
const appearsUnderPearlFreshwater =
  (prod014?.collections?.includes('pearl') || prod014?.category === 'pearl') &&
  (prod014?.tags?.includes('freshwater-pearls') || prod014?.materials?.includes('freshwater-pearls'));
assert(Boolean(appearsUnderPearlFreshwater), 'Test case: prod-014 is discoverable under Pearl Collection with "freshwater-pearls" tag');

// Also pearl bracelet in pearl collection:
const appearsUnderPearlBracelet =
  (prod014?.collections?.includes('pearl') || prod014?.category === 'pearl') &&
  (prod014?.tags?.includes('bracelets') || prod014?.subcategory === 'bracelets');
assert(Boolean(appearsUnderPearlBracelet), 'Test case: prod-014 is discoverable under Pearl Collection with "bracelets" tag');

// 2. Check Categories and subcategories/tags taxonomy
const minCat = CATEGORIES.find((c) => c.id === 'minimalist');
assert(!!minCat, 'Minimalist category taxonomy defined');
const minSub = (minCat?.subcategories || []).map((s) => s.slug);
['necklaces', 'earrings', 'rings', 'bracelets', 'anklets'].forEach((tag) => {
  assert(minSub.includes(tag), `Minimalist includes tag ${tag}`);
});
assert(!minSub.includes('sets'), 'Sets filter removed from Minimalist');

const stmtCat = CATEGORIES.find((c) => c.id === 'statement');
assert(!!stmtCat, 'Statement category taxonomy defined');
const stmtSub = (stmtCat?.subcategories || []).map((s) => s.slug);
['necklaces', 'earrings', 'rings', 'bracelets', 'anklets'].forEach((tag) => {
  assert(stmtSub.includes(tag), `Statement includes tag ${tag}`);
});
assert(!stmtSub.includes('sets'), 'Sets filter removed from Statement');

const moisCat = CATEGORIES.find((c) => c.id === 'moissanite');
assert(!!moisCat, 'Moissanite category taxonomy defined');
const moisSub = (moisCat?.subcategories || []).map((s) => s.slug);
assert(moisSub.includes('gra-certified'), 'Moissanite includes gra-certified');

const pearlCat = CATEGORIES.find((c) => c.id === 'pearl');
assert(!!pearlCat, 'Pearl category taxonomy defined');
const pearlSub = (pearlCat?.subcategories || []).map((s) => s.slug);
assert(pearlSub.includes('freshwater-pearls'), 'Pearl includes freshwater-pearls');

const giftCat = CATEGORIES.find((c) => c.id === 'gifting');
assert(!!giftCat, 'Gifting category taxonomy defined');
const giftSub = (giftCat?.subcategories || []).map((s) => s.slug);
['rakhi', 'birthday', 'anniversary', 'bridesmaid'].forEach((tag) => {
  assert(giftSub.includes(tag), `Gifting includes tag ${tag}`);
});

// 3. Check App.jsx code integrity for PDP sticky scroll, aspect ratio, and admin scroll
const appJsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf-8');

// Admin modal max-h and overflow
assert(appJsx.includes('max-h-[92vh]') && appJsx.includes('flex flex-col') && appJsx.includes('overflow-hidden'), 'Admin Edit Product modal has bounded height and flex col layout');
assert(appJsx.includes('flex-1 overflow-y-auto') && appJsx.includes('custom-scrollbar'), 'Admin Edit Product modal body is independently scrollable with custom-scrollbar');

// Studio gallery reordering & front cover controls
assert(appJsx.includes('★ Front'), 'Studio gallery contains ★ Front cover promotion button');
assert(appJsx.includes('COVER 01'), 'Studio gallery highlights Angle 01 as primary COVER');
assert(appJsx.includes('_addToFront'), 'Studio gallery provides _addToFront front-cover toggle');

// PDP aspect ratio & description
assert(appJsx.includes('aspect-[4/5] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[85vh]'), 'PDP uses aspect-[4/5] on mobile to prevent empty bottom whitespace');
assert(appJsx.includes('product.description'), 'PDP renders product description in main view');

// PDP right side sticky scroll fix
assert(appJsx.includes('lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto overscroll-contain pr-2 space-y-7 custom-scrollbar'), 'PDP right column has sticky self-start with internal scroll to avoid getting stuck');

// Mobile track button responsive wrapping
assert(appJsx.includes('flex flex-wrap items-center justify-start sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto'), 'Patron order tracking row uses flex-wrap to prevent overflowing mobile screens');

// 4. Check duplicate images removal & sticky white strip fix
assert(!appJsx.includes('ALL {product.images.length} ANGLES IN HIGH-RESOLUTION'), 'Duplicate "ALL X ANGLES IN HIGH-RESOLUTION" continuous plates removed');
assert(!appJsx.includes('Full High-Resolution Exhibition Plates (Continuous Scroll)'), 'Continuous scroll duplicate exhibition plates removed');
assert(!appJsx.includes('sticky top-24 z-30 flex items-center justify-between bg-[var(--bg-card)]/90'), 'Angle indicator bar is non-sticky so white strip does not linger during scroll');

// 5. Check Curatorial Description typography & styling
assert(appJsx.includes('Atelier Curatorial Description'), 'PDP features Atelier Curatorial Description');
assert(appJsx.includes('font-playfair italic'), 'PDP description uses font-playfair italic for attractive editorial typography');
assert(appJsx.includes('Atelier Edition'), 'PDP description includes Atelier Edition archival badge');

// 6. Check color styling in index.css
const indexCss = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
assert(indexCss.includes('--bg-primary: #f6f2ea'), 'index.css sets warm champagne ivory background');
assert(indexCss.includes('--brand-forest: #0d281e'), 'index.css sets brand forest dark green');
assert(indexCss.includes('.font-playfair'), 'index.css includes .font-playfair class');

// 7. Check New Arrivals tagging & filtering integrity
assert(appJsx.includes("p.category === 'new-arrivals' ||"), 'AtelierView new-arrivals filter checks category, collections, and tags');
assert(!appJsx.includes("p.collections?.includes('new-arrivals') || true"), 'Removed buggy || true from new-arrivals filter');
assert(appJsx.includes("isNew: isNewFlag"), 'Admin handleSaveEdit persists isNew based on collections and tags');
assert(appJsx.includes("Array.isArray(editingProduct.tags)") && appJsx.includes("tags,"), 'Admin handleSaveEdit persists tags in product record');

// 8. Check Mobile Controls Bar & Description Readability
assert(appJsx.includes('flex sm:hidden items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1'), 'AtelierView provides dedicated mobile horizontal swipeable tag chips strip');
assert(appJsx.includes('bg-[#fdfbf7] dark:bg-[#1a221e]'), 'Curatorial description uses warm luminous cream in light mode and forest pine in dark mode without black background');
assert(!appJsx.includes('dark:from-[#191e1b] dark:via-[#151917] dark:to-[#101412]'), 'Black void background removed from curatorial description');

// Test: Section 5 Everyday Edit image formatting fix
assert(appJsx.includes('aspect-[4/3] sm:aspect-[16/11]'), 'Section 5 image uses responsive aspect framing without awkward mobile stretching');
assert(appJsx.includes('Atelier Exhibit // 14K Whitish Gold'), 'Section 5 image includes Atelier Exhibit badge overlay');

// Test: Universal eye-catching editorial typography
assert(appJsx.includes('font-editorial text-base sm:text-lg text-[var(--text-secondary)]'), 'Section 5 editorial text uses font-editorial styling');
assert(appJsx.includes('border-l-2 border-[#b38f56] dark:border-[#e6ca97]/70 pl-4 py-1'), 'Our Story and Text sections use gold editorial accent borders');
assert(appJsx.includes('font-serif text-[14.5px] sm:text-[15.5px] text-[var(--text-secondary)] leading-[1.85]'), 'Manifesto narrative uses high-legibility serif leading-[1.85]');
assert(appJsx.includes('font-editorial text-[15px] sm:text-[17px] text-[var(--text-primary)] leading-[1.85]'), 'Interactive Pillars dossier uses font-editorial typography');

// Test: Hero Section Mobile Alignment & Centering
assert(appJsx.includes('flex justify-center md:justify-start'), 'Hero container centers card symmetrically on mobile');
assert(appJsx.includes('w-full max-w-lg bg-[#fffdfa]/95 dark:bg-[#121915]/95 backdrop-blur-md'), 'Hero card has w-full and luxury glassmorphism background');
assert(!appJsx.includes('dark:bg-[#141816]'), 'Pitch-black void background removed from Hero card');

// Test: Announcement Header Bar Responsive Layout
assert(appJsx.includes('flex flex-col sm:flex-row items-center justify-center'), 'Announcement bar wraps into clean lines on mobile without truncation');
assert(appJsx.includes('Pan-India Shipping'), 'Announcement bar includes visible Pan-India shipping link');

console.log('\n🎉 ALL USER REQUIREMENTS FULLY VERIFIED AND PASSING! 🎉');

