import { Banner } from '@/components/ui/Banner'
import { MemberCard } from '@/components/cards/MemberCard'
import boardContent from '@/config/content/en/board-members.json'

export default function BoardOfMembersPage() {
  return (
    <main className="min-h-screen">
      <Banner
        title={boardContent.banner.title}
        subtitle={boardContent.banner.subtitle}
      />

      {/* President Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              {/* President Image - Left */}
              <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="text-center">
                    <div className="text-8xl mb-4">👤</div>
                    <p className="text-foreground/60">President Photo</p>
                  </div>
                </div>
              </div>

              {/* President Info - Right */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {boardContent.president.name}
                  </h2>
                  <p className="text-xl text-primary font-medium mb-4">
                    {boardContent.president.position}
                  </p>
                  <p className="text-base text-foreground/70 mb-4">
                    {boardContent.president.bio}
                  </p>
                </div>

                {/* President's Message */}
                <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-r-lg">
                  <p className="text-base italic text-foreground/80">
                    &quot;{boardContent.president.message}&quot;
                  </p>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">
                    📧 {boardContent.president.email}
                  </p>
                  <p className="text-sm text-foreground/70">
                    📞 {boardContent.president.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Committee */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {boardContent.executiveCommittee.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardContent.executiveCommittee.members.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  position={member.position}
                  bio={member.bio}
                  email={member.email}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Management Committee */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {boardContent.managementCommittee.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boardContent.managementCommittee.members.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  position={member.position}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
