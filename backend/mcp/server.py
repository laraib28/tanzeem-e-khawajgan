"""
MCP Content Server
Exposes RAG content as MCP tools for the OpenAI Agent.

This server provides:
- search_content: Search for information across all services
- get_service_info: Get detailed information about a specific service
- get_available_services: List all available services
- get_organization_info: Get organization details

Phase 6 Booking Tools:
- get_hall_list: List available banquet halls (READ)
- check_availability: Check hall availability for a date (READ)
- create_booking: Create a new booking (WRITE)
"""

import json
import sys
import random
import string
from pathlib import Path
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime, date, time

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from rag.query_service import get_rag_service, QueryResult
from rag.content_loader import ContentLoader
from database import SessionLocal
from models import BanquetHall, Booking, BookingAuditLog


@dataclass
class MCPToolResult:
    """Result from an MCP tool call."""
    success: bool
    data: Any
    message: str
    sources: List[str]


class MCPContentServer:
    """
    MCP Server providing RAG content access.

    This server is the ONLY knowledge source for the chatbot.
    All responses must be sourced from this server.
    """

    def __init__(self, config_path: Optional[str] = None):
        self.rag_service = get_rag_service(config_path)
        self.content_loader = ContentLoader(config_path)

        # Tool definitions for MCP
        self.tools = {
            "search_content": {
                "name": "search_content",
                "description": "Search for information about Tanzeem-e-Khawajgan services. Use this to answer user questions about medical services, IT courses, education programs, sports facilities, banquet halls, or graveyard services.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to find relevant information"
                        },
                        "service": {
                            "type": "string",
                            "description": "Optional: Filter by service (medical, it, education, sports, banquets, graveyard)",
                            "enum": ["medical", "it", "education", "sports", "banquets", "graveyard"]
                        }
                    },
                    "required": ["query"]
                }
            },
            "get_service_info": {
                "name": "get_service_info",
                "description": "Get complete information about a specific service. Use this when user asks about a particular service like medical, IT, education, sports, banquets, or graveyard.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "service": {
                            "type": "string",
                            "description": "The service to get information about",
                            "enum": ["medical", "it", "education", "sports", "banquets", "graveyard"]
                        }
                    },
                    "required": ["service"]
                }
            },
            "get_available_services": {
                "name": "get_available_services",
                "description": "Get a list of all services offered by Tanzeem-e-Khawajgan. Use this when user asks what services are available.",
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            },
            "get_organization_info": {
                "name": "get_organization_info",
                "description": "Get general information about Tanzeem-e-Khawajgan organization including contact details, mission, and overview.",
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            },
            # Phase 6: Booking Tools
            "get_hall_list": {
                "name": "get_hall_list",
                "description": "Get a list of all available banquet halls with their details including capacity, amenities, and pricing.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "description": "Filter by hall status (active or inactive). Default is 'active'.",
                            "enum": ["active", "inactive"]
                        }
                    }
                }
            },
            "check_availability": {
                "name": "check_availability",
                "description": "Check availability of a specific hall for a given date. Returns booked time slots and available hours.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "hall_id": {
                            "type": "integer",
                            "description": "The ID of the banquet hall to check"
                        },
                        "booking_date": {
                            "type": "string",
                            "description": "The date to check availability for (format: YYYY-MM-DD)"
                        }
                    },
                    "required": ["hall_id", "booking_date"]
                }
            },
            "create_booking": {
                "name": "create_booking",
                "description": "Create a new booking for a banquet hall. ONLY call this after user has explicitly confirmed all booking details.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "hall_id": {
                            "type": "integer",
                            "description": "The ID of the banquet hall"
                        },
                        "booking_date": {
                            "type": "string",
                            "description": "The booking date (format: YYYY-MM-DD)"
                        },
                        "start_time": {
                            "type": "string",
                            "description": "Start time (format: HH:MM, 24-hour)"
                        },
                        "end_time": {
                            "type": "string",
                            "description": "End time (format: HH:MM, 24-hour)"
                        },
                        "customer_name": {
                            "type": "string",
                            "description": "Full name of the customer"
                        },
                        "customer_phone": {
                            "type": "string",
                            "description": "Customer phone number"
                        },
                        "customer_email": {
                            "type": "string",
                            "description": "Customer email (optional)"
                        },
                        "event_type": {
                            "type": "string",
                            "description": "Type of event (wedding, conference, party, etc.)"
                        },
                        "guest_count": {
                            "type": "integer",
                            "description": "Expected number of guests"
                        },
                        "special_requirements": {
                            "type": "string",
                            "description": "Any special requirements or notes"
                        }
                    },
                    "required": ["hall_id", "booking_date", "start_time", "end_time", "customer_name", "customer_phone", "guest_count"]
                }
            }
        }

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """Get MCP tool definitions for agent registration."""
        return list(self.tools.values())

    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> MCPToolResult:
        """
        Execute an MCP tool call.

        Args:
            tool_name: Name of the tool to call
            arguments: Tool arguments

        Returns:
            MCPToolResult with the response data
        """
        if tool_name == "search_content":
            return self._search_content(
                query=arguments.get("query", ""),
                service=arguments.get("service")
            )
        elif tool_name == "get_service_info":
            return self._get_service_info(
                service=arguments.get("service", "")
            )
        elif tool_name == "get_available_services":
            return self._get_available_services()
        elif tool_name == "get_organization_info":
            return self._get_organization_info()
        # Phase 6: Booking tools
        elif tool_name == "get_hall_list":
            return self._get_hall_list(
                status=arguments.get("status", "active")
            )
        elif tool_name == "check_availability":
            return self._check_availability(
                hall_id=arguments.get("hall_id"),
                booking_date=arguments.get("booking_date")
            )
        elif tool_name == "create_booking":
            return self._create_booking(
                hall_id=arguments.get("hall_id"),
                booking_date=arguments.get("booking_date"),
                start_time=arguments.get("start_time"),
                end_time=arguments.get("end_time"),
                customer_name=arguments.get("customer_name"),
                customer_phone=arguments.get("customer_phone"),
                customer_email=arguments.get("customer_email"),
                event_type=arguments.get("event_type"),
                guest_count=arguments.get("guest_count"),
                special_requirements=arguments.get("special_requirements")
            )
        else:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Unknown tool: {tool_name}",
                sources=[]
            )

    def _search_content(self, query: str, service: Optional[str] = None) -> MCPToolResult:
        """Search RAG content for relevant information."""
        if not query.strip():
            return MCPToolResult(
                success=False,
                data=None,
                message="Please provide a search query.",
                sources=[]
            )

        results = self.rag_service.query(query, service=service, top_k=5)

        if not results:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"No information found for: {query}",
                sources=[]
            )

        # Format results for the agent
        formatted_results = []
        sources = set()

        for result in results:
            chunk = result.chunk
            formatted_results.append({
                "service": chunk.service,
                "category": chunk.category,
                "title": chunk.title,
                "content": chunk.content,
                "relevance": round(result.score, 2)
            })
            sources.add(chunk.source)

        return MCPToolResult(
            success=True,
            data=formatted_results,
            message=f"Found {len(results)} relevant result(s).",
            sources=list(sources)
        )

    def _get_service_info(self, service: str) -> MCPToolResult:
        """Get complete information about a service."""
        valid_services = ["medical", "it", "education", "sports", "banquets", "graveyard"]

        if service.lower() not in valid_services:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Unknown service: {service}. Available services: {', '.join(valid_services)}",
                sources=[]
            )

        chunks = self.rag_service.get_service_info(service.lower())

        if not chunks:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"No information available for service: {service}",
                sources=[]
            )

        # Format chunks into structured info
        info = {
            "service": service,
            "sections": []
        }
        sources = set()

        for chunk in chunks:
            info["sections"].append({
                "category": chunk.category,
                "title": chunk.title,
                "content": chunk.content
            })
            sources.add(chunk.source)

        return MCPToolResult(
            success=True,
            data=info,
            message=f"Information about {service} service retrieved successfully.",
            sources=list(sources)
        )

    def _get_available_services(self) -> MCPToolResult:
        """Get list of available services."""
        services = self.rag_service.get_available_services()

        service_descriptions = {
            "medical": "Healthcare services including diagnostics, consultations, and emergency care",
            "it": "IT training courses, web development, programming, and summer camps",
            "education": "Educational programs, scholarships, tutoring, and library services",
            "sports": "Sports facilities, fitness programs, and recreational activities",
            "banquets": "Event halls for weddings, conferences, and gatherings",
            "graveyard": "Burial and funeral services"
        }

        services_info = [
            {"name": s, "description": service_descriptions.get(s, "")}
            for s in services
        ]

        return MCPToolResult(
            success=True,
            data=services_info,
            message=f"Tanzeem-e-Khawajgan offers {len(services)} services.",
            sources=["config/site-config.json"]
        )

    def _get_organization_info(self) -> MCPToolResult:
        """Get organization information."""
        try:
            site_config = self.content_loader.load_site_config()

            org_info = {
                "name": site_config.get("organizationName", "Tanzeem-e-Khawajgan"),
                "tagline": site_config.get("tagline", ""),
                "description": site_config.get("description", ""),
                "contact": site_config.get("contact", {}),
                "social": site_config.get("social", {}),
                "address": site_config.get("address", {})
            }

            return MCPToolResult(
                success=True,
                data=org_info,
                message="Organization information retrieved successfully.",
                sources=["config/site-config.json"]
            )
        except Exception as e:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Failed to load organization info: {str(e)}",
                sources=[]
            )

    # ===== PHASE 6: BOOKING TOOLS =====

    def _get_hall_list(self, status: str = "active") -> MCPToolResult:
        """Get list of available banquet halls."""
        db = SessionLocal()
        try:
            query = db.query(BanquetHall)
            if status:
                query = query.filter(BanquetHall.status == status)

            halls = query.all()

            if not halls:
                return MCPToolResult(
                    success=True,
                    data=[],
                    message="No banquet halls found.",
                    sources=["database:banquet_halls"]
                )

            halls_data = []
            for hall in halls:
                halls_data.append({
                    "id": hall.id,
                    "name": hall.name,
                    "capacity": hall.capacity,
                    "amenities": hall.amenities or [],
                    "price_per_hour": float(hall.price_per_hour),
                    "status": hall.status
                })

            return MCPToolResult(
                success=True,
                data=halls_data,
                message=f"Found {len(halls)} banquet hall(s).",
                sources=["database:banquet_halls"]
            )

        except Exception as e:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Failed to retrieve halls: {str(e)}",
                sources=[]
            )
        finally:
            db.close()

    def _check_availability(self, hall_id: int, booking_date: str) -> MCPToolResult:
        """Check hall availability for a specific date."""
        if not hall_id or not booking_date:
            return MCPToolResult(
                success=False,
                data=None,
                message="hall_id and booking_date are required.",
                sources=[]
            )

        db = SessionLocal()
        try:
            # Validate hall exists
            hall = db.query(BanquetHall).filter(BanquetHall.id == hall_id).first()
            if not hall:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message=f"Hall with ID {hall_id} not found.",
                    sources=[]
                )

            # Parse date
            try:
                check_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
            except ValueError:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="Invalid date format. Use YYYY-MM-DD.",
                    sources=[]
                )

            # Validate not in past
            if check_date < date.today():
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="Cannot check availability for past dates.",
                    sources=[]
                )

            # Get existing bookings for this hall and date
            existing_bookings = db.query(Booking).filter(
                Booking.hall_id == hall_id,
                Booking.booking_date == check_date,
                Booking.status.in_(["pending", "confirmed"])
            ).all()

            booked_slots = []
            for booking in existing_bookings:
                booked_slots.append({
                    "start_time": booking.start_time.strftime("%H:%M"),
                    "end_time": booking.end_time.strftime("%H:%M"),
                    "status": booking.status
                })

            # Determine available hours (assume 08:00 - 22:00 operating hours)
            available_hours = "08:00 - 22:00"
            if booked_slots:
                available_hours = "Check booked_slots for unavailable times"

            return MCPToolResult(
                success=True,
                data={
                    "hall_id": hall.id,
                    "hall_name": hall.name,
                    "date": booking_date,
                    "booked_slots": booked_slots,
                    "total_bookings": len(booked_slots),
                    "operating_hours": "08:00 - 22:00",
                    "is_fully_booked": len(booked_slots) >= 5  # Simplified check
                },
                message=f"Availability for {hall.name} on {booking_date}: {len(booked_slots)} existing booking(s).",
                sources=["database:bookings", "database:banquet_halls"]
            )

        except Exception as e:
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Failed to check availability: {str(e)}",
                sources=[]
            )
        finally:
            db.close()

    def _generate_booking_reference(self, booking_date: str) -> str:
        """Generate unique booking reference: BK-YYYYMMDD-XXXX"""
        date_part = booking_date.replace("-", "")
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"BK-{date_part}-{random_part}"

    def _create_booking(
        self,
        hall_id: int,
        booking_date: str,
        start_time: str,
        end_time: str,
        customer_name: str,
        customer_phone: str,
        customer_email: Optional[str] = None,
        event_type: Optional[str] = None,
        guest_count: int = 0,
        special_requirements: Optional[str] = None
    ) -> MCPToolResult:
        """Create a new booking. WRITE operation - requires user confirmation."""

        # Validate required fields
        if not all([hall_id, booking_date, start_time, end_time, customer_name, customer_phone, guest_count]):
            return MCPToolResult(
                success=False,
                data=None,
                message="Missing required fields: hall_id, booking_date, start_time, end_time, customer_name, customer_phone, guest_count",
                sources=[]
            )

        db = SessionLocal()
        try:
            # Validate hall exists and is active
            hall = db.query(BanquetHall).filter(
                BanquetHall.id == hall_id,
                BanquetHall.status == "active"
            ).first()

            if not hall:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message=f"Hall with ID {hall_id} not found or not active.",
                    sources=[]
                )

            # Parse and validate date
            try:
                parsed_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
            except ValueError:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="Invalid date format. Use YYYY-MM-DD.",
                    sources=[]
                )

            if parsed_date < date.today():
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="Cannot create booking for past dates.",
                    sources=[]
                )

            # Parse times
            try:
                parsed_start = datetime.strptime(start_time, "%H:%M").time()
                parsed_end = datetime.strptime(end_time, "%H:%M").time()
            except ValueError:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="Invalid time format. Use HH:MM (24-hour format).",
                    sources=[]
                )

            if parsed_end <= parsed_start:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message="End time must be after start time.",
                    sources=[]
                )

            # Validate guest count against hall capacity
            if guest_count > hall.capacity:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message=f"Guest count ({guest_count}) exceeds hall capacity ({hall.capacity}).",
                    sources=[]
                )

            # Check for time conflicts
            conflicting = db.query(Booking).filter(
                Booking.hall_id == hall_id,
                Booking.booking_date == parsed_date,
                Booking.status.in_(["pending", "confirmed"]),
                # Time overlap check
                Booking.start_time < parsed_end,
                Booking.end_time > parsed_start
            ).first()

            if conflicting:
                return MCPToolResult(
                    success=False,
                    data=None,
                    message=f"Time slot conflicts with existing booking ({conflicting.start_time.strftime('%H:%M')} - {conflicting.end_time.strftime('%H:%M')}).",
                    sources=[]
                )

            # Generate booking reference
            booking_ref = self._generate_booking_reference(booking_date)

            # Create booking
            new_booking = Booking(
                hall_id=hall_id,
                booking_date=parsed_date,
                start_time=parsed_start,
                end_time=parsed_end,
                customer_name=customer_name,
                customer_phone=customer_phone,
                customer_email=customer_email,
                event_type=event_type,
                guest_count=guest_count,
                special_requirements=special_requirements,
                status="pending",
                priority="normal",
                booking_reference=booking_ref
            )
            db.add(new_booking)
            db.flush()  # Get the ID

            # Create audit log
            audit_log = BookingAuditLog(
                booking_id=new_booking.id,
                action="BOOKING_CREATED",
                actor="AI_AGENT",
                details={
                    "hall_name": hall.name,
                    "booking_date": booking_date,
                    "start_time": start_time,
                    "end_time": end_time,
                    "customer_name": customer_name,
                    "guest_count": guest_count,
                    "booking_reference": booking_ref
                }
            )
            db.add(audit_log)

            db.commit()

            return MCPToolResult(
                success=True,
                data={
                    "booking_id": new_booking.id,
                    "booking_reference": booking_ref,
                    "hall_name": hall.name,
                    "booking_date": booking_date,
                    "start_time": start_time,
                    "end_time": end_time,
                    "customer_name": customer_name,
                    "customer_phone": customer_phone,
                    "guest_count": guest_count,
                    "status": "pending",
                    "estimated_cost": float(hall.price_per_hour) * (
                        (parsed_end.hour * 60 + parsed_end.minute) -
                        (parsed_start.hour * 60 + parsed_start.minute)
                    ) / 60
                },
                message=f"Booking created successfully! Reference: {booking_ref}",
                sources=["database:bookings", "database:booking_audit_log"]
            )

        except Exception as e:
            db.rollback()
            return MCPToolResult(
                success=False,
                data=None,
                message=f"Failed to create booking: {str(e)}",
                sources=[]
            )
        finally:
            db.close()


# Singleton instance
_mcp_server: Optional[MCPContentServer] = None


def create_mcp_server(config_path: Optional[str] = None) -> MCPContentServer:
    """Create or get the MCP server singleton."""
    global _mcp_server
    if _mcp_server is None:
        _mcp_server = MCPContentServer(config_path)
    return _mcp_server
