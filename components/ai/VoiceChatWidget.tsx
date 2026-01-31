'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, X, Loader2, MessageCircle, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react'
import './chat.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface VoiceChatWidgetProps {
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export function VoiceChatWidget({ onClose }: VoiceChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Initialize with greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'assistant',
      content: `Assalam-o-Alaikum! Kya madad kar sakta hoon?

Medical, IT courses, sports, hall booking ya membership ke baare mein poochein.`,
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

  // Transcribe audio ref to avoid stale closure
  const transcribeRef = useRef<((blob: Blob, mimeType?: string) => Promise<void>) | null>(null)

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      })

      // Find supported mime type
      let mimeType = 'audio/webm'
      const types = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg']
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type
          break
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())

        if (audioChunksRef.current.length === 0) {
          alert('Recording empty. Dobara try karein.')
          return
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })

        if (audioBlob.size < 1000) {
          alert('Recording bahut chhoti hai. Thoda lambi recording karein.')
          return
        }

        if (transcribeRef.current) {
          await transcribeRef.current(audioBlob, mimeType)
        }
      }

      // Start with timeslice for continuous data collection
      mediaRecorder.start(250)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (err) {
      const error = err as Error
      if (error.name === 'NotAllowedError') {
        alert('Mic permission denied. Browser settings mein microphone allow karein.')
      } else if (error.name === 'NotFoundError') {
        alert('Microphone nahi mila. Microphone connect karein.')
      } else {
        alert('Mic error: ' + error.message)
      }
    }
  }, [])

  // Keep transcribe function in ref (avoids dependency issues)
  useEffect(() => {
    transcribeRef.current = async (audioBlob: Blob, mimeType?: string) => {
      setIsLoading(true)

      try {
        // Determine file extension from mime type
        let ext = 'webm'
        if (mimeType?.includes('mp4')) ext = 'mp4'
        else if (mimeType?.includes('ogg')) ext = 'ogg'

        const formData = new FormData()
        formData.append('audio', audioBlob, `recording.${ext}`)

        const response = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || 'Server error')
        }

        const data = await response.json()
        if (data.success && data.text && data.text.trim()) {
          await sendMessage(data.text.trim())
        } else {
          alert('Awaz samajh nahi aayi. Clear bolein ya type karein.')
        }
      } catch (err) {
        const error = err as Error
        if (error.message.includes('503')) {
          alert('Voice service available nahi. Type karein.')
        } else {
          alert('Voice error. Type karein.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  })

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

  // Text to Speech
  const speakText = useCallback(async (text: string) => {
    setIsSpeaking(true)

    const cleanText = text
      .replace(/\*/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, '. ')
      .replace(/Rs\./g, 'Rupees')
      .substring(0, 500)

    try {
      const response = await fetch(`${BACKEND_URL}/api/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'nova', speed: 0.95 })
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
          playBrowserTTS(cleanText)
        }

        await audio.play()
        return
      }
      throw new Error('TTS failed')
    } catch {
      playBrowserTTS(cleanText)
    }
  }, [])

  // Browser TTS fallback
  const playBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setIsSpeaking(false)
    }
  }

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  // Send message to AI
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
      // Call ChatGPT-like AI endpoint
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId
        })
      })

      if (response.ok) {
        const data = await response.json()
        responseText = data.response || 'Sorry, kuch galat ho gaya. Dobara try karein.'
      } else {
        throw new Error('API error')
      }
    } catch {
      // Fallback response
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

    if (autoSpeak) {
      setTimeout(() => speakText(responseText), 300)
    }
  }

  // Clear chat
  const clearChat = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/chat/session/${sessionId}`, { method: 'DELETE' })
    } catch {
      // Ignore error
    }
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: 'Chat clear. Kya madad chahiye?',
      timestamp: Date.now()
    }])
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <>
      {/* Overlay - click to close */}
      <div
        className="chat-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[420px] h-[500px] sm:h-[550px] flex flex-col z-50 border-none">
        {/* Header */}
        <CardHeader className="chat-header flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">Khawajgan AI</CardTitle>
            <p className="text-xs text-white/70">ChatGPT Powered</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-7 w-7 text-white hover:bg-white/20"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`h-7 w-7 text-white hover:bg-white/20 ${autoSpeak ? 'bg-white/20' : ''}`}
            title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="chat-window flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    message.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'
                  }`}
                >
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <div
                  className={`flex-1 p-2.5 rounded-lg text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                  {message.role === 'assistant' && message.id !== 'greeting' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                      className="mt-1.5 h-5 text-xs opacity-50 hover:opacity-100 p-1"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                      {isSpeaking ? 'Stop' : 'Sunein'}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-1 flex items-center p-2.5 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Soch raha hoon...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input border-t p-2.5">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isLoading && !isRecording}
            className={`flex-shrink-0 h-9 w-9 ${isRecording ? 'animate-pulse bg-red-500' : ''}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Bol rahe hain..." : "Message likhen..."}
            disabled={isLoading || isRecording}
            className="flex-1 h-9 text-sm"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim() || isRecording}
            size="icon"
            className="flex-shrink-0 h-9 w-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isRecording && (
          <p className="text-xs text-red-500 mt-1.5 text-center animate-pulse">
            Recording... Mic dabao stop karne ke liye
          </p>
        )}
      </form>
      </Card>
    </>
  )
}

// Fallback response when backend is unavailable
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase()

  // ============ SPECIFIC DOCTORS FIRST ============

  // Eye specialist
  if (/eye|aankh|nazar|ophtha|chasma/.test(msg)) {
    return "[Medical] Dr. Faiza: Saturday 11 AM-12:30 PM."
  }

  // Dentist specific
  if (/dentist|dant|teeth|dental/.test(msg)) {
    return "[Medical] Dr. Sohail: Mon-Thu, Sat 5-8PM. Dr. Rida: Mon, Wed, Fri 12:30-2PM."
  }

  // Child specialist
  if (/child|bacha|bachon|pediatric|kids/.test(msg)) {
    return "[Medical] Dr. Farzana: Mon, Wed, Fri 11AM-1PM."
  }

  // Gynaecologist
  if (/gynae|lady|women|aurat|pregnancy/.test(msg)) {
    return "[Medical] Dr. Naila Barni: Tue, Thu, Sat 10AM-12:30PM."
  }

  // Diabetes
  if (/diabetes|diabetic|sugar|bp/.test(msg)) {
    return "[Medical] Dr. Ahmed: Mon, Wed, Fri 11AM-1PM & 6-8PM."
  }

  // Homeopathic
  if (/homeo|homeopathic|desi/.test(msg)) {
    return "[Medical] Dr. Akif: Mon-Thu 12-2PM. Dr. Rashid: Mon-Fri 10AM-1PM."
  }

  // Hijama
  if (/hijama|hajama|cupping/.test(msg)) {
    return "[Medical] Dr. Rashid: Mon-Fri 10AM-1PM. Mrs. Saima: Friday 6:30-8:30PM."
  }

  // General greetings (only if short message)
  if (/^(salam|hello|hi|aoa|assalam)/.test(msg) && msg.split(' ').length <= 3) {
    return "[Router] AoA! Kaise madad karun?"
  }

  // General doctor query - ask which one
  if (/doctor|medical|daaktar|health|hospital|clinic/.test(msg)) {
    return "[Medical] Konsa doctor? Eye, Dentist, Child, Gynae, Diabetes, Homeo?"
  }

  // ============ SPORTS - SPECIFIC SPORT FIRST ============
  // Check timing/price with typos
  const askingTiming = /timing|timng|tming|taiming|time|kab|waqt|schedule|open|close|hour|ghanta/.test(msg)
  const askingPrice = /price|rate|fee|fees|kitna|kitni|cost|rs|rupee|paisa|paise|kiraya|rent/.test(msg)

  // Badminton (with typos)
  if (/badminton|bedminton|badmintan|badmintun|badmintn|bedmintn/.test(msg)) {
    if (askingTiming) return "[Sports] Badminton: 10 AM se 4 AM."
    if (askingPrice) return "[Sports] Badminton: Rs.1500/hour."
    return "[Sports] Badminton: Rs.1500/hour, 10 AM-4 AM."
  }
  // Cricket (with typos)
  if (/cricket|criket|crickut|crikat|krket|crcket/.test(msg)) {
    if (askingTiming) return "[Sports] Cricket: 10 AM se 4 AM."
    if (askingPrice) return "[Sports] Cricket: Rs.2000-2500/hour."
    return "[Sports] Cricket: Rs.2000-2500/hour, 10 AM-4 AM."
  }
  // Snooker (with typos)
  if (/snooker|snuker|snookr|snukar|snokr|snukar/.test(msg)) {
    if (askingTiming) return "[Sports] Snooker: 10 AM se 4 AM."
    if (askingPrice) return "[Sports] Snooker: Rs.7/minute."
    return "[Sports] Snooker: Rs.7/minute, 10 AM-4 AM."
  }
  // Pool
  if (/pool|pul/.test(msg) && !/swimming/.test(msg)) {
    if (askingTiming) return "[Sports] Pool: 10 AM se 4 AM."
    if (askingPrice) return "[Sports] Pool: Rs.100/game."
    return "[Sports] Pool: Rs.100/game, 10 AM-4 AM."
  }
  // General sports - ONLY if no specific sport mentioned
  if (/sport|sports|khel|gym|fitness/.test(msg)) {
    if (askingTiming) return "[Sports] Timing: 10 AM se 4 AM."
    if (askingPrice) return "[Sports] Konsa sport ki fee? Badminton, Cricket, Snooker, Pool?"
    return "[Sports] Konsa sport? Badminton, Cricket, Snooker, Pool?"
  }

  // ============ BANQUET - SPECIFIC FIRST ============
  if (/tehseena/.test(msg)) {
    return "[Banquet] Tehseena Banquet Rs.30-40K fixed."
  }
  if (/iqbal/.test(msg)) {
    return "[Banquet] Iqbal Arena Rs.250-300/head."
  }
  if (/abdul|lateef/.test(msg)) {
    return "[Banquet] Abdul Lateef Hall Rs.250-300/head."
  }

  // Guest count matching - BEFORE general hall query
  if (/\b(300|350|400|500)\b/.test(msg) && /guest|mehmaan|log|booking|banquet|hall/.test(msg)) {
    return "[Banquet] Tehseena Banquet Rs.30-40K fixed."
  }
  if (/\b(200|250)\b/.test(msg) && /guest|mehmaan|log|booking|banquet|hall/.test(msg)) {
    return "[Banquet] Iqbal Arena Rs.250-300/head."
  }
  if (/\b(50|100|150)\b/.test(msg) && /guest|mehmaan|log|booking|banquet|hall/.test(msg)) {
    return "[Banquet] Abdul Lateef Hall Rs.250-300/head."
  }

  // General hall query - AFTER guest count matching
  if (/hall|banquet|wedding|shadi|booking|nikah|walima/.test(msg)) {
    return "[Banquet] Kitne guests? 50-150: Abdul Lateef, 200-250: Iqbal Arena, 300+: Tehseena."
  }

  // ============ IT ============
  const askingContact = /contact|number|no|phone|call|rabta/.test(msg)

  if (/shopify/.test(msg)) {
    if (askingContact) return "[IT] Shopify: Kh Mustafa Fazal 0334-3699906"
    return "[IT] Shopify: 3 months. Contact: 0334-3699906"
  }
  if (/amazon|fba/.test(msg)) {
    if (askingContact) return "[IT] Amazon FBA: Kh Mustafa Fazal 0334-3699906"
    return "[IT] Amazon FBA: 4 months. Contact: 0334-3699906"
  }
  if (/python/.test(msg)) {
    if (askingContact) return "[IT] Python: Kh Mustafa Fazal 0334-3699906"
    return "[IT] Python: 4 months. Contact: 0334-3699906"
  }
  if (/course|it|training|coding|computer/.test(msg)) {
    if (askingContact) return "[IT] Kh Mustafa Fazal 0334-3699906"
    return "[IT] Shopify (3m), Amazon FBA (4m), Python (4m). Contact: 0334-3699906"
  }

  // ============ GRAVEYARD ============
  if (/graveyard|qabristan|burial|funeral|janaza/.test(msg)) {
    return "[Graveyard] Burial plots available. Contact: 0334-3037800"
  }

  // ============ MEMBERSHIP ============
  if (/member/.test(msg)) {
    return "Membership: Free OPD, free operations. Form: /membership-form"
  }

  // ============ GENERIC ============
  if (/fee|price|kitna|kitni/.test(msg)) {
    return "Kis cheez ki fee? Medical, IT, sports ya hall?"
  }

  if (/timing|kab|waqt/.test(msg)) {
    return "Kis cheez ka timing? Medical, sports ya hall?"
  }

  return "Kya jaanna chahte hain? Medical, IT, sports, hall ya membership?"
}
