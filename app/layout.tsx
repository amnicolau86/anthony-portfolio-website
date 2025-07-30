import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anthony Nicolau - Director & Producer',
  description: 'Portfolio of Anthony Nicolau - Award-winning Cuban-American director, producer, and filmmaker. Creator of narrative films and commercials for BMW, Spotify, Adidas, and more.',
  openGraph: {
    title: 'Anthony Nicolau - Director & Producer',
    description: 'Award-winning Cuban-American director, producer, and filmmaker. Creator of narrative films and commercials for BMW, Spotify, Adidas, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Anthony Nicolau Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthony Nicolau - Director & Producer',
    description: 'Award-winning Cuban-American director, producer, and filmmaker.',
  },
  keywords: ['director', 'producer', 'filmmaker', 'commercial director', 'narrative film', 'Anthony Nicolau'],
  authors: [{ name: 'Anthony Nicolau' }],
  creator: 'Anthony Nicolau',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}