import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Code, Cpu, Network, ShieldCheck, LifeBuoy } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const ITServicesPage = () => {
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
                <BreadcrumbPage>IT Services</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">IT Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mt-4">
            Modern solutions for a digital world.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Code />, title: 'Web Development', desc: 'Responsive and modern websites.' },
              { icon: <Cpu />, title: 'Software Solutions', desc: 'Custom software for your needs.' },
              { icon: <Network />, title: 'Network Management', desc: 'Secure and reliable networking.' },
              { icon: <ShieldCheck />, title: 'IT Consulting', desc: 'Expert advice to drive growth.' },
              { icon: <LifeBuoy />, title: 'Technical Support', desc: '24/7 support for your systems.' },
              { icon: <Code />, title: 'Hardware Solutions', desc: 'The best hardware for your needs.' },
            ].map(service => (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-secondary text-white p-4 rounded-full">{service.icon}</div>
                  <CardTitle className="text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { title: 'Expert Team', desc: 'Our team consists of experienced IT professionals.' },
              { title: 'Affordable Pricing', desc: 'High-quality services at competitive prices.' },
              { title: '24/7 Support', desc: 'We are always here to help you.' },
              { title: 'Proven Track Record', desc: 'A history of successful projects and satisfied clients.' },
            ].map(item => (
                <div key={item.title}>
                    <h3 className="text-2xl font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Need IT Services?</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Contact us today to discuss your project and get a free consultation.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white" asChild>
            <a href="/contact">Request a Quote</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ITServicesPage;