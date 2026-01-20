import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ParkingCircle, Wifi, Users, Cake } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const BanquetsPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <Image src="/donation-card.jpg" alt="Banquets" layout="fill" objectFit="cover" className="z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent z-10" />
        <div className="z-20 p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Banquet Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Host your events in style and elegance.</p>
        </div>
      </section>

      <div className='container mx-auto px-4'>
        <Breadcrumb className='py-8'>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Banquets</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Banquet Halls */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Banquet Halls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <Image src="/hero.jpg" alt="Hall A" width={600} height={400} className="rounded-t-lg"/>
              <CardHeader>
                <CardTitle className="text-primary">Hall A</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Capacity:</strong> 200 Guests</p>
                <p><strong>Features:</strong> Fully air-conditioned, audio-visual equipment.</p>
              </CardContent>
            </Card>
            <Card>
              <Image src="/hero2.jpg" alt="Hall B" width={600} height={400} className="rounded-t-lg"/>
              <CardHeader>
                <CardTitle className="text-primary">Hall B</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Capacity:</strong> 500 Guests</p>
                <p><strong>Features:</strong> Spacious, elegant decor, stage for performances.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Included */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Services Included</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            {[
              { icon: <Utensils />, name: 'Catering' },
              { icon: <ParkingCircle />, name: 'Parking' },
              { icon: <Wifi />, name: 'Wifi' },
              { icon: <Users />, name: 'Staff Support' },
              { icon: <Cake />, name: 'Decoration' },
            ].map(service => (
              <div key={service.name} className="flex flex-col items-center">
                <div className="bg-secondary text-white p-4 rounded-full mb-2">{service.icon}</div>
                <p className="text-primary font-semibold">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Book Your Event</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
            Contact us to book our banquet halls for your special occasions.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white" asChild>
            <a href="/contact">Book Now</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BanquetsPage;