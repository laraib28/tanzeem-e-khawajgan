import { HeroSection } from '@/components/home/HeroSection'
import { IntroductionSection } from '@/components/home/IntroductionSection'
import { ImageSection } from '@/components/home/ImageSection'
import { ImpactCounters } from '@/components/home/ImpactCounters'
import homeContent from '@/config/content/en/home.json'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title={homeContent.hero.title}
        subtitle={homeContent.hero.subtitle}
        description={homeContent.hero.description}
        ctaText={homeContent.hero.ctaText}
        ctaLink={homeContent.hero.ctaLink}
        imageAlt={homeContent.hero.imageAlt}
      />
      <IntroductionSection
        heading={homeContent.introduction.heading}
        content={homeContent.introduction.content}
        highlights={homeContent.introduction.highlights}
      />
      <ImageSection
        title={homeContent.imageSection.title}
        description={homeContent.imageSection.description}
        imageAlt={homeContent.imageSection.imageAlt}
      />
      <ImpactCounters counters={homeContent.impactCounters} />
    </main>
  )
}
