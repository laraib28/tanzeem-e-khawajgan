"""
AI Chat Router - ChatGPT-like intelligent chatbot with Agent capabilities
Uses OpenAI Agents SDK with MCP tools for booking and information queries.

Features:
- Language detection: Responds in same language as user (Urdu/English/Roman)
- Agent tools: Hall booking, availability check, member lookup
- Website knowledge only - no hallucinations
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import os
import re

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

# Check OpenAI availability and import agent
OPENAI_AVAILABLE = bool(os.getenv("OPENAI_API_KEY"))
agent_controller = None
IMPORT_ERROR = None

if OPENAI_AVAILABLE:
    try:
        from ai_agents.openai_agent import get_agent_controller
        agent_controller = get_agent_controller()
        print("[DEBUG] Agent controller loaded successfully")
    except Exception as e:
        OPENAI_AVAILABLE = False
        IMPORT_ERROR = str(e)
        print(f"[ERROR] Failed to load agent controller: {e}")
else:
    print("[ERROR] OPENAI_API_KEY not set")


def detect_language(text: str) -> str:
    """
    Detect language of input text.
    Returns: 'urdu', 'english', or 'roman' (Roman Urdu)
    """
    # Urdu Unicode range check
    urdu_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]')

    if urdu_pattern.search(text):
        return 'urdu'

    # Roman Urdu indicators (common words)
    roman_urdu_words = [
        'aap', 'mein', 'hai', 'hain', 'kya', 'kaise', 'kaisa', 'kon', 'kab',
        'kahan', 'kyun', 'acha', 'theek', 'nahi', 'ji', 'salam', 'walaikum',
        'assalam', 'khawajgan', 'tanzeem', 'booking', 'hall', 'doctor', 'daaktar',
        'batao', 'bataye', 'chahiye', 'karna', 'karein', 'dijiye', 'dein',
        'milega', 'hoga', 'sakta', 'sakti', 'mujhe', 'humein', 'unka', 'inka',
        'wala', 'wali', 'abhi', 'kal', 'parso', 'aaj', 'raat', 'subah', 'shaam',
        'pehle', 'baad', 'andar', 'bahar', 'upar', 'neeche', 'paas', 'door',
        'shukriya', 'meherbani', 'krna', 'krein', 'btao', 'btaye', 'ho', 'tum',
        'ap', 'mjhe', 'hmein', 'yahan', 'wahan', 'jahan', 'jab', 'tab', 'phir',
        'lekin', 'magar', 'aur', 'ya', 'bhi', 'sirf', 'bas', 'sab', 'kuch',
        'bohat', 'bohot', 'bahut', 'zyada', 'kam', 'thoda', 'zara'
    ]

    text_lower = text.lower()
    words_in_text = text_lower.split()

    roman_count = sum(1 for word in words_in_text if word in roman_urdu_words)

    # If more than 20% words are Roman Urdu indicators
    if len(words_in_text) > 0 and (roman_count / len(words_in_text)) > 0.2:
        return 'roman'

    # Check for common Roman Urdu patterns even with single word
    if any(word in text_lower for word in ['kya', 'kaise', 'batao', 'chahiye', 'mujhe', 'hai', 'hain', 'karna', 'salam', 'aoa']):
        return 'roman'

    return 'english'


def get_language_instruction(lang: str) -> str:
    """Get system instruction for language."""
    if lang == 'urdu':
        return """
IMPORTANT LANGUAGE RULE: User is speaking in Urdu script.
You MUST respond in Urdu (اردو) using Arabic script.
Example: "جی ہاں، میں آپ کی مدد کر سکتا ہوں۔"
"""
    elif lang == 'roman':
        return """
IMPORTANT LANGUAGE RULE: User is speaking in Roman Urdu (Urdu in English letters).
You MUST respond in Roman Urdu only.
Example: "Ji haan, main aapki madad kar sakta hoon."
Do NOT use English. Do NOT use Urdu script. Use Roman Urdu only.
"""
    else:
        return """
IMPORTANT LANGUAGE RULE: User is speaking in English.
You MUST respond in simple, clear English.
"""


# Conversation storage
conversations: Dict[str, List[Dict[str, str]]] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    success: bool
    response: str
    session_id: str
    intent: Optional[str] = None
    service: Optional[str] = None


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat message using OpenAI Agent with MCP tools.

    Features:
    - Language matching (Urdu/English/Roman Urdu)
    - Hall booking via agent tools
    - Information queries via MCP RAG
    - Conversation context maintained
    """
    session_id = request.session_id or f"session_{datetime.now().timestamp()}"

    # Detect user language
    user_lang = detect_language(request.message)

    # Initialize conversation if new
    if session_id not in conversations:
        conversations[session_id] = []

    # Add user message to history
    conversations[session_id].append({
        "role": "user",
        "content": request.message
    })

    # Keep only last 20 messages
    if len(conversations[session_id]) > 20:
        conversations[session_id] = conversations[session_id][-20:]

    if OPENAI_AVAILABLE and agent_controller:
        try:
            print(f"[DEBUG] Processing: {request.message}")

            # Use the OpenAI Agent Controller with MCP tools
            result = agent_controller.chat(
                user_message=request.message,
                session_id=session_id
            )

            response_text = result.get("response", "")
            intent = result.get("intent", "information")
            service = result.get("service")

            print(f"[DEBUG] Agent: {service}, Response: {response_text[:100]}")

            # Apply language transformation if needed
            response_text = await apply_language_style(response_text, user_lang)

        except Exception as e:
            print(f"[ERROR] Agent failed: {e}")
            response_text = get_fallback_response(request.message, user_lang)
            intent = "fallback"
            service = None
    else:
        # Fallback when OpenAI not available
        print(f"[DEBUG] Using fallback - OPENAI: {OPENAI_AVAILABLE}, Controller: {agent_controller is not None}")
        response_text = get_fallback_response(request.message, user_lang)
        intent = "fallback"
        service = None

    # Add assistant response to history
    conversations[session_id].append({
        "role": "assistant",
        "content": response_text
    })

    return ChatResponse(
        success=True,
        response=response_text,
        session_id=session_id,
        intent=intent,
        service=service
    )


async def apply_language_style(text: str, target_lang: str) -> str:
    """
    Ensure response matches target language style.
    This is a post-processing step for language consistency.
    """
    # For now, return as-is since agent is trained for Roman Urdu
    # Future: Add translation layer if needed
    return text


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear conversation history for a session."""
    if session_id in conversations:
        del conversations[session_id]
    if agent_controller:
        agent_controller.clear_history(session_id)
    return {"success": True, "message": "Session cleared"}


@router.get("/health")
async def chat_health():
    """Check AI Chat endpoint health."""
    return {
        "status": "healthy",
        "openai_key_set": OPENAI_AVAILABLE,
        "agent_controller_loaded": agent_controller is not None,
        "import_error": IMPORT_ERROR
    }


def get_fallback_response(message: str, lang: str) -> str:
    """Smart fallback responses - context-aware, concise."""
    msg = message.lower().strip()
    is_roman = lang == 'roman'

    # ============ GREETINGS FIRST ============
    if any(w in msg for w in ['salam', 'hello', 'hi', 'aoa', 'assalam']) and len(msg.split()) <= 3:
        return "[Router] AoA! Kaise madad karun?"

    # ============ MEDICAL CENTER - SPECIFIC DOCTORS FIRST ============

    # Eye specialist
    if any(w in msg for w in ['eye', 'aankh', 'nazar', 'ophtha', 'chasma']):
        return "[Medical] Dr. Faiza: Saturday 11 AM-12:30 PM."

    # Dentist
    if any(w in msg for w in ['dentist', 'dant', 'teeth', 'dental']):
        return "[Medical] Dr. Sohail: Mon-Thu, Sat 5-8 PM. Dr. Rida: Mon, Wed, Fri 12:30-2 PM."

    # Child specialist
    if any(w in msg for w in ['child', 'bacha', 'bachon', 'pediatric', 'kids']):
        return "[Medical] Dr. Farzana: Mon, Wed, Fri 11 AM-1 PM."

    # Gynaecologist
    if any(w in msg for w in ['gynae', 'lady', 'women', 'aurat', 'pregnancy', 'delivery']):
        return "[Medical] Dr. Naila Barni: Tue, Thu, Sat 10 AM-12:30 PM."

    # Diabetes / Sugar
    if any(w in msg for w in ['diabetes', 'dibetes', 'diabetic', 'sugar', 'bp']):
        return "[Medical] Dr. Ahmed: Mon, Wed, Fri 11 AM-1 PM & 6-8 PM."

    # Homeopathic
    if any(w in msg for w in ['homeo', 'homeopathic', 'desi', 'herbal']):
        return "[Medical] Dr. Akif: Mon-Thu 12-2 PM. Dr. Rashid: Mon-Fri 10 AM-1 PM."

    # Hijama / Cupping
    if any(w in msg for w in ['hajama', 'cupping', 'hijama']):
        return "[Medical] Dr. Rashid: Mon-Fri 10 AM-1 PM. Mrs. Saima: Friday 6:30-8:30 PM."

    # Ultrasound
    if any(w in msg for w in ['ultrasound', 'sonography', 'scan']):
        return "[Medical] Dr. Qurat Ul Ain: Mon-Fri."

    # General OPD
    if any(w in msg for w in ['opd', 'general doctor', 'general physician']):
        return "[Medical] Dr. Qurat Ul Ain: Mon-Fri."

    # Lab
    if any(w in msg for w in ['lab', 'test', 'blood test', 'diagnostic', 'xray', 'x-ray']):
        return "[Medical] Sindh Lab: Mon-Sat 10:30 AM-8 PM."

    # General Medical - ask which doctor (AFTER all specific doctors)
    if any(w in msg for w in ['doctor', 'medical', 'daaktar', 'health', 'hospital', 'clinic']):
        return "[Medical] Konsa doctor? Eye, Dentist, Child, Gynae, Diabetes, Homeo?"

    # ============ SPORTS - SPECIFIC SPORT FIRST ============
    # Check timing/price with typos
    asking_timing = any(w in msg for w in ['timing', 'timng', 'tming', 'taiming', 'time', 'kab', 'waqt', 'schedule', 'open', 'close', 'hour', 'ghanta'])
    asking_price = any(w in msg for w in ['price', 'rate', 'fee', 'fees', 'kitna', 'kitni', 'cost', 'rs', 'rupee', 'paisa', 'paise', 'kiraya', 'rent'])

    # Badminton (with typos)
    if any(w in msg for w in ['badminton', 'bedminton', 'badmintan', 'badmintun', 'badmintn', 'bedmintn']):
        if asking_timing:
            return "[Sports] Badminton: 10 AM se 4 AM."
        if asking_price:
            return "[Sports] Badminton: Rs.1500/hour."
        return "[Sports] Badminton: Rs.1500/hour, 10 AM-4 AM."

    # Cricket (with typos)
    if any(w in msg for w in ['cricket', 'criket', 'crickut', 'crikat', 'krket', 'crcket']):
        if asking_timing:
            return "[Sports] Cricket: 10 AM se 4 AM."
        if asking_price:
            return "[Sports] Cricket: Rs.2000-2500/hour."
        return "[Sports] Cricket: Rs.2000-2500/hour, 10 AM-4 AM."

    # Snooker (with typos)
    if any(w in msg for w in ['snooker', 'snuker', 'snookr', 'snukar', 'snokr']):
        if asking_timing:
            return "[Sports] Snooker: 10 AM se 4 AM."
        if asking_price:
            return "[Sports] Snooker: Rs.7/minute."
        return "[Sports] Snooker: Rs.7/minute, 10 AM-4 AM."

    # Pool
    if any(w in msg for w in ['pool', 'pul']) and 'swimming' not in msg:
        if asking_timing:
            return "[Sports] Pool: 10 AM se 4 AM."
        if asking_price:
            return "[Sports] Pool: Rs.100/game."
        return "[Sports] Pool: Rs.100/game, 10 AM-4 AM."

    # General sports - ONLY if no specific sport mentioned
    if any(w in msg for w in ['sport', 'sports', 'khel', 'gym', 'fitness', 'game']):
        if asking_timing:
            return "[Sports] Timing: 10 AM se 4 AM."
        if asking_price:
            return "[Sports] Konsa sport ki fee? Badminton, Cricket, Snooker, Pool?"
        return "[Sports] Konsa sport? Badminton, Cricket, Snooker, Pool?"

    # ============ BANQUET - SPECIFIC HALLS FIRST ============

    if 'tehseena' in msg:
        return "[Banquet] Tehseena Banquet Rs.30-40K fixed."

    if 'iqbal' in msg:
        return "[Banquet] Iqbal Arena Rs.250-300/head."

    if 'abdul' in msg or 'lateef' in msg:
        return "[Banquet] Abdul Lateef Hall Rs.250-300/head."

    # Guest count based matching - BEFORE general hall query

    # 300+ guests -> Tehseena
    if re.search(r'\b(300|350|400|450|500|600)\b', msg):
        if any(w in msg for w in ['guest', 'mehmaan', 'log', 'booking', 'banquet', 'hall', 'shadi', 'wedding']):
            return "[Banquet] Tehseena Banquet Rs.30-40K fixed."

    # 200-250 guests -> Iqbal Arena
    if re.search(r'\b(200|220|250)\b', msg):
        if any(w in msg for w in ['guest', 'mehmaan', 'log', 'booking', 'banquet', 'hall', 'shadi', 'wedding']):
            return "[Banquet] Iqbal Arena Rs.250-300/head."

    # 50-150 guests -> Abdul Lateef
    if re.search(r'\b(50|60|70|80|90|100|120|150)\b', msg):
        if any(w in msg for w in ['guest', 'mehmaan', 'log', 'booking', 'banquet', 'hall', 'shadi', 'wedding']):
            return "[Banquet] Abdul Lateef Hall Rs.250-300/head."

    # General hall query (AFTER guest count matching)
    if any(w in msg for w in ['hall', 'banquet', 'wedding', 'shadi', 'booking', 'book', 'venue', 'event', 'nikah', 'walima', 'mehendi']):
        return "[Banquet] Kitne guests? 50-150: Abdul Lateef, 200-250: Iqbal Arena, 300+: Tehseena."

    # ============ IT - SPECIFIC COURSES FIRST ============

    if 'shopify' in msg:
        return "[IT] 3 months ka course hai."

    if 'amazon' in msg or 'fba' in msg:
        return "[IT] 4 months ka course hai."

    if 'python' in msg:
        return "[IT] 4 months ka course hai."

    # General IT query (AFTER all specific courses)
    if any(w in msg for w in ['course', 'it', 'coding', 'training', 'computer', 'programming']):
        return "[IT] Shopify (3m), Amazon FBA (4m), Python (4m)."

    # ============ GRAVEYARD ============

    if any(w in msg for w in ['graveyard', 'qabristan', 'burial', 'funeral', 'janaza', 'grave', 'cemetery']):
        return "[Graveyard] Burial plots available. Contact: 0334-3037800"

    # ============ MEMBERSHIP ============

    if any(w in msg for w in ['member', 'membership', 'card', 'register']):
        return "Membership: Free OPD, Free operations. Form: /membership-form"

    # ============ ORGANIZATION INFO ============

    if any(w in msg for w in ['address', 'location', 'kahan', 'where', 'pata']):
        return "F-90, Block F, North Nazimabad, Karachi."

    if any(w in msg for w in ['contact', 'phone', 'number', 'call', 'rabta']):
        return "Contact: /contact page ya center visit karein."

    if any(w in msg for w in ['about', 'tanzeem', 'khawajgan', 'organization', 'kya hai']):
        return "Tanzeem-e-Khawajgan: Community welfare org. Medical, IT, Sports, Banquets."

    # ============ OTHER GREETINGS ============

    if any(w in msg for w in ['shukriya', 'thanks', 'thank']):
        return "Khushi hui madad karke!"

    if any(w in msg for w in ['bye', 'khuda hafiz', 'allah hafiz']):
        return "Allah Hafiz!"

    # ============ GENERIC QUERIES ============

    if any(w in msg for w in ['fee', 'fees', 'price', 'cost', 'rate', 'kitna', 'kitni']):
        return "Kis cheez ki fee? Medical, IT, sports ya hall?"

    if any(w in msg for w in ['timing', 'time', 'kab', 'waqt', 'schedule']):
        return "Kis cheez ka timing? Medical, sports ya hall?"

    # Default
    return "Kya jaanna chahte hain? Medical, IT, sports, hall ya membership?"
