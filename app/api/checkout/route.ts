import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/actions';
import { PRODUCTS } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, shippingAddress, city, postalCode, country, items } = body;

    // Strict validation
    if (!customerName || !customerEmail || !shippingAddress || !city || !postalCode || !country) {
      return NextResponse.json(
        { success: false, message: 'Incomplete collector shipping dossier provided.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Collection is empty.' },
        { status: 400 }
      );
    }

    // Verify prices & calculate verified total
    let verifiedTotal = 0;
    const validatedItems = items.map((item: { productId: string; quantity: number }) => {
      const match = PRODUCTS.find((p) => p.id === item.productId);
      const unitPrice = match ? match.price : 2000;
      const quantity = Math.max(1, item.quantity || 1);
      verifiedTotal += unitPrice * quantity;
      return {
        productId: item.productId,
        quantity,
        price: unitPrice,
      };
    });

    // Execute Order creation
    const result = await createOrder({
      customerName,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      country,
      items: validatedItems,
      total: verifiedTotal,
    });

    return NextResponse.json({
      success: true,
      message: 'Archival acquisition successfully recorded.',
      order: result.order,
    });
  } catch (error) {
    console.error('Error in /api/checkout handler:', error);
    return NextResponse.json(
      { success: false, message: 'Acquisition processing failed.' },
      { status: 500 }
    );
  }
}
