'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Menu, X, ChevronDown } from 'lucide-react'
import navigationConfig from '@/config/navigation.json'
import Image from 'next/image'

// Dynamically import ChatInterface to avoid SSR issues
const ChatInterface = dynamic(
  () => import('@/components/ai/ChatInterface').then((mod) => mod.ChatInterface),
  { ssr: false }
)

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-accent shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Center on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/" className="block">
              <Image
                src="/logo-khawajgan.png"
                alt="Tanzeem-e-Khawajgan Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <ul className="hidden md:flex md:flex-1 md:justify-center md:items-center md:gap-x-1">
            {navigationConfig.mainMenu.map((item) => (
              <li key={item.id} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.submenu[0].href) ? 'text-primary' : 'text-white'
                      }`}
                    >
                      {item.label.en}
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <ul className="rounded-md border border-border/30 bg-background shadow-lg py-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary ${
                                isActive(subItem.href) ? 'text-primary font-medium' : 'text-foreground'
                              }`}
                            >
                              {subItem.label.en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href!) ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {item.label.en}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Ask With Me Button - Right */}
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center px-4 py-2 min-h-[44px] rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {navigationConfig.aiAction.label.en}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-white hover:text-primary hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-accent">
            <ul className="py-4">
              {navigationConfig.mainMenu.map((item) => (
                <li key={item.id}>
                  {item.submenu ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleMobileDropdown(item.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-primary transition-colors min-h-[44px]"
                        aria-expanded={openDropdown === item.id}
                      >
                        <span>{item.label.en}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {openDropdown === item.id && (
                        <ul className="bg-white/10 border-l-2 border-primary/40 ml-4">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setOpenDropdown(null)
                                }}
                                className={`flex items-center px-4 py-3 text-sm transition-colors hover:bg-white/10 hover:text-primary min-h-[44px] ${
                                  isActive(subItem.href) ? 'text-primary font-medium' : 'text-white'
                                }`}
                              >
                                {subItem.label.en}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setOpenDropdown(null)
                      }}
                      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10 hover:text-primary min-h-[44px] ${
                        isActive(item.href!) ? 'text-primary' : 'text-white'
                      }`}
                    >
                      {item.label.en}
                    </Link>
                  )}
                </li>
              ))}
              <li className="px-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setChatOpen(true)
                    setMobileMenuOpen(false)
                    setOpenDropdown(null)
                  }}
                  className="w-full px-4 py-3 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
                >
                  {navigationConfig.aiAction.label.en}
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* AI Chat Interface */}
        {chatOpen && <ChatInterface onClose={() => setChatOpen(false)} />}
      </div>
    </nav>
  )
}
