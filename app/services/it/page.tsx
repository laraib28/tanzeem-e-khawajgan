import { Banner } from '@/components/ui/Banner'
import { InquiryForm } from '@/components/forms/InquiryForm'
import servicesContent from '@/config/content/en/services.json'

export default function ITServicePage() {
  const { banner, description, courses, summerCamp } = servicesContent.it

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      {/* Description Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-foreground/70 leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-md border-l-4 border-primary">
                  <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-foreground/70 mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-foreground/60">
                    <div>
                      <span className="font-medium">Duration:</span> {course.duration}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {course.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summer Camp Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-accent/5 border-l-4 border-accent p-8 rounded-r-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Summer IT Camp</h2>
              <p className="text-base text-foreground/70">{summerCamp}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Enroll in IT Courses</h2>
              <p className="text-base text-foreground/70">
                Interested in our IT training programs? Fill out the form below and our team will contact you.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <InquiryForm courses={courses} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}