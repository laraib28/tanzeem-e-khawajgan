import { Mail, Phone } from 'lucide-react'

interface MemberCardProps {
  name: string
  position: string
  bio?: string
  email?: string
  phone?: string
  imageAlt?: string
}

export function MemberCard({
  name,
  position,
  bio,
  email,
  phone,
  imageAlt,
}: MemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Member Image Placeholder */}
      <div className="relative w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <div className="text-6xl mb-2">👤</div>
            <p className="text-sm text-foreground/60">{imageAlt || 'Member photo'}</p>
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-primary font-medium mb-3">{position}</p>
        {bio && <p className="text-sm text-foreground/70 mb-4">{bio}</p>}

        {/* Contact Info */}
        {(email || phone) && (
          <div className="space-y-2 pt-4 border-t">
            {email && (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Mail className="w-4 h-4 text-accent" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Phone className="w-4 h-4 text-accent" />
                <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
