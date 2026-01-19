import { Check } from 'lucide-react'

interface IntroductionSectionProps {
  heading: string
  content: string
  highlights: string[]
}

export function IntroductionSection({
  heading,
  content,
  highlights,
}: IntroductionSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            {heading}
          </h2>
          <p className="text-base md:text-lg text-foreground/70 text-center mb-8">
            {content}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <p className="text-sm md:text-base text-foreground/80">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
