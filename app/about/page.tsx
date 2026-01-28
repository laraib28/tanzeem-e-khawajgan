import { Banner } from '@/components/ui/Banner'
import { Timeline } from '@/components/ui/Timeline'
import aboutContent from '@/config/content/en/about.json'
import { Target, Eye, Heart, Users } from 'lucide-react'

const valueIcons = [Target, Eye, Heart, Users]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Banner
        title={aboutContent.banner.title}
        subtitle={aboutContent.banner.subtitle}
        backgroundImage="/bg-about-f-e.jpeg"
      />

      {/* Introduction Section */}
      <section className="py-16 md:py-20 bg-[#FDF6E9]">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {aboutContent.introduction.heading}
            </h2>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
              {aboutContent.introduction.content}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-accent/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-primary">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {aboutContent.mission.content}
                </p>
              </div>
              {/* Vision */}
              <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-accent">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
                <p className="text-foreground/70 leading-relaxed">
                  To be a leading community organization that transforms lives through sustainable programs in education, healthcare, and social welfare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {aboutContent.values.heading}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutContent.values.items.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length]
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-[#FDF6E9]">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Our History
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {aboutContent.timeline.heading}
              </h2>
            </div>
            <Timeline events={aboutContent.timeline.events} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-accent">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Us in Making a Difference
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Be a part of our mission to serve the community and create lasting positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/membership-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Become a Member
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-accent font-medium rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
