"""
Voice Router
Provides voice-to-text (Whisper) and text-to-speech (TTS) endpoints.

Uses OpenAI's Whisper API for transcription and TTS API for speech synthesis.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from typing import Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import io
import tempfile
from datetime import datetime

from database import get_db
from models import ChatHistory

# Check if OpenAI is available
OPENAI_ERROR = None
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = bool(os.getenv("OPENAI_API_KEY"))
    if OPENAI_AVAILABLE:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        print("[DEBUG] Voice: OpenAI client initialized")
    else:
        print("[ERROR] Voice: OPENAI_API_KEY not set")
        client = None
except ImportError as e:
    OPENAI_AVAILABLE = False
    OPENAI_ERROR = str(e)
    client = None
    print(f"[ERROR] Voice: OpenAI import failed: {e}")

router = APIRouter(prefix="/api/voice", tags=["Voice"])


class TranscribeResponse(BaseModel):
    success: bool
    text: str
    language: Optional[str] = None
    duration: Optional[float] = None


class TTSRequest(BaseModel):
    text: str
    voice: str = "alloy"  # alloy, echo, fable, onyx, nova, shimmer
    speed: float = 1.0


class ChatWithVoiceRequest(BaseModel):
    text: str
    session_id: Optional[str] = None
    speak_response: bool = True


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = None
):
    """
    Transcribe audio to text using OpenAI Whisper.

    Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
    Max file size: 25MB
    """
    if not OPENAI_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Voice transcription not available. OpenAI API key not configured."
        )

    # Validate file type
    allowed_types = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/m4a", "audio/mp3"]
    content_type = audio.content_type or ""

    # Also check by extension
    filename = audio.filename or ""
    allowed_extensions = [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"]
    has_valid_extension = any(filename.lower().endswith(ext) for ext in allowed_extensions)

    if not (content_type in allowed_types or has_valid_extension):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid audio format. Supported: mp3, mp4, wav, webm, m4a"
        )

    try:
        # Read audio data
        audio_data = await audio.read()
        print(f"[DEBUG] Voice: Received audio, size={len(audio_data)} bytes, type={audio.content_type}, filename={audio.filename}")

        # Check file size (25MB limit)
        if len(audio_data) > 25 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file too large. Max 25MB.")

        if len(audio_data) < 1000:
            raise HTTPException(status_code=400, detail="Audio file too small. Please record longer.")

        # Determine file extension
        filename = audio.filename or "recording.webm"
        ext = os.path.splitext(filename)[1] or ".webm"

        # Create temp file for Whisper API
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(audio_data)
            tmp_path = tmp.name

        print(f"[DEBUG] Voice: Temp file created at {tmp_path}")

        try:
            # Transcribe with Whisper
            # Use English to keep Roman Urdu as Roman text (not Hindi script)
            with open(tmp_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language or "en",  # Default to English for Roman Urdu
                    response_format="verbose_json"
                )

            print(f"[DEBUG] Voice: Transcription successful: {transcript.text[:50]}...")

            return TranscribeResponse(
                success=True,
                text=transcript.text,
                language=transcript.language if hasattr(transcript, 'language') else None,
                duration=transcript.duration if hasattr(transcript, 'duration') else None
            )
        finally:
            # Clean up temp file
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Voice: Transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@router.post("/speak")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using OpenAI TTS.

    Returns audio/mpeg stream.

    Voices: alloy, echo, fable, onyx, nova, shimmer
    """
    if not OPENAI_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Text-to-speech not available. OpenAI API key not configured."
        )

    # Validate voice
    valid_voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    if request.voice not in valid_voices:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid voice. Options: {', '.join(valid_voices)}"
        )

    # Validate speed
    if not 0.25 <= request.speed <= 4.0:
        raise HTTPException(status_code=400, detail="Speed must be between 0.25 and 4.0")

    # Clean text for TTS (remove markdown, emojis)
    clean_text = request.text
    # Remove markdown
    import re
    clean_text = re.sub(r'\*\*([^*]+)\*\*', r'\1', clean_text)  # Bold
    clean_text = re.sub(r'\*([^*]+)\*', r'\1', clean_text)  # Italic
    clean_text = re.sub(r'•', '', clean_text)  # Bullets
    clean_text = re.sub(r'[🏥🏸💻🏛️🎫👩‍⚕️👶🦷👁️🌿💆🔬📅💰📞📍✅✨👥👑🎪🏠📦🛒🤖☀️🤝🙏⏰⏱️📊🏏🎱🌙🎤]', '', clean_text)

    # Limit text length (TTS has limits)
    if len(clean_text) > 4096:
        clean_text = clean_text[:4096]

    try:
        # Generate speech
        response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=clean_text,
            speed=request.speed
        )

        # Stream the audio response
        return StreamingResponse(
            io.BytesIO(response.content),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")


@router.post("/chat")
async def voice_chat(
    request: ChatWithVoiceRequest,
    db: Session = Depends(get_db)
):
    """
    Combined endpoint: Process text message and optionally return TTS audio URL.

    This endpoint:
    1. Sends text to the chatbot
    2. Gets response
    3. Optionally generates TTS for response
    4. Saves to database
    """
    if not OPENAI_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Voice chat not available. OpenAI API key not configured."
        )

    # Import agent controller
    from ai_agents.openai_agent import get_agent_controller

    try:
        # Get chatbot response
        agent = get_agent_controller()
        response = agent.chat(request.text, request.session_id)

        response_text = response.get("response", "")

        # Save to database
        try:
            chat_record = ChatHistory(
                session_id=request.session_id or "voice_session",
                user_message=request.text,
                assistant_message=response_text,
                timestamp=datetime.utcnow()
            )
            db.add(chat_record)
            db.commit()
        except Exception:
            db.rollback()

        result = {
            "success": True,
            "response": response_text,
            "intent": response.get("intent"),
            "service": response.get("service"),
            "sources": response.get("sources", []),
            "session_id": request.session_id,
            "audio_available": request.speak_response
        }

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice chat failed: {str(e)}")


@router.get("/health")
async def voice_health():
    """Check voice service health."""
    return {
        "status": "healthy" if OPENAI_AVAILABLE else "limited",
        "whisper_available": OPENAI_AVAILABLE,
        "tts_available": OPENAI_AVAILABLE,
        "openai_error": OPENAI_ERROR,
        "message": "Voice services ready" if OPENAI_AVAILABLE else "OpenAI API key required for voice features"
    }
