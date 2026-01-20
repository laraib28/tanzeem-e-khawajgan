import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandHeart, Target, Users, BookOpen, HeartHandshake, Briefcase, Trophy } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const MissionPage = () => {
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
                <BreadcrumbPage>Mission</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Our Mission</h1>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary text-center">
                To empower communities through dedicated service, education, and sustainable development.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 text-center">
                Our mission is to foster a resilient and self-sufficient society by providing comprehensive services in healthcare, education, and social welfare. We are committed to uplifting the underprivileged and creating a future where everyone has the opportunity to thrive.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <HeartHandshake />, name: 'Compassion' },
              { icon: <Users />, name: 'Community' },
              { icon: <Trophy />, name: 'Integrity' },
              { icon: <Briefcase />, name: 'Service' },
            ].map(value => (
              <Card key={value.name} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-secondary text-white w-20 h-20 flex items-center justify-center rounded-full">
                    {value.icon}
                  </div>
                  <CardTitle className="mt-4 text-primary">{value.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">What We Do</h2>
            <div className='space-y-16'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className='text-3xl font-bold text-primary mb-4'>Healthcare Services</h3>
                        <p className='text-lg text-gray-700'>We provide accessible and affordable medical care, from primary health check-ups to specialized treatments, ensuring the well-being of the community.</p>
                    </div>
                    <Image src="/hero2.jpg" alt="Healthcare" width={500} height={300} className="rounded-lg shadow-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <Image src="/donation-card.jpg" alt="Education" width={500} height={300} className="rounded-lg shadow-md" />
                    <div>
                        <h3 className='text-3xl font-bold text-primary mb-4'>Educational Programs</h3>
                        <p className='text-lg text-gray-700'>Our educational initiatives aim to empower the next generation with knowledge and skills, offering everything from basic schooling to vocational training.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <h3 className="text-4xl font-bold">10k+</h3>
                    <p>Students Educated</p>
                </div>
                <div>
                    <h3 className="text-4xl font-bold">50k+</h3>
                    <p>Patients Treated</p>
                </div>
                <div>
                    <h3 className="text-4xl font-bold">100+</h3>
                    <p>Community Projects</p>
                </div>
                <div>
                    <h3 className="text-4xl font-bold">5k+</h3>
                    <p>Families Supported</p>
                </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-6">Join Our Mission</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
            Be a part of our journey to create a better world. Your support can make a significant difference.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
            Get Involved Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;