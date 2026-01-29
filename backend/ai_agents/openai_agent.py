"""
OpenAI Agent Controller
Uses OpenAI Agents SDK with MCP tools for the unified chatbot.

Phase 6: Booking Agent (Active)
- Information queries → RAG content via MCP tools
- Booking queries → Booking tools (get_hall_list, check_availability, create_booking)
- All responses grounded in tool results
"""

import os
import json
import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from datetime import datetime
from dotenv import load_dotenv

from agents import Agent, Runner, function_tool
from agents.run import RunConfig

# Import MCP server
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from mcp.server import create_mcp_server, MCPToolResult

load_dotenv()


@dataclass
class ConversationMessage:
    """A message in the conversation history."""
    role: str  # "user" or "assistant"
    content: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class AgentResponse:
    """Response from the OpenAI Agent."""
    response: str
    intent: str
    service: Optional[str]
    confidence: float
    sources: List[str]
    can_help: bool
    follow_up: Optional[str]
    timestamp: str


class OpenAIAgentController:
    """
    OpenAI Agent Controller using Agents SDK.

    This controller:
    - Uses MCP server as the ONLY knowledge source
    - Ensures all responses are grounded in RAG content
    - Handles conversation context
    - Routes queries to appropriate MCP tools
    """

    SYSTEM_INSTRUCTIONS = """You are the Booking Assistant for Tanzeem-e-Khawajgan banquet halls.

YOU CAN AND MUST HELP USERS BOOK HALLS. BOOKING IS FULLY ENABLED.

##############################################
# MANDATORY RULE - READ THIS FIRST
##############################################

When user mentions ANY of these words:
- book, booking, reserve, reservation
- hall, banquet, venue, wedding, event
- availability, available, date, slot
- party, conference, function, mehendi, walima

YOU MUST IMMEDIATELY:
1. Call get_hall_list() tool - DO THIS FIRST, NO EXCEPTIONS
2. Show the halls to the user
3. Ask which hall they want

FORBIDDEN RESPONSES FOR BOOKING REQUESTS:
- "Please contact us directly" ❌ NEVER SAY THIS
- "I cannot help with bookings" ❌ NEVER SAY THIS
- "Booking feature is not available" ❌ NEVER SAY THIS
- "Call our office" ❌ NEVER SAY THIS

##############################################
# BOOKING FLOW - FOLLOW EXACTLY
##############################################

STEP 1 - SHOW HALLS (call get_hall_list immediately):
"Assalam-o-Alaikum! Here are our available halls:

1. **[Hall Name]** - Capacity: [X] guests
   - Amenities: [list]
   - Price: PKR [X]/hour

Which hall would you like to book?"

STEP 2 - GET DATE:
"Great choice! What date do you need? (Please provide in YYYY-MM-DD format, e.g., 2026-02-15)"

STEP 3 - CHECK AVAILABILITY (call check_availability):
After getting hall_id and date, call check_availability(hall_id, date)
Show available time slots to user.

STEP 4 - COLLECT DETAILS:
Ask for these one by one:
- Start time (e.g., 14:00)
- End time (e.g., 18:00)
- Your full name
- Phone number
- Number of guests
- Event type (wedding/party/conference/other)

STEP 5 - CONFIRM:
"Here's your booking summary:
- Hall: [name]
- Date: [date]
- Time: [start] - [end]
- Name: [name]
- Phone: [phone]
- Guests: [count]
- Estimated Cost: PKR [amount]

Reply 'confirm' to complete your booking."

STEP 6 - CREATE BOOKING (call create_booking only after user confirms):
After user says "yes"/"confirm"/"ok", call create_booking() and return:
"Booking confirmed! Your reference number is: [BK-XXXXXXXX-XXXX]"

##############################################
# FOR NON-BOOKING QUERIES
##############################################

Use these tools for information:
- search_content: Search organization info
- get_service_info: Get service details
- get_available_services: List all services
- get_organization_info: Contact info

##############################################
# REMEMBER
##############################################

1. BOOKING IS ENABLED - you have full capability to book halls
2. ALWAYS call get_hall_list first for any booking query
3. NEVER redirect users elsewhere for bookings
4. Be friendly and use "Assalam-o-Alaikum" for greetings"""

    def __init__(self):
        self.mcp_server = create_mcp_server()
        self.conversations: Dict[str, List[ConversationMessage]] = {}
        self._agent: Optional[Agent] = None
        self._initialize_agent()

    def _initialize_agent(self):
        """Initialize the OpenAI Agent with MCP tools."""
        # Create function tools from MCP server
        @function_tool
        def search_content(query: str, service: Optional[str] = None) -> str:
            """Search for information about Tanzeem-e-Khawajgan services.

            Args:
                query: The search query to find relevant information
                service: Optional filter by service (medical, it, education, sports, banquets, graveyard)

            Returns:
                JSON string with search results
            """
            result = self.mcp_server.call_tool("search_content", {
                "query": query,
                "service": service
            })
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        @function_tool
        def get_service_info(service: str) -> str:
            """Get complete information about a specific service.

            Args:
                service: The service name (medical, it, education, sports, banquets, graveyard)

            Returns:
                JSON string with service information
            """
            result = self.mcp_server.call_tool("get_service_info", {
                "service": service
            })
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        @function_tool
        def get_available_services() -> str:
            """Get a list of all services offered by Tanzeem-e-Khawajgan.

            Returns:
                JSON string with list of available services
            """
            result = self.mcp_server.call_tool("get_available_services", {})
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        @function_tool
        def get_organization_info() -> str:
            """Get general information about Tanzeem-e-Khawajgan organization.

            Returns:
                JSON string with organization details
            """
            result = self.mcp_server.call_tool("get_organization_info", {})
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        # Phase 6: Booking Tools
        @function_tool
        def get_hall_list(status: Optional[str] = "active") -> str:
            """Get list of available banquet halls with details.

            Args:
                status: Filter by hall status ('active' or 'inactive'). Default is 'active'.

            Returns:
                JSON string with list of halls including capacity, amenities, pricing
            """
            result = self.mcp_server.call_tool("get_hall_list", {
                "status": status or "active"
            })
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        @function_tool
        def check_availability(hall_id: int, booking_date: str) -> str:
            """Check availability of a specific hall for a given date.

            Args:
                hall_id: The ID of the banquet hall to check
                booking_date: The date to check (format: YYYY-MM-DD)

            Returns:
                JSON string with availability info including booked slots
            """
            result = self.mcp_server.call_tool("check_availability", {
                "hall_id": hall_id,
                "booking_date": booking_date
            })
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        @function_tool
        def create_booking(
            hall_id: int,
            booking_date: str,
            start_time: str,
            end_time: str,
            customer_name: str,
            customer_phone: str,
            guest_count: int,
            customer_email: Optional[str] = None,
            event_type: Optional[str] = None,
            special_requirements: Optional[str] = None
        ) -> str:
            """Create a new booking for a banquet hall. ONLY call after user confirmation.

            Args:
                hall_id: The ID of the banquet hall
                booking_date: The booking date (format: YYYY-MM-DD)
                start_time: Start time (format: HH:MM, 24-hour)
                end_time: End time (format: HH:MM, 24-hour)
                customer_name: Full name of the customer
                customer_phone: Customer phone number
                guest_count: Expected number of guests
                customer_email: Customer email (optional)
                event_type: Type of event (optional)
                special_requirements: Any special requirements (optional)

            Returns:
                JSON string with booking confirmation and reference number
            """
            result = self.mcp_server.call_tool("create_booking", {
                "hall_id": hall_id,
                "booking_date": booking_date,
                "start_time": start_time,
                "end_time": end_time,
                "customer_name": customer_name,
                "customer_phone": customer_phone,
                "customer_email": customer_email,
                "event_type": event_type,
                "guest_count": guest_count,
                "special_requirements": special_requirements
            })
            return json.dumps({
                "success": result.success,
                "data": result.data,
                "message": result.message,
                "sources": result.sources
            })

        # Create the agent with all tools including booking
        self._agent = Agent(
            name="TanzeemAssistant",
            instructions=self.SYSTEM_INSTRUCTIONS,
            tools=[
                search_content,
                get_service_info,
                get_available_services,
                get_organization_info,
                get_hall_list,
                check_availability,
                create_booking
            ],
            model="gpt-4o-mini"  # Cost-effective model for information queries
        )

    def _detect_intent(self, query: str) -> str:
        """Detect the intent of the user query."""
        query_lower = query.lower()

        # Greeting patterns (check first but don't return if booking keywords also present)
        greeting_patterns = [
            "hello", "hi", "hey", "salam", "assalam", "aoa", "good morning",
            "good afternoon", "good evening"
        ]
        is_greeting = any(pattern in query_lower for pattern in greeting_patterns)

        # Booking patterns - PRIORITY for Phase 6 (check before greeting)
        booking_patterns = [
            "book", "booking", "reserve", "reservation", "schedule", "appointment", "slot",
            "hall", "banquet", "venue", "event", "wedding", "party", "conference",
            "availability", "available", "check date", "free date", "open date",
            "mehendi", "walima", "nikah", "shaadi", "function"
        ]
        for pattern in booking_patterns:
            if pattern in query_lower:
                return "booking"

        # Return greeting only if no booking intent
        if is_greeting:
            return "greeting"

        # Action patterns (membership, registration - not booking)
        action_patterns = [
            "register", "enroll", "apply", "sign up", "submit", "membership"
        ]
        for pattern in action_patterns:
            if pattern in query_lower:
                return "action"

        return "information"

    def _detect_service(self, query: str) -> Optional[str]:
        """Detect which service the query relates to."""
        query_lower = query.lower()

        service_patterns = {
            "medical": ["medical", "doctor", "health", "hospital", "clinic", "diagnostic"],
            "it": ["it", "computer", "technology", "programming", "web", "course", "coding"],
            "education": ["education", "school", "scholarship", "tutoring", "library"],
            "sports": ["sports", "gym", "fitness", "cricket", "football"],
            "banquets": ["banquet", "hall", "wedding", "event", "venue"],
            "graveyard": ["graveyard", "burial", "funeral", "cemetery"]
        }

        for service, patterns in service_patterns.items():
            for pattern in patterns:
                if pattern in query_lower:
                    return service

        return None

    async def chat_async(
        self,
        user_message: str,
        session_id: Optional[str] = None
    ) -> AgentResponse:
        """
        Process a chat message asynchronously.

        Args:
            user_message: The user's message
            session_id: Optional session ID for conversation tracking

        Returns:
            AgentResponse with the agent's response
        """
        session_id = session_id or "default"

        # Initialize conversation if needed
        if session_id not in self.conversations:
            self.conversations[session_id] = []

        # Record user message
        user_msg = ConversationMessage(
            role="user",
            content=user_message,
            timestamp=datetime.now().isoformat()
        )
        self.conversations[session_id].append(user_msg)

        # Detect intent and service
        intent = self._detect_intent(user_message)
        service = self._detect_service(user_message)

        # Build conversation context
        context_messages = []
        for msg in self.conversations[session_id][-10:]:  # Last 10 messages
            context_messages.append({
                "role": msg.role,
                "content": msg.content
            })

        try:
            # Run the agent
            result = await Runner.run(
                self._agent,
                user_message,
                context={"conversation_history": context_messages}
            )

            response_text = result.final_output or "I couldn't process your request. Please try again."

            # Extract sources from tool calls if available
            sources = []
            if hasattr(result, 'tool_results'):
                for tool_result in result.tool_results:
                    try:
                        data = json.loads(tool_result)
                        if isinstance(data, dict) and 'sources' in data:
                            sources.extend(data['sources'])
                    except (json.JSONDecodeError, TypeError):
                        pass

            # Record assistant response
            assistant_msg = ConversationMessage(
                role="assistant",
                content=response_text,
                timestamp=datetime.now().isoformat(),
                metadata={"intent": intent, "service": service}
            )
            self.conversations[session_id].append(assistant_msg)

            return AgentResponse(
                response=response_text,
                intent=intent,
                service=service,
                confidence=0.9 if sources else 0.7,
                sources=list(set(sources)),
                can_help=True,
                follow_up=None,
                timestamp=assistant_msg.timestamp
            )

        except Exception:
            # Different error messages based on intent
            if intent == "booking":
                error_msg = "I encountered a temporary issue. Let me try again - which hall would you like to book? I can show you our available halls."
                follow_up = "Try asking about available halls"
            else:
                error_msg = "I encountered an error processing your request. Please try again."
                follow_up = "Try rephrasing your question"

            return AgentResponse(
                response=error_msg,
                intent=intent,
                service=service,
                confidence=0.0,
                sources=[],
                can_help=True,  # Changed to True - we CAN help
                follow_up=follow_up,
                timestamp=datetime.now().isoformat()
            )

    def chat(
        self,
        user_message: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process a chat message synchronously.

        Args:
            user_message: The user's message
            session_id: Optional session ID for conversation tracking

        Returns:
            Dict with the agent's response
        """
        # Run async in event loop
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
            "intent": response.intent,
            "service": response.service,
            "confidence": response.confidence,
            "sources": response.sources,
            "can_help": response.can_help,
            "follow_up": response.follow_up,
            "timestamp": response.timestamp
        }

    def get_available_services(self) -> List[str]:
        """Get list of available services."""
        return ["medical", "it", "education", "sports", "banquets", "graveyard"]

    def get_service_info(self, service: str) -> Dict[str, Any]:
        """Get information about a specific service."""
        result = self.mcp_server.call_tool("get_service_info", {"service": service})
        return {
            "success": result.success,
            "service": service,
            "message": result.message,
            "content": result.data.get("sections", []) if result.data else [],
            "sources": result.sources
        }

    def clear_history(self, session_id: Optional[str] = None):
        """Clear conversation history."""
        if session_id:
            self.conversations.pop(session_id, None)
        else:
            self.conversations.clear()


# Singleton instance
_agent_controller: Optional[OpenAIAgentController] = None


def get_agent_controller() -> OpenAIAgentController:
    """Get or create the agent controller singleton."""
    global _agent_controller
    if _agent_controller is None:
        _agent_controller = OpenAIAgentController()
    return _agent_controller
