import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, Stethoscope, Microscope, ShieldPlus, UserMd, Activity } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

const MedicalServicesPage = () => {
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
                <BreadcrumbPage>Medical Services</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Medical Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mt-4">
            Compassionate care for a healthier community.
          </p>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <HeartPulse />, title: 'Primary Healthcare', desc: 'General check-ups and treatments.' },
              { icon: <Stethoscope />, title: 'Emergency Services', desc: '24/7 emergency medical care.' },
              { icon: <Microscope />, title: 'Diagnostic Services', desc: 'Accurate and timely diagnostics.' },
              { icon: <ShieldPlus />, title: 'Preventive Care', desc: 'Health screenings and vaccinations.' },
              { icon: <UserMd />, title: 'Medical Consultations', desc: 'Expert advice from specialists.' },
              { icon: <Activity />, title: 'Health Programs', desc: 'Community health awareness campaigns.' },
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

        {/* Appointment Booking */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-primary mb-6">Book an Appointment</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                    Our medical team is here to help. Contact us to schedule your appointment.
                </p>
                <div className='text-left max-w-md mx-auto space-y-4'>
                    <p><strong>Phone:</strong> +1 234 567 890</p>
                    <p><strong>Email:</strong> medical@organization.com</p>
                    <p><strong>Timings:</strong> Mon-Sat: 9am - 8pm</p>
                </div>
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white mt-8" asChild>
                    <a href="/contact">Contact Us</a>
                </Button>
            </div>
        </section>

      {/* Health Tips Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Health Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Stay Hydrated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-700'>Drink at least 8 glasses of water a day to keep your body functioning optimally.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Eat a Balanced Diet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-700'>Include a variety of fruits, vegetables, and whole grains in your meals.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Regular Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-700'>Aim for at least 30 minutes of moderate physical activity most days of the week.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalServicesPage;