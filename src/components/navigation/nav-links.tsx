"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const navigationLinks = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "/about",
      subLinks: [
        { name: "Vision", href: "/about/vision" },
        { name: "Mission", href: "/about/mission" },
        { name: "Board of Members", href: "/about/board-members" },
        { name: "News & Events", href: "/about/news-events" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    {
      name: "Services",
      href: "/services",
      subLinks: [
        { name: "IT Services", href: "/services/it" },
        { name: "Medical Services", href: "/services/medical" },
        { name: "Sports Services", href: "/services/sports" },
        { name: "Banquets", href: "/services/banquets" },
        { name: "Education", href: "/services/education" },
        { name: "Graveyard Services", href: "/services/graveyard" },
      ],
    },
    { name: "Contact Us", href: "/contact" },
  ]

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-6">
      {navigationLinks.map((link) => {
        const isActive = pathname === link.href;
        if (link.subLinks) {
          return (
            <li key={link.name}>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-lg font-medium text-primary hover:text-secondary transition-colors">
                  {link.name}
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link.subLinks.map((subLink) => (
                    <DropdownMenuItem key={subLink.name} asChild>
                      <Link href={subLink.href}>{subLink.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        }
        return (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`text-lg font-medium transition-colors ${
                isActive ? 'text-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;