import { Banner } from '@/components/ui/Banner'
import { Check } from 'lucide-react'
import missionContent from '@/config/content/en/mission.json'

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <Banner
        title={missionContent.banner.title}
        subtitle={missionContent.banner.subtitle}
      />

      {/* Mission Statement */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {missionContent.mission.heading}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {missionContent.mission.content}
            </p>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {missionContent.vision.heading}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {missionContent.vision.content}
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {missionContent.objectives.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missionContent.objectives.items.map((objective, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow border-t-4 border-accent"
                >
                  <div className="text-4xl mb-4">{objective.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {objective.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{objective.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {missionContent.principles.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missionContent.principles.items.map((principle, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-background/50"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <p className="text-base text-foreground/80">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
