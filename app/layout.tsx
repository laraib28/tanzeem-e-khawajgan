import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/ai/ChatWidget'
import './globals.css'

// Using system fonts as fallback
const inter = {
  variable: '--font-inter',
}

export const metadata: Metadata = {
  title: {
    default: 'Tanzeem-e-Khawajgan | Community Organization',
    template: '%s | Tanzeem-e-Khawajgan',
  },
  description: 'Tanzeem-e-Khawajgan is a community-focused organization providing IT training, medical services, education programs, sports facilities, and more.',
  keywords: ['Tanzeem-e-Khawajgan', 'community organization', 'IT training', 'medical services', 'education', 'sports facilities'],
  authors: [{ name: 'Tanzeem-e-Khawajgan' }],
  creator: 'Tanzeem-e-Khawajgan',
  publisher: 'Tanzeem-e-Khawajgan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tanzeem-e-khawajgan.org',
    siteName: 'Tanzeem-e-Khawajgan',
    title: 'Tanzeem-e-Khawajgan | Community Organization',
    description: 'Community-focused organization providing IT training, medical services, education programs, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanzeem-e-Khawajgan',
    description: 'Community-focused organization providing quality services and programs.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth bg-background">
      <head />
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
      </body>
    </html>
  )
}
