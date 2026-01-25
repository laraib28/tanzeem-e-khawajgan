"""
RAG Query Service
Retrieves relevant content based on user queries.
Uses TF-IDF for keyword matching.
"""

import re
import math
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from collections import Counter
from .indexer import ContentIndexer, ContentChunk
from .content_loader import ContentLoader


@dataclass
class QueryResult:
    """A search result with relevance score."""
    chunk: ContentChunk
    score: float
    matched_keywords: List[str]


class RAGQueryService:
    """
    RAG Query Service for retrieving website content.

    Rules:
    - Only returns content from indexed website sources
    - No hallucinations - returns empty if no match found
    - Provides source attribution
    """

    def __init__(self, config_path: str = None):
        self.loader = ContentLoader(config_path)
        self.indexer = ContentIndexer(self.loader)
        self.chunks: List[ContentChunk] = []
        self.idf_scores: Dict[str, float] = {}
        self._indexed = False

    def initialize(self):
        """Initialize the RAG system by indexing all content."""
        if not self._indexed:
            self.chunks = self.indexer.index_all()
            self._compute_idf()
            self._indexed = True

    def _compute_idf(self):
        """Compute IDF scores for all keywords."""
        doc_count = len(self.chunks)
        if doc_count == 0:
            return

        # Count documents containing each keyword
        keyword_doc_count: Dict[str, int] = Counter()
        for chunk in self.chunks:
            unique_keywords = set(chunk.keywords)
            for kw in unique_keywords:
                keyword_doc_count[kw] += 1

        # Compute IDF: log(N / df)
        for kw, df in keyword_doc_count.items():
            self.idf_scores[kw] = math.log(doc_count / df)

    def _tokenize(self, text: str) -> List[str]:
        """Tokenize query text."""
        return re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())

    def _compute_score(self, query_tokens: List[str], chunk: ContentChunk) -> Tuple[float, List[str]]:
        """Compute relevance score using TF-IDF."""
        matched = []
        score = 0.0

        chunk_keywords = set(chunk.keywords)
        for token in query_tokens:
            if token in chunk_keywords:
                matched.append(token)
                idf = self.idf_scores.get(token, 1.0)
                score += idf

        # Boost for service keyword matches
        service_boost = 0.0
        service_keywords = self.indexer.service_keywords.get(chunk.service, [])
        for token in query_tokens:
            if token in service_keywords:
                service_boost += 2.0

        return score + service_boost, matched

    def _detect_service(self, query: str) -> Optional[str]:
        """Detect which service the query is about."""
        query_lower = query.lower()

        service_patterns = {
            "medical": ["medical", "doctor", "health", "hospital", "clinic", "treatment", "diagnostic", "emergency"],
            "it": ["it", "computer", "technology", "software", "programming", "web", "course", "coding", "digital", "cyber"],
            "education": ["education", "school", "learning", "scholarship", "tutoring", "library", "study"],
            "sports": ["sports", "fitness", "gym", "football", "cricket", "basketball", "exercise"],
            "banquets": ["banquet", "hall", "wedding", "event", "venue", "booking", "party", "conference"],
            "graveyard": ["graveyard", "burial", "funeral", "cemetery"]
        }

        for service, patterns in service_patterns.items():
            for pattern in patterns:
                if pattern in query_lower:
                    return service

        return None

    def query(
        self,
        query: str,
        service: Optional[str] = None,
        top_k: int = 5,
        min_score: float = 0.5
    ) -> List[QueryResult]:
        """
        Query the RAG system for relevant content.

        Args:
            query: User query string
            service: Optional service filter (medical, it, education, sports, banquets, graveyard)
            top_k: Maximum number of results to return
            min_score: Minimum relevance score threshold

        Returns:
            List of QueryResult sorted by relevance score
        """
        self.initialize()

        if not self.chunks:
            return []

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        # Auto-detect service if not specified
        if service is None:
            service = self._detect_service(query)

        # Filter chunks by service if specified
        search_chunks = self.chunks
        if service:
            search_chunks = [c for c in self.chunks if c.service == service]

        # Score all chunks
        results: List[QueryResult] = []
        for chunk in search_chunks:
            score, matched = self._compute_score(query_tokens, chunk)
            if score >= min_score and matched:
                results.append(QueryResult(
                    chunk=chunk,
                    score=score,
                    matched_keywords=matched
                ))

        # Sort by score descending
        results.sort(key=lambda x: x.score, reverse=True)

        return results[:top_k]

    def get_service_info(self, service: str) -> List[ContentChunk]:
        """Get all information about a specific service."""
        self.initialize()
        return self.indexer.get_chunks_by_service(service)

    def get_available_services(self) -> List[str]:
        """Get list of available services."""
        self.initialize()
        return self.indexer.get_all_services()

    def format_response(self, results: List[QueryResult]) -> Dict[str, Any]:
        """
        Format query results for API response.

        Returns structured response with:
        - Retrieved content
        - Source attribution
        - No hallucinated content
        """
        if not results:
            return {
                "found": False,
                "message": "No relevant information found in the website content.",
                "results": [],
                "sources": []
            }

        formatted_results = []
        sources = set()

        for result in results:
            chunk = result.chunk
            formatted_results.append({
                "service": chunk.service,
                "category": chunk.category,
                "title": chunk.title,
                "content": chunk.content,
                "relevance_score": round(result.score, 2),
                "source": chunk.source
            })
            sources.add(chunk.source)

        return {
            "found": True,
            "message": f"Found {len(results)} relevant result(s).",
            "results": formatted_results,
            "sources": list(sources)
        }


# Singleton instance for API use
_rag_service: Optional[RAGQueryService] = None


def get_rag_service(config_path: str = None) -> RAGQueryService:
    """Get or create RAG service singleton."""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGQueryService(config_path)
        _rag_service.initialize()
    return _rag_service
