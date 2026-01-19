import { Banner } from '@/components/ui/Banner'
import { ServiceCard } from '@/components/cards/ServiceCard'
import servicesContent from '@/config/content/en/services.json'

export default function SportsServicePage() {
  const { banner, description, facilities } = servicesContent.sports

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
              Our Sports Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <ServiceCard
                  key={index}
                  title={facility.title}
                  description={facility.description}
                  icon={['⚽', '🏏', '🏀', '💪'][index]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
