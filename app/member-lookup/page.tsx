'use client'

import { useState } from 'react'
import { Banner } from '@/components/ui/Banner'
import { Search, User, Phone, MapPin, CreditCard, Droplets, Briefcase, Users, QrCode } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://khawajgan.org'

interface MemberData {
  membership_no?: string
  full_name?: string
  name?: string
  relation_name?: string
  cnic?: string
  native_city?: string
  phone?: string
  contact_no?: string
  blood_group?: string
  occupation?: string
  address?: string
  category?: string
  cast?: string
  dependents_count?: number
  approval_status?: string
  qr_url?: string
  date_of_birth?: string
}

export default function MemberLookupPage() {
  const [searchType, setSearchType] = useState<'membership_no' | 'cnic' | 'full_name'>('membership_no')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState<MemberData | null>(null)
  const [multipleResults, setMultipleResults] = useState<MemberData[]>([])
  const [error, setError] = useState('')

  const placeholders = {
    membership_no: 'KA-001 ya KA 001',
    cnic: '42301-1234567-1',
    full_name: 'Member ka naam',
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setMember(null)
    setMultipleResults([])
    setError('')

    try {
      const params = new URLSearchParams({ [searchType]: query.trim() })
      const res = await fetch(`${BACKEND_URL}/lookup-member?${params}`)
      const data = await res.json()

      if (data.success) {
        if (data.multiple) {
          setMultipleResults(data.data)
        } else {
          setMember(data.data)
        }
      } else {
        setError(data.message || 'Member nahi mila.')
      }
    } catch {
      setError('Server se connection nahi ho saka. Backend chal raha hai?')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status?: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-background">
      <Banner
        title="Member Lookup"
        subtitle="Membership number, CNIC, ya naam se member ki details dekhen"
        backgroundImage="/banner-bg.jpg"
      />

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          {/* Search Type Tabs */}
          <div className="flex gap-2 mb-5">
            {([
              { key: 'membership_no', label: 'Membership #' },
              { key: 'cnic', label: 'CNIC' },
              { key: 'full_name', label: 'Naam' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setSearchType(tab.key); setQuery(''); setMember(null); setError('') }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  searchType === tab.key
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholders[searchType]}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Search size={18} />
              {loading ? 'Dhundh raha...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Multiple Results */}
        {multipleResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <p className="text-sm text-gray-500 mb-4">{multipleResults.length} members mile — ek select karein:</p>
            <div className="space-y-2">
              {multipleResults.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMember(m); setMultipleResults([]) }}
                  className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                >
                  <p className="font-medium text-gray-800">{m.full_name || m.name}</p>
                  <p className="text-xs text-gray-500">{m.membership_no} · {m.cnic}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Member Card */}
        {member && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{member.full_name || member.name}</h2>
                  {member.membership_no && (
                    <p className="text-emerald-100 text-sm"># {member.membership_no}</p>
                  )}
                </div>
              </div>
              {member.approval_status && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(member.approval_status)}`}>
                  {member.approval_status}
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(member.relation_name) && (
                <Detail icon={<User size={16} />} label="Father's Name" value={member.relation_name} />
              )}
              {(member.cnic) && (
                <Detail icon={<CreditCard size={16} />} label="CNIC" value={member.cnic} />
              )}
              {(member.phone || member.contact_no) && (
                <Detail icon={<Phone size={16} />} label="Phone" value={member.phone || member.contact_no} />
              )}
              {member.native_city && (
                <Detail icon={<MapPin size={16} />} label="Native City" value={member.native_city} />
              )}
              {member.blood_group && (
                <Detail icon={<Droplets size={16} />} label="Blood Group" value={member.blood_group} />
              )}
              {member.occupation && (
                <Detail icon={<Briefcase size={16} />} label="Work" value={member.occupation} />
              )}
              {member.category && (
                <Detail icon={<Users size={16} />} label="Category" value={member.category} />
              )}
              {member.cast && (
                <Detail icon={<User size={16} />} label="Cast" value={member.cast} />
              )}
              {(member.dependents_count !== undefined && member.dependents_count !== null && member.dependents_count > 0) && (
                <Detail icon={<Users size={16} />} label="Dependents" value={String(member.dependents_count)} />
              )}
              {member.address && (
                <div className="sm:col-span-2">
                  <Detail icon={<MapPin size={16} />} label="Address" value={member.address} />
                </div>
              )}
            </div>

            {/* QR Code */}
            {member.qr_url && (
              <div className="border-t border-gray-100 px-6 py-5 flex items-center gap-4">
                <QrCode size={20} className="text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Membership QR</p>
                  <a
                    href={member.qr_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm hover:underline break-all"
                  >
                    {member.qr_url}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <span className="text-emerald-600 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  )
}
