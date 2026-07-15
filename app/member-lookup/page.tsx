'use client'

import { useState } from 'react'
import { Banner } from '@/components/ui/Banner'
import { Search, User, Briefcase } from 'lucide-react'

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
    membership_no: 'e.g. KA-001 or KA 001',
    cnic: '42301-1234567-1',
    full_name: 'Enter member name',
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
        setError(data.message || 'Member not found.')
      }
    } catch {
      setError('Could not connect to server. Please try again.')
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
        subtitle="Search member details by membership number, CNIC, or name"
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
              { key: 'full_name', label: 'Name' },
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search size={18} />
              {loading ? 'Searching...' : 'Search'}
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
            <p className="text-sm text-gray-500 mb-4">{multipleResults.length} members found — please select one:</p>
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
            <div className="bg-emerald-600 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{member.full_name || member.name}</h2>
                  {member.approval_status === 'approved' && member.membership_no ? (
                    <p className="text-emerald-100 text-sm font-semibold"># {member.membership_no}</p>
                  ) : !member.membership_no && member.approval_status !== 'rejected' ? (
                    <p className="text-yellow-200 text-xs font-medium">
                      Membership number will be issued after approval —{' '}
                      <span className="uppercase tracking-wide">Pending</span>
                    </p>
                  ) : member.approval_status === 'rejected' ? (
                    <p className="text-red-200 text-xs">Application rejected — no membership number assigned</p>
                  ) : null}
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
              {member.cast && (
                <Detail icon={<User size={16} />} label="Cast" value={member.cast} />
              )}
              {(member.occupation) && (
                <Detail icon={<Briefcase size={16} />} label="Profession" value={member.occupation} />
              )}
            </div>
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
