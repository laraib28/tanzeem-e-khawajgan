"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full bg-white" />
                <span className="text-xl font-bold">Tanzeem-e-Khawajgan</span>
            </Link>
            <p className="text-sm text-gray-300">
              A brief description of the organization and its mission to serve the community.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="text-gray-300 hover:text-secondary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-secondary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-secondary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-secondary transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-secondary transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="flex flex-col gap-2">
                <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
                <li><Link href="/about/mission" className="hover:text-secondary transition-colors">About Us</Link></li>
                <li><Link href="/gallery" className="hover:text-secondary transition-colors">Gallery</Link></li>
                <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li><Link href="/services" className="hover:text-secondary transition-colors">All Services</Link></li>
                <li><Link href="/about/news-events" className="hover:text-secondary transition-colors">News & Events</Link></li>
                <li><Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 text-secondary" />
                <span>123 Organization St, City, Country</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="mt-1 text-secondary" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="mt-1 text-secondary" />
                <span>info@organization.com</span>
              </li>
            </ul>
            <h3 className="text-lg font-semibold mt-6 mb-4">Office Hours</h3>
            <p className="text-sm">Mon-Fri: 9am - 5pm</p>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your Email" className="bg-gray-700 border-gray-600 text-white" />
              <Button className="bg-secondary hover:bg-secondary-dark text-white">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-dark py-4">
        <div className="container mx-auto text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Tanzeem-e-Khawajgan. All rights reserved.
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-8 right-8 bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-secondary-dark transition-all duration-300"
      >
        <ArrowUp size={24} />
      </button>
    </footer>
  );
};

export default Footer;