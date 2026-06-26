interface BannerProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function Banner({ title, subtitle }: BannerProps) {
  return (
    <div className="w-full pt-16 pb-10 px-4 text-center">
      <h1 className="animate-page-title text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        {title}
      </h1>

      <div className="animate-page-line mx-auto mt-4 h-[3px] w-16 rounded-full bg-primary" />

      {subtitle && (
        <p className="animate-page-sub mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
