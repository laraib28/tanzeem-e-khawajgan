"use client";
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

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

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ul className="flex flex-col gap-4">
            {navigationLinks.map((link) => {
              if (link.subLinks) {
                return (
                  <li key={link.name}>
                    <Accordion type="single" collapsible>
                        <AccordionItem value={link.name}>
                            <AccordionTrigger>{link.name}</AccordionTrigger>
                            <AccordionContent>
                                <ul className='flex flex-col gap-2 pl-4'>
                                {link.subLinks.map((subLink) => (
                                    <li key={subLink.name}>
                                        <Link href={subLink.href} className="text-muted-foreground hover:text-foreground">
                                            {subLink.name}
                                        </Link>
                                    </li>
                                ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                  </li>
                );
              }
              return (
                <li key={link.name}>
                  <Link href={link.href} className="text-lg font-medium">
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button asChild className="w-full mt-6 bg-secondary hover:bg-secondary-dark text-white">
            <Link href="/contact">Donate</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;