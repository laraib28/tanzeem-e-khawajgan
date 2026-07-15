'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryFormData } from '@/lib/forms/validation'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface InquiryFormProps {
  courses: Array<{ title: string }>
}

export function InquiryForm({ courses }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string | null>(null)
  const [pictureError, setPictureError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPictureError('')
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPictureError('Only JPG or PNG images are allowed.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setPictureError('Image must be under 2MB.')
      return
    }
    setPictureFile(file)
    setPicturePreview(URL.createObjectURL(file))
  }

  const removePicture = () => {
    setPictureFile(null)
    setPicturePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: InquiryFormData) => {
    if (!pictureFile) {
      setPictureError('Please upload your picture.')
      return
    }
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('fatherName', data.fatherName)
      formData.append('membershipNo', data.membershipNo || '')
      formData.append('email', data.email)
      formData.append('course', data.course)
      formData.append('picture', pictureFile)

      const response = await fetch('/api/forms/inquiry', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'شکریہ! آپ کی درخواست جمع ہو گئی ہے۔ ہم جلد رابطہ کریں گے۔' })
        reset()
        removePicture()
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'درخواست جمع نہیں ہوئی۔ دوبارہ کوشش کریں۔' })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Picture <span className="text-red-500">*</span>
        </label>
        {picturePreview ? (
          <div className="relative w-28 h-28">
            <Image
              src={picturePreview}
              alt="Preview"
              fill
              className="object-cover rounded-lg border border-foreground/20"
            />
            <button
              type="button"
              onClick={removePicture}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 border-2 border-dashed border-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Upload className="w-6 h-6 text-foreground/40 mb-1" />
            <span className="text-xs text-foreground/40 text-center px-1">Upload Photo</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handlePictureChange}
          className="hidden"
        />
        {pictureError && <p className="mt-1 text-sm text-red-500">{pictureError}</p>}
        <p className="mt-1 text-xs text-foreground/40">JPG or PNG, max 2MB</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="fatherName" className="block text-sm font-medium text-foreground mb-2">
          Father&apos;s Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('fatherName')}
          type="text"
          id="fatherName"
          className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter father's name"
        />
        {errors.fatherName && <p className="mt-1 text-sm text-red-500">{errors.fatherName.message}</p>}
      </div>

      <div>
        <label htmlFor="membershipNo" className="block text-sm font-medium text-foreground mb-2">
          Membership Number
        </label>
        <input
          {...register('membershipNo')}
          type="text"
          id="membershipNo"
          className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g. TK-00001"
        />
        <p className="mt-1 text-xs text-foreground/50 italic">If you are a member of Khawajgan</p>
        {errors.membershipNo && <p className="mt-1 text-sm text-red-500">{errors.membershipNo.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="course" className="block text-sm font-medium text-foreground mb-2">
          Course of Interest <span className="text-red-500">*</span>
        </label>
        <select
          {...register('course')}
          id="course"
          className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.title} value={course.title}>
              {course.title}
            </option>
          ))}
        </select>
        {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>}
      </div>

      {submitStatus && (
        <div
          className={`p-4 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 min-h-[44px] bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
