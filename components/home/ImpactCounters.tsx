'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Heart, Clock, Layers } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface Counter {
  value: number
  label: string
  suffix: string
}

interface ImpactCountersProps {
  counters: Counter[]
}

const counterIcons = [Users, Heart, Clock, Layers]

export function ImpactCounters({ counters }: ImpactCountersProps) {
  const [counts, setCounts] = useState<number[]>(counters.map(() => 0))
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    const intervals = counters.map((counter, index) => {
      const increment = counter.value / steps
      let currentStep = 0
      return setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCounts((prev) => {
            const next = [...prev]
            next[index] = Math.min(Math.round(increment * currentStep), counter.value)
            return next
          })
        }
      }, stepDuration)
    })
    return () => intervals.forEach(clearInterval)
  }, [hasStarted, counters])

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/5 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-full tracking-widest uppercase mb-5">
              Our Impact
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Numbers That Matter
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {counters.map((counter, index) => {
            const Icon = counterIcons[index % counterIcons.length]
            return (
              <AnimatedSection key={index} animation="zoom-in" delay={index * 100}>
                <div className="text-center p-4 md:p-8 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 group border border-accent/10 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-1 font-display">
                    {counts[index].toLocaleString()}{counter.suffix}
                  </div>
                  <div className="text-sm md:text-base text-foreground/60 font-medium">
                    {counter.label}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
