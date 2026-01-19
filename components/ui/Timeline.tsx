import { Calendar } from 'lucide-react'

interface TimelineEvent {
  year: string
  title: string
  description: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative py-8">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-accent/30 transform md:-translate-x-1/2" />

      {/* Timeline Events */}
      <div className="space-y-12">
        {events.map((event, index) => (
          <div
            key={index}
            className={`relative flex items-start ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } flex-col md:gap-8`}
          >
            {/* Event Content */}
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} pl-12 md:pl-0`}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2 text-accent font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>{event.year}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-foreground/70">{event.description}</p>
              </div>
            </div>

            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-accent rounded-full border-4 border-background flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>

            {/* Spacer for alternating layout */}
            <div className="hidden md:block flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
