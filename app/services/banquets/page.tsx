import { Banner } from '@/components/ui/Banner'
import servicesContent from '@/config/content/en/services.json'

export default function BanquetsServicePage() {
  const { banner, description, halls } = servicesContent.banquets

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-foreground/70 leading-relaxed">{description}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Our Event Venues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {halls.map((hall, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
                  <div className="text-5xl mb-4 text-center">{['🏛️', '🎪', '📊'][index]}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{hall.title}</h3>
                  <p className="text-sm text-foreground/70 mb-3">{hall.description}</p>
                  <div className="text-sm font-medium text-primary">
                    Capacity: {hall.capacity} guests
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
