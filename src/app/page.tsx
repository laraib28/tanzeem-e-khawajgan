import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Briefcase, HeartHandshake, Home, Newspaper, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center text-white">
        <Image src="/hero.jpg" alt="Hero Image" layout="fill" objectFit="cover" className="z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10" />
        <div className="z-20 p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Serving Humanity, Together</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Our mission is to uplift communities through comprehensive services and unwavering support.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
              Get Involved
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">About Our Organization</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-8">
            We are a non-profit organization dedicated to making a positive impact on society. For years, we have been at the forefront of providing essential services, fostering education, and promoting community well-being. Our strength lies in our volunteers, our partners, and the generous support from people like you.
          </p>
          <Button asChild>
            <Link href="/about/mission">
              Read More <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Briefcase />, name: 'IT Services', desc: 'Providing modern IT solutions.' },
              { icon: <HeartHandshake />, name: 'Medical Services', desc: 'Accessible healthcare for all.' },
              { icon: <Users />, name: 'Sports Services', desc: 'Promoting health through sports.' },
              { icon: <Home />, name: 'Banquets', desc: 'Event spaces for your gatherings.' },
              { icon: <BookOpen />, name: 'Education', desc: 'Empowering through knowledge.' },
              { icon: <Newspaper />, name: 'Graveyard Services', desc: 'Dignified and respectful services.' },
            ].map(service => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-secondary text-white p-4 rounded-full">{service.icon}</div>
                  <CardTitle className="text-primary">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <Link href={`/services/${service.name.toLowerCase().replace(' ', '-')}`} className="text-secondary font-semibold hover:underline">
                    Learn More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold">25+</h3>
              <p>Years of Service</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">100k+</h3>
              <p>People Served</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">500+</h3>
              <p>Projects Completed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">200+</h3>
              <p>Team Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News/Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Latest News & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Card 1 */}
            <Card>
              <Image src="/hero2.jpg" alt="News 1" width={400} height={250} className="w-full h-48 object-cover"/>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-2">Dec 3, 2025</p>
                <h3 className="text-xl font-semibold text-primary mb-4">Community Health Camp a Success</h3>
                <p className="text-gray-700">Our recent health camp provided free check-ups to over 500 people.</p>
              </CardContent>
            </Card>
             {/* News Card 2 */}
             <Card>
              <Image src="/donation-card.jpg" alt="News 2" width={400} height={250} className="w-full h-48 object-cover"/>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-2">Nov 28, 2025</p>
                <h3 className="text-xl font-semibold text-primary mb-4">Annual Fundraiser Gala</h3>
                <p className="text-gray-700">Join us for a night of giving and celebration to support our causes.</p>
              </CardContent>
            </Card>
             {/* News Card 3 */}
             <Card>
              <Image src="/hero.jpg" alt="News 3" width={400} height={250} className="w-full h-48 object-cover"/>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-2">Nov 15, 2025</p>
                <h3 className="text-xl font-semibold text-primary mb-4">New IT Training Program Launched</h3>
                <p className="text-gray-700">We've launched a new program to equip youth with valuable IT skills.</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/about/news-events">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Support Our Cause</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Your contribution can make a world of difference. Join us in our mission to create a better future.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
            Donate Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;