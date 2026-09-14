import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category') || undefined;
    const search = searchParams.get('q') || undefined;
    const sortBy = (searchParams.get('sort') as 'price-asc' | 'price-desc' | 'featured') || undefined;

    const products = await getProducts({ categorySlug, search, sortBy });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in /api/products handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve archive items' },
      { status: 500 }
    );
  }
}
