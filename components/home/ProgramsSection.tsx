'use client'

import Image from 'next/image'
import Link from 'next/link'

const programs = [
  {
    title: 'Health Care',
    description: 'Providing accessible healthcare services with qualified doctors and medical facilities.',
    image: '/homepage-medical.jpeg',
    link: '/services/medical'
  },
  {
    title: 'Education Program',
    description: 'Quality education and skill development programs for community growth.',
    image: '/h-p-educ.jpeg',
    link: '/services/it'
  },
  {
    title: 'Community Engagement',
    description: 'Building stronger communities through events, gatherings, and social programs.',
    image: '/com-eng.jpeg',
    link: '/services/banquets'
  },
  {
    title: 'Sports Activity',
    description: 'Promoting healthy lifestyles through various sports facilities and programs.',
    image: '/sp-act.jpeg',
    link: '/services/sports'
  }
]

export function ProgramsSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Programs
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Empowering our community through comprehensive services and initiatives
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {programs.map((program, index) => (
            <Link href={program.link} key={index}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {program.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
