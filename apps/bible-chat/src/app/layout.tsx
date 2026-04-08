import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       'BibleAI — Explore the Bible with AI',
  description: 'Explore the Bible with AI — Ask questions and get scripture-backed answers from all major Bible versions.',
  keywords:    ['Bible', 'AI', 'Scripture', 'KJV', 'Bible study', 'Christian', 'ChatGPT Bible'],
  openGraph: {
    title:       'BibleAI — Explore the Bible with AI',
    description: 'Ask questions about the Bible and get scripture-backed answers from all major versions.',
    type:        'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BibleAI' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'BibleAI',
    description: 'Explore the Bible with AI-powered scripture search and Q&A.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
