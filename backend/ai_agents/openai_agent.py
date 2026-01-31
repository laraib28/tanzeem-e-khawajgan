"""
Khawajgan AI - Multi-Agent System
Uses OpenAI Agents SDK with Handoffs

Architecture:
- Triage Agent (main) → Detects intent and hands off
- Medical Agent → Doctors, timings, OPD
- Banquet Agent → Hall booking, events
- Sports Agent → Sports facilities
- IT Agent → Courses, training
- Graveyard Agent → Burial services
"""

import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime

from agents import Runner

# Import our multi-agent system
from .agents import triage_agent


@dataclass
class AgentResponse:
    """Response from the Khawajgan AI"""
    response: str
    agent_used: str
    timestamp: str


class KhawajganAI:
    """
    Khawajgan AI Controller

    Multi-agent system with handoffs:
    - Triage agent receives all queries
    - Automatically hands off to specialized agents
    - Each agent has domain-specific knowledge
    """

    def __init__(self):
        self.conversations: Dict[str, List[Dict]] = {}
        self.agent = triage_agent

    async def chat_async(
        self,
        user_message: str,
        session_id: Optional[str] = None
    ) -> AgentResponse:
        """
        Process a chat message asynchronously.

        The triage agent will automatically detect intent
        and handoff to the appropriate specialized agent.
        """
        session_id = session_id or "default"

        # Initialize conversation if needed
        if session_id not in self.conversations:
            self.conversations[session_id] = []

        # Add user message to history
        self.conversations[session_id].append({
            "role": "user",
            "content": user_message
        })

        try:
            # Run the triage agent - it will handoff automatically
            result = await Runner.run(
                self.agent,
                user_message
            )

            response_text = result.final_output or "System mein masla hai, thodi dair baad try karein."

            # Detect which agent was used
            agent_used = "triage"
            if hasattr(result, 'last_agent') and result.last_agent:
                agent_used = result.last_agent.name

            # Add assistant response to history
            self.conversations[session_id].append({
                "role": "assistant",
                "content": response_text
            })

            return AgentResponse(
                response=response_text,
                agent_used=agent_used,
                timestamp=datetime.now().isoformat()
            )

        except Exception as e:
            error_msg = "System mein masla aa gaya hai, thodi dair baad try karein."
            return AgentResponse(
                response=error_msg,
                agent_used="error",
                timestamp=datetime.now().isoformat()
            )

    def chat(
        self,
        user_message: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process a chat message synchronously.
        """
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        response = loop.run_until_complete(
            self.chat_async(user_message, session_id)
        )

        return {
            "response": response.response,
            "agent_used": response.agent_used,
            "timestamp": response.timestamp
        }

    def clear_history(self, session_id: Optional[str] = None):
        """Clear conversation history."""
        if session_id:
            self.conversations.pop(session_id, None)
        else:
            self.conversations.clear()


# Singleton instance
_khawajgan_ai: Optional[KhawajganAI] = None


def get_khawajgan_ai() -> KhawajganAI:
    """Get or create the Khawajgan AI singleton."""
    global _khawajgan_ai
    if _khawajgan_ai is None:
        _khawajgan_ai = KhawajganAI()
    return _khawajgan_ai


# Legacy compatibility
def get_agent_controller():
    """Legacy function - returns KhawajganAI instance"""
    return get_khawajgan_ai()


class OpenAIAgentController:
    """Legacy compatibility wrapper"""

    def __init__(self):
        self._ai = get_khawajgan_ai()

    def chat(self, user_message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        result = self._ai.chat(user_message, session_id)
        # Return in legacy format
        return {
            "response": result["response"],
            "intent": "auto",
            "service": result.get("agent_used", "unknown"),
            "confidence": 0.9,
            "sources": [],
            "can_help": True,
            "follow_up": None,
            "timestamp": result["timestamp"]
        }

    async def chat_async(self, user_message: str, session_id: Optional[str] = None):
        return await self._ai.chat_async(user_message, session_id)

    def clear_history(self, session_id: Optional[str] = None):
        self._ai.clear_history(session_id)
