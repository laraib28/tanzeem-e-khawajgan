'use client'

import { Check } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface IntroductionSectionProps {
  heading: string
  content: string
  highlights: string[]
}

export function IntroductionSection({ heading, content, highlights }: IntroductionSectionProps) {
  return (
    <section className="w-full py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-full tracking-widest uppercase mb-5">
                Who We Are
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                {heading}
              </h2>
              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="h-px w-16 bg-primary/40" />
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="h-px w-16 bg-primary/40" />
              </div>
              <p className="text-base md:text-lg text-foreground/65 leading-relaxed max-w-2xl mx-auto">
                {content}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {highlights.map((highlight, index) => (
              <AnimatedSection
                key={index}
                animation={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                delay={index * 100}
              >
                <div className="flex items-start gap-4 p-5 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/30 hover:bg-accent/10 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 leading-relaxed pt-1">{highlight}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
