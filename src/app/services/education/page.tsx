import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, School, UserCheck, Computer, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const EducationServicesPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <Image src="/hero.jpg" alt="Education" layout="fill" objectFit="cover" className="z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent z-10" />
        <div className="z-20 p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Education Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Empowering minds, shaping the future.</p>
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
                <BreadcrumbPage>Education</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Educational Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Educational Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <School />, name: 'Primary Education' },
              { icon: <Book />, name: 'Secondary Education' },
              { icon: <UserCheck />, name: 'Adult Education' },
              { icon: <Computer />, name: 'Computer Literacy' },
              { icon: <GraduationCap />, name: 'Vocational Training' },
              { icon: <GraduationCap />, name: 'Language Classes' },
            ].map(program => (
              <Card key={program.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-secondary text-white p-4 rounded-full">{program.icon}</div>
                  <CardTitle className="text-primary">{program.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Admission Process</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700">
              <li>Submit the online application form.</li>
              <li>Provide the required documents (birth certificate, previous transcripts).</li>
              <li>Attend an entrance test and interview.</li>
              <li>Receive admission confirmation.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-6">Enroll Now</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
            Take the first step towards a brighter future.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white" asChild>
            <a href="/contact">Apply Now</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EducationServicesPage;