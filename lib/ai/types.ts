export type Language = 'en' | 'ur'

export type AgentType =
  | 'information'
  | 'navigation'
  | 'services'
  | 'policy'
  | 'action'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  language: Language
  timestamp: number
}

export interface ChatSession {
  id: string
  messages: Message[]
  createdAt: number
  lastActivity: number
  messageCount: number
}

export interface AgentResponse {
  success: boolean
  message: string
  language: Language
  agentType: AgentType
  metadata?: Record<string, unknown>
}

export interface MCPConnection {
  connected: boolean
  lastPing: number
  retryCount: number
}

// Backend chatbot API types
export interface ChatMessageRequest {
  message: string
  session_id?: string
}

export interface ChatMessageResponse {
  response: string
  intent: string
  service: string | null
  confidence: number
  sources: string[]
  can_help: boolean
  follow_up: string | null
  timestamp: string
}

export interface AIConfig {
  sessionTTL: number
  maxMessagesPerSession: number
  rateLimit: {
    requestsPerMinute: number
    messagesPerSession: number
  }
  agents: {
    [key in AgentType]: {
      enabled: boolean
      maxRetries: number
    }
  }
}
