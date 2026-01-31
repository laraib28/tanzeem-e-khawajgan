'use client'

import { Banner } from '@/components/ui/Banner'
import servicesContent from '@/config/content/en/services.json'
import {
  Clock,
  MapPin,
  Phone,
  Users,
  Calendar,
  CheckCircle,
  Star,
  Sparkles,
  UtensilsCrossed,
  Music,
  Car,
  Snowflake,
  PartyPopper,
  Heart
} from 'lucide-react'

export default function BanquetsServicePage() {
  const { banner, description, halls } = servicesContent.banquets

  const stats = [
    { icon: PartyPopper, value: '500+', label: 'Events Hosted' },
    { icon: Users, value: '3', label: 'Premium Venues' },
    { icon: Star, value: '4.9', label: 'Rating' },
    { icon: Heart, value: '100%', label: 'Satisfaction' },
  ]

  const eventTypes = [
    { icon: Heart, label: 'Weddings' },
    { icon: PartyPopper, label: 'Receptions' },
    { icon: Users, label: 'Corporate Events' },
    { icon: Calendar, label: 'Family Functions' },
    { icon: Sparkles, label: 'Engagement' },
    { icon: Star, label: 'Anniversaries' },
  ]

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('catering') || feature.toLowerCase().includes('menu')) {
      return <UtensilsCrossed className="w-4 h-4" />
    }
    if (feature.toLowerCase().includes('ac') || feature.toLowerCase().includes('air')) {
      return <Snowflake className="w-4 h-4" />
    }
    if (feature.toLowerCase().includes('parking')) {
      return <Car className="w-4 h-4" />
    }
    if (feature.toLowerCase().includes('sound') || feature.toLowerCase().includes('music')) {
      return <Music className="w-4 h-4" />
    }
    if (feature.toLowerCase().includes('stage') || feature.toLowerCase().includes('light')) {
      return <Sparkles className="w-4 h-4" />
    }
    return <CheckCircle className="w-4 h-4" />
  }

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Create <span className="text-accent">Unforgettable</span> Memories
                </h2>
                <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                  {description}
                </p>

                {/* Event Types */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {eventTypes.map((event, index) => (
                    <div key={index} className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                      <event.icon className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">{event.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="#venues" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                    View Venues
                  </a>
                  <a href="#contact" className="border-2 border-accent text-accent px-8 py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                    Book Now
                  </a>
                </div>
              </div>

              {/* Right - Image Placeholder */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <PartyPopper className="w-12 h-12 text-accent" />
                  </div>
                  <p className="text-foreground/40 text-sm">Banquet Hall Image</p>
                  <p className="text-foreground/30 text-xs mt-1">Add: /public/banquets/main.jpg</p>
                </div>
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Rated</p>
                      <p className="text-xl font-bold text-foreground">4.9/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-accent">
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

      {/* Venues Section */}
      <section id="venues" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Premium Venues
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Choose from our elegant halls for your special occasions
              </p>
            </div>

            <div className="space-y-8">
              {halls.map((hall, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Placeholder */}
                    <div className={`relative h-64 lg:h-auto bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <p className="text-foreground/40 text-sm">{hall.name} Image</p>
                        <p className="text-foreground/30 text-xs mt-1">Add: /public/banquets/{hall.name.toLowerCase().replace(/\s+/g, '-')}.jpg</p>
                      </div>
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        {hall.price}
                        <span className="text-xs font-normal ml-1">/{hall.priceType}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">{hall.name}</h3>
                      </div>

                      <p className="text-foreground/70 mb-6 leading-relaxed">{hall.description}</p>

                      {/* Capacity */}
                      <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-foreground">Capacity: {hall.capacity} guests</span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {hall.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full">
                            {getFeatureIcon(feature)}
                            <span className="text-sm font-medium text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-foreground/10">
                        <div>
                          <p className="text-sm text-foreground/60">Starting from</p>
                          <p className="text-2xl font-bold text-accent">{hall.price} <span className="text-sm font-normal text-foreground/60">/{hall.priceType}</span></p>
                        </div>
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                        >
                          Book This Venue
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quick Price Guide
              </h2>
              <p className="text-lg text-foreground/60">
                Compare our venues and choose the best for your event
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-accent text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Venue</th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-left font-semibold">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {halls.map((hall, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-accent" />
                          </div>
                          <span className="font-semibold text-foreground">{hall.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-accent">{hall.price}</span>
                        <span className="text-foreground/60 text-sm ml-1">/{hall.priceType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="text-foreground">{hall.capacity}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Our Venues?
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                We ensure your events are memorable and hassle-free
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UtensilsCrossed className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Delicious Catering</h3>
                <p className="text-foreground/60">Mouth-watering menu options with customizable packages for your guests</p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Elegant Décor</h3>
                <p className="text-foreground/60">Beautiful decorations and ambiance to match your event theme</p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Professional Staff</h3>
                <p className="text-foreground/60">Dedicated team to ensure smooth event execution from start to finish</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Book Your Event?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Contact us today to check availability and reserve your date
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-accent px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Get in Touch
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
                Book Your Venue
              </h2>
              <p className="text-lg text-foreground/60">
                Contact us for bookings and inquiries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Hall Booking</h3>
                <p className="text-foreground/60">0321-3037800</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Office Hours</h3>
                <p className="text-foreground/60">10 AM - 10 PM</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Location</h3>
                <p className="text-foreground/60">F-90, Block F, North Nazimabad</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
