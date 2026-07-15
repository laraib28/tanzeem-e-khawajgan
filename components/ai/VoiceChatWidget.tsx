'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, X, Loader2, MessageCircle, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react'
import { getErrorMessage, ApiError } from '@/lib/api-client'
import './chat.css'

// ── Types ────────────────────────────────────────────────────────────────────

// Single state machine — replaces isLoading + isRecording + isSpeaking booleans
// Inspired by voice skill onTurn/onInterrupt/onCallEnd lifecycle pattern
type VoicePhase =
  | 'idle'         // ready for input
  | 'listening'    // mic open, VAD running
  | 'transcribing' // audio sent, waiting for STT
  | 'thinking'     // LLM streaming
  | 'speaking'     // TTS playing

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface HistoryItem {
  role: 'user' | 'assistant'
  content: string
}

interface VoiceChatWidgetProps {
  onClose: () => void
}

// ── Constants ────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
const STORAGE_KEY = 'tk_voice_history'

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content: 'اسلام علیکم! Khawajgan Bot mein khush aamdeed 🌙\n\nAap mic se baat kar sakte hain ya type kar sakte hain.',
  timestamp: 0,
}

const PHASE_STATUS: Record<VoicePhase, string> = {
  idle: '',
  listening: '🔴 Listening...',
  transcribing: 'Transcribing...',
  thinking: 'Thinking...',
  speaking: '🔊 Speaking...',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadPersisted(): { messages: Message[]; history: HistoryItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { messages: [GREETING], history: [] }
}

function savePersisted(messages: Message[], history: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, history }))
  } catch { /* ignore */ }
}

function cleanForTTS(text: string) {
  return text
    .replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '')
    .replace(/\n+/g, '. ').replace(/Rs\./g, 'Rupees')
    .replace(/[🌙🏥🏸💻🏛️🎫👩‍⚕️👶🦷👁️🌿💆🔬📅💰📞📍✅✨👥👑🎪🏠📦🛒🤖☀️🤝🙏⏰⏱️📊🏏🎱]/g, '')
    .substring(0, 500)
}

// ── Component ────────────────────────────────────────────────────────────────

export function VoiceChatWidget({ onClose }: VoiceChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [phase, setPhase] = useState<VoicePhase>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafIdRef = useRef<number>(0)
  // AbortController pattern from streaming-chat skill — cancel in-flight requests on interrupt
  const abortCtrlRef = useRef<AbortController | null>(null)
  const historyRef = useRef<HistoryItem[]>([])

  // Keep historyRef in sync (avoids stale closure in onTurn)
  useEffect(() => { historyRef.current = history }, [history])

  useEffect(() => {
    const saved = loadPersisted()
    setMessages(saved.messages)
    setHistory(saved.history)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ── TTS ─────────────────────────────────────────────────────────────────────

  const stopSpeaking = useCallback(() => {
    currentAudioRef.current?.pause()
    currentAudioRef.current = null
    window.speechSynthesis?.cancel()
  }, [])

  function browserTTS(text: string, onEnd: () => void) {
    if (!('speechSynthesis' in window)) { onEnd(); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    const hasUrdu = /[\u0600-\u06FF]/.test(text)
    utt.lang = hasUrdu ? 'ur-PK' : 'en-US'
    utt.rate = 0.9
    utt.onend = onEnd
    utt.onerror = onEnd
    window.speechSynthesis.speak(utt)
  }

  const speakText = useCallback(async (text: string) => {
    setPhase('speaking')
    setStatusMsg(PHASE_STATUS.speaking)
    const clean = cleanForTTS(text)
    const done = () => { setPhase('idle'); setStatusMsg('') }

    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, voice: 'nova', speed: 0.95 }),
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error('TTS unavailable')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      currentAudioRef.current = audio
      audio.onended = () => { URL.revokeObjectURL(url); done() }
      audio.onerror = () => { URL.revokeObjectURL(url); browserTTS(clean, done) }
      await audio.play()
    } catch {
      browserTTS(clean, done)
    }
  }, [])

  // ── onInterrupt — voice skill pattern ────────────────────────────────────────
  // User clicks mic while AI is speaking → stop TTS + cancel request + start listening
  const onInterrupt = useCallback(() => {
    stopSpeaking()
    abortCtrlRef.current?.abort()
    abortCtrlRef.current = null
    setPhase('idle')
    setStatusMsg('')
  }, [stopSpeaking])

  // ── onTurn — voice skill pattern ─────────────────────────────────────────────
  // Single entry point: transcript → LLM stream → (optionally) TTS
  const onTurn = useCallback(async (text: string) => {
    if (!text.trim()) return

    // messageConcurrency: "latest" — cancel any in-flight request
    abortCtrlRef.current?.abort()
    abortCtrlRef.current = new AbortController()
    const signal = abortCtrlRef.current.signal

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInputValue('')
    setPhase('thinking')
    setStatusMsg(PHASE_STATUS.thinking)

    try {
      const res = await fetch('/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyRef.current }),
        signal,
      })

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value, { stream: true }).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          let parsed: Record<string, string> | null = null
          try { parsed = JSON.parse(data) } catch { continue }
          if (!parsed) continue
          if (parsed.error) throw new Error(parsed.error)
          if (parsed.text) {
            fullText += parsed.text
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m)
            )
          }
        }
      }

      const nextHistory: HistoryItem[] = [
        ...historyRef.current,
        { role: 'user', content: text },
        { role: 'assistant', content: fullText },
      ]
      setHistory(nextHistory)
      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === assistantId ? { ...m, content: fullText } : m
        )
        savePersisted(updated, nextHistory)
        return updated
      })

      if (signal.aborted) return

      if (autoSpeak && fullText) {
        await speakText(fullText)
      } else {
        setPhase('idle')
        setStatusMsg('')
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
      const errMsg = getErrorMessage(err)
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: errMsg } : m)
      )
      setPhase('idle')
      setStatusMsg('')
    }
  }, [autoSpeak, speakText])

  // ── Recording ────────────────────────────────────────────────────────────────

  const stopRecording = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current)
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    if (mediaRecorderRef.current && phase === 'listening') {
      mediaRecorderRef.current.stop()
    }
    setPhase('idle')
    setStatusMsg('')
  }, [phase])

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusMsg('Microphone not available (HTTPS required).')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      })

      const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
      const mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        cancelAnimationFrame(rafIdRef.current)
        audioCtxRef.current?.close()
        audioCtxRef.current = null
        stream.getTracks().forEach(t => t.stop())

        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        if (blob.size < 1000) {
          setStatusMsg('Recording too short. Please try again.')
          setPhase('idle')
          return
        }

        // ── onTurn pipeline: STT → LLM → TTS ───────────────────────────────
        setPhase('transcribing')
        setStatusMsg(PHASE_STATUS.transcribing)

        const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm'
        const formData = new FormData()
        formData.append('audio', blob, `recording.${ext}`)

        try {
          const res = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.detail || 'Transcription failed')

          if (data.success && data.text?.trim()) {
            setInputValue(data.text.trim())   // show in input like ChatGPT
            await onTurn(data.text.trim())
          } else {
            setStatusMsg('Could not understand audio. Please speak clearly.')
            setPhase('idle')
          }
        } catch (err) {
          setStatusMsg(err instanceof Error ? err.message : getErrorMessage(err))
          setPhase('idle')
        }
      }

      recorder.start(250)
      mediaRecorderRef.current = recorder
      setPhase('listening')
      setStatusMsg(PHASE_STATUS.listening)

      // ── Silence detection (VAD) ───────────────────────────────────────────
      const audioCtx = new AudioContext()
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      audioCtx.createMediaStreamSource(stream).connect(analyser)
      audioCtxRef.current = audioCtx

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const startTime = Date.now()
      const SILENCE_THRESHOLD = 18   // raised for real mics (background noise varies)
      const SILENCE_AFTER_MS = 2000  // 2s of silence to auto-stop
      const MIN_RECORD_MS = 1000     // ignore VAD in first 1s
      let silenceStart: number | null = null

      const detect = () => {
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length

        if (Date.now() - startTime > MIN_RECORD_MS) {
          if (avg < SILENCE_THRESHOLD) {
            if (silenceStart === null) silenceStart = Date.now()
            else if (Date.now() - silenceStart > SILENCE_AFTER_MS) {
              recorder.stop()
              return
            }
            const remaining = Math.ceil(
              (SILENCE_AFTER_MS - (Date.now() - (silenceStart ?? Date.now()))) / 1000
            )
            setStatusMsg(`⏸ Sending in ${remaining}s...`)
          } else {
            silenceStart = null
            setStatusMsg(PHASE_STATUS.listening)
          }
        }
        rafIdRef.current = requestAnimationFrame(detect)
      }
      rafIdRef.current = requestAnimationFrame(detect)
    } catch (err) {
      const e = err as { name?: string; message?: string }
      if (e.name === 'NotAllowedError') setStatusMsg('Microphone permission denied.')
      else if (e.name === 'NotFoundError') setStatusMsg('No microphone found.')
      else setStatusMsg('Mic error: ' + (e.message || 'unknown'))
      setPhase('idle')
    }
  }, [onTurn])

  // ── Mic button handler — implements onInterrupt pattern ───────────────────
  const handleMicClick = useCallback(() => {
    if (phase === 'speaking') {
      onInterrupt()
      // Brief delay then start listening (matches voice skill onInterrupt → onTurn flow)
      setTimeout(() => startRecording(), 100)
    } else if (phase === 'listening') {
      stopRecording()
    } else if (phase === 'idle') {
      startRecording()
    }
    // thinking/transcribing phases: ignore (or could abort)
  }, [phase, onInterrupt, startRecording, stopRecording])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (text && phase === 'idle') onTurn(text)
  }

  const clearChat = () => {
    stopSpeaking()
    abortCtrlRef.current?.abort()
    setMessages([GREETING])
    setHistory([])
    setPhase('idle')
    setStatusMsg('')
    localStorage.removeItem(STORAGE_KEY)
  }

  // ── Derived UI state ─────────────────────────────────────────────────────
  const isListening = phase === 'listening'
  const isBusy = phase === 'thinking' || phase === 'transcribing'
  const isSpeaking = phase === 'speaking'
  const micDisabled = isBusy  // allow interrupt during speaking, block only thinking/transcribing

  return (
    <>
      <div className="chat-overlay" onClick={onClose} aria-hidden="true" />

      <Card className="chat-container fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[420px] h-[520px] sm:h-[580px] flex flex-col z-50 border-none">
        {/* Header */}
        <CardHeader className="chat-header flex flex-row items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Khawajgan AI</CardTitle>
              <p className="text-xs text-white/70">
                {phase === 'idle' ? 'Voice + Chat Assistant' : PHASE_STATUS[phase]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button" variant="ghost" size="icon"
              onClick={clearChat}
              className="h-7 w-7 text-white hover:bg-white/20"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button" variant="ghost" size="icon"
              onClick={() => setAutoSpeak(v => !v)}
              className={`h-7 w-7 text-white hover:bg-white/20 ${autoSpeak ? 'bg-white/20' : ''}`}
              title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </Button>
            <Button
              type="button" variant="ghost" size="icon"
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
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div dir="auto" className={`flex-1 p-2.5 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {msg.content || (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </span>
                    )}
                    {msg.role === 'assistant' && msg.id !== 'greeting' && msg.content && (
                      <Button
                        type="button" variant="ghost" size="sm"
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                        className="mt-1.5 h-5 text-xs opacity-50 hover:opacity-100 p-1"
                      >
                        {isSpeaking
                          ? <><VolumeX className="w-3 h-3 mr-1" />Stop</>
                          : <><Volume2 className="w-3 h-3 mr-1" />Listen</>
                        }
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Status bar */}
        {statusMsg && !isListening && (
          <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 border-t">
            {statusMsg}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="chat-input border-t p-2.5">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isListening ? 'destructive' : isSpeaking ? 'outline' : 'outline'}
              size="icon"
              onClick={handleMicClick}
              disabled={micDisabled}
              className={`flex-shrink-0 h-9 w-9 ${isListening ? 'animate-pulse' : ''} ${isSpeaking ? 'border-accent text-accent' : ''}`}
              title={
                phase === 'speaking' ? 'Interrupt and speak' :
                phase === 'listening' ? 'Stop recording' :
                'Start voice input'
              }
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                phase === 'listening' ? 'Listening... speak now' :
                phase === 'transcribing' ? 'Transcribing...' :
                phase === 'thinking' ? 'Thinking...' :
                phase === 'speaking' ? 'AI is speaking...' :
                'Type or use mic...'
              }
              disabled={!['idle'].includes(phase)}
              className="flex-1 h-9 text-sm"
            />
            <Button
              type="submit"
              disabled={phase !== 'idle' || !inputValue.trim()}
              size="icon"
              className="flex-shrink-0 h-9 w-9"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isListening && statusMsg && (
            <p className="text-xs text-red-500 mt-1.5 text-center animate-pulse font-medium">
              {statusMsg}
            </p>
          )}
        </form>
      </Card>
    </>
  )
}
