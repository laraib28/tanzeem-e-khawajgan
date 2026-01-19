import { Calendar } from 'lucide-react'

interface NewsCardProps {
  title: string
  summary: string
  date: string
  category?: string
  imageAlt?: string
}

export function NewsCard({ title, summary, date, category, imageAlt }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* News Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <div className="text-5xl mb-2">📰</div>
            <p className="text-sm text-foreground/60">{imageAlt || 'News image'}</p>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="p-6">
        {category && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-3">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-3">{summary}</p>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Calendar className="w-4 h-4" />
          <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
        </div>
      </div>
    </article>
  )
}
