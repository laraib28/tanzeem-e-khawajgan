'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Menu, X, ChevronDown } from 'lucide-react'
import navigationConfig from '@/config/navigation.json'

// Dynamically import ChatInterface to avoid SSR issues
const ChatInterface = dynamic(
  () => import('@/components/ai/ChatInterface').then((mod) => mod.ChatInterface),
  { ssr: false }
)

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Center on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/" className="text-xl font-bold text-primary">
              Tanzeem-e-Khawjgan
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:space-x-8">
            {navigationConfig.mainMenu.map((item) => (
              <div key={item.id} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.submenu[0].href) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.label.en}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-2 w-48 rounded-md border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className={`block px-4 py-2 text-sm hover:bg-primary/10 transition-colors ${
                              isActive(subItem.href) ? 'text-primary font-medium' : 'text-foreground'
                            }`}
                          >
                            {subItem.label.en}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href!) ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {item.label.en}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Ask With Me Button - Right */}
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center px-4 py-2 min-h-[44px] rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {navigationConfig.aiAction.label.en}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              {navigationConfig.mainMenu.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <details className="group">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium hover:bg-primary/10 transition-colors min-h-[44px]">
                        <span>{item.label.en}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 space-y-1 bg-background/50">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-4 py-3 text-sm hover:bg-primary/10 transition-colors min-h-[44px] flex items-center ${
                              isActive(subItem.href) ? 'text-primary font-medium' : 'text-foreground'
                            }`}
                          >
                            {subItem.label.en}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors min-h-[44px] flex items-center ${
                        isActive(item.href!) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.label.en}
                    </Link>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setChatOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full mt-4 px-4 py-3 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
              >
                {navigationConfig.aiAction.label.en}
              </button>
            </div>
          </div>
        )}

        {/* AI Chat Interface */}
        {chatOpen && <ChatInterface onClose={() => setChatOpen(false)} />}
      </div>
    </nav>
  )
}
