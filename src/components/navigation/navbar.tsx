"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import NavLinks from './nav-links';
import MobileMenu from './mobile-menu';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold text-primary">Tanzeem-e-Khawajgan</span>
        </Link>

        <nav className="hidden lg:flex">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          <Button
            asChild
            className="hidden sm:inline-flex bg-secondary hover:bg-secondary-dark text-white"
          >
            <Link href="/contact">Donate</Link>
          </Button>
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;