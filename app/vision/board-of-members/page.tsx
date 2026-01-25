'use client'

import { useState } from 'react'
import { Banner } from '@/components/ui/Banner'
import { User } from 'lucide-react'
import Image from 'next/image'

// President - Featured
const president = {
  name: 'Khawaja Javed Iqbal',
  designation: 'President',
  image: '/ijaz.jpeg',
  message: 'Welcome to Tanzeem-e-Khawajgan. Our commitment is to serve the community with integrity, compassion, and excellence. Together, we strive to create opportunities and improve lives.'
}

// Board of Members - Other leadership with designations
const boardMembers = [
  {
    name: 'Khawaja Haji Muhammad Ahmed',
    designation: 'Sr. Vice President',
    image: '/ahmed.jpeg',
  },
  {
    name: 'Khawaja Muhammad Ahmed',
    designation: 'Vice President',
    image: '/board-members/khawaja-muhammad-ahmed.jpg',
  },
  {
    name: 'Khawaja Babar Hafeez',
    designation: 'General Secretary',
    image: '/baber.jpeg',
  },
  {
    name: 'Zafar Jawed Khawaja',
    designation: 'Finance Secretary',
    image: '/board-members/zafar-jawed-khawaja.jpg',
  },
  {
    name: 'Khawaja Mutayyab Shareef',
    designation: 'Joint Secretary',
    image: '/mutayab.jpeg',
  },
  {
    name: 'Khawaja Haseeb Mazher',
    designation: 'Social Secretary',
    image: '/haseeb.jpeg',
  },
]


// Committee Members - No specific designation
const committeeMembers = [
  { name: 'Khawaja Mustafa Fazal', image: '/mustafa.jpeg' },
  { name: 'Khawaja Masood Ahmed', image: '/masood.jpeg' },
  { name: 'Khawaja Irfan Munir', image: '/irfan.jpeg' },
  { name: 'Khawaja Junaid Ahmed', image: '/junaid.jpeg' },
  { name: 'Khawaja Rehan Saeed', image: '/rehan.jpeg' },
  { name: 'Khawaja Abdul Mannan', image: '/adul-manan.jpeg' },
  { name: 'Khawaja Aijaz Ahmed', image: '/ijaz.jpeg' },
  { name: 'Khawaja Bilal Ahmed', image: '/bilal.jpeg' },
  { name: 'Khawaja Adeel Tahir', image: '/adeel.jpeg' },
  { name: 'Khawaja Rizwan Waqar', image: '/rizwan.jpeg' },
]

// President Featured Card
function PresidentCard({ name, designation, image, message }: { name: string; designation: string; image: string; message: string }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-primary/5 rounded-xl p-8 md:p-10 shadow-sm border border-foreground/5">
      <div className="flex flex-col items-center gap-6">
        {/* Image - Top */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {imageError ? (
            <User className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-primary" />
          ) : (
            <Image
              src={image}
              alt={name}
              width={288}
              height={288}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Content - Bottom */}
        <div className="flex-1 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-lg sm:text-xl font-medium text-primary mb-5">
            {designation}
          </p>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

interface MemberCardProps {
  name: string
  designation?: string
  image?: string
  variant?: 'primary' | 'accent'
}

function MemberCard({ name, designation, image, variant = 'primary' }: MemberCardProps) {
  const [imageError, setImageError] = useState(false)

  const bgClass = variant === 'primary' ? 'bg-primary/5' : 'bg-accent/5'
  const iconBgClass = variant === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
  const iconColorClass = variant === 'primary' ? 'text-primary' : 'text-accent'
  const designationColorClass = variant === 'primary' ? 'text-primary' : 'text-accent'

  const showFallback = !image || imageError

  return (
    <div
      className={`${bgClass} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-foreground/5`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar - Image or Icon Fallback */}
        <div
          className={`w-20 h-20 rounded-full ${iconBgClass} flex items-center justify-center overflow-hidden`}
        >
          {showFallback ? (
            <User className={`w-10 h-10 ${iconColorClass}`} />
          ) : (
            <Image
              src={image}
              alt={name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {name}
        </h3>

        {/* Designation */}
        {designation && (
          <p className={`text-sm font-medium ${designationColorClass}`}>
            {designation}
          </p>
        )}
      </div>
    </div>
  )
}

export default function BoardOfMembersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Banner
        title="Board of Members"
        subtitle="Meet the dedicated leaders guiding our organization"
      />

      {/* President Section - Featured */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-md sm:max-w-lg mx-auto">
            <PresidentCard
              name={president.name}
              designation={president.designation}
              image={president.image}
              message={president.message}
            />
          </div>
        </div>
      </section>

      {/* Board of Members Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
              Board of Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  designation={member.designation}
                  image={member.image}
                  variant="primary"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Committee Members Section */}
      <section className="py-12 md:py-16 bg-accent/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
              Committee Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {committeeMembers.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  designation="Committee Member"
                  image={member.image}
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
