"""
Khawajgan AI - Multi-Agent System
OpenAI Agents SDK with Handoffs
"""

from .openai_agent import (
    KhawajganAI,
    get_khawajgan_ai,
    get_agent_controller,
    OpenAIAgentController,
    AgentResponse
)

__all__ = [
    "KhawajganAI",
    "get_khawajgan_ai",
    "get_agent_controller",
    "OpenAIAgentController",
    "AgentResponse"
]
