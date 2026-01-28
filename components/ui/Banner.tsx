import Image from 'next/image'

interface BannerProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function Banner({ title, subtitle, backgroundImage }: BannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-foreground'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-lg md:text-xl max-w-2xl ${backgroundImage ? 'text-white/90' : 'text-foreground/70'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
