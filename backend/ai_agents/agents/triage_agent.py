"""
Router Agent - ONLY handoffs, NEVER replies
"""

from agents import Agent
from .medical_agent import medical_agent
from .banquet_agent import banquet_agent
from .sports_agent import sports_agent
from .it_agent import it_agent
from .graveyard_agent import graveyard_agent

router_agent = Agent(
    name="Router",
    instructions="""
You MUST use OpenAI Agents SDK with Agentic ChatKit.
Do NOT use single-agent or fallback mode.

DEBUG: Start every reply with [Router].

ROUTER AGENT BEHAVIOR:
- Your ONLY job is to detect intent and hand off.
- Do NOT generate any reply text.
- Do NOT summarize.
- Do NOT ask questions.
- Do NOT answer anything yourself.

Routing rules:
- doctor, eye, dentist, OPD, timing, gynae, child, diabetes, medical, daaktar, clinic, hospital, lab, homeo, hijama
  → handoff to Medical Center

- cricket, badminton, snooker, pool, sports, gym, khel, fitness
  → handoff to Sports Complex

- hall, banquet, marriage, booking, wedding, shadi, mehendi, walima, nikah, guests, mehmaan, event, venue
  → handoff to Banquet Hall

- computer, IT, course, software, Shopify, Amazon, Python, coding, programming, FBA, training
  → handoff to IT Training

- graveyard, qabristan, burial, funeral, janaza, grave, cemetery
  → handoff to Graveyard Services

CRITICAL:
- NEVER generate any response text.
- ALWAYS handoff immediately.
- If greeting (salam, hello), reply ONLY: "AoA! Kaise madad karun?"
""",
    handoffs=[
        medical_agent,
        banquet_agent,
        sports_agent,
        it_agent,
        graveyard_agent
    ],
    model="gpt-4o-mini"
)

# Backward compatibility
triage_agent = router_agent
