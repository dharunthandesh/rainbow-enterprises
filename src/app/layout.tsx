import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/toast-container';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SiteShell } from '@/components/layout/SiteShell';

// Static variables to support offline builds, fonts will load via standard browser link tags
const outfit = { variable: 'font-outfit' };
const inter = { variable: 'font-inter' };
const playfair = { variable: 'font-playfair' };

export const metadata: Metadata = {
  title: 'Rainbow Enterprises | Premium Organic & Cold-Pressed Store',
  description:
    'Sustainably sourced, 100% natural organic products, traditional cold-pressed oils, rich desi cow ghee, rare honey, ancient millets, and healthy snacks from West Mambalam, Chennai.',
  keywords: 'organic store, cold pressed oil, cow ghee, mountain honey, millets, health foods, rootsveyr, chennai organic store',
  authors: [{ name: 'Rainbow Enterprises' }],
  openGraph: {
    title: 'Rainbow Enterprises | Premium Organic & Cold-Pressed Store',
    description: '100% natural cold-pressed oils, pure A2 cow ghee, forest honey, and organic millets delivered to your doorstep.',
    siteName: 'Rainbow Enterprises',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Rainbow Enterprises',
  description: 'Pure, authentic organic cold-pressed oils, ghee, forest honey, and traditional wellness foods.',
  telephone: '+919176088989',
  email: 'raiinbow27@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'S2, Second Floor, Vandikaran Street, West Mambalam',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600033',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '₹₹',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Alex+Brush&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full font-sans bg-background text-foreground flex flex-col antialiased">
        <AuthProvider>
          <SiteShell>
            {children}
          </SiteShell>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
