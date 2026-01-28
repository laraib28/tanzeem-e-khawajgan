'use client'

import { useState } from 'react'
import { Banner } from '@/components/ui/Banner'
import { User, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

const president = {
  name: 'Khawaja Javed Iqbal',
  designation: 'President & Chairman',
  image: '/ijaz.jpeg',
  description: 'Leading the organization with vision and dedication. Committed to excellence in community service and organizational growth.',
  message: 'Welcome to Tanzeem-e-Khawjgan. Our commitment is to serve the community with integrity, compassion, and excellence. Together, we strive to create opportunities and improve lives.',
  email: 'president@tanzeem-e-khawjgan.org',
  phone: '+92 XXX XXXXXXX'
}

const boardMembers = [
  {
    name: 'Khawaja Haji Muhammad Ahmed',
    designation: 'Sr. Vice President',
    image: '/ahmed.jpeg',
    description: 'Supporting organizational leadership and strategic initiatives.',
    email: 'srvp@tanzeem-e-khawjgan.org'
  },
  {
    name: 'Khawaja Muhammad Ahmed',
    designation: 'Vice President',
    image: '/board-members/khawaja-muhammad-ahmed.jpg',
    description: 'Guiding organizational growth and community relations.',
    email: 'vp@tanzeem-e-khawjgan.org'
  },
  {
    name: 'Khawaja Babar Hafeez',
    designation: 'General Secretary',
    image: '/baber.jpeg',
    description: 'Managing organizational operations and administrative affairs.',
    email: 'secretary@tanzeem-e-khawjgan.org'
  },
  {
    name: 'Zafar Jawed Khawaja',
    designation: 'Finance Secretary',
    image: '/board-members/zafar-jawed-khawaja.jpg',
    description: 'Overseeing financial management and accountability.',
    email: 'finance@tanzeem-e-khawjgan.org'
  },
  {
    name: 'Khawaja Mutayyab Shareef',
    designation: 'Joint Secretary',
    image: '/mutayab.jpeg',
    description: 'Coordinating organizational activities and member engagement.',
    email: 'joint@tanzeem-e-khawjgan.org'
  },
  {
    name: 'Khawaja Haseeb Mazher',
    designation: 'Social Secretary',
    image: '/haseeb.jpeg',
    description: 'Leading social programs and community events.',
    email: 'social@tanzeem-e-khawjgan.org'
  },
]

const committeeMembers = [
  { name: 'Khawaja Mustafa Fazal', image: '/mustafa.jpeg', description: 'Active contributor to community initiatives.' },
  { name: 'Khawaja Masood Ahmed', image: '/masood.jpeg', description: 'Dedicated member serving the organization.' },
  { name: 'Khawaja Irfan Munir', image: '/irfan.jpeg', description: 'Supporting organizational activities.' },
  { name: 'Khawaja Junaid Ahmed', image: '/junaid.jpeg', description: 'Committed to community development.' },
  { name: 'Khawaja Rehan Saeed', image: '/rehan.jpeg', description: 'Contributing to welfare programs.' },
  { name: 'Khawaja Abdul Mannan', image: '/adul-manan.jpeg', description: 'Active participant in community service.' },
  { name: 'Khawaja Aijaz Ahmed', image: '/ijaz.jpeg', description: 'Supporting organizational growth.' },
  { name: 'Khawaja Bilal Ahmed', image: '/bilal.jpeg', description: 'Dedicated to community welfare.' },
  { name: 'Khawaja Adeel Tahir', image: '/adeel.jpeg', description: 'Contributing to organizational success.' },
  { name: 'Khawaja Rizwan Waqar', image: '/rizwan.jpeg', description: 'Active member in community programs.' },
]

function PresidentCard() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-[#FDF6E9] rounded-xl p-6 md:p-10 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="w-full lg:w-[45%] aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#D4C4A8] via-[#B8C4B8] to-[#A8C4C4] flex items-center justify-center">
          {imageError ? (
            <User className="w-24 h-24 text-primary/60" />
          ) : (
            <Image
              src={president.image}
              alt={president.name}
              width={500}
              height={375}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {president.name}
          </h3>
          <p className="text-lg md:text-xl font-semibold text-primary mb-4">
            {president.designation}
          </p>
          <p className="text-base text-foreground/80 mb-6 leading-relaxed">
            {president.description}
          </p>
          <div className="border-l-4 border-accent pl-4 mb-6">
            <p className="text-base italic text-foreground/70 leading-relaxed">
              &ldquo;{president.message}&rdquo;
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-foreground/70">
              <Mail className="w-5 h-5 text-accent" />
              <span className="text-sm">{president.email}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <Phone className="w-5 h-5 text-accent" />
              <span className="text-sm">{president.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemberCardProps {
  name: string
  designation: string
  image?: string
  description?: string
  email?: string
  variant?: 'primary' | 'accent'
}

function MemberCard({ name, designation, image, description, email, variant = 'primary' }: MemberCardProps) {
  const [imageError, setImageError] = useState(false)

  const showFallback = !image || imageError

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#D4C4A8] via-[#B8C4B8] to-[#A8C4C4] flex items-center justify-center">
        {showFallback ? (
          <User className="w-16 h-16 text-primary/60" />
        ) : (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-lg font-bold text-foreground text-left">
          {name}
        </h3>
        <p className="text-sm font-semibold text-primary text-left mt-1">
          {designation}
        </p>
        {description && (
          <p className="text-sm text-foreground/70 text-left mt-3 leading-relaxed">
            {description}
          </p>
        )}
        {email && (
          <>
            <div className="border-t border-foreground/10 mt-4 pt-4">
              <div className="flex items-center gap-2 text-foreground/70">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-xs">{email}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function BoardOfMembersPage() {
  return (
    <main className="min-h-screen bg-primary/5">
      <Banner
        title="Board of Members"
        subtitle="Meet the dedicated leaders guiding our organization"
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <PresidentCard />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-left mb-8 text-foreground">
              Board of Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  designation={member.designation}
                  image={member.image}
                  description={member.description}
                  email={member.email}
                  variant="primary"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-accent/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-left mb-8 text-foreground">
              Committee Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committeeMembers.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  designation="Committee Member"
                  image={member.image}
                  description={member.description}
                  variant="accent"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
