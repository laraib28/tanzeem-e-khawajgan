'use client'

import { useState } from 'react'
import { Banner } from '@/components/ui/Banner'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// All countries list
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const CITIES = ["Bhera", "Miani", "Pind Dadan Khan", "Sargodha", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Other"]

const CASTS = ["Roar", "Wohra", "Sethi", "Mehta", "Sehgal", "Dogal", "Kapoor", "Other"]

const EDUCATION_LEVELS = [
  "No Formal Education",
  "Primary",
  "Middle",
  "Matric",
  "Intermediate",
  "Bachelor's",
  "Master's",
  "Doctorate",
  "Other"
]

const INCOME_SOURCES = [
  "Employment",
  "Self-Employment",
  "Business",
  "Agriculture",
  "Pension",
  "Rental Income",
  "Investment",
  "Other"
]

const OCCUPATIONS = [
  "Government Employee",
  "Private Employee",
  "Business Owner",
  "Farmer",
  "Teacher",
  "Doctor",
  "Engineer",
  "Lawyer",
  "Student",
  "Retired",
  "Homemaker",
  "Other"
]

interface FormData {
  membershipNumber: string
  gender: string
  fullName: string
  relationshipType: string
  relationName: string
  fatherInLawName: string
  cnic: string
  country: string
  nativeCity: string
  currentCity: string
  address: string
  dateOfBirth: string
  cast: string
  sourceOfIncome: string
  education: string
  occupation: string
  profession: string
  numberOfDependents: string
  relationshipWithDependents: string
  // Office use only
  formReceivedDate: string
  verifiedBy: string
  verificationRemarks: string
  approvalStatus: string
  membershipIssuedDate: string
  officialSignature: string
  officeStamp: string
}

interface ValidationErrors {
  membershipNumber?: string
  [key: string]: string | undefined
}

export default function MembershipFormPage() {
  const [formData, setFormData] = useState<FormData>({
    membershipNumber: '',
    gender: '',
    fullName: '',
    relationshipType: 'son_of',
    relationName: '',
    fatherInLawName: '',
    cnic: '',
    country: 'Pakistan',
    nativeCity: '',
    currentCity: '',
    address: '',
    dateOfBirth: '',
    cast: '',
    sourceOfIncome: '',
    education: '',
    occupation: '',
    profession: '',
    numberOfDependents: '',
    relationshipWithDependents: '',
    formReceivedDate: '',
    verifiedBy: '',
    verificationRemarks: '',
    approvalStatus: '',
    membershipIssuedDate: '',
    officialSignature: '',
    officeStamp: ''
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupType, setLookupType] = useState<'membership_no' | 'full_name' | 'cnic'>('cnic')
  const [lookupMessage, setLookupMessage] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate membership number format
  const validateMembershipNumber = (value: string): string | undefined => {
    if (!value) return undefined // Optional field
    if (value.length !== 5) {
      return 'Membership number must be exactly 5 characters'
    }
    if (!/^[A-Za-z0-9]+$/.test(value)) {
      return 'Membership number must be alphanumeric only'
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validate membership number on change
    if (name === 'membershipNumber') {
      const error = validateMembershipNumber(value)
      setErrors(prev => ({ ...prev, membershipNumber: error }))
    }
  }

  // Member lookup function
  const handleLookup = async () => {
    if (!lookupQuery.trim()) {
      setLookupMessage('Please enter CNIC, membership number, or name')
      return
    }

    setLookupLoading(true)
    setLookupMessage('')

    try {
      const params = new URLSearchParams()
      if (lookupType === 'membership_no') {
        params.append('membership_no', lookupQuery.trim())
      } else if (lookupType === 'cnic') {
        params.append('cnic', lookupQuery.trim())
      } else {
        params.append('full_name', lookupQuery.trim())
      }

      const response = await fetch(`${BACKEND_URL}/lookup-member?${params.toString()}`)
      const data = await response.json()

      if (data.success && data.data && !data.multiple) {
        // Single member found - fill the form
        const member = data.data
        setFormData(prev => ({
          ...prev,
          membershipNumber: member.membership_no || '',
          gender: member.gender || '',
          fullName: member.full_name || '',
          relationshipType: member.relationship_type || 'son_of',
          relationName: member.relation_name || '',
          fatherInLawName: member.father_in_law_name || '',
          cnic: member.cnic || '',
          country: member.country || 'Pakistan',
          nativeCity: member.native_city || member.city || '',
          currentCity: member.current_city || '',
          address: member.address || '',
          dateOfBirth: member.date_of_birth || '',
          cast: member.cast || '',
          sourceOfIncome: member.source_of_income || '',
          education: member.education || '',
          occupation: member.occupation || '',
          profession: member.profession || '',
          numberOfDependents: member.dependents_count?.toString() || '',
          relationshipWithDependents: member.dependents_relation || ''
        }))
        setLookupMessage('Member record found and loaded!')
      } else if (data.multiple) {
        setLookupMessage(`Multiple members found. Please be more specific or use membership number.`)
      } else {
        setLookupMessage('Record nahi mila')
      }
    } catch {
      setLookupMessage('Error looking up member. Please try again.')
    } finally {
      setLookupLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate membership number before submit
    const membershipError = validateMembershipNumber(formData.membershipNumber)
    if (membershipError) {
      setErrors(prev => ({ ...prev, membershipNumber: membershipError }))
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch(`${BACKEND_URL}/submit-membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membership_no: formData.membershipNumber || null,
          gender: formData.gender,
          full_name: formData.fullName,
          relationship_type: formData.relationshipType,
          relation_name: formData.relationName,
          father_in_law_name: formData.fatherInLawName || null,
          cnic: formData.cnic,
          country: formData.country,
          native_city: formData.nativeCity,
          current_city: formData.currentCity,
          address: formData.address,
          city: formData.nativeCity, // Legacy field
          date_of_birth: formData.dateOfBirth,
          cast: formData.cast,
          source_of_income: formData.sourceOfIncome,
          education: formData.education,
          occupation: formData.occupation,
          profession: formData.profession || null,
          dependents_count: parseInt(formData.numberOfDependents) || 0,
          dependents_relation: formData.relationshipWithDependents || null
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitMessage('Membership application submitted successfully!')
        // Optionally reset form
      } else {
        setSubmitMessage(data.detail || 'Error submitting application')
      }
    } catch {
      setSubmitMessage('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
  const labelClass = "block text-sm font-medium text-foreground mb-2"
  const errorClass = "text-red-500 text-xs mt-1"

  return (
    <div className="min-h-screen">
      <Banner title="Membership Form" subtitle="Join our community" />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">

          {/* Member Lookup Section */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Member Lookup / Record Search</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Already a member? CNIC, Membership Number ya Name se apna record search karein.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={lookupType}
                onChange={(e) => setLookupType(e.target.value as 'membership_no' | 'full_name' | 'cnic')}
                className={`${inputClass} sm:w-48`}
              >
                <option value="cnic">CNIC</option>
                <option value="membership_no">Membership No.</option>
                <option value="full_name">Full Name</option>
              </select>
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleLookup()
                  }
                }}
                placeholder={
                  lookupType === 'cnic'
                    ? 'CNIC likhen (e.g., 35202-1234567-1)'
                    : lookupType === 'membership_no'
                      ? 'Membership number likhen (e.g., AB123)'
                      : 'Naam likhen'
                }
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={lookupLoading}
                className="px-6 py-3 bg-accent text-white font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {lookupLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {lookupMessage && (
              <p className={`mt-3 text-sm ${lookupMessage.includes('found') ? 'text-green-600' : 'text-red-500'}`}>
                {lookupMessage}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="bg-background border border-foreground/10 rounded-lg shadow-sm">
            {/* ===== HEADER SECTION ===== */}
            <div className="border-b border-foreground/10 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Logo Placeholder */}
                <div className="w-24 h-24 border-2 border-dashed border-foreground/30 rounded-lg flex items-center justify-center text-foreground/40 text-xs text-center">
                  Logo<br/>Placeholder
                </div>

                {/* Organization Info */}
                <div className="text-center flex-1">
                  <h1 className="text-2xl font-bold text-primary">Tanzeem-e-Khawajgan</h1>
                  <p className="text-foreground/70 mt-1">Organization Address</p>
                </div>

                {/* Applicant Photo Placeholder */}
                <div className="w-24 h-32 border-2 border-dashed border-foreground/30 rounded-lg flex items-center justify-center text-foreground/40 text-xs text-center">
                  Applicant<br/>Photo
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mt-6 text-foreground">Membership Form</h2>
            </div>

            {/* ===== APPLICANT INFORMATION ===== */}
            <div className="p-8 space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-foreground/10 pb-2">
                Applicant Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Membership Number */}
                <div>
                  <label htmlFor="membershipNumber" className={labelClass}>
                    Membership Number
                  </label>
                  <input
                    type="text"
                    id="membershipNumber"
                    name="membershipNumber"
                    value={formData.membershipNumber}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.membershipNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., AB123 (5 alphanumeric characters)"
                    maxLength={5}
                  />
                  {errors.membershipNumber && (
                    <p className={errorClass}>{errors.membershipNumber}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                  <div className="flex gap-6 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Son of / Wife of / Daughter of */}
                <div>
                  <label htmlFor="relationshipType" className={labelClass}>
                    Relationship Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relationshipType"
                    name="relationshipType"
                    value={formData.relationshipType}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="son_of">Son of</option>
                    <option value="wife_of">Wife of</option>
                    <option value="daughter_of">Daughter of</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="relationName" className={labelClass}>
                    Father / Husband Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="relationName"
                    name="relationName"
                    value={formData.relationName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter name"
                    required
                  />
                </div>

                {/* Father-in-Law Name */}
                <div>
                  <label htmlFor="fatherInLawName" className={labelClass}>
                    Father-in-Law Name
                  </label>
                  <input
                    type="text"
                    id="fatherInLawName"
                    name="fatherInLawName"
                    value={formData.fatherInLawName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter father-in-law name"
                  />
                </div>

                {/* CNIC */}
                <div>
                  <label htmlFor="cnic" className={labelClass}>
                    CNIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cnic"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="XXXXX-XXXXXXX-X"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Native City */}
                <div>
                  <label htmlFor="nativeCity" className={labelClass}>
                    Native City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="nativeCity"
                    name="nativeCity"
                    value={formData.nativeCity}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Native City</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Current City */}
                <div>
                  <label htmlFor="currentCity" className={labelClass}>
                    Current City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="currentCity"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Current City</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className={labelClass}>
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                {/* Cast */}
                <div>
                  <label htmlFor="cast" className={labelClass}>
                    Cast <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cast"
                    name="cast"
                    value={formData.cast}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Cast</option>
                    {CASTS.map(cast => (
                      <option key={cast} value={cast}>{cast}</option>
                    ))}
                  </select>
                </div>

                {/* Source of Income */}
                <div>
                  <label htmlFor="sourceOfIncome" className={labelClass}>
                    Source of Income <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sourceOfIncome"
                    name="sourceOfIncome"
                    value={formData.sourceOfIncome}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Source of Income</option>
                    {INCOME_SOURCES.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className={labelClass}>
                    Education <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Education Level</option>
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label htmlFor="occupation" className={labelClass}>
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Occupation</option>
                    {OCCUPATIONS.map(occupation => (
                      <option key={occupation} value={occupation}>{occupation}</option>
                    ))}
                  </select>
                </div>

                {/* Profession */}
                <div>
                  <label htmlFor="profession" className={labelClass}>
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your profession"
                  />
                </div>

                {/* Number of Dependents */}
                <div>
                  <label htmlFor="numberOfDependents" className={labelClass}>
                    Number of Dependents
                  </label>
                  <input
                    type="number"
                    id="numberOfDependents"
                    name="numberOfDependents"
                    value={formData.numberOfDependents}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter number"
                    min="0"
                  />
                </div>

                {/* Relationship with Dependents */}
                <div className="md:col-span-2">
                  <label htmlFor="relationshipWithDependents" className={labelClass}>
                    Relationship with Dependents
                  </label>
                  <input
                    type="text"
                    id="relationshipWithDependents"
                    name="relationshipWithDependents"
                    value={formData.relationshipWithDependents}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g., Spouse, Children, Parents"
                  />
                </div>
              </div>
            </div>

            {/* ===== OFFICE USE ONLY ===== */}
            <div className="p-8 bg-foreground/5 space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-foreground/10 pb-2">
                Office Use Only
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Received Date */}
                <div>
                  <label htmlFor="formReceivedDate" className={labelClass}>
                    Form Received Date
                  </label>
                  <input
                    type="date"
                    id="formReceivedDate"
                    name="formReceivedDate"
                    value={formData.formReceivedDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Verified By */}
                <div>
                  <label htmlFor="verifiedBy" className={labelClass}>
                    Verified By
                  </label>
                  <input
                    type="text"
                    id="verifiedBy"
                    name="verifiedBy"
                    value={formData.verifiedBy}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Verifier name"
                  />
                </div>

                {/* Verification Remarks */}
                <div className="md:col-span-2">
                  <label htmlFor="verificationRemarks" className={labelClass}>
                    Verification Remarks
                  </label>
                  <textarea
                    id="verificationRemarks"
                    name="verificationRemarks"
                    value={formData.verificationRemarks}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Enter remarks"
                  />
                </div>

                {/* Approval Status */}
                <div>
                  <label htmlFor="approvalStatus" className={labelClass}>
                    Approval Status
                  </label>
                  <select
                    id="approvalStatus"
                    name="approvalStatus"
                    value={formData.approvalStatus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Membership Issued Date */}
                <div>
                  <label htmlFor="membershipIssuedDate" className={labelClass}>
                    Membership Issued Date
                  </label>
                  <input
                    type="date"
                    id="membershipIssuedDate"
                    name="membershipIssuedDate"
                    value={formData.membershipIssuedDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Official Signature */}
                <div>
                  <label htmlFor="officialSignature" className={labelClass}>
                    Official Signature
                  </label>
                  <div className="h-24 border-2 border-dashed border-foreground/30 rounded-md flex items-center justify-center text-foreground/40 text-sm">
                    Signature Area
                  </div>
                </div>

                {/* Office Stamp / Seal */}
                <div>
                  <label htmlFor="officeStamp" className={labelClass}>
                    Office Stamp / Seal
                  </label>
                  <div className="h-24 border-2 border-dashed border-foreground/30 rounded-md flex items-center justify-center text-foreground/40 text-sm">
                    Stamp Area
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SUBMIT BUTTON ===== */}
            <div className="p-8 border-t border-foreground/10">
              {submitMessage && (
                <p className={`mb-4 text-center ${submitMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                  {submitMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 min-h-[44px] bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
