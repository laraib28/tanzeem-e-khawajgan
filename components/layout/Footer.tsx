'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { DonateModal } from '@/components/ui/DonateModal'
import siteConfig from '@/config/site-config.json'

export function Footer() {
  const [donateOpen, setDonateOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="w-full bg-[#004d40] text-white">
        {/* Donate CTA strip */}
        <div className="bg-primary py-4 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white text-sm font-medium text-center sm:text-left">
              Support our community — every contribution makes a difference.
            </p>
            <button
              onClick={() => setDonateOpen(true)}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2 bg-white text-primary text-sm font-bold rounded-lg hover:bg-white/90 transition-colors"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              Donate Now
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo + About */}
            <div className="md:col-span-2">
              <Image
                src="/logo-khawajgan.png"
                alt="Tanzeem-e-Khawajgan"
                width={64}
                height={64}
                className="object-contain mb-4"
              />
              <h3 className="text-base font-bold mb-2 text-white">
                {siteConfig.siteName.en}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                {siteConfig.siteDescription.en}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-primary uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/services/it', label: 'Services' },
                  { href: '/vision/mission', label: 'Mission & Vision' },
                  { href: '/contact', label: 'Contact Us' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/70 hover:text-primary transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-primary uppercase tracking-widest">Contact</h3>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary transition-colors break-all">
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-primary transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li className="leading-relaxed">{siteConfig.contact.address.en}</li>
              </ul>
            </div>
          </div>

          {/* Social + Copyright */}
          <div className="mt-10 pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
            {(siteConfig.social.facebook || siteConfig.social.twitter || siteConfig.social.instagram) && (
              <div className="flex gap-4">
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="text-white/60 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                    className="text-white/60 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="text-white/60 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
            <p className="text-xs text-white/50">
              &copy; {currentYear} {siteConfig.siteName.en}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  )
}
