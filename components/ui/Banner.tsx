interface BannerProps {
  title: string
  subtitle?: string
}

export function Banner({ title, subtitle }: BannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
      {/* Background Pattern/Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative pattern */}
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
