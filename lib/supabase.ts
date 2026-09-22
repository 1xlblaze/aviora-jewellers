import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://kqolyvmwcsqilnakuewt.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb2x5dm13Y3NxaWxuYWt1ZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDA3OTEsImV4cCI6MjA5Mjk3Njc5MX0.S55kkJmt7temy86iOarGf4bo-AwgUew-5tEzSj_0lw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to compress and downscale images client-side before upload or fallback
 */
async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      file.arrayBuffer().then((buf) => {
        const b64 = Buffer.from(buf).toString('base64');
        const dataUrl = `data:${file.type || 'image/jpeg'};base64,${b64}`;
        resolve({ blob: file, dataUrl });
      }).catch(() => {
        resolve({ blob: file, dataUrl: '' });
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          canvas.toBlob(
            (blob) => {
              resolve({ blob: blob || file, dataUrl });
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
        }
      };
      img.onerror = () => {
        resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve({ blob: file, dataUrl: '' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to Supabase Storage with robust Base64 fallback
 */
export async function uploadProductImageToStorage(file: File): Promise<string> {
  let compressedBlob: Blob = file;
  let compressedDataUrl = '';

  try {
    const comp = await compressImage(file, 1600, 0.85);
    compressedBlob = comp.blob;
    compressedDataUrl = comp.dataUrl;
  } catch (compErr) {
    console.warn('Image compression notice:', compErr);
  }

  try {
    const fileExt = file.name ? file.name.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg';
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt) ? fileExt : 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, compressedBlob, {
        cacheControl: '31536000',
        upsert: true,
        contentType: compressedBlob.type || 'image/jpeg',
      });

    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (data?.publicUrl) return data.publicUrl;
    } else {
      console.warn('Supabase storage upload failed, falling back:', uploadError.message);
    }
  } catch (err) {
    console.warn('Supabase storage upload failed, falling back to base64 data URL:', err);
  }

  // Resilient Base64 Fallback Pipeline: Ensures images upload and render immediately
  if (compressedDataUrl) {
    return compressedDataUrl;
  }

  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  } else {
    // Node.js test environment fallback
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:${file.type || 'image/jpeg'};base64,${base64}`;
  }
}

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
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    currency: p.currency || 'INR',
    description: p.description || '',
    editorialNote: p.editorial_note || '',
    edition: p.edition || '',
    material: p.material || '14K Whitish Gold Vermeil over 925 Silver',
    goldPurity: p.gold_purity || '14K Gold Vermeil',
    colorTone: p.color_tone || 'Whitish Gold',
    metalColorHex: p.metal_color_hex || '#EDE7DC',
    occasionVibe: p.occasion_vibe || 'Everyday Wear',
    category: p.category || p.category_slug || 'minimalist',
    subcategory: p.subcategory || '',
    silhouette: p.silhouette || 'light',
    dimensions: p.dimensions || '',
    craftsmanship: p.craftsmanship || '',
    images: Array.isArray(p.images) ? p.images : [],
    modelImage: p.model_image || (Array.isArray(p.images) && p.images[0]) || '',
    videoUrl: p.video_url || '',
    featured: Boolean(p.featured),
    inStock: Boolean(p.in_stock ?? true),
    inventory: Number(p.inventory ?? 5),
    isEngravable: Boolean(p.is_engravable),
    categorySlug: p.category_slug || 'minimalist',
    categoryName: p.category_name || 'Minimalist Jewellery',
    hallmark: p.hallmark || 'Fine 925 Sterling Silver',
    warranty: p.warranty || '30-Day Manufacturing Warranty',
    pairsWithId: p.pairs_with_id || undefined,
    upsellReason: p.upsell_reason || '',
    collections: Array.isArray(p.collections) ? p.collections : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    isNew: Boolean(p.is_new),
  }));
}

/**
 * Save newly placed order to Supabase aviora_orders & double-entry bookkeeping ledger
 */
export async function persistOrderToDb(order: any) {
  try {
    const grossTotal = Number(order.total) || 0;
    const gstAmount = Number(order.gstAmount) || Math.round((grossTotal * 3) / 103);
    const trackingNumber = (order.trackingNumber || '').trim();

    const orderRow = {
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
      subtotal: Number(order.subtotal) || grossTotal,
      discount: Number(order.discount) || 0,
      total: grossTotal,
      currency: order.currency || 'INR',
      status: order.status || 'CONFIRMED',
      courier: order.courier || 'Blue Dart Express Air',
      tracking_number: trackingNumber,
      bluedart_consignment_no: trackingNumber,
      gst_amount: gstAmount,
      estimated_delivery: order.estimatedDelivery || '15-20 Business Days Handcrafting + 1-5 Days Express Air',
      items: order.items || [],
      timeline: order.timeline || [],
      otp_verified: Boolean(order.otpVerified),
      payment_transaction_id: order.paymentTransactionId || '',
      whatsapp_notifications: order.whatsappNotifications || [],
      phonepe_transaction_id: order.phonepeTransactionId || '',
      phonepe_merchant_transaction_id: order.phonepeMerchantTransactionId || '',
      phonepe_payment_link_id: order.phonepePaymentLinkId || '',
      phonepe_amount_in_paise: Number(order.phonepeAmountInPaise) || (grossTotal * 100),
      phonepe_payment_url: order.phonepePaymentUrl || '',
    };

    const { data, error } = await supabase.from('aviora_orders').insert([orderRow]);
    if (error) console.warn('Failed to sync order to Supabase aviora_orders:', error);

    // Double-entry record in bookkeeping ledger
    await recordBookkeepingLedgerEntry({
      order_number: order.orderNumber,
      event_type: 'ORDER_PLACED_PAYMENT_CAPTURED',
      customer_name: order.customerName,
      customer_phone: order.customerPhone || '',
      customer_email: order.customerEmail || '',
      gross_amount: grossTotal,
      tax_amount: gstAmount,
      net_amount: grossTotal - gstAmount,
      currency: order.currency || 'INR',
      payment_method: order.paymentMethod || 'PhonePe',
      payment_gateway_ref: order.paymentTransactionId || order.phonepeTransactionId || 'UPI-9650834445@kotak',
      bluedart_consignment_no: trackingNumber,
      status: order.status || 'CONFIRMED',
      items_summary: (order.items || []).map((i: any) => `${i.name} (x${i.quantity || 1})`).join(', '),
      notes: `Order created and payment captured. PhonePe paise: ${order.phonepeAmountInPaise || (grossTotal * 100)}. Handcrafting benchwork queued.`,
      metadata: {
        shippingAddress: order.shippingAddress,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
      },
    });

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
        color_tone: product.colorTone || 'Whitish Gold',
        metal_color_hex: product.metalColorHex || '#EDE7DC',
        occasion_vibe: product.occasionVibe || 'Everyday Wear',
        dimensions: product.dimensions || '',
        craftsmanship: product.craftsmanship || '',
        images: product.images || [],
        model_image: product.modelImage || (Array.isArray(product.images) && product.images[0]) || '',
        featured: Boolean(product.featured),
        in_stock: Boolean(product.inStock ?? true),
        inventory: product.inventory ?? 5,
        is_engravable: Boolean(product.isEngravable),
        category: product.category || product.categorySlug || 'minimalist',
        category_slug: product.categorySlug || 'minimalist',
        subcategory: product.subcategory || '',
        silhouette: product.silhouette || 'light',
        collections: Array.isArray(product.collections) ? product.collections : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        is_new: Boolean(product.isNew),
        hallmark: product.hallmark || 'Fine 925 Sterling Silver',
        warranty: product.warranty || '30-Day Manufacturing Warranty',
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
    if (updates.images !== undefined) {
      dbPayload.images = updates.images;
      if (Array.isArray(updates.images) && updates.images.length > 0 && !updates.modelImage) {
        dbPayload.model_image = updates.images[0];
      }
    }
    if (updates.modelImage !== undefined) dbPayload.model_image = updates.modelImage;
    if (updates.featured !== undefined) dbPayload.featured = updates.featured;
    if (updates.inStock !== undefined) dbPayload.in_stock = updates.inStock;
    if (updates.inventory !== undefined) dbPayload.inventory = updates.inventory;
    if (updates.isEngravable !== undefined) dbPayload.is_engravable = updates.isEngravable;
    if (updates.categorySlug !== undefined) dbPayload.category_slug = updates.categorySlug;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.subcategory !== undefined) dbPayload.subcategory = updates.subcategory;
    if (updates.silhouette !== undefined) dbPayload.silhouette = updates.silhouette;
    if (updates.collections !== undefined) dbPayload.collections = updates.collections;
    if (updates.tags !== undefined) dbPayload.tags = updates.tags;
    if (updates.isNew !== undefined) dbPayload.is_new = updates.isNew;
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
      trackingNumber: o.bluedart_consignment_no || o.tracking_number || '',
      bluedartConsignmentNo: o.bluedart_consignment_no || o.tracking_number || '',
      gstAmount: Number(o.gst_amount) || Math.round((Number(o.total) * 3) / 103),
      shippedAt: o.shipped_at || '',
      deliveredAt: o.delivered_at || '',
      estimatedDelivery: o.estimated_delivery,
      items: o.items || [],
      timeline: o.timeline || [],
      otpVerified: Boolean(o.otp_verified),
      paymentTransactionId: o.payment_transaction_id || '',
      whatsappNotifications: o.whatsapp_notifications || [],
      phonepeTransactionId: o.phonepe_transaction_id || '',
      phonepeMerchantTransactionId: o.phonepe_merchant_transaction_id || '',
      phonepePaymentLinkId: o.phonepe_payment_link_id || '',
      phonepeAmountInPaise: Number(o.phonepe_amount_in_paise) || (Number(o.total) * 100),
      phonepePaymentUrl: o.phonepe_payment_url || '',
    }));
  } catch (err) {
    console.warn('Supabase fetchOrders error:', err);
    return [];
  }
}

/**
 * Fetch orders for a specific customer phone number from Supabase
 */
export async function fetchOrdersByPhone(phone: string) {
  try {
    const clean = phone.replace(/[^\d]/g, '').slice(-10);
    const { data, error } = await supabase
      .from('aviora_orders')
      .select('*')
      .ilike('customer_phone', `%${clean}%`)
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
      trackingNumber: o.bluedart_consignment_no || o.tracking_number || '',
      bluedartConsignmentNo: o.bluedart_consignment_no || o.tracking_number || '',
      gstAmount: Number(o.gst_amount) || Math.round((Number(o.total) * 3) / 103),
      shippedAt: o.shipped_at || '',
      deliveredAt: o.delivered_at || '',
      estimatedDelivery: o.estimated_delivery,
      items: o.items || [],
      timeline: o.timeline || [],
      otpVerified: Boolean(o.otp_verified),
      paymentTransactionId: o.payment_transaction_id || '',
      whatsappNotifications: o.whatsapp_notifications || [],
      phonepeTransactionId: o.phonepe_transaction_id || '',
      phonepeMerchantTransactionId: o.phonepe_merchant_transaction_id || '',
      phonepePaymentLinkId: o.phonepe_payment_link_id || '',
      phonepeAmountInPaise: Number(o.phonepe_amount_in_paise) || (Number(o.total) * 100),
      phonepePaymentUrl: o.phonepe_payment_url || '',
    }));
  } catch (err) {
    console.warn('Supabase fetchOrdersByPhone error:', err);
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
  timeline?: any[],
  whatsappNotifications?: any[]
) {
  try {
    const updates: any = { status };
    if (trackingNumber !== undefined) {
      const cleanAwb = (trackingNumber || '').trim();
      updates.tracking_number = cleanAwb;
      updates.bluedart_consignment_no = cleanAwb;
    }
    if (status === 'SHIPPED') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'DELIVERED') {
      updates.delivered_at = new Date().toISOString();
    }
    if (timeline) updates.timeline = timeline;
    if (whatsappNotifications) updates.whatsapp_notifications = whatsappNotifications;

    const { data, error } = await supabase
      .from('aviora_orders')
      .update(updates)
      .eq('order_number', orderNumber);
    if (error) throw error;

    // Record bookkeeping ledger event for tracking and audit trail
    await recordBookkeepingLedgerEntry({
      order_number: orderNumber,
      event_type: status === 'SHIPPED' ? 'HANDOVER_TO_BLUEDART' : `STATUS_TRANSITION_${status}`,
      customer_name: 'Patron',
      gross_amount: 0,
      tax_amount: 0,
      net_amount: 0,
      currency: 'INR',
      payment_method: 'Prepaid',
      bluedart_consignment_no: trackingNumber || '',
      status: status,
      notes: status === 'SHIPPED'
        ? `Consignment handed over to Blue Dart Express Air. AWB / Consignment No: ${trackingNumber}`
        : `Order status moved to ${status}`,
    });

    return { success: true, data };
  } catch (err) {
    console.error('Supabase updateOrderStatus error:', err);
    return { success: false, error: err };
  }
}

/**
 * Append entry to double-entry Bookkeeping & Analytics Ledger (Cloud + LocalStorage)
 */
export async function recordBookkeepingLedgerEntry(entry: {
  order_number: string;
  event_type: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  gross_amount: number;
  tax_amount?: number;
  net_amount: number;
  currency?: string;
  payment_method?: string;
  payment_gateway_ref?: string;
  bluedart_consignment_no?: string;
  status: string;
  items_summary?: string;
  notes?: string;
  metadata?: any;
}) {
  const ledgerItem = {
    id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    order_number: entry.order_number,
    event_type: entry.event_type,
    customer_name: entry.customer_name,
    customer_phone: entry.customer_phone || '',
    customer_email: entry.customer_email || '',
    gross_amount: Number(entry.gross_amount) || 0,
    tax_amount: Number(entry.tax_amount) || 0,
    net_amount: Number(entry.net_amount) || 0,
    currency: entry.currency || 'INR',
    payment_method: entry.payment_method || 'PhonePe',
    payment_gateway_ref: entry.payment_gateway_ref || '',
    bluedart_consignment_no: entry.bluedart_consignment_no || '',
    status: entry.status,
    items_summary: entry.items_summary || '',
    notes: entry.notes || '',
    metadata: entry.metadata || {},
  };

  // 1. Sync to Supabase table
  try {
    await supabase.from('aviora_bookkeeping_ledger').insert([ledgerItem]);
  } catch (err) {
    console.warn('Supabase recordBookkeepingLedgerEntry error:', err);
  }

  // 2. Sync to local storage for immediate offline and snappy client availability
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('aviora_bookkeeping_ledger');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(ledgerItem);
      localStorage.setItem('aviora_bookkeeping_ledger', JSON.stringify(list.slice(0, 500)));
    } catch (e) {
      console.warn('LocalStorage ledger save error:', e);
    }
  }

  return ledgerItem;
}

/**
 * Fetch all bookkeeping ledger entries from Supabase (with localStorage fallback)
 */
export async function fetchBookkeepingLedgerFromDb() {
  try {
    const { data, error } = await supabase
      .from('aviora_bookkeeping_ledger')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aviora_bookkeeping_ledger', JSON.stringify(data));
      }
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetchBookkeepingLedger error, using local fallback:', err);
  }

  // LocalStorage Fallback
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('aviora_bookkeeping_ledger');
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [];
}

/**
 * Generate UTF-8 CSV string for Tally Prime, Zoho Books, and accountant ledgers
 */
export function generateBookkeepingCsvString(orders: any[] = []): string {
  const headers = [
    'Order Reference',
    'Date Placed (IST)',
    'Customer Name',
    'Customer Phone',
    'Customer Email',
    'Shipping Address',
    'City',
    'State',
    'Postal Code',
    'Items Summary',
    'Gross Total (INR)',
    'GST 3% (INR)',
    'Net Revenue (INR)',
    'Payment Method',
    'Gateway Txn ID',
    'PhonePe Paise Value',
    'Blue Dart Consignment No',
    'Fulfillment Status',
    'Shipped Date',
    'Delivered Date',
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = orders.map((o) => {
    const gross = Number(o.total) || 0;
    const gst = Number(o.gstAmount) || Math.round((gross * 3) / 103);
    const net = gross - gst;
    const itemsSummary = Array.isArray(o.items)
      ? o.items.map((i: any) => `${i.name || i.title} (Qty: ${i.quantity || 1}, ₹${i.price})`).join('; ')
      : '';

    return [
      escapeCsv(o.orderNumber),
      escapeCsv(o.orderDate || (o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : '')),
      escapeCsv(o.customerName),
      escapeCsv(o.customerPhone),
      escapeCsv(o.customerEmail),
      escapeCsv(o.shippingAddress),
      escapeCsv(o.city),
      escapeCsv(o.state),
      escapeCsv(o.postalCode),
      escapeCsv(itemsSummary),
      escapeCsv(gross),
      escapeCsv(gst),
      escapeCsv(net),
      escapeCsv(o.paymentMethod || 'PhonePe / UPI'),
      escapeCsv(o.paymentTransactionId || o.phonepeTransactionId || 'TXN-VERIFIED'),
      escapeCsv(o.phonepeAmountInPaise || (gross * 100)),
      escapeCsv(o.trackingNumber || o.bluedartConsignmentNo || 'Pending Dispatch'),
      escapeCsv(o.status || 'CONFIRMED'),
      escapeCsv(o.shippedAt || (o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED' ? 'Dispatched' : 'Pending Handover')),
      escapeCsv(o.deliveredAt || (o.status === 'DELIVERED' ? 'Delivered' : 'In Transit/Pending')),
    ].join(',');
  });

  return '\uFEFF' + [headers.map((h) => `"${h}"`).join(','), ...rows].join('\n');
}

/**
 * 1-Click Export of Bookkeeping Ledger as CSV for Accountants, Tally Prime, and Zoho Books
 */
export function exportBookkeepingLedgerAsCsv(orders: any[] = []): void {
  if (typeof window === 'undefined') return;

  const csvContent = generateBookkeepingCsvString(orders);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aviora_bookkeeping_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 1-Click Export of Complete Audit Ledger as Structured JSON for Business Intelligence
 */
export function exportBookkeepingLedgerAsJson(orders: any[] = [], ledger: any[] = []): void {
  if (typeof window === 'undefined') return;

  const payload = {
    exportedAt: new Date().toISOString(),
    organization: 'AVIORA Atelier & Fine Jewellery',
    taxRegistration: 'GSTIN: 27AABCA1234F1Z9 (Maharashtra)',
    currency: 'INR',
    ordersCount: orders.length,
    orders,
    ledgerEvents: ledger,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aviora_audit_ledger_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
