import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Futbol, Trophy, Users, Building, Medal } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const SportsServicesPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <Image src="/hero2.jpg" alt="Sports" layout="fill" objectFit="cover" className="z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent z-10" />
        <div className="z-20 p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Sports Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Unleash your potential, on and off the field.</p>
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
                <BreadcrumbPage>Sports Services</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Sports Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Sports Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Futbol />, name: 'Cricket', age: 'All Ages' },
              { icon: <Futbol />, name: 'Football', age: 'Youth & Adults' },
              { icon: <Futbol />, name: 'Basketball', age: 'Youth' },
              { icon: <Futbol />, name: 'Badminton', age: 'All Ages' },
              { icon: <Futbol />, name: 'Athletics', age: 'All Ages' },
              { icon: <Futbol />, name: 'Swimming', age: 'All Ages' },
            ].map(program => (
              <Card key={program.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-secondary text-white p-4 rounded-full">{program.icon}</div>
                  <CardTitle className="text-primary">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600"><strong>Age Group:</strong> {program.age}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Facilities</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
                <Image src="/hero.jpg" alt="Facilities" width={600} height={400} className="rounded-lg shadow-md" />
                <div>
                    <h3 className='text-3xl font-bold text-primary mb-4'>State-of-the-Art Sports Complex</h3>
                    <p className='text-lg text-gray-700'>Our complex includes a full-sized cricket ground, football pitch, basketball court, and modern equipment to support our athletes.</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* Achievements */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <Medal className='mx-auto mb-2 w-12 h-12 text-secondary'/>
                    <h3 className="text-3xl font-bold">10+</h3>
                    <p>Championships Won</p>
                </div>
                <div>
                    <Trophy className='mx-auto mb-2 w-12 h-12 text-secondary'/>
                    <h3 className="text-3xl font-bold">50+</h3>
                    <p>Tournaments Hosted</p>
                </div>
                <div>
                    <Users className='mx-auto mb-2 w-12 h-12 text-secondary'/>
                    <h3 className="text-3xl font-bold">100+</h3>
                    <p>Professional Athletes</p>
                </div>
                <div>
                    <Building className='mx-auto mb-2 w-12 h-12 text-secondary'/>
                    <h3 className="text-3xl font-bold">5+</h3>
                    <p>Sports Facilities</p>
                </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-6">Join Our Sports Programs</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
            Become a part of our winning team. Register now and start your journey.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white" asChild>
            <a href="/contact">Register Now</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SportsServicesPage;