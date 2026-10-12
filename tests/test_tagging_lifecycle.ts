import { PRODUCTS } from '../lib/data';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('--- TESTING TAGGING & CATEGORY ADDING / REMOVING & SECTION REFLECTION ---');

// Simulated ShopView filter function matching App.jsx logic
function filterBySection(products: any[], selectedCategory: string) {
  let list = [...products];
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
      list = list.filter(
        (p) =>
          p.category === 'minimalist' ||
          p.categorySlug === 'minimalist' ||
          (Array.isArray(p.collections) && p.collections.includes('minimalist')) ||
          (Array.isArray(p.tags) && p.tags.includes('minimalist')) ||
          p.occasionVibe === 'Minimalist'
      );
    } else if (selectedCategory === 'statement') {
      list = list.filter(
        (p) =>
          p.category === 'statement' ||
          p.categorySlug === 'statement' ||
          (Array.isArray(p.collections) && p.collections.includes('statement')) ||
          (Array.isArray(p.tags) && p.tags.includes('statement')) ||
          p.occasionVibe === 'Statement'
      );
    } else if (selectedCategory === 'moissanite') {
      list = list.filter(
        (p) =>
          p.category === 'moissanite' ||
          p.categorySlug === 'moissanite' ||
          (Array.isArray(p.collections) && p.collections.includes('moissanite')) ||
          (Array.isArray(p.tags) && p.tags.includes('moissanite'))
      );
    } else if (selectedCategory === 'pearl') {
      list = list.filter(
        (p) =>
          p.category === 'pearl' ||
          p.categorySlug === 'pearl' ||
          (Array.isArray(p.collections) && p.collections.includes('pearl')) ||
          (Array.isArray(p.tags) && (p.tags.includes('pearl') || p.tags.includes('freshwater-pearls')))
      );
    } else if (selectedCategory === 'gifting') {
      list = list.filter(
        (p) =>
          p.category === 'gifting' ||
          p.categorySlug === 'gifting' ||
          (Array.isArray(p.collections) && p.collections.includes('gifting')) ||
          (Array.isArray(p.tags) && (p.tags.includes('gifting') || p.tags.includes('rakhi') || p.tags.includes('birthday') || p.tags.includes('anniversary') || p.tags.includes('bridesmaid'))) ||
          p.occasionVibe === 'Gifting'
      );
    }
  }
  return list;
}

// 1. Initial counts
const initialMin = filterBySection(PRODUCTS, 'minimalist');
const initialStmt = filterBySection(PRODUCTS, 'statement');
const initialMoiss = filterBySection(PRODUCTS, 'moissanite');
const initialPearl = filterBySection(PRODUCTS, 'pearl');

assert(initialMin.length === 14, `Initial Minimalist section has 14 products (got ${initialMin.length})`);
assert(initialStmt.length === 12, `Initial Statement section has 12 products (got ${initialStmt.length})`);
assert(initialMoiss.length === 6, `Initial Moissanite section has 6 products (got ${initialMoiss.length})`);
assert(initialPearl.length === 5, `Initial Pearl section has 5 products (got ${initialPearl.length})`);

// 2. Simulate moving a product (prod-001) from Minimalist to Statement in Catalogue
let modifiedProducts = PRODUCTS.map((p) => {
  if (p.id === 'prod-001') {
    return {
      ...p,
      category: 'statement',
      categorySlug: 'statement-jewellery',
      collections: p.collections.filter((c: string) => c !== 'minimalist').concat('statement'),
      tags: (p.tags || []).filter((t: string) => t !== 'minimalist').concat('statement'),
    };
  }
  return p;
});

const movedMin = filterBySection(modifiedProducts, 'minimalist');
const movedStmt = filterBySection(modifiedProducts, 'statement');

assert(!movedMin.some((p) => p.id === 'prod-001'), 'prod-001 successfully REMOVED from Minimalist section');
assert(movedMin.length === 13, `Minimalist section now has 13 products (got ${movedMin.length})`);
assert(movedStmt.some((p) => p.id === 'prod-001'), 'prod-001 successfully ADDED to Statement section');
assert(movedStmt.length === 13, `Statement section now has 13 products (got ${movedStmt.length})`);

// 3. Simulate untagging Pearl from prod-002
modifiedProducts = modifiedProducts.map((p) => {
  if (p.id === 'prod-002') {
    return {
      ...p,
      category: 'minimalist',
      categorySlug: 'minimalist-jewellery',
      collections: p.collections.filter((c: string) => c !== 'pearl'),
      tags: (p.tags || []).filter((t: string) => t !== 'pearl' && t !== 'freshwater-pearls'),
    };
  }
  return p;
});

const untaggedPearl = filterBySection(modifiedProducts, 'pearl');
assert(!untaggedPearl.some((p) => p.id === 'prod-002'), 'prod-002 successfully REMOVED from Pearl section after untagging');
assert(untaggedPearl.length === 4, `Pearl section now has 4 products (got ${untaggedPearl.length})`);

// 4. Simulate adding Moissanite tag to prod-003
modifiedProducts = modifiedProducts.map((p) => {
  if (p.id === 'prod-003') {
    return {
      ...p,
      collections: [...p.collections, 'moissanite'],
      tags: [...(p.tags || []), 'moissanite'],
    };
  }
  return p;
});

const taggedMoiss = filterBySection(modifiedProducts, 'moissanite');
assert(taggedMoiss.some((p) => p.id === 'prod-003'), 'prod-003 successfully ADDED to Moissanite section after tagging');
assert(taggedMoiss.length === 7, `Moissanite section now has 7 products (got ${taggedMoiss.length})`);

// 5. Test localStorage hydration preservation simulation
const authenticMap = new Map(PRODUCTS.map((p) => [p.id, p]));
const hydratedFromStorage = modifiedProducts.map((p) => {
  const canonical = authenticMap.get(p.id)!;
  return {
    ...canonical,
    ...p,
    name: p.name || canonical.name,
    description: p.description || canonical.description,
    category: p.category || canonical.category,
    categorySlug: p.categorySlug || canonical.categorySlug,
    subcategory: p.subcategory !== undefined ? p.subcategory : canonical.subcategory,
    collections: Array.isArray(p.collections) ? p.collections : (canonical.collections || []),
    tags: Array.isArray(p.tags) ? p.tags : (canonical.tags || []),
    isNew: p.isNew !== undefined ? p.isNew : canonical.isNew,
  };
});

const hydratedProd001 = hydratedFromStorage.find((p) => p.id === 'prod-001')!;
assert(hydratedProd001.category === 'statement', 'Hydration preserved modified category statement for prod-001');
assert(hydratedProd001.collections.includes('statement'), 'Hydration preserved modified collections statement for prod-001');
assert(!hydratedProd001.collections.includes('minimalist'), 'Hydration did NOT resurrect minimalist collection for prod-001');

const hydratedProd002 = hydratedFromStorage.find((p) => p.id === 'prod-002')!;
assert(!hydratedProd002.collections.includes('pearl'), 'Hydration did NOT resurrect untagged pearl collection for prod-002');

console.log('\n🎉 ALL TAGGING LIFECYCLE AND SECTION REFLECTION TESTS PASSED! 🎉');
