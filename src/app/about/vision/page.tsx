import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Eye, Flag, Target } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const VisionPage = () => {
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
                    <BreadcrumbPage>Vision</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Our Vision</h1>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-6">A Future of Empowerment and Equity</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our vision is to build a self-reliant, educated, and prosperous community where every individual has the opportunity to achieve their full potential. We envision a society free from poverty and discrimination, where healthcare is a right, not a privilege, and where our youth are empowered to become leaders of tomorrow.
            </p>
            <blockquote className="border-l-4 border-secondary pl-6 text-xl italic text-gray-800">
              "To create a world where compassion and service are the cornerstones of a thriving community."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Vision Points */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Eye />, title: 'Empowerment', desc: 'Fostering self-sufficiency and growth.' },
              { icon: <Flag />, title: 'Integrity', desc: 'Upholding transparency and accountability.' },
              { icon: <Target />, title: 'Excellence', desc: 'Striving for the highest quality in service.' },
              { icon: <CheckCircle />, title: 'Community', desc: 'Building a strong, supportive network.' },
              { icon: <HeartHandshake />, title: 'Compassion', desc: 'Serving with empathy and understanding.' },
              { icon: <BookOpen />, title: 'Knowledge', desc: 'Promoting education as a key to progress.' },
            ].map(point => (
              <Card key={point.title} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-secondary text-white w-16 h-16 flex items-center justify-center rounded-full">
                    {point.icon}
                  </div>
                  <CardTitle className="mt-4 text-primary">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{point.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[400px] text-white flex items-center justify-center">
        <Image src="/hero2.jpg" alt="Inspiring Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="z-10 text-center p-4">
          <h2 className="text-4xl font-bold">Join Us in Building a Better Tomorrow</h2>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Future Goals</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-8">
                <li className='flex items-start gap-4'>
                    <div className="bg-secondary text-white p-3 rounded-full mt-1">
                        <Target/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-primary">Expand Healthcare Access</h3>
                        <p className='text-gray-700'>Establish a state-of-the-art hospital to provide advanced medical care to underserved populations.</p>
                    </div>
                </li>
                <li className='flex items-start gap-4'>
                    <div className="bg-secondary text-white p-3 rounded-full mt-1">
                        <BookOpen/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-primary">Enhance Educational Programs</h3>
                        <p className='text-gray-700'>Launch a scholarship fund to support higher education and vocational training for 1,000 students annually.</p>
                    </div>
                </li>
                <li className='flex items-start gap-4'>
                    <div className="bg-secondary text-white p-3 rounded-full mt-1">
                        <Briefcase/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-primary">Promote Economic Growth</h3>
                        <p className='text-gray-700'>Create a micro-finance program to support 500 small businesses and entrepreneurs within the community.</p>
                    </div>
                </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionPage;