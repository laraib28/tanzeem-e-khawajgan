"""
RAG Content Indexer
Creates searchable chunks from website content.
"""

import re
from typing import Dict, List, Any
from dataclasses import dataclass
from .content_loader import ContentLoader


@dataclass
class ContentChunk:
    """A searchable chunk of content."""
    id: str
    service: str
    category: str
    title: str
    content: str
    keywords: List[str]
    source: str


class ContentIndexer:
    """Indexes website content into searchable chunks."""

    def __init__(self, loader: ContentLoader = None):
        self.loader = loader or ContentLoader()
        self.chunks: List[ContentChunk] = []
        self.service_keywords = {
            "medical": ["doctor", "health", "hospital", "medicine", "treatment", "clinic", "consultation", "diagnostic", "emergency", "vaccination", "checkup", "physician"],
            "it": ["computer", "technology", "software", "programming", "web", "development", "coding", "course", "training", "digital", "internet", "cybersecurity", "cloud", "database", "app"],
            "education": ["school", "learning", "study", "scholarship", "tutoring", "library", "books", "academic", "literacy", "adult education"],
            "sports": ["fitness", "gym", "football", "cricket", "basketball", "volleyball", "badminton", "exercise", "trainer", "field", "grounds"],
            "banquets": ["hall", "wedding", "event", "venue", "party", "conference", "meeting", "booking", "reservation", "capacity", "guests"],
            "graveyard": ["burial", "funeral", "cemetery", "plot", "grave", "resting"]
        }

    def index_all(self) -> List[ContentChunk]:
        """Index all content from the website."""
        self.chunks = []
        content = self.loader.load_all()

        # Index services
        services = content.get("services", {})
        self._index_medical(services.get("medical", {}))
        self._index_it(services.get("it", {}), content.get("it_service", {}))
        self._index_education(services.get("education", {}))
        self._index_sports(services.get("sports", {}))
        self._index_banquets(services.get("banquets", {}))
        self._index_graveyard(services.get("graveyard", {}))

        # Index organization info
        self._index_organization(content.get("site_config", {}))

        return self.chunks

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text."""
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        return list(set(words))

    def _create_chunk(self, service: str, category: str, title: str, content: str, source: str) -> ContentChunk:
        """Create a content chunk."""
        chunk_id = f"{service}_{category}_{len(self.chunks)}"
        keywords = self._extract_keywords(f"{title} {content}")
        keywords.extend(self.service_keywords.get(service, []))
        return ContentChunk(
            id=chunk_id,
            service=service,
            category=category,
            title=title,
            content=content,
            keywords=list(set(keywords)),
            source=source
        )

    def _index_medical(self, data: Dict[str, Any]):
        """Index medical service content."""
        if not data:
            return

        # Main description
        if "description" in data:
            chunk = self._create_chunk(
                service="medical",
                category="overview",
                title=data.get("banner", {}).get("title", "Medical Services"),
                content=data["description"],
                source="services/medical"
            )
            self.chunks.append(chunk)

        # Individual services
        for svc in data.get("services", []):
            chunk = self._create_chunk(
                service="medical",
                category="service",
                title=svc.get("title", ""),
                content=svc.get("description", ""),
                source="services/medical"
            )
            self.chunks.append(chunk)

    def _index_it(self, services_data: Dict[str, Any], it_service_data: Dict[str, Any]):
        """Index IT service content."""
        # From services.json
        if services_data:
            if "description" in services_data:
                chunk = self._create_chunk(
                    service="it",
                    category="overview",
                    title=services_data.get("banner", {}).get("title", "IT Services"),
                    content=services_data["description"],
                    source="services/it"
                )
                self.chunks.append(chunk)

            for course in services_data.get("courses", []):
                content = f"{course.get('description', '')} Duration: {course.get('duration', '')}. Level: {course.get('level', '')}."
                chunk = self._create_chunk(
                    service="it",
                    category="course",
                    title=course.get("title", ""),
                    content=content,
                    source="services/it"
                )
                self.chunks.append(chunk)

            if "summerCamp" in services_data:
                chunk = self._create_chunk(
                    service="it",
                    category="program",
                    title="Summer Camp",
                    content=services_data["summerCamp"],
                    source="services/it"
                )
                self.chunks.append(chunk)

        # From it-service.json
        it_data = it_service_data.get("itService", {})
        if it_data:
            if "description" in it_data:
                chunk = self._create_chunk(
                    service="it",
                    category="overview",
                    title="IT Services Overview",
                    content=it_data["description"],
                    source="services/it"
                )
                self.chunks.append(chunk)

            if "imageSection" in it_data:
                section = it_data["imageSection"]
                chunk = self._create_chunk(
                    service="it",
                    category="mission",
                    title=section.get("title", ""),
                    content=section.get("description", ""),
                    source="services/it"
                )
                self.chunks.append(chunk)

            for course in it_data.get("courses", []):
                chunk = self._create_chunk(
                    service="it",
                    category="course",
                    title=course.get("title", ""),
                    content=course.get("description", ""),
                    source="services/it"
                )
                self.chunks.append(chunk)

    def _index_education(self, data: Dict[str, Any]):
        """Index education service content."""
        if not data:
            return

        if "description" in data:
            chunk = self._create_chunk(
                service="education",
                category="overview",
                title=data.get("banner", {}).get("title", "Education Services"),
                content=data["description"],
                source="services/education"
            )
            self.chunks.append(chunk)

        for program in data.get("programs", []):
            chunk = self._create_chunk(
                service="education",
                category="program",
                title=program.get("title", ""),
                content=program.get("description", ""),
                source="services/education"
            )
            self.chunks.append(chunk)

    def _index_sports(self, data: Dict[str, Any]):
        """Index sports service content."""
        if not data:
            return

        if "description" in data:
            chunk = self._create_chunk(
                service="sports",
                category="overview",
                title=data.get("banner", {}).get("title", "Sports Facilities"),
                content=data["description"],
                source="services/sports"
            )
            self.chunks.append(chunk)

        for facility in data.get("facilities", []):
            chunk = self._create_chunk(
                service="sports",
                category="facility",
                title=facility.get("title", ""),
                content=facility.get("description", ""),
                source="services/sports"
            )
            self.chunks.append(chunk)

    def _index_banquets(self, data: Dict[str, Any]):
        """Index banquet service content."""
        if not data:
            return

        if "description" in data:
            chunk = self._create_chunk(
                service="banquets",
                category="overview",
                title=data.get("banner", {}).get("title", "Banquet Services"),
                content=data["description"],
                source="services/banquets"
            )
            self.chunks.append(chunk)

        for hall in data.get("halls", []):
            content = f"{hall.get('description', '')} Capacity: {hall.get('capacity', 'N/A')} guests."
            chunk = self._create_chunk(
                service="banquets",
                category="hall",
                title=hall.get("title", ""),
                content=content,
                source="services/banquets"
            )
            self.chunks.append(chunk)

    def _index_graveyard(self, data: Dict[str, Any]):
        """Index graveyard service content."""
        if not data:
            return

        if "description" in data:
            chunk = self._create_chunk(
                service="graveyard",
                category="overview",
                title=data.get("banner", {}).get("title", "Graveyard Services"),
                content=data["description"],
                source="services/graveyard"
            )
            self.chunks.append(chunk)

        for svc in data.get("services", []):
            chunk = self._create_chunk(
                service="graveyard",
                category="service",
                title=svc.get("title", ""),
                content=svc.get("description", ""),
                source="services/graveyard"
            )
            self.chunks.append(chunk)

        if "contact" in data:
            chunk = self._create_chunk(
                service="graveyard",
                category="contact",
                title="Graveyard Contact",
                content=data["contact"],
                source="services/graveyard"
            )
            self.chunks.append(chunk)

    def _index_organization(self, data: Dict[str, Any]):
        """Index organization info."""
        if not data:
            return

        # Organization name and description
        site_name = data.get("siteName", {}).get("en", "Tanzeem-e-Khawajgan")
        site_desc = data.get("siteDescription", {}).get("en", "")

        chunk = self._create_chunk(
            service="organization",
            category="info",
            title=site_name,
            content=site_desc,
            source="site-config"
        )
        self.chunks.append(chunk)

        # Contact info
        contact = data.get("contact", {})
        if contact:
            contact_content = f"Email: {contact.get('email', '')}. Phone: {contact.get('phone', '')}. Address: {contact.get('address', {}).get('en', '')}."
            chunk = self._create_chunk(
                service="organization",
                category="contact",
                title="Contact Information",
                content=contact_content,
                source="site-config"
            )
            self.chunks.append(chunk)

    def get_chunks_by_service(self, service: str) -> List[ContentChunk]:
        """Get all chunks for a specific service."""
        return [c for c in self.chunks if c.service == service]

    def get_all_services(self) -> List[str]:
        """Get list of indexed services."""
        return list(set(c.service for c in self.chunks))
