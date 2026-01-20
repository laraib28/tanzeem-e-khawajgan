"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const galleryImages = [
  { src: '/hero.jpg', category: 'Events', title: 'Annual Gala' },
  { src: '/hero2.jpg', category: 'Services', title: 'Health Camp' },
  { src: '/donation-card.jpg', category: 'Community', title: 'Community Support' },
  { src: '/hero.jpg', category: 'Achievements', title: 'Award Ceremony' },
  { src: '/hero2.jpg', category: 'Events', title: 'Sports Day' },
  { src: '/donation-card.jpg', category: 'Services', title: 'IT Program' },
  { src: '/hero.jpg', category: 'Community', title: 'Volunteer Drive' },
  { src: '/hero2.jpg', category: 'Achievements', title: 'Scholarship Distribution' },
];

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = filter === 'All' ? galleryImages : galleryImages.filter(img => img.category === filter);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Gallery</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Gallery</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mt-4">
            A glimpse into our moments and memories.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 flex justify-center">
          <Tabs defaultValue="All" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Events">Events</TabsTrigger>
              <TabsTrigger value="Services">Services</TabsTrigger>
              <TabsTrigger value="Community">Community</TabsTrigger>
              <TabsTrigger value="Achievements">Achievements</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredImages.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="relative mb-4 break-inside-avoid cursor-pointer group">
                    <Image
                      src={image.src}
                      alt={image.title}
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-lg font-semibold">{image.title}</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <Image src={image.src} alt={image.title} width={1200} height={800} className="w-full h-auto rounded-lg"/>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button>Load More</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;