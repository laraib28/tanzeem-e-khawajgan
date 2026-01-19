import { Banner } from '@/components/ui/Banner'
import { NewsCard } from '@/components/cards/NewsCard'
import { EventCard } from '@/components/cards/EventCard'
import newsEventsContent from '@/config/content/en/news-events.json'

export default function NewsEventsPage() {
  return (
    <main className="min-h-screen">
      <Banner
        title={newsEventsContent.banner.title}
        subtitle={newsEventsContent.banner.subtitle}
      />

      {/* Latest News Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {newsEventsContent.news.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {newsEventsContent.news.items.map((newsItem, index) => (
                <NewsCard
                  key={index}
                  title={newsItem.title}
                  summary={newsItem.summary}
                  date={newsItem.date}
                  category={newsItem.category}
                  imageAlt={newsItem.imageAlt}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {newsEventsContent.events.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {newsEventsContent.events.items.map((event, index) => (
                <EventCard
                  key={index}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  status={event.status as 'upcoming' | 'ongoing' | 'completed'}
                  imageAlt={event.imageAlt}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
