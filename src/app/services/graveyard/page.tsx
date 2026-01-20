import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandHelping, MapPin, Phone, Clock } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const GraveyardServicesPage = () => {
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
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Graveyard Services</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Graveyard Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mt-4">
            Dignified and respectful services for your loved ones.
          </p>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <HandHelping />, title: 'Burial Services' },
              { icon: <HandHelping />, title: 'Grave Allocation' },
              { icon: <HandHelping />, title: 'Maintenance Services' },
              { icon: <HandHelping />, title: 'Memorial Services' },
              { icon: <HandHelping />, title: 'Record Keeping' },
              { icon: <HandHelping />, title: 'Family Support' },
            ].map(service => (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-secondary text-white p-4 rounded-full">{service.icon}</div>
                  <CardTitle className="text-primary">{service.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Procedures</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700">
              <li>Contact our 24/7 helpline for immediate assistance.</li>
              <li>Provide the necessary documentation (death certificate, ID).</li>
              <li>Select a grave plot and complete the allocation process.</li>
              <li>Arrange the burial service with our team.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Contact Us</h2>
          <div className='text-left max-w-md mx-auto space-y-4'>
            <p className='flex items-center gap-2'><Phone /> <strong>24/7 Helpline:</strong> +1 234 567 890</p>
            <p className='flex items-center gap-2'><Clock /> <strong>Office Timings:</strong> Mon-Fri: 9am - 5pm</p>
            <p className='flex items-center gap-2'><MapPin /> <strong>Location:</strong> 123 Graveyard St, City, Country</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GraveyardServicesPage;