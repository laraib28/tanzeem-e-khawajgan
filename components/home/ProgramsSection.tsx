'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const programs = [
  {
    title: 'Health Care',
    description: 'Providing accessible healthcare services with qualified doctors and medical facilities.',
    image: '/homepage-medical.jpeg',
    link: '/services/medical',
    color: 'from-primary/80 to-primary/40',
  },
  {
    title: 'Education Program',
    description: 'Quality education and skill development programs for community growth.',
    image: '/h-p-educ.jpeg',
    link: '/services/it',
    color: 'from-accent/80 to-accent/40',
  },
  {
    title: 'Community Engagement',
    description: 'Building stronger communities through events, gatherings, and social programs.',
    image: '/com-eng.jpeg',
    link: '/services/banquets',
    color: 'from-primary/80 to-accent/40',
  },
  {
    title: 'Sports Activity',
    description: 'Promoting healthy lifestyles through various sports facilities and programs.',
    image: '/sp-act.jpeg',
    link: '/services/sports',
    color: 'from-accent/80 to-primary/40',
  },
]

export function ProgramsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F2EDD9]">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-widest uppercase mb-5">
              What We Do
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Programs
            </h2>
            <p className="text-base md:text-lg text-foreground/60 max-w-xl mx-auto">
              Empowering our community through comprehensive services and initiatives
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((program, index) => (
            <AnimatedSection key={index} animation="zoom-in" delay={index * 120}>
              <Link href={program.link} className="block h-full group">
                <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col bg-white">
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed flex-1">
                      {program.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
