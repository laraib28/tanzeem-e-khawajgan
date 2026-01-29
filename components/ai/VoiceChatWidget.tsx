'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, X, Loader2, MessageCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import './chat.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isPlaying?: boolean
}

interface VoiceChatWidgetProps {
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Comprehensive fallback responses with Roman Urdu support
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase()

  // Greetings
  if (msg.includes('salam') || msg.includes('assalam') || msg.includes('aoa') || msg.includes('hello') || msg.includes('hi')) {
    return 'Wa Alaikum Assalam! Tanzeem-e-Khawajgan mein khush aamdeed! Main aapki madad kar sakta/sakti hoon:\n\n- Medical Services\n- IT Courses\n- Sports\n- Banquet Hall Booking\n- Membership\n\nKya jaanna chahte hain?'
  }

  // Medical
  if (msg.includes('doctor') || msg.includes('medical') || msg.includes('health') || msg.includes('daaktar')) {
    return 'Medical Center ki Details:\n\nDr. Qurat Ul Ain - General OPD & Ultrasound (Mon-Fri)\nDr. Farzana - Child Specialist (Mon, Wed, Fri 11 AM)\nDr. Naila Barni - Gynaecologist (Tue, Thu, Sat 10 AM)\nDr. Ahmed - Diabetes (Mon, Wed, Fri 6 PM)\nDr. Sohail - Dentist (Mon-Thu, Sat 5 PM)\n\nSindh Lab bhi available hai Mon-Sat 10:30 AM - 8 PM'
  }

  // Sports
  if (msg.includes('sport') || msg.includes('khel') || msg.includes('game') || msg.includes('badminton') || msg.includes('cricket')) {
    return 'Sports Complex Rates:\n\nBadminton Court - Rs. 1,500/hour\nCricket Net - Rs. 2,000-2,500/hour\nSnooker - Rs. 7/minute\nPool Table - Rs. 100/game\n\nTimings: 10 AM - 4 AM'
  }

  // IT Courses
  if (msg.includes('it') || msg.includes('course') || msg.includes('computer') || msg.includes('training') || msg.includes('amazon') || msg.includes('python')) {
    return 'IT Courses:\n\nAmazon FBA - 4 months\nShopify E-commerce - 3 months\nPython AI Chatbot - 4 months\n\nSummer Camp bhi available hai students ke liye!'
  }

  // Banquet/Hall
  if (msg.includes('hall') || msg.includes('banquet') || msg.includes('booking') || msg.includes('wedding') || msg.includes('shadi')) {
    return 'Banquet Halls:\n\nTehseena Banquet - Rs. 30,000-40,000 (300+ guests)\nIqbal Arena - Rs. 250-300/head (200+ guests)\nAbdul Lateef Hall - Rs. 250-300/head (150+ guests)\n\nBooking ke liye date batayein!'
  }

  // Membership
  if (msg.includes('member') || msg.includes('membership') || msg.includes('join')) {
    return 'Membership Benefits:\n\n- Shed Hospital mein Free OPD\n- Abdul Samad Hospital mein Free Operations\n- Community events mein discounts\n\nForm ke liye: /membership-form'
  }

  // Default
  return 'Ji, main Tanzeem-e-Khawajgan ka assistant hoon.\n\nAap pooch sakte hain:\n- Medical/Doctors\n- IT Courses\n- Sports\n- Hall booking\n- Membership\n\nKya jaanna chahte hain?'
}

export function VoiceChatWidget({ onClose }: VoiceChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [sessionId] = useState(() => `voice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize with greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'assistant',
      content: 'Assalam-o-Alaikum!\n\nMain Tanzeem-e-Khawajgan ka AI Assistant hoon. Aap Roman Urdu ya English mein baat kar sakte hain.\n\nMic button se voice message bhej sakte hain!',
      timestamp: Date.now()
    }
    setMessages([greeting])
  }, [])

  // Auto scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Transcribe audio using Whisper API
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.text) {
          setInputValue(data.text)
        } else {
          throw new Error('Transcription failed')
        }
      } else {
        throw new Error('Transcription API error')
      }
    } catch {
      alert('Voice transcription failed. Please try again or type your message.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())

        // Send to Whisper API for transcription
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch {
      alert('Microphone access denied. Please allow microphone access to use voice input.')
    }
  }, [transcribeAudio])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Text to Speech using OpenAI TTS
  const speakText = useCallback(async (text: string) => {
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }

    setIsSpeaking(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voice: 'nova', // Female voice, good for Urdu/English
          speed: 0.95
        })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        currentAudioRef.current = audio
        await audio.play()
      } else {
        throw new Error('TTS API error')
      }
    } catch {
      setIsSpeaking(false)
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*•]/g, ''))
        utterance.lang = 'en-US'
        utterance.rate = 0.9
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      }
    }
  }, [])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  // Send message
  const sendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    let responseText = ''

    try {
      // Try backend API first
      const response = await fetch(`${BACKEND_URL}/api/voice/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageText,
          session_id: sessionId,
          speak_response: autoSpeak
        })
      })

      if (response.ok) {
        const data = await response.json()
        responseText = data.response || getFallbackResponse(messageText)
      } else {
        throw new Error('API error')
      }
    } catch {
      // Use fallback response
      responseText = getFallbackResponse(messageText)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)

    // Auto-speak response if enabled
    if (autoSpeak) {
      setTimeout(() => speakText(responseText), 300)
    }
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[500px] sm:h-[600px] flex flex-col z-50 border-primary/20 shadow-2xl">
      {/* Header */}
      <CardHeader className="chat-header flex flex-row items-center justify-between p-4 rounded-t-lg bg-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-white">Voice Assistant</CardTitle>
            <p className="text-xs text-white/70">OpenAI Powered</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setAutoSpeak(!autoSpeak)}
            aria-label={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
            className={`h-8 w-8 text-white hover:bg-white/20 ${autoSpeak ? 'bg-white/20' : ''}`}
            title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            type="button"
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
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-primary' : 'bg-accent'
                  }`}
                >
                  {message.role === 'user' ? (
                    <span className="text-xs text-white font-semibold">U</span>
                  ) : (
                    <MessageCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                  {message.role === 'assistant' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                      className="mt-2 h-6 text-xs opacity-60 hover:opacity-100"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                      {isSpeaking ? 'Stop' : 'Sunein'}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? 'Recording...' : 'Thinking...'}
                  </p>
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
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isLoading && !isRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className={`flex-shrink-0 ${isRecording ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Recording... Stop to send" : "Type ya mic use karein..."}
            disabled={isLoading || isRecording}
            className="flex-1 bg-transparent"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim() || isRecording}
            size="icon"
            aria-label="Send message"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isRecording && (
          <p className="text-xs text-red-500 mt-2 text-center animate-pulse">
            Recording... Mic button dabayein stop karne ke liye
          </p>
        )}
      </form>
    </Card>
  )
}
