"""
ChatKit Router
Provides ChatKit-compatible endpoint for the frontend.

Uses OpenAI ChatKit Python SDK to handle streaming responses.
"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import json
import os
from datetime import datetime

# Conditional import based on ChatKit SDK availability
try:
    from chatkit import ChatKitServer, Message, event
    CHATKIT_AVAILABLE = True
except ImportError:
    CHATKIT_AVAILABLE = False

# Use OpenAI Agent if OPENAI_API_KEY is set, otherwise fallback
if os.getenv("OPENAI_API_KEY"):
    from ai_agents.openai_agent import get_agent_controller
else:
    from ai_agents.chatbot import get_chatbot_service as get_agent_controller

router = APIRouter(prefix="/chatkit", tags=["ChatKit"])


class TanzeemChatKitServer:
    """
    Custom ChatKit server for Tanzeem-e-Khawajgan.

    Integrates with the OpenAI Agent controller to provide
    streaming responses using MCP tools.
    """

    def __init__(self):
        self.agent = get_agent_controller()

    async def respond(self, messages: list, session_id: str = None) -> AsyncGenerator[str, None]:
        """
        Handle incoming chat messages and stream responses.

        Args:
            messages: List of conversation messages
            session_id: Session identifier for conversation tracking

        Yields:
            SSE events with response chunks
        """
        if not messages:
            yield self._format_sse_event("error", {"message": "No messages provided"})
            return

        # Get the last user message
        user_message = None
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break

        if not user_message:
            yield self._format_sse_event("error", {"message": "No user message found"})
            return

        # Signal start of response
        yield self._format_sse_event("start", {"timestamp": datetime.now().isoformat()})

        try:
            # Get response from agent
            response = self.agent.chat(user_message, session_id)

            # Stream the response in chunks for better UX
            response_text = response.get("response", "")
            chunk_size = 50  # Characters per chunk

            for i in range(0, len(response_text), chunk_size):
                chunk = response_text[i:i + chunk_size]
                yield self._format_sse_event("text", {"content": chunk})

            # Send metadata
            yield self._format_sse_event("metadata", {
                "intent": response.get("intent"),
                "service": response.get("service"),
                "sources": response.get("sources", []),
                "confidence": response.get("confidence", 0)
            })

            # Signal end of response
            yield self._format_sse_event("end", {
                "timestamp": datetime.now().isoformat(),
                "follow_up": response.get("follow_up")
            })

        except Exception as e:
            yield self._format_sse_event("error", {"message": str(e)})

    def _format_sse_event(self, event_type: str, data: dict) -> str:
        """Format data as SSE event."""
        return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"


# Singleton instance
_chatkit_server = None


def get_chatkit_server() -> TanzeemChatKitServer:
    """Get or create ChatKit server singleton."""
    global _chatkit_server
    if _chatkit_server is None:
        _chatkit_server = TanzeemChatKitServer()
    return _chatkit_server


@router.post("")
async def chatkit_endpoint(request: Request):
    """
    ChatKit endpoint for streaming chat responses.

    Accepts ChatKit-formatted requests and returns SSE stream.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    messages = body.get("messages", [])
    session_id = body.get("session_id") or body.get("thread_id")

    server = get_chatkit_server()

    return StreamingResponse(
        server.respond(messages, session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.get("/health")
async def chatkit_health():
    """Check ChatKit endpoint health."""
    return {
        "status": "healthy",
        "chatkit_sdk": CHATKIT_AVAILABLE,
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "timestamp": datetime.now().isoformat()
    }
