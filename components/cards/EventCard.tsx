import { Calendar, Clock, MapPin } from 'lucide-react'

interface EventCardProps {
  title: string
  description: string
  date: string
  time: string
  location: string
  status?: 'upcoming' | 'ongoing' | 'completed'
  imageAlt?: string
}

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  status = 'upcoming',
  imageAlt,
}: EventCardProps) {
  const statusColors = {
    upcoming: 'bg-primary/10 text-primary',
    ongoing: 'bg-accent/10 text-accent',
    completed: 'bg-foreground/10 text-foreground/60',
  }

  const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
  }

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Event Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
          <div className="text-center">
            <div className="text-5xl mb-2">🎉</div>
            <p className="text-sm text-foreground/60">{imageAlt || 'Event image'}</p>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Calendar className="w-4 h-4 text-accent" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Clock className="w-4 h-4 text-accent" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
