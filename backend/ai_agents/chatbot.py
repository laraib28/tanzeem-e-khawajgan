"""
Chatbot Service (Fallback)
Fallback chatbot when OpenAI API key is not configured.

This service:
- Routes queries to the appropriate agent
- Handles information queries via InformationAgent
- For booking: Provides hall info but requires OpenAI for full booking

NOTE: For full Phase 6 booking capabilities, configure OPENAI_API_KEY.
"""

from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum

from .information_agent import InformationAgent, AgentResponse


class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class IntentType(str, Enum):
    GREETING = "greeting"
    INFORMATION = "information"
    BOOKING = "booking"  # Future: Phase 4+
    ACTION = "action"    # Future: Phase 4+
    UNKNOWN = "unknown"


@dataclass
class ChatMessage:
    """A single chat message."""
    role: MessageType
    content: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ChatResponse:
    """Response from the chatbot."""
    message: str
    intent: str
    service: Optional[str]
    confidence: float
    sources: list
    can_help: bool
    follow_up: Optional[str] = None


class ChatbotService:
    """
    Unified Chatbot Service.

    Phase 3 Implementation:
    - Information queries only
    - Uses InformationAgent for service info
    - No booking or action capabilities yet

    Future phases will add:
    - BookingAgent for banquet bookings
    - ActionAgent for form submissions
    """

    def __init__(self):
        self.information_agent = InformationAgent()
        self.conversation_history: list = []

        # Intent detection patterns
        self.booking_keywords = [
            "book", "reserve", "reservation", "availability", "available",
            "schedule", "appointment", "slot"
        ]
        self.action_keywords = [
            "submit", "apply", "register", "enroll", "sign up", "fill form"
        ]

    def detect_intent(self, query: str) -> IntentType:
        """Detect the intent of the user query."""
        query_lower = query.lower()

        # Check for greeting
        if self.information_agent.is_greeting(query):
            return IntentType.GREETING

        # Check for booking intent (not supported in Phase 3)
        for keyword in self.booking_keywords:
            if keyword in query_lower:
                return IntentType.BOOKING

        # Check for action intent (not supported in Phase 3)
        for keyword in self.action_keywords:
            if keyword in query_lower:
                return IntentType.ACTION

        # Default to information
        if self.information_agent.is_question(query):
            return IntentType.INFORMATION

        return IntentType.INFORMATION  # Default

    def _handle_unsupported_intent(self, intent: IntentType, query: str) -> ChatResponse:
        """Handle booking/action intents - provide info and guide to full booking."""
        if intent == IntentType.BOOKING:
            # Try to get banquet info using information agent
            agent_response = self.information_agent.query("banquet halls venues capacity amenities")

            if agent_response.success and agent_response.content:
                return ChatResponse(
                    message=f"Assalam-o-Alaikum! Here's information about our banquet halls:\n\n"
                            f"{agent_response.message}\n\n"
                            f"We have the following halls available:\n"
                            f"• **Grand Hall** - Capacity: 500 guests (PKR 5,000/hour)\n"
                            f"• **Conference Room A** - Capacity: 50 guests (PKR 1,000/hour)\n"
                            f"• **Garden Lawn** - Capacity: 300 guests (PKR 3,000/hour)\n\n"
                            f"Which hall interests you? Tell me your preferred date and I'll help you proceed.",
                    intent=intent.value,
                    service="banquets",
                    confidence=0.9,
                    sources=agent_response.sources,
                    can_help=True,
                    follow_up="Tell me your preferred hall and date"
                )
            else:
                return ChatResponse(
                    message="Assalam-o-Alaikum! I'd be happy to help you with banquet hall booking.\n\n"
                            "We have these halls available:\n"
                            "• **Grand Hall** - Up to 500 guests\n"
                            "• **Conference Room A** - Up to 50 guests\n"
                            "• **Garden Lawn** - Up to 300 guests\n\n"
                            "Which hall are you interested in? And what date do you need?",
                    intent=intent.value,
                    service="banquets",
                    confidence=0.8,
                    sources=[],
                    can_help=True,
                    follow_up="Tell me your preferred hall and date"
                )

        if intent == IntentType.ACTION:
            return ChatResponse(
                message="I can provide information about our services and programs. "
                        "What service are you interested in?\n\n"
                        "• Medical services\n"
                        "• IT courses\n"
                        "• Education programs\n"
                        "• Sports facilities",
                intent=intent.value,
                service=None,
                confidence=0.8,
                sources=[],
                can_help=True,
                follow_up="Ask about a specific service"
            )

        return ChatResponse(
            message="Assalam-o-Alaikum! I can help you with:\n\n"
                    "• Medical services\n"
                    "• IT courses and training\n"
                    "• Education programs\n"
                    "• Sports facilities\n"
                    "• **Banquet hall booking**\n\n"
                    "What would you like to know?",
            intent=IntentType.UNKNOWN.value,
            service=None,
            confidence=0.5,
            sources=[],
            can_help=True,
            follow_up="Choose a service or book a hall"
        )

    def _convert_agent_response(self, agent_response: AgentResponse, intent: IntentType) -> ChatResponse:
        """Convert InformationAgent response to ChatResponse."""
        follow_up = None

        if not agent_response.success:
            follow_up = "Try asking about a specific service"

        return ChatResponse(
            message=agent_response.message,
            intent=intent.value,
            service=agent_response.service,
            confidence=agent_response.confidence,
            sources=agent_response.sources,
            can_help=agent_response.success,
            follow_up=follow_up
        )

    def chat(self, user_message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message and return a response.

        Args:
            user_message: The user's message
            session_id: Optional session identifier for conversation tracking

        Returns:
            Dict containing the chatbot response
        """
        # Record user message
        user_msg = ChatMessage(
            role=MessageType.USER,
            content=user_message,
            timestamp=datetime.now().isoformat()
        )
        self.conversation_history.append(asdict(user_msg))

        # Detect intent
        intent = self.detect_intent(user_message)

        # Route to appropriate handler
        if intent in [IntentType.BOOKING, IntentType.ACTION]:
            response = self._handle_unsupported_intent(intent, user_message)
        else:
            # Use Information Agent
            agent_response = self.information_agent.query(user_message)
            response = self._convert_agent_response(agent_response, intent)

        # Record assistant message
        assistant_msg = ChatMessage(
            role=MessageType.ASSISTANT,
            content=response.message,
            timestamp=datetime.now().isoformat(),
            metadata={
                "intent": response.intent,
                "service": response.service,
                "confidence": response.confidence
            }
        )
        self.conversation_history.append(asdict(assistant_msg))

        # Return response as dict
        return {
            "response": response.message,
            "intent": response.intent,
            "service": response.service,
            "confidence": response.confidence,
            "sources": response.sources,
            "can_help": response.can_help,
            "follow_up": response.follow_up,
            "timestamp": assistant_msg.timestamp
        }

    def get_service_info(self, service: str) -> Dict[str, Any]:
        """Get complete information about a specific service."""
        agent_response = self.information_agent.get_service_overview(service)

        return {
            "success": agent_response.success,
            "service": agent_response.service,
            "message": agent_response.message,
            "content": agent_response.content,
            "sources": agent_response.sources
        }

    def get_available_services(self) -> list:
        """Get list of services the chatbot can provide information about."""
        return ["medical", "it", "education", "sports", "banquets", "graveyard"]

    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []


# Singleton instance
_chatbot_service: Optional[ChatbotService] = None


def get_chatbot_service() -> ChatbotService:
    """Get or create chatbot service singleton."""
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service
