import Image from 'next/image'

interface BannerProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function Banner({ title, subtitle, backgroundImage }: BannerProps) {
  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden">
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* Professional gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-accent/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>
        </div>
      )}

      {/* Decorative elements */}
      {backgroundImage && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      )}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start md:items-center text-left md:text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
