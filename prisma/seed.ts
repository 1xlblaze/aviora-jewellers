import { PrismaClient } from '@prisma/client';
import { CATEGORIES, PRODUCTS } from '../lib/data';

const prisma = new PrismaClient();

export async function main() {
  console.log('🏛️  AURA Atelier India: Initiating catalog seed for Indian market...');

  // Upsert Categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        heroImage: cat.heroImage,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        heroImage: cat.heroImage,
      },
    });
    categoryMap.set(cat.slug, created.id);
    console.log(`  ✓ Category archived: [${created.name}]`);
  }

  // Upsert Indian Luxury Products
  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, categoryName, images, ...prodData } = prod;

    const created = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...prodData,
        images: JSON.stringify(images),
        categoryId,
      },
      create: {
        ...prodData,
        images: JSON.stringify(images),
        categoryId,
      },
    });
    console.log(`  ✓ Piece archived: [${created.name}] — ₹${created.price} (MRP: ₹${created.originalPrice})`);
  }

  console.log('✨ AURA Atelier: 8 Indian fine jewelry pieces successfully seeded.');
}

if (require.main === module || process.env.NODE_ENV !== 'test') {
  main()
    .catch((e) => {
      console.error('Error seeding AURA catalog:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
