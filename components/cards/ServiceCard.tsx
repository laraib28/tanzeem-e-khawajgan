import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  icon?: string
  link?: string
}

export function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  const CardContent = (
    <>
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <div className="text-6xl mb-2">{icon || '⚙️'}</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-3">{description}</p>
        {link && (
          <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  )

  if (link) {
    return (
      <Link
        href={link}
        className="group block rounded-lg bg-white shadow-md hover:shadow-lg transition-all border-t-4 border-accent hover:border-primary overflow-hidden"
      >
        {CardContent}
      </Link>
    )
  }

  return (
    <div className="rounded-lg bg-white shadow-md border-t-4 border-accent overflow-hidden">
      {CardContent}
    </div>
  )
}