"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const allNews = [
    { type: 'News', image: '/hero.jpg', date: 'Dec 3, 2025', title: 'Community Health Camp Huge Success', excerpt: 'Our recent health camp provided free medical check-ups and consultations to over 500 people in the community.' },
    { type: 'Event', image: '/donation-card.jpg', date: 'Nov 28, 2025', title: 'Annual Fundraiser Gala Night', excerpt: 'Join us for a night of giving, celebration, and entertainment to support our ongoing and future projects.' },
    { type: 'Update', image: '/hero2.jpg', date: 'Nov 15, 2025', title: 'New IT Training Program Launched', excerpt: 'We are excited to launch a new IT skills program to empower the youth with in-demand technical skills.' },
    { type: 'News', image: '/hero.jpg', date: 'Oct 22, 2025', title: 'Educational Scholarships Awarded', excerpt: 'Over 100 deserving students were awarded scholarships for higher education this year.' },
    { type: 'Event', image: '/donation-card.jpg', date: 'Sep 30, 2025', title: 'Sports Fest 2025 Concludes', excerpt: 'Our annual sports festival saw record participation and promoted a spirit of healthy competition.' },
    { type: 'Update', image: '/hero2.jpg', date: 'Sep 5, 2025', title: 'New Banquet Hall Facility Opened', excerpt: 'We are pleased to announce the opening of our new, state-of-the-art banquet hall for community events.' },
];

const NewsEventsPage = () => {
    const [filter, setFilter] = useState('All');

    const filteredNews = filter === 'All' ? allNews : allNews.filter(item => item.type === filter);

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
                <BreadcrumbLink href="/about">About</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>News & Events</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">News & Events</h1>
          <div className="flex justify-center mt-8">
            <Tabs defaultValue="All" onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="News">News</TabsTrigger>
                    <TabsTrigger value="Event">Events</TabsTrigger>
                    <TabsTrigger value="Update">Updates</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <Image src={item.image} alt={item.title} width={400} height={250} className="w-full h-48 object-cover"/>
                <CardContent className="p-6">
                    <div className='flex justify-between items-center mb-4'>
                        <Badge className="bg-secondary text-white">{item.type}</Badge>
                        <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-4">{item.excerpt}</p>
                  <Link href="#" className="text-secondary font-semibold hover:underline">
                    Read More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button>Load More</Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
          </p>
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Your Email" className="bg-white text-black"/>
            <Button className="bg-secondary hover:bg-secondary-dark text-white">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsEventsPage;