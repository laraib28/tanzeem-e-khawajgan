import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

// Using system fonts as fallback
const inter = {
  variable: '--font-inter',
}

export const metadata: Metadata = {
  title: {
    default: 'Tanzeem-e-Khawjgan | Community Organization',
    template: '%s | Tanzeem-e-Khawjgan',
  },
  description: 'Tanzeem-e-Khawjgan is a community-focused organization providing IT training, medical services, education programs, sports facilities, and more.',
  keywords: ['Tanzeem-e-Khawjgan', 'community organization', 'IT training', 'medical services', 'education', 'sports facilities'],
  authors: [{ name: 'Tanzeem-e-Khawjgan' }],
  creator: 'Tanzeem-e-Khawjgan',
  publisher: 'Tanzeem-e-Khawjgan',
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
    url: 'https://tanzeem-e-khawjgan.org',
    siteName: 'Tanzeem-e-Khawjgan',
    title: 'Tanzeem-e-Khawjgan | Community Organization',
    description: 'Community-focused organization providing IT training, medical services, education programs, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanzeem-e-Khawjgan',
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
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head />
      <body className={`${inter.variable} font-sans bg-background antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
