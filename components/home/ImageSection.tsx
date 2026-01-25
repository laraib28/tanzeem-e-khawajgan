interface ImageSectionProps {
  title: string
  description: string
  imageAlt?: string
}

export function ImageSection({ title, description }: ImageSectionProps) {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {title}
            </h2>
            <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
                  {/* Placeholder - Replace with actual images */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">
                        {index === 1 && '📚'}
                        {index === 2 && '🏥'}
                        {index === 3 && '⚽'}
                        {index === 4 && '🤝'}
                      </div>
                      <p className="text-sm text-foreground/60">
                        {index === 1 && 'Education Programs'}
                        {index === 2 && 'Healthcare Services'}
                        {index === 3 && 'Sports Activities'}
                        {index === 4 && 'Community Engagement'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
