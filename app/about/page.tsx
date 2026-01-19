import { Banner } from '@/components/ui/Banner'
import { Timeline } from '@/components/ui/Timeline'
import aboutContent from '@/config/content/en/about.json'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Banner
        title={aboutContent.banner.title}
        subtitle={aboutContent.banner.subtitle}
      />

      {/* Introduction Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {aboutContent.introduction.heading}
            </h2>
            <p className="text-base md:text-lg text-foreground/70">
              {aboutContent.introduction.content}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {aboutContent.mission.heading}
            </h2>
            <p className="text-base md:text-lg text-foreground/70">
              {aboutContent.mission.content}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {aboutContent.values.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutContent.values.items.map((value, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-3 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {aboutContent.timeline.heading}
            </h2>
            <Timeline events={aboutContent.timeline.events} />
          </div>
        </div>
      </section>
    </main>
  )
}
