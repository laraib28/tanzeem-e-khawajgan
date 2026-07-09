import OpenAI from 'openai'
import knowledgeBase from '@/config/ai/knowledge-base.json'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Internal backend URL (Docker: http://backend:8000, local: http://localhost:8000)
const BACKEND_INTERNAL_URL =
  process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000'

async function fetchLiveContext(): Promise<string> {
  // Manual timeout for Node.js compatibility (AbortSignal.timeout requires Node 17.3+)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/context/live`, {
      signal: controller.signal,
    })
    if (!res.ok) return ''
    const data = await res.json()
    if (!data.success) return ''

    const booked = data.banquet_booked_dates as Record<
      string,
      Array<{ hall: string; status: string }>
    >
    const entries = Object.entries(booked)
    if (entries.length === 0) {
      return '\nBANQUET AVAILABILITY: All halls currently available for booking.'
    }
    const lines = entries.map(
      ([date, items]) =>
        `  ${date}: ${items.map((b) => b.hall).join(', ')} — BOOKED (${items[0].status})`
    )
    return `\nLIVE BANQUET BOOKED DATES (next 90 days, as of ${data.as_of}):\n${lines.join('\n')}\nAll other dates are available.`
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

function buildSystemPrompt(liveContext: string): string {
  return `You are the AI assistant for Tanzeem-e-Khawajgan, a community welfare organization based in North Nazimabad, Karachi, serving 595+ members.

═══════════════════════════════════════
LANGUAGE RULE — STRICT, NEVER BREAK IT
═══════════════════════════════════════
Detect the script/language the user is writing in and reply in the EXACT same script.

| User writes in       | You reply in        |
|----------------------|---------------------|
| Roman Urdu           | Roman Urdu only     |
| English              | English only        |
| Urdu script (اردو)   | Urdu script only    |

- NEVER mix scripts in one reply (no half-English + half-Roman Urdu).
- NEVER switch language unless the user switches first.
- If ambiguous, match the dominant language in the user's message.
- Voice replies carry the same content as text — do not simplify just because it is spoken.

══════
TONE
══════
- Always use "aap" (never "tu" / "tera") in Roman Urdu or Urdu script replies.
- Warm, respectful, community-appropriate.
- Concise — prefer bullet points over long paragraphs.
- If information is not available or not found in the knowledge base, say so honestly — never guess or invent data.

════════════════════════
WHAT YOU CAN ANSWER
════════════════════════
Answer ONLY from the knowledge base and live data below. Do not invent anything outside it.
For bookings or unavailable info, direct users to the contact number or relevant page.
Never provide medical or legal advice.

════════════════════════
KNOWLEDGE BASE
════════════════════════
${JSON.stringify(knowledgeBase, null, 2)}
${liveContext}`
}

export class ChatService {
  // Lazy-init: don't instantiate OpenAI at module load time so a missing key
  // throws immediately on the first request with a clear message, not a 64s timeout.
  private _openai: OpenAI | null = null

  private get openai(): OpenAI {
    if (!this._openai) {
      const key = process.env.OPENAI_API_KEY
      if (!key) {
        throw new Error(
          'OPENAI_API_KEY is not set. Add it to .env.local (development) or the Docker environment (production).'
        )
      }
      this._openai = new OpenAI({ apiKey: key })
    }
    return this._openai
  }

  async streamResponse(
    message: string,
    history: ChatMessage[]
  ): Promise<AsyncIterable<string>> {
    const liveContext = await fetchLiveContext()
    const systemPrompt = buildSystemPrompt(liveContext)

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10),
      { role: 'user', content: message },
    ]

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 800,
      stream: true,
      messages,
    })

    return this.extractTextChunks(stream)
  }

  private async *extractTextChunks(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): AsyncIterable<string> {
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? ''
      if (text) yield text
    }
  }
}

export const chatService = new ChatService()
