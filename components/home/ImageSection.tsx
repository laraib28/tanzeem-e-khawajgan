import Image from 'next/image'

interface ImageSectionProps {
  title: string
  description: string
  imageAlt?: string
}

const sectionImages = [
  { src: '/banquet6.jpeg', label: 'Banquet Services', icon: '🎉' },
  { src: '/banquet7.jpeg', label: 'Event Management', icon: '🏥' },
  { src: '/banquet8.jpeg', label: 'Community Hall', icon: '⚽' },
  { src: '/banquet9.jpeg', label: 'Premium Venues', icon: '🤝' },
]

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
            {sectionImages.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <Image
                  src={image.src}
                  alt={image.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-2xl mr-2">{image.icon}</span>
                  <span className="font-semibold">{image.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
