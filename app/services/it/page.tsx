'use client'

import { Banner } from '@/components/ui/Banner'
import { InquiryForm } from '@/components/forms/InquiryForm'
import servicesContent from '@/config/content/en/services.json'
import Image from 'next/image'
import { Monitor, Users, Award, Clock, CheckCircle, Laptop, TrendingUp, ShoppingCart, Bot } from 'lucide-react'

export default function ITServicePage() {
  const { banner, description, courses, summerCamp } = servicesContent.it

  const stats = [
    { icon: Users, value: '500+', label: 'Students Trained' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Monitor, value: '3', label: 'Professional Courses' },
    { icon: Clock, value: '24/7', label: 'Lab Access' },
  ]

  const labFeatures = [
    'High-speed internet connectivity',
    'Latest computers with modern software',
    'Comfortable learning environment',
    'One-on-one mentorship sessions',
    'Real project experience',
    'Industry expert instructors',
  ]

  return (
    <main className="min-h-screen relative">
      {/* Background Logo */}
      <div
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/ktek-logo.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '40%',
        }}
      />

      {/* Content wrapper with z-index */}
      <div className="relative z-10">
        <Banner title={banner.title} subtitle={banner.subtitle} />

        {/* Hero Section with Image */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left - Content */}
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                    Launch Your <span className="text-primary">E-Commerce</span> Career
                  </h2>
                  <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                    {description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#courses" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      View Courses
                    </a>
                    <a href="#enroll" className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                      Enroll Now
                    </a>
                  </div>
                </div>

                {/* Right - Image */}
                <div className="relative">
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/homepage-com-eng.jpeg"
                      alt="KTEK IT Lab"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </div>
                  {/* Floating Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Success Rate</p>
                        <p className="text-xl font-bold text-foreground">95%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-10 h-10 text-white/80 mx-auto mb-3" />
                    <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Professional Courses
                </h2>
                <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                  Master the skills needed to build successful online businesses
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-background to-primary/5 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 group"
                  >
                    {/* Course Icon */}
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      {course.title.includes('Amazon') ? (
                        <ShoppingCart className="w-8 h-8 text-primary" />
                      ) : course.title.includes('Python') || course.title.includes('AI') ? (
                        <Bot className="w-8 h-8 text-primary" />
                      ) : (
                        <Laptop className="w-8 h-8 text-primary" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3">{course.title}</h3>
                    <p className="text-foreground/70 mb-6 leading-relaxed">{course.description}</p>

                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{course.level}</span>
                      </div>
                    </div>

                    <a
                      href="#enroll"
                      className="inline-flex items-center text-primary font-semibold hover:gap-3 gap-2 transition-all"
                    >
                      Enroll Now
                      <span>→</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lab Facilities Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left - Images Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/homepage-education.jpeg"
                        alt="IT Lab Environment"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-32 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/homepage-com-eng.jpeg"
                        alt="Computer Lab"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative h-32 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/homepage-main.jpeg"
                        alt="Training Session"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/homepage-education.jpeg"
                        alt="Students Learning"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right - Content */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    State-of-the-Art <span className="text-primary">IT Lab</span>
                  </h2>
                  <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                    Our modern IT lab is equipped with the latest technology to provide you with hands-on learning experience. Train in a professional environment that mirrors real-world work settings.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {labFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summer Camp Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-12 h-12 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      Summer IT Camp 🌟
                    </h2>
                    <p className="text-lg text-foreground/70 leading-relaxed">{summerCamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose KTEK?
                </h2>
                <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                  We provide comprehensive training that prepares you for real-world success
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Expert Instructors</h3>
                  <p className="text-foreground/60">Learn from industry professionals with real-world experience in e-commerce</p>
                </div>

                <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Laptop className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Hands-on Training</h3>
                  <p className="text-foreground/60">Practice on real projects and build your portfolio while learning</p>
                </div>

                <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Certification</h3>
                  <p className="text-foreground/60">Receive recognized certificates upon successful course completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your E-Commerce Journey?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join hundreds of successful students who have transformed their careers
              </p>
              <a
                href="#enroll"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                Enroll Today
              </a>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section id="enroll" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left - Info */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                    Enroll in IT Courses
                  </h2>
                  <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                    Take the first step towards your e-commerce career. Fill out the form and our team will contact you with all the details.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Flexible Timing</h4>
                        <p className="text-foreground/60">Morning and evening batches available</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Small Batch Size</h4>
                        <p className="text-foreground/60">Personal attention with limited seats per batch</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Job Assistance</h4>
                        <p className="text-foreground/60">Career guidance and placement support</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <InquiryForm courses={courses} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
