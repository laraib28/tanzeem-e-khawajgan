import type { ChatSession, Message, Language } from './types'
import { randomUUID } from 'crypto'

/**
 * Session Manager
 * Manages chat sessions with TTL (Time To Live) and in-memory storage
 * Sessions expire after 30 minutes of inactivity
 */

const SESSION_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds
const MAX_MESSAGES_PER_SESSION = 50
const CLEANUP_INTERVAL = 5 * 60 * 1000 // Cleanup every 5 minutes

class SessionManager {
  private sessions: Map<string, ChatSession>
  private cleanupInterval: NodeJS.Timeout | null

  constructor() {
    this.sessions = new Map()
    this.cleanupInterval = null
    this.startCleanupTask()
  }

  /**
   * Create a new chat session
   */
  createSession(language: Language = 'en'): ChatSession {
    const sessionId = randomUUID()
    const now = Date.now()

    const session: ChatSession = {
      id: sessionId,
      messages: [
        {
          id: randomUUID(),
          role: 'system',
          content: this.getSystemMessage(language),
          language,
          timestamp: now,
        },
      ],
      createdAt: now,
      lastActivity: now,
      messageCount: 1,
    }

    this.sessions.set(sessionId, session)
    return session
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    const session = this.sessions.get(sessionId)

    if (!session) {
      return null
    }

    // Check if session has expired
    const now = Date.now()
    if (now - session.lastActivity > SESSION_TTL) {
      this.deleteSession(sessionId)
      return null
    }

    return session
  }

  /**
   * Add a message to a session
   */
  addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    language: Language
  ): Message | null {
    const session = this.getSession(sessionId)

    if (!session) {
      return null
    }

    // Check message limit
    if (session.messageCount >= MAX_MESSAGES_PER_SESSION) {
      throw new Error('Maximum messages per session exceeded')
    }

    const message: Message = {
      id: randomUUID(),
      role,
      content,
      language,
      timestamp: Date.now(),
    }

    session.messages.push(message)
    session.lastActivity = Date.now()
    session.messageCount++

    this.sessions.set(sessionId, session)
    return message
  }

  /**
   * Get all messages in a session
   */
  getMessages(sessionId: string): Message[] {
    const session = this.getSession(sessionId)
    return session?.messages || []
  }

  /**
   * Get conversation history (excluding system messages)
   */
  getConversationHistory(sessionId: string): Message[] {
    const messages = this.getMessages(sessionId)
    return messages.filter(msg => msg.role !== 'system')
  }

  /**
   * Update session activity timestamp
   */
  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.lastActivity = Date.now()
      this.sessions.set(sessionId, session)
    }
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

  /**
   * Get total number of active sessions
   */
  getActiveSessionCount(): number {
    return this.sessions.size
  }

  /**
   * Start periodic cleanup of expired sessions
   */
  private startCleanupTask(): void {
    if (this.cleanupInterval) {
      return
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions()
    }, CLEANUP_INTERVAL)
  }

  /**
   * Cleanup expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = Date.now()
    const expiredSessions: string[] = []

    const sessionEntries = Array.from(this.sessions.entries())
    for (const [sessionId, session] of sessionEntries) {
      if (now - session.lastActivity > SESSION_TTL) {
        expiredSessions.push(sessionId)
      }
    }

    for (const sessionId of expiredSessions) {
      this.deleteSession(sessionId)
    }

    // Sessions cleaned up silently
  }

  /**
   * Stop cleanup task
   */
  stopCleanupTask(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Get system message based on language
   */
  private getSystemMessage(language: Language): string {
    if (language === 'ur') {
      return 'میں تنظیم خواجگان کا AI اسسٹنٹ ہوں۔ میں آپ کو تنظیم کے بارے میں معلومات، خدمات، اور نیویگیشن میں مدد کر سکتا ہوں۔'
    }

    return 'I am the AI assistant for Tanzeem-e-Khawajgan. I can help you with information about the organization, services, and navigation assistance.'
  }

  /**
   * Clear all sessions (for testing/maintenance)
   */
  clearAllSessions(): void {
    this.sessions.clear()
  }
}

// Singleton instance
export const sessionManager = new SessionManager()
