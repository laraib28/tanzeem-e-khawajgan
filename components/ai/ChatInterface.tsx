'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Message } from '@/lib/ai/types'
import { Send, X, Loader2, MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react'
import './chat.css'

interface ChatInterfaceProps {
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Comprehensive fallback responses with Roman Urdu support
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase()

  // Greetings (Roman Urdu + English)
  if (msg.includes('salam') || msg.includes('assalam') || msg.includes('aoa') || msg.includes('hello') || msg.includes('hi')) {
    return 'Wa Alaikum Assalam! Tanzeem-e-Khawajgan mein khush aamdeed! Main aapki madad kar sakta/sakti hoon:\n\n• Medical Services (Doctors, Lab)\n• IT Courses (Amazon, Shopify, Python)\n• Sports (Badminton, Cricket, Snooker, Pool)\n• Banquet Hall Booking\n• Membership Form\n\nKya jaanna chahte hain? (What would you like to know?)'
  }

  // Medical/Doctors
  if (msg.includes('doctor') || msg.includes('daaktar') || msg.includes('medical') || msg.includes('health') || msg.includes('tabib') || msg.includes('clinic')) {
    return '🏥 **Medical Center - Doctors ki Details:**\n\n' +
      '👩‍⚕️ **Dr. Qurat Ul Ain** - General OPD & Ultrasound\n   📅 Mon to Fri\n\n' +
      '👶 **Dr. Farzana** - Child Specialist\n   📅 Mon, Wed, Fri (11 AM - 1 PM)\n\n' +
      '👩‍⚕️ **Dr. Naila Barni** - Gynaecologist\n   📅 Tue, Thu, Sat (10 AM - 12:30 PM)\n\n' +
      '💉 **Dr. Ahmed** - Diabetes & General\n   📅 Mon, Wed, Fri (6-8 PM & 11 AM-1 PM)\n\n' +
      '🦷 **Dr. Sohail** - Dentist\n   📅 Mon-Thu, Sat (5 PM - 8 PM)\n\n' +
      '🦷 **Dr. Rida** - Dentist\n   📅 Mon, Wed, Fri (12:30 PM - 2 PM)\n\n' +
      '👁️ **Dr. Faiza** - Eye Specialist\n   📅 Sat (11 AM - 12:30 PM)\n\n' +
      '🌿 **Dr. Akif** - Homeopathic\n   📅 Mon-Thu (12 PM - 2 PM)\n\n' +
      '🌿 **Dr. Rashid Mehmood** - Homeopathic & Hajama\n   📅 Mon-Fri (10 AM - 1 PM)\n\n' +
      '💆 **Mrs. Saima Rashid** - Hajama Therapy\n   📅 Fri (6:30 PM - 8:30 PM)\n\n' +
      '🔬 **Sindh Lab** - Mon to Sat (10:30 AM - 8 PM)\n\n' +
      '🏥 **Partner Hospitals:**\n• Shed Hospital - Free OPD for members\n• Abdul Samad Hospital - Free Operations & Delivery'
  }

  // Child/Pediatric
  if (msg.includes('child') || msg.includes('bacha') || msg.includes('bachon') || msg.includes('pediatric')) {
    return '👶 **Child Specialist - Dr. Farzana**\n\n📅 Timing: Mon, Wed, Fri (11 AM - 1 PM)\n\nBachon ke liye specialist doctor available hain. Appointment ke liye medical center visit karein.'
  }

  // Dentist
  if (msg.includes('dant') || msg.includes('teeth') || msg.includes('dentist') || msg.includes('dental')) {
    return '🦷 **Dental Services:**\n\n**Dr. Sohail** - Mon to Thu, Sat (5 PM - 8 PM)\n**Dr. Rida** - Mon, Wed, Fri (12:30 PM - 2 PM)\n\nDono dentists available hain different timings pe!'
  }

  // Eye
  if (msg.includes('eye') || msg.includes('ankh') || msg.includes('nazar')) {
    return '👁️ **Eye Specialist - Dr. Faiza**\n\n📅 Timing: Saturday (11 AM - 12:30 PM)\n\nAnkhon ke checkup ke liye Saturday ko aayein.'
  }

  // Sports
  if (msg.includes('sport') || msg.includes('khel') || msg.includes('game') || msg.includes('khelna')) {
    return '🏸 **Sports Complex - Facilities & Rates:**\n\n' +
      '🏸 **Badminton Court** - Rs. 1,500/hour\n' +
      '🏏 **Cricket Net** - Rs. 2,000 - 2,500/hour\n' +
      '🎱 **Snooker Table** - Rs. 7/minute\n' +
      '🎱 **Pool Table** - Rs. 100/game\n\n' +
      '⏰ **Timings:** 10:00 AM - 4:00 AM (Subah 10 baje se raat 4 baje tak)\n\n' +
      'Booking ke liye contact karein!'
  }

  // Badminton
  if (msg.includes('badminton')) {
    return '🏸 **Badminton Court**\n\n💰 Rate: Rs. 1,500/hour\n⏰ Timing: 10 AM - 4 AM\n\nProfessional indoor courts with quality flooring and proper lighting.'
  }

  // Cricket
  if (msg.includes('cricket')) {
    return '🏏 **Cricket Net**\n\n💰 Rate: Rs. 2,000 - 2,500/hour\n⏰ Timing: 10 AM - 4 AM\n\nWell-maintained cricket nets for batting and bowling practice.'
  }

  // Snooker/Pool
  if (msg.includes('snooker') || msg.includes('pool') || msg.includes('billiard')) {
    return '🎱 **Snooker & Pool:**\n\n**Snooker Table** - Rs. 7/minute\n**Pool Table** - Rs. 100/game\n\n⏰ Timing: 10 AM - 4 AM'
  }

  // IT Courses
  if (msg.includes('it') || msg.includes('course') || msg.includes('kors') || msg.includes('computer') || msg.includes('programming') || msg.includes('training')) {
    return '💻 **IT Courses:**\n\n' +
      '📦 **Amazon Private Label (FBA)**\n   Duration: 4 months\n   Level: Beginner to Intermediate\n   Amazon business seekhein - product research se brand launch tak\n\n' +
      '🛒 **Shopify E-commerce**\n   Duration: 3 months\n   Level: Beginner\n   Online store banana aur manage karna seekhein\n\n' +
      '🤖 **Python AI Chatbot Development**\n   Duration: 4 months\n   Level: Intermediate\n   AI chatbots banana seekhein Python se\n\n' +
      '☀️ **Summer Camp** - Students ke liye special coding program\n\n' +
      'Enrollment ke liye /services/it page visit karein ya mujhe batayein!'
  }

  // Amazon
  if (msg.includes('amazon') || msg.includes('fba')) {
    return '📦 **Amazon Private Label (FBA) Course**\n\n⏱️ Duration: 4 months\n📊 Level: Beginner to Intermediate\n\nKya seekhenge:\n• Product Research\n• Sourcing\n• Listing Optimization\n• Private Label Brand Launch\n\nEnrollment ke liye /services/it visit karein!'
  }

  // Shopify
  if (msg.includes('shopify') || msg.includes('ecommerce') || msg.includes('store')) {
    return '🛒 **Shopify E-commerce Course**\n\n⏱️ Duration: 3 months\n📊 Level: Beginner\n\nKya seekhenge:\n• Store Setup\n• Themes & Apps\n• Marketing Strategies\n• Order Management\n\nEnrollment ke liye /services/it visit karein!'
  }

  // Python/AI
  if (msg.includes('python') || msg.includes('ai') || msg.includes('chatbot')) {
    return '🤖 **Python AI Chatbot Development**\n\n⏱️ Duration: 4 months\n📊 Level: Intermediate\n\nKya seekhenge:\n• Python Programming\n• NLP (Natural Language Processing)\n• Machine Learning\n• WhatsApp/Telegram/Web Integration\n\nEnrollment ke liye /services/it visit karein!'
  }

  // Banquet/Hall/Booking
  if (msg.includes('hall') || msg.includes('banquet') || msg.includes('booking') || msg.includes('wedding') || msg.includes('shadi') || msg.includes('venue') || msg.includes('event')) {
    return '🏛️ **Banquet Halls:**\n\n' +
      '👑 **Tehseena Banquet**\n   💰 Rs. 30,000 - 40,000 per event\n   👥 Capacity: 300+ guests\n   ✨ Features: Grand Décor, AC, Parking, Catering, Stage & Lighting\n\n' +
      '🎪 **Iqbal Arena**\n   💰 Rs. 250 - 300 per head\n   👥 Capacity: 200+ guests\n   ✨ Features: Full Catering, AC, Sound System, Parking\n\n' +
      '🏠 **Abdul Lateef Hall**\n   💰 Rs. 250 - 300 per head\n   👥 Capacity: 150+ guests\n   ✨ Features: Catering Included, AC, Parking\n\n' +
      'Availability check karne ke liye date batayein!'
  }

  // Hall availability
  if (msg.includes('available') || msg.includes('date') || msg.includes('tarikh') || msg.includes('kab') || msg.includes('availability')) {
    return '📅 **Hall Availability:**\n\nHall ki availability check karne ke liye:\n\n1. Apni preferred date batayein\n2. Kitne guests honge?\n3. Konsa hall pasand hai?\n\nMain check karke batata/batati hoon. Ya phir directly contact karein booking ke liye.'
  }

  // Membership
  if (msg.includes('member') || msg.includes('membership') || msg.includes('join') || msg.includes('shamil')) {
    return '🎫 **Membership Benefits:**\n\n✅ Shed Hospital mein Free OPD\n✅ Abdul Samad Hospital mein Free Operations & Delivery\n✅ Community events mein discounts\n✅ Priority booking for halls\n\n📝 **Form ke liye:** /membership-form\n\n**Required Information:**\n• Full Name\n• Father\'s Name\n• CNIC Number\n• Phone Number\n• Email\n• Address\n\nKya aap member banna chahte hain?'
  }

  // Price/Rate
  if (msg.includes('price') || msg.includes('rate') || msg.includes('kitna') || msg.includes('kitne') || msg.includes('cost') || msg.includes('fee')) {
    return '💰 **Rates & Prices:**\n\n**Sports:**\n• Badminton: Rs. 1,500/hour\n• Cricket: Rs. 2,000-2,500/hour\n• Snooker: Rs. 7/minute\n• Pool: Rs. 100/game\n\n**Banquet Halls:**\n• Tehseena: Rs. 30,000-40,000/event\n• Iqbal Arena: Rs. 250-300/head\n• Abdul Lateef: Rs. 250-300/head\n\nKis cheez ka rate chahiye specifically?'
  }

  // Help
  if (msg.includes('help') || msg.includes('madad') || msg.includes('guide')) {
    return '🤝 **Main aapki madad kar sakta/sakti hoon:**\n\n• Medical - Doctors ki info aur timings\n• IT Courses - Amazon, Shopify, Python\n• Sports - Rates aur booking\n• Banquet Halls - Availability aur booking\n• Membership Form - Benefits aur registration\n\nBas poochiye jo jaanna ho!'
  }

  // Thanks
  if (msg.includes('thanks') || msg.includes('shukriya') || msg.includes('thank')) {
    return 'Aapka shukriya! 🙏\n\nAgar koi aur sawal ho to zaroor poochiye. Khush raho!'
  }

  // Contact
  if (msg.includes('contact') || msg.includes('number') || msg.includes('phone') || msg.includes('call')) {
    return '📞 **Contact Information:**\n\nHamari website pe /contact page visit karein for:\n• Phone numbers\n• Email address\n• Location map\n• Feedback form'
  }

  // Location
  if (msg.includes('location') || msg.includes('address') || msg.includes('kahan') || msg.includes('where')) {
    return '📍 **Location:**\n\nHamara address aur map dekhne ke liye /contact page visit karein.'
  }

  // Default response
  return 'Ji, main samajh gaya/gayi! Main Tanzeem-e-Khawajgan ka assistant hoon.\n\nAap mujhse pooch sakte hain:\n\n• 🏥 Medical/Doctors\n• 💻 IT Courses\n• 🏸 Sports facilities\n• 🏛️ Hall booking\n• 🎫 Membership\n\nKya jaanna chahte hain?'
}

// Text to Speech function
function speakText(text: string) {
  if ('speechSynthesis' in window) {
    // Remove markdown formatting for speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/•/g, '')
      .replace(/🏥|🏸|💻|🏛️|🎫|👩‍⚕️|👶|🦷|👁️|🌿|💆|🔬|📅|💰|📞|📍|✅|✨|👥|👑|🎪|🏠|📦|🛒|🤖|☀️|🤝|🙏|⏰|⏱️|📊|🏏|🎱/g, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported] = useState(false) // Speech disabled in legacy component
  const [sessionId] = useState<string>(() =>
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<unknown>(null)

  // Add initial greeting message
  useEffect(() => {
    const greetingMessage: Message = {
      id: 'greeting',
      role: 'assistant',
      content: 'Assalam-o-Alaikum! 🌙\n\nTanzeem-e-Khawajgan mein khush aamdeed! Main aapka AI assistant hoon.\n\nAap Roman Urdu ya English mein baat kar sakte hain. Voice button se bol bhi sakte hain! 🎤\n\nKya jaanna chahte hain?',
      language: 'en',
      timestamp: Date.now(),
    }
    setMessages([greetingMessage])
  }, [])

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Toggle voice recognition
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current as { start: () => void; stop: () => void }
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  // Speak last assistant message
  const speakLastMessage = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant')
    if (lastAssistantMessage) {
      speakText(lastAssistantMessage.content)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = inputValue.trim()
    if (!trimmedInput || isLoading) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      language: 'en',
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const responseText = data.response || data.message || data.detail || getFallbackResponse(trimmedInput)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        language: 'en',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])

      if (data.follow_up) {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: data.follow_up,
          language: 'en',
          timestamp: Date.now(),
        }
        setTimeout(() => {
          setMessages(prev => [...prev, followUpMessage])
        }, 500)
      }
    } catch {
      // Fallback response when backend is not available
      const fallbackResponse = getFallbackResponse(trimmedInput)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        language: 'en',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] flex flex-col z-50 border-primary/20">
      {/* Header */}
      <CardHeader className="chat-header flex flex-row items-center justify-between p-4 rounded-t-lg bg-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-white">AI Assistant</CardTitle>
            <p className="text-xs text-white/70">Roman Urdu / English</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={speakLastMessage}
            aria-label="Listen to response"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close chat"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="chat-window flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-muted-foreground">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input border-t p-3">
        <div className="flex gap-2">
          {speechSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
              aria-label={isListening ? "Stop listening" : "Voice input"}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            disabled={isLoading}
            className="flex-1 bg-transparent"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
