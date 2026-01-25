"""
Services Information Agent
Handles information queries for all organizational services using RAG.

Capabilities:
- Medical services information
- IT services and courses information
- Education programs information
- Sports facilities information
- Banquet halls information

Constraints:
- Information only - no actions
- Only uses RAG-sourced content
- Clearly states when information is unavailable
"""

import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

from rag.query_service import get_rag_service, QueryResult


class ServiceType(str, Enum):
    MEDICAL = "medical"
    IT = "it"
    EDUCATION = "education"
    SPORTS = "sports"
    BANQUETS = "banquets"
    GRAVEYARD = "graveyard"
    ORGANIZATION = "organization"
    UNKNOWN = "unknown"


@dataclass
class AgentResponse:
    """Response from the Information Agent."""
    success: bool
    service: Optional[str]
    message: str
    content: List[Dict[str, Any]]
    sources: List[str]
    confidence: float
    suggestion: Optional[str] = None


class InformationAgent:
    """
    Services Information Agent.

    Provides information about organizational services using RAG.
    Does NOT perform any actions - information retrieval only.
    """

    def __init__(self):
        self.rag_service = get_rag_service()

        # Intent patterns for service detection
        self.service_patterns = {
            ServiceType.MEDICAL: [
                r"\b(medical|doctor|health|hospital|clinic|treatment|diagnostic|emergency|vaccination|checkup|physician|medicine)\b",
            ],
            ServiceType.IT: [
                r"\b(it|computer|technology|software|programming|web|development|coding|course|training|digital|cybersecurity|cloud|database|app|mobile)\b",
            ],
            ServiceType.EDUCATION: [
                r"\b(education|school|learning|scholarship|tutoring|library|study|academic|literacy|books)\b",
            ],
            ServiceType.SPORTS: [
                r"\b(sports?|fitness|gym|football|cricket|basketball|volleyball|badminton|exercise|trainer|field|grounds)\b",
            ],
            ServiceType.BANQUETS: [
                r"\b(banquet|hall|wedding|event|venue|party|conference|meeting|capacity|guests|booking|reservation)\b",
            ],
            ServiceType.GRAVEYARD: [
                r"\b(graveyard|burial|funeral|cemetery|grave|plot|resting)\b",
            ],
            ServiceType.ORGANIZATION: [
                r"\b(organization|tanzeem|khawajgan|contact|address|phone|email|about|who|what)\b",
            ],
        }

        # Greeting patterns
        self.greeting_patterns = [
            r"^(hi|hello|hey|assalam|salam|good morning|good afternoon|good evening)\b",
        ]

        # Question patterns
        self.question_patterns = [
            r"\b(what|where|when|how|which|who|tell me|explain|describe|list|show)\b",
        ]

    def detect_service(self, query: str) -> ServiceType:
        """Detect which service the query is about."""
        query_lower = query.lower()

        scores = {}
        for service, patterns in self.service_patterns.items():
            score = 0
            for pattern in patterns:
                matches = re.findall(pattern, query_lower)
                score += len(matches)
            if score > 0:
                scores[service] = score

        if not scores:
            return ServiceType.UNKNOWN

        return max(scores, key=scores.get)

    def is_greeting(self, query: str) -> bool:
        """Check if query is a greeting."""
        query_lower = query.lower().strip()
        for pattern in self.greeting_patterns:
            if re.match(pattern, query_lower):
                return True
        return False

    def is_question(self, query: str) -> bool:
        """Check if query is a question."""
        query_lower = query.lower()
        for pattern in self.question_patterns:
            if re.search(pattern, query_lower):
                return True
        return query.strip().endswith("?")

    def handle_greeting(self) -> AgentResponse:
        """Handle greeting queries."""
        return AgentResponse(
            success=True,
            service=None,
            message="Assalam-o-Alaikum! Welcome to Tanzeem-e-Khawajgan. I can help you with information about our services:\n\n"
                    "• **Medical** - Healthcare services and facilities\n"
                    "• **IT** - Technology courses and training programs\n"
                    "• **Education** - Educational programs and scholarships\n"
                    "• **Sports** - Sports facilities and fitness programs\n"
                    "• **Banquets** - Event halls and venues\n\n"
                    "What would you like to know about?",
            content=[],
            sources=[],
            confidence=1.0
        )

    def format_results(self, results: List[QueryResult], service: ServiceType) -> str:
        """Format RAG results into a readable response."""
        if not results:
            return ""

        service_names = {
            ServiceType.MEDICAL: "Medical Services",
            ServiceType.IT: "IT Services",
            ServiceType.EDUCATION: "Education Services",
            ServiceType.SPORTS: "Sports Facilities",
            ServiceType.BANQUETS: "Banquet Services",
            ServiceType.GRAVEYARD: "Graveyard Services",
            ServiceType.ORGANIZATION: "Organization Information",
        }

        lines = []
        service_name = service_names.get(service, "Services")

        # Group by category
        categories = {}
        for result in results:
            cat = result.chunk.category
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(result)

        # Format overview first if present
        if "overview" in categories:
            for result in categories["overview"]:
                lines.append(result.chunk.content)
            lines.append("")
            del categories["overview"]

        # Format other categories
        for category, cat_results in categories.items():
            if category in ["course", "program", "service", "facility", "hall"]:
                lines.append(f"**Available {category.title()}s:**")
                for result in cat_results:
                    chunk = result.chunk
                    lines.append(f"• **{chunk.title}**: {chunk.content}")
                lines.append("")

        return "\n".join(lines).strip()

    def query(self, user_query: str) -> AgentResponse:
        """
        Process a user query and return information.

        This method:
        1. Detects if it's a greeting
        2. Detects the service type
        3. Queries RAG for relevant content
        4. Formats and returns the response

        Does NOT perform any actions.
        """
        # Handle greetings
        if self.is_greeting(user_query):
            return self.handle_greeting()

        # Detect service
        service = self.detect_service(user_query)

        # Query RAG
        service_filter = service.value if service != ServiceType.UNKNOWN else None
        results = self.rag_service.query(
            query=user_query,
            service=service_filter,
            top_k=5,
            min_score=0.3
        )

        # No results found
        if not results:
            suggestion = self._get_suggestion(service)
            return AgentResponse(
                success=False,
                service=service.value if service != ServiceType.UNKNOWN else None,
                message="I don't have specific information about that in our records. " + suggestion,
                content=[],
                sources=[],
                confidence=0.0,
                suggestion=suggestion
            )

        # Format response
        formatted_content = self.format_results(results, service)

        # Build content list
        content_list = [
            {
                "service": r.chunk.service,
                "category": r.chunk.category,
                "title": r.chunk.title,
                "content": r.chunk.content,
                "score": round(r.score, 2)
            }
            for r in results
        ]

        # Get sources
        sources = list(set(r.chunk.source for r in results))

        # Calculate confidence
        avg_score = sum(r.score for r in results) / len(results)
        confidence = min(avg_score / 5.0, 1.0)  # Normalize to 0-1

        return AgentResponse(
            success=True,
            service=service.value if service != ServiceType.UNKNOWN else results[0].chunk.service,
            message=formatted_content,
            content=content_list,
            sources=sources,
            confidence=confidence
        )

    def _get_suggestion(self, service: ServiceType) -> str:
        """Get a helpful suggestion based on detected service."""
        suggestions = {
            ServiceType.MEDICAL: "You can ask about our medical services, consultations, or diagnostic facilities.",
            ServiceType.IT: "You can ask about our IT courses, web development training, or summer camp programs.",
            ServiceType.EDUCATION: "You can ask about our educational programs, scholarships, or tutoring services.",
            ServiceType.SPORTS: "You can ask about our sports facilities, fitness center, or available grounds.",
            ServiceType.BANQUETS: "You can ask about our banquet halls, event venues, or hall capacities.",
            ServiceType.GRAVEYARD: "You can ask about burial services or funeral arrangements.",
            ServiceType.ORGANIZATION: "You can ask about our organization, contact information, or services.",
            ServiceType.UNKNOWN: "You can ask about our Medical, IT, Education, Sports, or Banquet services.",
        }
        return suggestions.get(service, suggestions[ServiceType.UNKNOWN])

    def get_service_overview(self, service: str) -> AgentResponse:
        """Get complete overview of a specific service."""
        try:
            service_type = ServiceType(service)
        except ValueError:
            return AgentResponse(
                success=False,
                service=None,
                message=f"Unknown service: {service}. Available services are: medical, it, education, sports, banquets.",
                content=[],
                sources=[],
                confidence=0.0
            )

        chunks = self.rag_service.get_service_info(service)

        if not chunks:
            return AgentResponse(
                success=False,
                service=service,
                message=f"No information available for {service} service.",
                content=[],
                sources=[],
                confidence=0.0
            )

        # Format all chunks
        content_list = [
            {
                "category": c.category,
                "title": c.title,
                "content": c.content,
            }
            for c in chunks
        ]

        sources = list(set(c.source for c in chunks))

        # Build formatted message
        lines = []
        for chunk in chunks:
            if chunk.category == "overview":
                lines.insert(0, chunk.content)
            else:
                lines.append(f"• **{chunk.title}**: {chunk.content}")

        return AgentResponse(
            success=True,
            service=service,
            message="\n".join(lines),
            content=content_list,
            sources=sources,
            confidence=1.0
        )
