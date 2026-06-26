'use client'

import { X, Copy, Check, Heart } from 'lucide-react'
import { useState } from 'react'

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
}

const bankDetails = [
  { label: 'Bank', value: 'Allied Bank Ltd.' },
  { label: 'Account Title', value: 'Khawajgan Services' },
  { label: 'Account #', value: '0020094523660011' },
  { label: 'IBAN #', value: 'PK11ABPA0020094523660011' },
]

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h2 id="donate-modal-title" className="text-white text-xl font-bold">
                Donate Now
              </h2>
              <p className="text-white/75 text-sm">
                Support Tanzeem-e-Khawajgan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Please transfer your donation to the following bank account. May Allah
            reward your generosity.
          </p>

          <div className="space-y-3">
            {bankDetails.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3 gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-foreground font-semibold text-sm mt-0.5 break-all">
                    {value}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(value, label)}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
                  aria-label={`Copy ${label}`}
                >
                  {copied === label ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-1">
            For queries, please contact us via our website.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
