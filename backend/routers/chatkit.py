"""
ChatKit Router - OpenAI Agents SDK ChatKit Integration
Uses official SDK ChatKit for streaming responses.
"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import json
import os
from datetime import datetime

router = APIRouter(prefix="/chatkit", tags=["ChatKit"])

# Check for OpenAI API Key
OPENAI_AVAILABLE = bool(os.getenv("OPENAI_API_KEY"))
IMPORT_ERROR = None

# Import our multi-agent system
if OPENAI_AVAILABLE:
    try:
        from ai_agents.agents import triage_agent
        from agents import Runner
        AGENTS_AVAILABLE = True
        print("[DEBUG] Agents SDK loaded successfully")
    except ImportError as e:
        AGENTS_AVAILABLE = False
        IMPORT_ERROR = str(e)
        print(f"[ERROR] Failed to import agents: {e}")
else:
    AGENTS_AVAILABLE = False
    print("[ERROR] OPENAI_API_KEY not set")


async def stream_agent_response(user_message: str, session_id: str = None) -> AsyncGenerator[str, None]:
    """
    Stream response from Khawajgan AI multi-agent system.

    Uses OpenAI Agents SDK Runner for execution.
    """
    # Signal start
    yield f"event: start\ndata: {json.dumps({'timestamp': datetime.now().isoformat()})}\n\n"

    if not AGENTS_AVAILABLE:
        # Fallback response
        from routers.ai_chat import get_fallback_response, detect_language
        lang = detect_language(user_message)
        response = get_fallback_response(user_message, lang)

        # Stream in chunks
        for i in range(0, len(response), 30):
            chunk = response[i:i + 30]
            yield f"event: text\ndata: {json.dumps({'content': chunk})}\n\n"

        yield f"event: end\ndata: {json.dumps({'timestamp': datetime.now().isoformat()})}\n\n"
        return

    try:
        print(f"[DEBUG] Processing message: {user_message}")

        # Run triage agent - it will handoff to appropriate agent
        result = await Runner.run(
            triage_agent,
            user_message
        )

        response_text = result.final_output or "System mein masla hai, thodi dair baad try karein."

        # Detect which agent responded
        agent_name = "triage"
        if hasattr(result, 'last_agent') and result.last_agent:
            agent_name = result.last_agent.name

        print(f"[DEBUG] Agent: {agent_name}, Response: {response_text[:100]}")

        # Stream response in chunks for smooth UX
        chunk_size = 30
        for i in range(0, len(response_text), chunk_size):
            chunk = response_text[i:i + chunk_size]
            yield f"event: text\ndata: {json.dumps({'content': chunk})}\n\n"

        # Send metadata
        yield f"event: metadata\ndata: {json.dumps({'agent': agent_name})}\n\n"

        # Signal end
        yield f"event: end\ndata: {json.dumps({'timestamp': datetime.now().isoformat()})}\n\n"

    except Exception as e:
        error_msg = "System mein masla hai, thodi dair baad try karein."
        yield f"event: text\ndata: {json.dumps({'content': error_msg})}\n\n"
        yield f"event: end\ndata: {json.dumps({'timestamp': datetime.now().isoformat(), 'error': True})}\n\n"


@router.post("")
async def chatkit_endpoint(request: Request):
    """
    ChatKit SSE endpoint for streaming chat.

    Request format:
    {
        "messages": [{"role": "user", "content": "..."}],
        "session_id": "optional-session-id"
    }
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    messages = body.get("messages", [])
    session_id = body.get("session_id") or body.get("thread_id")

    # Get last user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "")
            break

    if not user_message:
        async def error_stream():
            yield f"event: error\ndata: {json.dumps({'message': 'No user message'})}\n\n"
        return StreamingResponse(error_stream(), media_type="text/event-stream")

    return StreamingResponse(
        stream_agent_response(user_message, session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("/chat")
async def chatkit_chat(request: Request):
    """
    Non-streaming chat endpoint.
    Returns complete response at once.
    """
    try:
        body = await request.json()
    except Exception:
        return {"success": False, "error": "Invalid request"}

    messages = body.get("messages", [])
    session_id = body.get("session_id")

    # Get last user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "")
            break

    if not user_message:
        return {"success": False, "error": "No user message"}

    if not AGENTS_AVAILABLE:
        from routers.ai_chat import get_fallback_response, detect_language
        lang = detect_language(user_message)
        response = get_fallback_response(user_message, lang)
        return {
            "success": True,
            "response": response,
            "agent": "fallback"
        }

    try:
        result = await Runner.run(triage_agent, user_message)
        response_text = result.final_output or "System mein masla hai."

        agent_name = "triage"
        if hasattr(result, 'last_agent') and result.last_agent:
            agent_name = result.last_agent.name

        return {
            "success": True,
            "response": response_text,
            "agent": agent_name
        }
    except Exception as e:
        return {
            "success": False,
            "response": "System mein masla hai, thodi dair baad try karein.",
            "agent": "error"
        }


@router.get("/health")
async def chatkit_health():
    """Check ChatKit endpoint health."""
    return {
        "status": "healthy",
        "openai_key_set": OPENAI_AVAILABLE,
        "agents_sdk_loaded": AGENTS_AVAILABLE,
        "import_error": IMPORT_ERROR,
        "timestamp": datetime.now().isoformat()
    }
