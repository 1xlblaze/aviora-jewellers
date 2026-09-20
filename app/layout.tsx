import type { Metadata } from 'next';
import { Cinzel, Playfair_Display, Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Navigation } from '@/components/ui/navigation';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { Footer } from '@/components/ui/footer';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AVIORA JEWELLERS — 14K Gold Plated 925 Sterling Silver Atelier',
  description:
    'Demi-fine luxury jewelry house. 14K/18K Gold Plated Vermeil over authentic BIS Hallmarked 925 Sterling Silver. Everyday waterproof permanence.',
  keywords: [
    'aviora jewellers',
    'gold plated silver jewelry',
    '925 sterling silver',
    '14k gold vermeil',
    'bis hallmarked silver',
    'demi fine jewelry',
    'waterproof gold jewelry',
  ],
  openGraph: {
    title: 'AVIORA JEWELLERS — 14K Gold Plated 925 Sterling Silver Atelier',
    description: 'Wearable architectural sculptures crafted in 14K gold plated BIS 925 sterling silver.',
    url: 'https://aviora-jewellers.vercel.app',
    siteName: 'AVIORA JEWELLERS',
    images: [
      {
        url: '/products/14k-gold-plated-double-layer-necklace-4200-1.jpg',
        width: 1600,
        height: 1000,
        alt: 'AVIORA Fine Jewellery Atelier',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${cinzel.variable} ${playfair.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#09090B] text-zinc-100 font-sans antialiased selection:bg-[#D4AF37] selection:text-black min-h-screen flex flex-col">
        <CartProvider>
          <Navigation />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
