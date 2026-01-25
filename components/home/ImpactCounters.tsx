'use client'

import { useEffect, useState } from 'react'

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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds animation
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
  }, [isVisible, counters])

  return (
    <section className="w-full py-12 md:py-16 bg-accent/5">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {counts[index].toLocaleString()}
                {counter.suffix}
              </div>
              <div className="text-sm md:text-base text-foreground/70 font-medium">
                {counter.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
