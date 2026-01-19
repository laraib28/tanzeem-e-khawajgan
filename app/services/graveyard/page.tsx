import { Banner } from '@/components/ui/Banner'
import { ServiceCard } from '@/components/cards/ServiceCard'
import servicesContent from '@/config/content/en/services.json'

export default function GraveyardServicePage() {
  const { banner, description, services, contact } = servicesContent.graveyard

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-foreground/70 leading-relaxed">{description}</p>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={['🕊️', '🙏', '🌿'][index]}
                />
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-background p-8 rounded-lg shadow-md border-l-4 border-accent">
              <h3 className="text-2xl font-bold text-foreground mb-4">Contact Information</h3>
              <p className="text-base text-foreground/70">{contact}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
