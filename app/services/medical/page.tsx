'use client'

import { Banner } from '@/components/ui/Banner'
import servicesContent from '@/config/content/en/services.json'
import {
  Clock,
  MapPin,
  Phone,
  Stethoscope,
  Baby,
  Heart,
  Eye,
  Pill,
  Users,
  Calendar,
  CheckCircle,
  Activity,
  FlaskConical,
  Building2,
  Gift,
  BadgeCheck
} from 'lucide-react'

// Custom icons for specialties
const DentalIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8 2 5 5 5 9c0 3 1 5 2 7s2 6 3 6c.5 0 1-1 2-3 1 2 1.5 3 2 3 1 0 2-4 3-6s2-4 2-7c0-4-3-7-7-7z" />
  </svg>
)

const TherapyIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const getSpecialtyIcon = (icon: string) => {
  switch (icon) {
    case 'general':
      return <Stethoscope className="w-6 h-6" />
    case 'child':
      return <Baby className="w-6 h-6" />
    case 'gynae':
      return <Heart className="w-6 h-6" />
    case 'diabetes':
      return <Activity className="w-6 h-6" />
    case 'dental':
      return <DentalIcon />
    case 'eye':
      return <Eye className="w-6 h-6" />
    case 'homeo':
      return <Pill className="w-6 h-6" />
    case 'therapy':
      return <TherapyIcon />
    default:
      return <Stethoscope className="w-6 h-6" />
  }
}

const getSpecialtyColor = (icon: string) => {
  switch (icon) {
    case 'general':
      return 'bg-blue-500/10 text-blue-600'
    case 'child':
      return 'bg-pink-500/10 text-pink-600'
    case 'gynae':
      return 'bg-rose-500/10 text-rose-600'
    case 'diabetes':
      return 'bg-orange-500/10 text-orange-600'
    case 'dental':
      return 'bg-cyan-500/10 text-cyan-600'
    case 'eye':
      return 'bg-purple-500/10 text-purple-600'
    case 'homeo':
      return 'bg-green-500/10 text-green-600'
    case 'therapy':
      return 'bg-amber-500/10 text-amber-600'
    default:
      return 'bg-primary/10 text-primary'
  }
}

export default function MedicalServicePage() {
  const { banner, description, doctors, laboratory, partnerHospitals } = servicesContent.medical

  const stats = [
    { icon: Users, value: '10+', label: 'Expert Doctors' },
    { icon: Stethoscope, value: '8+', label: 'Specialties' },
    { icon: Calendar, value: '6', label: 'Days a Week' },
    { icon: Heart, value: '1000+', label: 'Patients Served' },
  ]

  const services = [
    'General OPD & Ultrasound',
    'Child Specialist (Pediatrics)',
    'Gynaecology',
    'Diabetes Care',
    'Dental Care',
    'Eye Care',
    'Homeopathic Treatment',
    'Hajama Therapy',
    'Laboratory Services',
  ]

  return (
    <main className="min-h-screen">
      <Banner title={banner.title} subtitle={banner.subtitle} />

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Your Health, Our <span className="text-primary">Priority</span>
                </h2>
                <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                  {description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#doctors" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Our Doctors
                  </a>
                  <a href="#contact" className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Right - Image Placeholder */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Stethoscope className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-foreground/40 text-sm">Medical Center Image</p>
                  <p className="text-foreground/30 text-xs mt-1">Add: /public/medical/center.jpg</p>
                </div>
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Trusted by</p>
                      <p className="text-xl font-bold text-foreground">1000+ Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-10 h-10 text-white/80 mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Hospitals - Special Benefits */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Gift className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wide">Exclusive Member Benefits</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Partner Hospitals for Khawajgan Members</h3>
            </div>

            {/* Hospital Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerHospitals.map((hospital, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{hospital.name}</h4>
                      <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-800 px-4 py-1.5 rounded-full mb-3">
                        <BadgeCheck className="w-4 h-4" />
                        <span className="font-bold text-sm">{hospital.benefit}</span>
                      </div>
                      <p className="text-white/80 text-sm">{hospital.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-white/70 text-sm mt-6">
              Show your Khawajgan membership card to avail these exclusive benefits
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Medical Services
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Comprehensive healthcare services under one roof
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-background p-4 rounded-xl text-center hover:shadow-md transition-shadow"
                >
                  <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Expert Doctors
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Experienced healthcare professionals dedicated to your well-being
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Doctor Image Placeholder */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getSpecialtyColor(doctor.icon)} shadow-lg`}>
                      {getSpecialtyIcon(doctor.icon)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h3>
                    <p className="text-primary font-medium mb-4">{doctor.specialty}</p>

                    <div className="flex items-center gap-2 text-foreground/70">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">{doctor.timing}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/5 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                    {laboratory.name}
                  </h2>
                  <p className="text-lg text-primary font-medium mb-3">{laboratory.services}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-foreground/70">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{laboratory.timing}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Doctor Schedule
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Plan your visit with our comprehensive schedule
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-background rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Doctor</th>
                    <th className="px-6 py-4 text-left font-semibold">Specialty</th>
                    <th className="px-6 py-4 text-left font-semibold">Timings</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSpecialtyColor(doctor.icon)}`}>
                            {getSpecialtyIcon(doctor.icon)}
                          </div>
                          <span className="font-medium text-foreground">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{doctor.specialty}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          <Clock className="w-3 h-3" />
                          {doctor.timing}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                          <FlaskConical className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-foreground">{laboratory.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{laboratory.services}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        <Clock className="w-3 h-3" />
                        {laboratory.timing}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Image Placeholder */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-foreground/40 text-sm">Medical Facility Image</p>
                  <p className="text-foreground/30 text-xs mt-1">Add: /public/medical/facility.jpg</p>
                </div>
              </div>

              {/* Right - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose Our <span className="text-primary">Medical Center</span>?
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  We are committed to providing quality healthcare services with experienced professionals and modern facilities at affordable rates.
                </p>

                <div className="space-y-4">
                  {[
                    'Experienced & qualified doctors',
                    'Multiple specialties under one roof',
                    'Affordable consultation fees',
                    'Modern diagnostic facilities',
                    'Convenient timings',
                    'Caring & friendly staff',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Medical Assistance?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Visit our medical center or contact us to book an appointment
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-lg text-foreground/60">
                Visit our medical center or get in touch for appointments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-foreground/60">+92 XXX XXXXXXX</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">OPD Hours</h3>
                <p className="text-foreground/60">10 AM - 8 PM</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Location</h3>
                <p className="text-foreground/60">Khawajgan Complex</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
