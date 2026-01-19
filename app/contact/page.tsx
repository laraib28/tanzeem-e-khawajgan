import { Banner } from '@/components/ui/Banner'
import { FeedbackForm } from '@/components/forms/FeedbackForm'
import dynamic from 'next/dynamic'
import contactContent from '@/config/content/en/contact.json'
import siteConfig from '@/config/site-config.json'

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(
  () => import('@/components/ui/Map').then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-lg bg-foreground/5 flex items-center justify-center">
        <p className="text-foreground/60">Loading map...</p>
      </div>
    )
  }
)

export default function ContactPage() {
  const { banner, contactInfo, map, feedback } = contactContent

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <Banner title={banner.title} subtitle={banner.subtitle} />

      {/* Contact Information Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">{contactInfo.heading}</h2>
          <p className="text-foreground/80 mb-12 max-w-3xl">{contactInfo.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address */}
            <div className="flex items-start gap-4 p-6 bg-background border border-foreground/10 rounded-lg">
              <span className="text-3xl">{contactInfo.address.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">{contactInfo.address.label}</h3>
                <p className="text-foreground/80">{contactInfo.address.value}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-6 bg-background border border-foreground/10 rounded-lg">
              <span className="text-3xl">{contactInfo.phone.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">{contactInfo.phone.label}</h3>
                <a href={`tel:${contactInfo.phone.value}`} className="text-foreground/80 hover:text-primary transition-colors">
                  {contactInfo.phone.value}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-6 bg-background border border-foreground/10 rounded-lg">
              <span className="text-3xl">{contactInfo.email.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">{contactInfo.email.label}</h3>
                <a href={`mailto:${contactInfo.email.value}`} className="text-foreground/80 hover:text-primary transition-colors">
                  {contactInfo.email.value}
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4 p-6 bg-background border border-foreground/10 rounded-lg">
              <span className="text-3xl">{contactInfo.hours.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">{contactInfo.hours.label}</h3>
                <p className="text-foreground/80">{contactInfo.hours.value}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-foreground/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">{map.heading}</h2>
          <p className="text-foreground/80 mb-8">{map.description}</p>

          <Map
            latitude={siteConfig.contact.coordinates.lat}
            longitude={siteConfig.contact.coordinates.lng}
            title={siteConfig.siteName.en}
            description={contactInfo.address.value}
          />
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">{feedback.heading}</h2>
          <p className="text-foreground/80 mb-8">{feedback.description}</p>

          <FeedbackForm />
        </div>
      </section>
    </div>
  )
}
