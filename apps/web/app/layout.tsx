import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RewaCab - Book Affordable Cabs in Rewa',
  description:
    'Book affordable and reliable cab services from Rewa to Prayagraj, Satna, Varanasi and more. Verified drivers, secure payments, 24/7 support.',
  keywords: [
    'rewa cab booking',
    'rewa to prayagraj cab',
    'rewa to allahabad taxi',
    'rewa to satna cab',
    'mp cab booking',
  ],
  openGraph: {
    title: 'RewaCab - Book Affordable Cabs in Rewa',
    description:
      'Book affordable and reliable cab services from Rewa. Verified drivers, secure payments.',
    url: 'https://rewacab.com',
    siteName: 'RewaCab',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
