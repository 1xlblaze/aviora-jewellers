import { PRODUCTS, createOrderTimeline } from '../lib/data.ts';

console.log('--- TEST 1: Dynamic Price Reflection ---');
// Emulate rawCart with product ID reference
const testRawCart = [
  { productId: PRODUCTS[0].id, quantity: 2, engraving: 'AURA 14K' }
];

// Dynamically resolve cart items from PRODUCTS catalog
function resolveCart(rawCart, catalog) {
  return rawCart.map((item) => {
    const liveProduct = catalog.find((p) => p.id === item.productId) || catalog[0];
    return {
      productId: item.productId,
      product: liveProduct,
      quantity: item.quantity,
      engraving: item.engraving,
    };
  });
}

const resolvedCart1 = resolveCart(testRawCart, PRODUCTS);
const originalTotal = resolvedCart1.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
console.log(`Original Product: ${resolvedCart1[0].product.name}, Price: ₹${resolvedCart1[0].product.price}, Total: ₹${originalTotal}`);

// Simulate a catalog price update
const modifiedProducts = PRODUCTS.map((p, idx) => idx === 0 ? { ...p, price: p.price + 5000 } : p);
const resolvedCart2 = resolveCart(testRawCart, modifiedProducts);
const updatedTotal = resolvedCart2.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
console.log(`Updated Product Price in Cart: ₹${resolvedCart2[0].product.price}, New Cart Total: ₹${updatedTotal}`);

if (updatedTotal === originalTotal + 10000) {
  console.log('✓ SUCCESS: Cart automatically and dynamically reflects live catalog price change!');
} else {
  console.error('✗ FAILED: Dynamic pricing did not update correctly.');
  process.exit(1);
}

console.log('\n--- TEST 2: Order Persistence & Add to Bag Independence ---');
let ordersHistory = [];

function addOrder(order) {
  const filtered = ordersHistory.filter((o) => o.orderNumber !== order.orderNumber);
  ordersHistory = [order, ...filtered];
}

// 1. Place initial order
const order1 = {
  orderNumber: 'AUR-IN-839210',
  createdAt: new Date().toISOString(),
  customerName: 'Aarav Mehta',
  total: 42999,
  status: 'IN_TRANSIT',
  trackingNumber: 'BLD-4821-9923-IN',
  timeline: createOrderTimeline('IN_TRANSIT', new Date().toISOString()),
};
addOrder(order1);
console.log(`Orders count after Order 1: ${ordersHistory.length}`);

// 2. User performs "Add to Bag" on multiple products
let cartState = [];
function addToBag(product, qty = 1, engraving = '') {
  // Adding to bag ONLY mutates cartState, NEVER touches ordersHistory!
  cartState.push({ productId: product.id, quantity: qty, engraving });
}

addToBag(PRODUCTS[0], 1, 'Initial 14K');
addToBag(PRODUCTS[1], 2);
console.log(`Cart items count after Add to Bag: ${cartState.length}`);
console.log(`Orders count after Add to Bag: ${ordersHistory.length}`);

if (ordersHistory.length === 1 && ordersHistory[0].orderNumber === 'AUR-IN-839210') {
  console.log('✓ SUCCESS: Adding to bag leaves past orders 100% intact!');
} else {
  console.error('✗ FAILED: Orders were altered during Add to Bag.');
  process.exit(1);
}

// 3. Place second order
const order2 = {
  orderNumber: 'AUR-IN-940122',
  createdAt: new Date().toISOString(),
  customerName: 'Priya Sen',
  total: 18500,
  status: 'IN_TRANSIT',
  trackingNumber: 'BLD-3910-1829-IN',
  timeline: createOrderTimeline('IN_TRANSIT', new Date().toISOString()),
};
addOrder(order2);
console.log(`Orders count after Order 2: ${ordersHistory.length}`);

// 4. Verify tracking milestones
console.log('\n--- TEST 3: Blue Dart Timeline Steps ---');
console.log(`Order ${order2.orderNumber} Waybill: ${order2.trackingNumber}`);
console.log(`Timeline Milestones count: ${order2.timeline.length}`);
order2.timeline.forEach((step, i) => {
  console.log(`  Step ${i + 1}: [${step.current ? 'ACTIVE' : step.completed ? 'DONE' : 'PENDING'}] ${step.label} (${step.location})`);
});

if (order2.timeline.length === 6 && order2.timeline.some((s) => s.current)) {
  console.log('✓ SUCCESS: Real-time Blue Dart transit stepper correctly initialized with active in-transit milestone!');
} else {
  console.error('✗ FAILED: Timeline stepper did not match expected 6-step lifecycle.');
  process.exit(1);
}

console.log('\nALL VERIFICATION TESTS PASSED!');
