'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart, Users, BookOpen, Stethoscope } from 'lucide-react'
import { DonateModal } from '@/components/ui/DonateModal'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  imageAlt: string
}

const heroImages = [
  { src: '/graveyard4.jpeg', alt: 'Graveyard Services', label: 'Graveyard Management' },
  { src: '/banquet1.jpeg', alt: 'Banquet Hall', label: 'Premium Banquet Halls' },
  { src: '/graveyard.jpeg', alt: 'Graveyard View', label: 'Sacred Grounds' },
  { src: '/banquet2.jpeg', alt: 'Event Venue', label: 'Event Venues' },
  { src: '/medical.jpeg', alt: 'Medical Services', label: 'Healthcare Services' },
  { src: '/banquet5.jpeg', alt: 'Banquet Services', label: 'Banquet Services' },
  { src: '/graveyard6.jpeg', alt: 'Graveyard Maintenance', label: 'Graveyard Care' },
  { src: '/it1.jpeg', alt: 'IT Services', label: 'IT & Digital Training' },
  { src: '/banquet7.jpeg', alt: 'Community Hall', label: 'Community Events' },
  { src: '/banquet9.jpeg', alt: 'Premium Venue', label: 'Premium Venues' },
]

const pillars = [
  { icon: Stethoscope, label: 'Healthcare' },
  { icon: BookOpen, label: 'Education' },
  { icon: Users, label: 'Community' },
  { icon: Heart, label: 'Welfare' },
]

export function HeroSection({ description, ctaText }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroImages.length), [])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + heroImages.length) % heroImages.length), [])

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      <section className="w-full min-h-[88vh] flex flex-col lg:flex-row pt-6 lg:pt-8">

        {/* ── LEFT: Text Content ── */}
        <div className="flex-1 flex items-center bg-background px-8 md:px-14 lg:px-16 py-16 lg:py-0">
          <div
            className={`max-w-xl w-full transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Eyebrow */}
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-6">
              North Nazimabad · Karachi
            </span>

            {/* Org Name */}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight mb-5">
              Tanzeem-e-<br />
              <span className="text-primary">Khawajgan</span>
            </h1>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-primary/40" />
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="h-px w-10 bg-primary/40" />
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed mb-8">
              {description}
            </p>

            {/* Pillars */}
            <div className="flex flex-wrap gap-3 mb-10">
              {pillars.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-sm text-foreground/65"
                >
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDonateOpen(true)}
                className="px-7 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {ctaText}
              </button>
              <Link
                href="/about"
                className="px-7 py-3 rounded-lg border-2 border-foreground/15 text-foreground/70 font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all"
              >
                Learn More
              </Link>
              <Link
                href="/membership-form"
                className="px-7 py-3 rounded-lg border-2 border-accent/25 text-accent font-semibold text-sm hover:bg-accent/5 transition-all"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Image Carousel ── */}
        <div className="relative w-full lg:w-[52%] min-h-[50vh] lg:min-h-full overflow-hidden lg:my-6 lg:mr-6 lg:rounded-2xl shadow-xl">

          {/* Images */}
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 52vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Subtle left gradient to blend with text side */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* Overlay for label */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

          {/* Slide label */}
          <div className="absolute bottom-16 left-6 z-20">
            <span className="text-white/80 text-sm font-medium tracking-wide">
              {heroImages[current].label}
            </span>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-primary/70 backdrop-blur-sm text-white p-2.5 rounded-full transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-primary/70 backdrop-blur-sm text-white p-2.5 rounded-full transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === current ? 'bg-primary w-6' : 'bg-white/40 w-3 hover:bg-white/60'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </section>

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  )
}
