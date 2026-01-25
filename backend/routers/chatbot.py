"""
Chatbot API Router
Single interface for the unified chatbot using OpenAI Agents SDK + MCP.

Phase 6: Booking Agent (ACTIVE)
- Uses OpenAI Agents SDK for conversation handling
- MCP server for RAG content AND booking operations
- Booking capabilities ENABLED via MCP tools
"""

from fastapi import APIRouter, HTTPException
from typing import Optional, List
from pydantic import BaseModel
import os

# Use OpenAI Agent if OPENAI_API_KEY is set, otherwise fallback to basic chatbot
if os.getenv("OPENAI_API_KEY"):
    from ai_agents.openai_agent import get_agent_controller as get_chatbot_service
else:
    from ai_agents.chatbot import get_chatbot_service

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])


class ChatRequest(BaseModel):
    """Request model for chat."""
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat."""
    response: str
    intent: str
    service: Optional[str]
    confidence: float
    sources: List[str]
    can_help: bool
    follow_up: Optional[str]
    timestamp: str


class ServiceInfoRequest(BaseModel):
    """Request model for service info."""
    service: str


class ServiceInfoResponse(BaseModel):
    """Response model for service info."""
    success: bool
    service: Optional[str]
    message: str
    content: list
    sources: List[str]


class ServicesResponse(BaseModel):
    """Response model for available services."""
    services: List[str]


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message to the chatbot.

    The chatbot will:
    - Detect the intent (greeting, information, booking)
    - For booking: Use MCP tools to list halls, check availability, create bookings
    - For info: Query RAG for relevant information
    - Return a formatted response

    Phase 6: Booking enabled via OpenAI Agents SDK + MCP.
    """
    try:
        chatbot = get_chatbot_service()
        response = chatbot.chat(
            user_message=request.message,
            session_id=request.session_id
        )
        return ChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/message")
async def send_message_get(
    q: str,
    session_id: Optional[str] = None
):
    """
    Send a message to the chatbot (GET method).

    Convenience endpoint for testing.
    """
    try:
        chatbot = get_chatbot_service()
        response = chatbot.chat(
            user_message=q,
            session_id=session_id
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/services", response_model=ServicesResponse)
async def get_services():
    """Get list of services the chatbot can provide information about."""
    try:
        chatbot = get_chatbot_service()
        services = chatbot.get_available_services()
        return ServicesResponse(services=services)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/services/{service}", response_model=ServiceInfoResponse)
async def get_service_info(service: str):
    """
    Get complete information about a specific service.

    Available services: medical, it, education, sports, banquets, graveyard
    """
    try:
        chatbot = get_chatbot_service()
        response = chatbot.get_service_info(service)
        return ServiceInfoResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clear")
async def clear_history(session_id: Optional[str] = None):
    """Clear conversation history."""
    try:
        chatbot = get_chatbot_service()
        chatbot.clear_history()
        return {"success": True, "message": "Conversation history cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def chatbot_health():
    """Check chatbot health status."""
    try:
        chatbot = get_chatbot_service()
        services = chatbot.get_available_services()
        openai_enabled = bool(os.getenv("OPENAI_API_KEY"))

        return {
            "status": "healthy",
            "services_available": len(services),
            "phase": "6 - Booking Agent" if openai_enabled else "3 - Fallback",
            "openai_enabled": openai_enabled,
            "capabilities": {
                "information": True,
                "booking": openai_enabled,  # Booking enabled with OpenAI
                "actions": False
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
