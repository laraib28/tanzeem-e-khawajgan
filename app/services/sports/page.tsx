'use client'

import { Banner } from '@/components/ui/Banner'
import servicesContent from '@/config/content/en/services.json'
import Image from 'next/image'
import { Clock, MapPin, Phone, CheckCircle, Star, Users, Trophy, Calendar } from 'lucide-react'

// Sport icons as components
const BadmintonIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v8M8 12h8M6 20l6-4 6 4" />
  </svg>
)

const CricketIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20L20 4M4 4l4 4M16 16l4 4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const SnookerIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <circle cx="12" cy="14" r="3" />
    <path d="M12 17v5" />
  </svg>
)

const PoolIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="7" cy="7" r="3" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="7" cy="17" r="3" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'badminton':
      return <BadmintonIcon />
    case 'cricket':
      return <CricketIcon />
    case 'snooker':
      return <SnookerIcon />
    case 'pool':
      return <PoolIcon />
    default:
      return <Trophy className="w-8 h-8" />
  }
}

// Facility images
const facilityImages: Record<string, string> = {
  badminton: '/badminton.jpg',
  cricket: '/cricket.jpg',
  snooker: '',  // Placeholder - add image later
  pool: '',     // Placeholder - add image later
}

export default function SportsServicePage() {
  const { banner, description, timings, facilities } = servicesContent.sports

  const stats = [
    { icon: Users, value: '1000+', label: 'Monthly Visitors' },
    { icon: Trophy, value: '4', label: 'Sports Available' },
    { icon: Star, value: '4.8', label: 'Rating' },
    { icon: Calendar, value: '18hrs', label: 'Daily Open' },
  ]

  const features = [
    'Professional-grade equipment',
    'Well-maintained facilities',
    'Affordable rates',
    'Open till late night',
    'Friendly staff',
    'Safe environment',
  ]

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Your Ultimate <span className="text-primary">Sports</span> Destination
                </h2>
                <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                  {description}
                </p>

                {/* Timings Badge */}
                <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full mb-8">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Open: {timings}</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="#facilities" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    View Facilities
                  </a>
                  <a href="#contact" className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                    Book Now
                  </a>
                </div>
              </div>

              {/* Right - Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/badminton.jpg"
                      alt="Badminton Court"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-3 left-3 text-white font-semibold">Badminton</p>
                  </div>
                  <div className="relative h-32 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/cricket.jpg"
                      alt="Cricket Net"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-3 left-3 text-white font-semibold">Cricket</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-32 rounded-xl overflow-hidden shadow-lg bg-green-500/10 flex items-center justify-center">
                    {/* Placeholder for Snooker */}
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                        <SnookerIcon />
                      </div>
                      <p className="text-sm font-medium text-foreground/60">Snooker</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg bg-blue-500/10 flex items-center justify-center">
                    {/* Placeholder for Pool */}
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                        <PoolIcon />
                      </div>
                      <p className="text-sm font-medium text-foreground/60">Pool</p>
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

      {/* Facilities & Pricing Section */}
      <section id="facilities" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Facilities & Pricing
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Premium sports facilities at competitive rates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((facility, index) => {
                const hasImage = facilityImages[facility.icon]
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image or Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10">
                      {hasImage ? (
                        <>
                          <Image
                            src={facilityImages[facility.icon]}
                            alt={facility.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 text-primary shadow-lg group-hover:scale-110 transition-transform">
                              {getIcon(facility.icon)}
                            </div>
                            <p className="text-xs text-foreground/40">Image Coming Soon</p>
                          </div>
                        </div>
                      )}
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        {facility.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-3">{facility.title}</h3>
                      <p className="text-foreground/70 mb-4 leading-relaxed">{facility.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{timings}</span>
                        </div>
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                        >
                          Book Now <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
                Quick Price Guide
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/5">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <BadmintonIcon />
                  </div>
                  <p className="font-bold text-foreground">Badminton</p>
                  <p className="text-2xl font-bold text-primary mt-2">₨ 1,500</p>
                  <p className="text-sm text-foreground/60">per hour</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-accent/5">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 text-accent">
                    <CricketIcon />
                  </div>
                  <p className="font-bold text-foreground">Cricket</p>
                  <p className="text-2xl font-bold text-accent mt-2">₨ 2,000+</p>
                  <p className="text-sm text-foreground/60">per hour</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-green-500/5">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                    <SnookerIcon />
                  </div>
                  <p className="font-bold text-foreground">Snooker</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">₨ 7</p>
                  <p className="text-sm text-foreground/60">per minute</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-blue-500/5">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                    <PoolIcon />
                  </div>
                  <p className="font-bold text-foreground">Pool</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₨ 100</p>
                  <p className="text-sm text-foreground/60">per game</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Operating Hours: {timings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Features */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose Our <span className="text-primary">Sports Complex</span>?
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  We provide a premium sports experience with top-quality facilities, professional equipment, and a welcoming atmosphere for players of all skill levels.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/badminton.jpg"
                  alt="Sports Complex"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
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
              Ready to Play?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Book your slot now and experience the best sports facilities in town!
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contact & Booking
              </h2>
              <p className="text-lg text-foreground/60">
                Get in touch to book your slot or for any inquiries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-foreground/60">+92 XXX XXXXXXX</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Timings</h3>
                <p className="text-foreground/60">{timings}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Location</h3>
                <p className="text-foreground/60">Khawajgan Complex</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
