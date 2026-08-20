import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/ai/ChatWidget'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['700', '800'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'Tanzeem-e-Khawajgan Registered Karachi | Community Organization',
    template: '%s | Tanzeem-e-Khawajgan Registered Karachi',
  },
  description: 'Tanzeem-e-Khawajgan Registered Karachi is a community-focused organization providing IT training, medical services, education programs, sports facilities, and more.',
  keywords: ['Tanzeem-e-Khawajgan', 'Tanzeem-e-Khawajgan Registered Karachi', 'community organization', 'IT training', 'medical services', 'education', 'sports facilities'],
  authors: [{ name: 'Tanzeem-e-Khawajgan Registered Karachi' }],
  creator: 'Tanzeem-e-Khawajgan Registered Karachi',
  publisher: 'Tanzeem-e-Khawajgan Registered Karachi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    url: 'https://khawajgan.com',
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
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased`}>
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
