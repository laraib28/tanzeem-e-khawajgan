'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Users, BookOpen, Stethoscope } from 'lucide-react'

const pillars = [
  { icon: Stethoscope, label: 'Healthcare' },
  { icon: BookOpen, label: 'Education' },
  { icon: Users, label: 'Community' },
  { icon: Heart, label: 'Welfare' },
]

export function OrgIntroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="w-full bg-background pt-14 pb-10 px-4">
      <div className="max-w-3xl mx-auto text-center">

        {/* Eyebrow */}
        <p
          className={`text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 transition-all duration-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          North Nazimabad · Karachi
        </p>

        {/* Title */}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight transition-all duration-700 delay-100 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          Tanzeem-e-Khawajgan
        </h1>

        {/* Divider */}
        <div
          className={`flex items-center justify-center gap-3 my-5 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="h-px w-12 bg-primary/40" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="h-px w-12 bg-primary/40" />
        </div>

        {/* Description */}
        <p
          className={`text-base md:text-lg text-foreground/65 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          ایک قابل اعتماد کمیونٹی تنظیم جو صحت، تعلیم، کھیل اور سماجی بہبود کے ذریعے خواجگان برادری کی خدمت میں پیش پیش ہے۔
          <span className="block mt-2 text-sm text-foreground/50">
            A trusted community organization dedicated to serving the Khawajgan community through healthcare, education, sports, and social welfare.
          </span>
        </p>

        {/* Pillars */}
        <div
          className={`flex flex-wrap justify-center gap-4 mt-8 transition-all duration-700 delay-[400ms] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {pillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-sm text-foreground/70"
            >
              <Icon className="w-4 h-4 text-accent" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA links */}
        <div
          className={`flex flex-wrap justify-center gap-3 mt-8 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/about"
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            About Us
          </Link>
          <Link
            href="/membership-form"
            className="px-6 py-2.5 rounded-lg border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/5 transition-colors"
          >
            Become a Member
          </Link>
        </div>

      </div>
    </section>
  )
}
