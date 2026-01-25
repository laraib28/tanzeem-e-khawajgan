import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  imageAlt: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Left */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium">
                {subtitle}
              </p>
              <p className="text-base md:text-lg text-foreground/70 max-w-2xl">
                {description}
              </p>
            </div>
            <div>
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center px-8 py-4 min-h-[44px] rounded-md bg-primary text-white text-base font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                {ctaText}
              </Link>
            </div>
          </div>

          {/* Image - Right */}
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
              {/* Placeholder - Replace with actual image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🏛️</div>
                  <p className="text-foreground/60">{imageAlt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
