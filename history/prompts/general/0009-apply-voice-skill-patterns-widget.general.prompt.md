---
name: Apply voice skill patterns to VoiceChatWidget
description: Refactored VoiceChatWidget using voice skill onTurn/onInterrupt/phase state machine patterns
type: general
stage: general
date: 2026-07-09
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: laraib-adnan
labels: ["voice", "refactor", "state-machine", "agents-sdk-skill"]
---

## Prompt

Read voice chatbot skill and apply

## Skill Patterns Applied

From `.agents/skills/agents-sdk/references/voice.md` and `references/streaming-chat.md`:

1. **`onTurn(transcript)` pattern** — single async entry point: STT result → LLM stream → TTS
2. **`onInterrupt()` pattern** — clicking mic while AI is speaking stops TTS + cancels request + immediately starts listening
3. **Single `VoicePhase` state machine** — replaced 3 boolean flags (`isLoading`, `isRecording`, `isSpeaking`) with one enum: `idle | listening | transcribing | thinking | speaking`
4. **`AbortController` (abortSignal pattern)** — cancel in-flight LLM requests on interrupt or new input
5. **`messageConcurrency: "latest"` pattern** — new voice/text input aborts previous in-flight request
6. **`historyRef`** — ref-based history access avoids stale closures in onTurn without adding history to deps

## Files Modified

 - components/ai/VoiceChatWidget.tsx

## Behavior changes

- Mic button now works in ALL phases: idle→start, listening→stop, speaking→INTERRUPT+start
- Status shown in header subtitle, not separate bar (less visual noise)
- Input placeholder changes per phase (clear feedback)
- Abort-safe: AbortError silently ignored, no error message shown to user
