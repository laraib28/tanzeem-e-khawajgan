'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">
      {/* Background Carousel */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Overlay - warm theme tones */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#00715D]/85 via-[#00715D]/50 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F9F5E8]/30 via-transparent to-[#00715D]/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-16 min-h-[90vh] flex items-center">
        <div className="max-w-2xl">
          <p
            className={`text-primary font-semibold text-sm md:text-base tracking-widest uppercase mb-4 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {subtitle}
          </p>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6 transition-all duration-700 delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-base md:text-lg text-white/80 max-w-xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {description}
          </p>
          <div
            className={`flex items-center gap-4 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {ctaText}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white/40 text-white text-base font-semibold hover:bg-white/15 transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* Current slide label */}
          <div
            className={`mt-10 transition-all duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-white/70 text-sm font-medium tracking-wide">
              {heroImages[current].label}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-primary/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-primary/60 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === current
                ? 'bg-primary w-8'
                : 'bg-white/40 w-4 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
