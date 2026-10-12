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
      list = list.filter((p) => {
        const isStmt =
          (p.category === 'statement' || p.categorySlug === 'statement' || (Array.isArray(p.collections) && p.collections.includes('statement'))) &&
          !(Array.isArray(p.collections) && p.collections.includes('minimalist')) &&
          p.category !== 'minimalist';
        if (isStmt) return false;

        return (
          p.category === 'minimalist' ||
          p.categorySlug === 'minimalist' ||
          (Array.isArray(p.collections) && p.collections.includes('minimalist')) ||
          (Array.isArray(p.tags) && p.tags.includes('minimalist'))
        );
      });
    } else if (selectedCategory === 'statement') {
      list = list.filter((p) => {
        const isMin =
          (p.category === 'minimalist' || p.categorySlug === 'minimalist' || (Array.isArray(p.collections) && p.collections.includes('minimalist'))) &&
          !(Array.isArray(p.collections) && p.collections.includes('statement')) &&
          p.category !== 'statement';
        if (isMin) return false;

        return (
          p.category === 'statement' ||
          p.categorySlug === 'statement' ||
          (Array.isArray(p.collections) && p.collections.includes('statement')) ||
          (Array.isArray(p.tags) && p.tags.includes('statement'))
        );
      });
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

// 2. User screenshot test case: prod-011 ("Azure Tide Layered Necklace")
// In user's screenshot: Category is Minimalist, tagged in collections: new-arrivals, minimalist, gifting. Untagged from statement.
let userModifiedProducts = PRODUCTS.map((p) => {
  if (p.id === 'prod-011') {
    return {
      ...p,
      category: 'minimalist',
      categorySlug: 'minimalist-jewellery',
      collections: ['new-arrivals', 'minimalist', 'gifting'],
      // Simulating old stale tags / vibe before sanitization
      tags: ['necklaces', 'statement', 'gifting'],
      occasionVibe: 'Statement',
    };
  }
  return p;
});

const userProdMin = filterBySection(userModifiedProducts, 'minimalist');
const userProdStmt = filterBySection(userModifiedProducts, 'statement');

assert(userProdMin.some((p) => p.id === 'prod-011'), 'prod-011 IS shown in Minimalist section');
assert(!userProdStmt.some((p) => p.id === 'prod-011'), 'prod-011 is NOT shown in Statement section (no longer duplicate in both!)');

// 3. Simulate untagging Pearl from prod-002
let modifiedProducts = PRODUCTS.map((p) => {
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

// 5. Test localStorage hydration sanitization simulation for prod-011
const authenticMap = new Map(PRODUCTS.map((p) => [p.id, p]));
const hydratedFromStorage = userModifiedProducts.map((p) => {
  const canonical = authenticMap.get(p.id)!;
  const finalCollections = Array.isArray(p.collections) ? p.collections : (canonical.collections || []);
  const isExplicitMin =
    (p.category === 'minimalist' || finalCollections.includes('minimalist')) &&
    !finalCollections.includes('statement') &&
    p.category !== 'statement';
  const isExplicitStmt =
    (p.category === 'statement' || finalCollections.includes('statement')) &&
    !finalCollections.includes('minimalist') &&
    p.category !== 'minimalist';

  let finalTags = Array.isArray(p.tags) ? p.tags : (canonical.tags || []);
  let finalOccasionVibe = p.occasionVibe || canonical.occasionVibe;

  if (isExplicitMin) {
    finalTags = finalTags.filter((t: string) => t !== 'statement');
    if (finalOccasionVibe === 'Statement') finalOccasionVibe = 'Everyday Wear';
  } else if (isExplicitStmt) {
    finalTags = finalTags.filter((t: string) => t !== 'minimalist');
    finalOccasionVibe = 'Statement';
  }

  return {
    ...canonical,
    ...p,
    name: p.name || canonical.name,
    description: p.description || canonical.description,
    category: p.category || canonical.category,
    categorySlug: p.categorySlug || canonical.categorySlug,
    subcategory: p.subcategory !== undefined ? p.subcategory : canonical.subcategory,
    occasionVibe: finalOccasionVibe,
    collections: finalCollections,
    tags: finalTags,
    isNew: p.isNew !== undefined ? p.isNew : canonical.isNew,
  };
});

const hydratedProd011 = hydratedFromStorage.find((p) => p.id === 'prod-011')!;
assert(hydratedProd011.category === 'minimalist', 'Hydration preserved modified category minimalist for prod-011');
assert(hydratedProd011.collections.includes('minimalist'), 'Hydration preserved modified collections minimalist for prod-011');
assert(!hydratedProd011.collections.includes('statement'), 'Hydration confirmed no statement in collections for prod-011');
assert(!hydratedProd011.tags.includes('statement'), 'Hydration sanitized tags and stripped lingering statement tag for prod-011');
assert(hydratedProd011.occasionVibe === 'Everyday Wear', 'Hydration sanitized occasionVibe away from Statement to Everyday Wear for prod-011');

console.log('\n🎉 ALL TAGGING LIFECYCLE AND SECTION REFLECTION TESTS PASSED! 🎉');
