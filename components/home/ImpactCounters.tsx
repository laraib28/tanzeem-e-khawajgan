'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface Counter {
  value: number
  label: string
  suffix: string
}

interface ImpactCountersProps {
  counters: Counter[]
}

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
            const newCounts = [...prev]
            newCounts[index] = Math.min(
              Math.round(increment * currentStep),
              counter.value
            )
            return newCounts
          })
        }
      }, stepDuration)
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [hasStarted, counters])

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-accent">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Our Impact
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <AnimatedSection key={index} animation="zoom-in" delay={index * 100}>
              <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counts[index].toLocaleString()}
                  {counter.suffix}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium">
                  {counter.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
