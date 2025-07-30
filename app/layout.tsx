import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anthony Nicolau - Director & Producer',
  description: 'NYC-based award-winning director and producer. Creator of Sundance-selected "The Night Owl" and Telly Award-winning brand films. Specializing in narrative films and commercial content.',
  keywords: 'Anthony Nicolau, film director, film producer, NYC filmmaker, Sundance, The Night Owl, Push to Enter, Corners, commercial director, narrative films',
  authors: [{ name: 'Anthony Nicolau' }],
  creator: 'Anthony Nicolau',
  openGraph: {
    title: 'Anthony Nicolau - Director & Producer',
    description: 'Award-winning filmmaker creating narrative and commercial content',
    url: 'https://anthonynicolau.com',
    siteName: 'Anthony Nicolau Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anthony Nicolau - Director & Producer',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthony Nicolau - Director & Producer',
    description: 'Award-winning filmmaker creating narrative and commercial content',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anthony Nicolau',
    jobTitle: ['Film Director', 'Film Producer'],
    url: 'https://anthonynicolau.com',
    sameAs: [
      'https://www.instagram.com/anthonymnicolau',
      'https://www.imdb.com/name/nm5970705/',
    ],
    award: ['Short of the Week', 'Vimeo Staff Pick', 'Telly Awards 2025'],
  };

  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}