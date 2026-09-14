import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://kqolyvmwcsqilnakuewt.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb2x5dm13Y3NxaWxuYWt1ZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDA3OTEsImV4cCI6MjA5Mjk3Njc5MX0.S55kkJmt7temy86iOarGf4bo-AwgUew-5tEzSj_0lw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all Aviora categories from Supabase
 */
export async function fetchCategoriesFromDb() {
  const { data, error } = await supabase
    .from('aviora_categories')
    .select('*')
    .order('name');
  if (error) {
    console.warn('Supabase fetchCategories error:', error);
    return null;
  }
  return data;
}

/**
 * Fetch all Aviora products from Supabase
 */
export async function fetchProductsFromDb() {
  const { data, error } = await supabase
    .from('aviora_products')
    .select('*')
    .order('created_at');
  if (error) {
    console.warn('Supabase fetchProducts error:', error);
    return null;
  }
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    subtitle: p.subtitle || '',
    price: Number(p.price),
    originalPrice: Number(p.original_price || p.price),
    currency: p.currency || 'INR',
    description: p.description || '',
    editorialNote: p.editorial_note || '',
    edition: p.edition || '',
    material: p.material || '14K Gold Vermeil over 925 Silver',
    goldPurity: p.gold_purity || '14K Gold Vermeil',
    colorTone: p.color_tone || 'Champagne Gold',
    metalColorHex: p.metal_color_hex || '#E6CA97',
    occasionVibe: p.occasion_vibe || 'Everyday Wear',
    dimensions: p.dimensions || '',
    weight: p.weight || '',
    craftsmanship: p.craftsmanship || '',
    images: Array.isArray(p.images) ? p.images : [],
    modelImage: p.model_image || (Array.isArray(p.images) && p.images[1]) || '',
    videoUrl: p.video_url || '',
    featured: Boolean(p.featured),
    inStock: Boolean(p.in_stock ?? true),
    inventory: Number(p.inventory ?? 5),
    isEngravable: Boolean(p.is_engravable),
    categorySlug: p.category_slug || 'anatomical-kadas-cuffs',
    categoryName: p.category_slug === 'anatomical-kadas-cuffs' ? 'Anatomical Kadas & Cuffs'
      : p.category_slug === 'architectural-signets' ? 'Architectural Signets'
      : p.category_slug === 'sculptural-chokers-haslis' ? 'Haslis & Sculptural Chokers'
      : 'Negative Space Ear Cuffs',
    hallmark: p.hallmark || 'BIS Hallmarked 925 Pure Silver',
    warranty: p.warranty || 'Lifetime Anti-Tarnish Warranty',
    pairsWithId: p.pairs_with_id || undefined,
    upsellReason: p.upsell_reason || '',
  }));
}

/**
 * Save newly placed order to Supabase
 */
export async function persistOrderToDb(order: any) {
  try {
    const { data, error } = await supabase.from('aviora_orders').insert([
      {
        order_number: order.orderNumber,
        customer_name: order.customerName,
        customer_email: order.customerEmail || '',
        customer_phone: order.customerPhone || '',
        shipping_address: order.shippingAddress,
        city: order.city,
        state: order.state,
        postal_code: order.postalCode,
        country: order.country || 'India',
        payment_method: order.paymentMethod,
        subtotal: order.subtotal || order.total,
        discount: order.discount || 0,
        total: order.total,
        currency: order.currency || 'INR',
        status: order.status || 'IN_TRANSIT',
        courier: order.courier || 'Blue Dart Express Air',
        tracking_number: order.trackingNumber || '',
        estimated_delivery: order.estimatedDelivery || '2-3 Business Days',
        items: order.items || [],
        timeline: order.timeline || [],
      },
    ]);
    if (error) console.warn('Failed to sync order to Supabase:', error);
    return data;
  } catch (err) {
    console.warn('Supabase persistOrder error:', err);
    return null;
  }
}

/**
 * Add a new product to Supabase
 */
export async function addProductToDb(product: any) {
  try {
    const { data, error } = await supabase.from('aviora_products').insert([
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        subtitle: product.subtitle || '',
        price: product.price,
        original_price: product.originalPrice || product.price,
        currency: product.currency || 'INR',
        description: product.description || '',
        editorial_note: product.editorialNote || '',
        edition: product.edition || '',
        material: product.material,
        gold_purity: product.goldPurity || '14K Gold Vermeil',
        color_tone: product.colorTone || 'Champagne Gold',
        metal_color_hex: product.metalColorHex || '#E6CA97',
        occasion_vibe: product.occasionVibe || 'Everyday Wear',
        dimensions: product.dimensions || '',
        weight: product.weight || '',
        craftsmanship: product.craftsmanship || '',
        images: product.images || [],
        model_image: product.modelImage || '',
        featured: Boolean(product.featured),
        in_stock: Boolean(product.inStock ?? true),
        inventory: product.inventory ?? 5,
        is_engravable: Boolean(product.isEngravable),
        category_slug: product.categorySlug || 'anatomical-kadas-cuffs',
        hallmark: product.hallmark || 'BIS Hallmarked 925 Pure Silver',
        warranty: product.warranty || 'Lifetime Anti-Tarnish Warranty',
        pairs_with_id: product.pairsWithId || null,
        upsell_reason: product.upsellReason || '',
      },
    ]);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase addProduct error:', err);
    return { success: false, error: err };
  }
}

/**
 * Update an existing product in Supabase
 */
export async function updateProductInDb(productId: string, updates: any) {
  try {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.slug !== undefined) dbPayload.slug = updates.slug;
    if (updates.subtitle !== undefined) dbPayload.subtitle = updates.subtitle;
    if (updates.price !== undefined) dbPayload.price = updates.price;
    if (updates.originalPrice !== undefined) dbPayload.original_price = updates.originalPrice;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.editorialNote !== undefined) dbPayload.editorial_note = updates.editorialNote;
    if (updates.edition !== undefined) dbPayload.edition = updates.edition;
    if (updates.material !== undefined) dbPayload.material = updates.material;
    if (updates.goldPurity !== undefined) dbPayload.gold_purity = updates.goldPurity;
    if (updates.colorTone !== undefined) dbPayload.color_tone = updates.colorTone;
    if (updates.metalColorHex !== undefined) dbPayload.metal_color_hex = updates.metalColorHex;
    if (updates.occasionVibe !== undefined) dbPayload.occasion_vibe = updates.occasionVibe;
    if (updates.dimensions !== undefined) dbPayload.dimensions = updates.dimensions;
    if (updates.weight !== undefined) dbPayload.weight = updates.weight;
    if (updates.craftsmanship !== undefined) dbPayload.craftsmanship = updates.craftsmanship;
    if (updates.images !== undefined) dbPayload.images = updates.images;
    if (updates.modelImage !== undefined) dbPayload.model_image = updates.modelImage;
    if (updates.featured !== undefined) dbPayload.featured = updates.featured;
    if (updates.inStock !== undefined) dbPayload.in_stock = updates.inStock;
    if (updates.inventory !== undefined) dbPayload.inventory = updates.inventory;
    if (updates.isEngravable !== undefined) dbPayload.is_engravable = updates.isEngravable;
    if (updates.categorySlug !== undefined) dbPayload.category_slug = updates.categorySlug;
    if (updates.hallmark !== undefined) dbPayload.hallmark = updates.hallmark;
    if (updates.warranty !== undefined) dbPayload.warranty = updates.warranty;
    if (updates.pairsWithId !== undefined) dbPayload.pairs_with_id = updates.pairsWithId;
    if (updates.upsellReason !== undefined) dbPayload.upsell_reason = updates.upsellReason;

    const { data, error } = await supabase
      .from('aviora_products')
      .update(dbPayload)
      .eq('id', productId);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase updateProduct error:', err);
    return { success: false, error: err };
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteProductFromDb(productId: string) {
  try {
    const { data, error } = await supabase
      .from('aviora_products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase deleteProduct error:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetch all orders from Supabase for Admin Order Fulfillment
 */
export async function fetchOrdersFromDb() {
  try {
    const { data, error } = await supabase
      .from('aviora_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone,
      shippingAddress: o.shipping_address,
      city: o.city,
      state: o.state,
      postalCode: o.postal_code,
      country: o.country,
      paymentMethod: o.payment_method,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      total: Number(o.total),
      currency: o.currency,
      status: o.status,
      courier: o.courier,
      trackingNumber: o.tracking_number,
      estimatedDelivery: o.estimated_delivery,
      items: o.items || [],
      timeline: o.timeline || [],
    }));
  } catch (err) {
    console.warn('Supabase fetchOrders error:', err);
    return [];
  }
}

/**
 * Update an order's status and tracking number in Supabase
 */
export async function updateOrderStatusInDb(
  orderNumber: string,
  status: string,
  trackingNumber?: string,
  timeline?: any[]
) {
  try {
    const updates: any = { status };
    if (trackingNumber) updates.tracking_number = trackingNumber;
    if (timeline) updates.timeline = timeline;

    const { data, error } = await supabase
      .from('aviora_orders')
      .update(updates)
      .eq('order_number', orderNumber);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase updateOrderStatus error:', err);
    return { success: false, error: err };
  }
}
