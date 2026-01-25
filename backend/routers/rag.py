"""
RAG API Router
Provides endpoints for querying website content.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from pydantic import BaseModel

from rag.query_service import get_rag_service

router = APIRouter(prefix="/api/rag", tags=["RAG"])


class RAGQueryRequest(BaseModel):
    """Request model for RAG query."""
    query: str
    service: Optional[str] = None
    top_k: int = 5


class ContentResult(BaseModel):
    """A single content result."""
    service: str
    category: str
    title: str
    content: str
    relevance_score: float
    source: str


class RAGQueryResponse(BaseModel):
    """Response model for RAG query."""
    found: bool
    message: str
    results: List[ContentResult]
    sources: List[str]


class ServiceInfoResponse(BaseModel):
    """Response model for service info."""
    service: str
    chunks: List[dict]
    total: int


class ServicesListResponse(BaseModel):
    """Response model for available services."""
    services: List[str]


@router.post("/query", response_model=RAGQueryResponse)
async def query_content(request: RAGQueryRequest):
    """
    Query website content using RAG.

    - Only returns content from indexed website sources
    - No hallucinations - returns empty if no match found
    - Provides source attribution
    """
    try:
        rag_service = get_rag_service()
        results = rag_service.query(
            query=request.query,
            service=request.service,
            top_k=request.top_k
        )
        response = rag_service.format_response(results)
        return RAGQueryResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/query", response_model=RAGQueryResponse)
async def query_content_get(
    q: str = Query(..., description="Search query"),
    service: Optional[str] = Query(None, description="Filter by service (medical, it, education, sports, banquets, graveyard)"),
    top_k: int = Query(5, ge=1, le=20, description="Maximum results to return")
):
    """
    Query website content using RAG (GET method).

    - Only returns content from indexed website sources
    - No hallucinations - returns empty if no match found
    - Provides source attribution
    """
    try:
        rag_service = get_rag_service()
        results = rag_service.query(
            query=q,
            service=service,
            top_k=top_k
        )
        response = rag_service.format_response(results)
        return RAGQueryResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/services", response_model=ServicesListResponse)
async def list_services():
    """Get list of available services with indexed content."""
    try:
        rag_service = get_rag_service()
        services = rag_service.get_available_services()
        return ServicesListResponse(services=services)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/services/{service}", response_model=ServiceInfoResponse)
async def get_service_info(service: str):
    """
    Get all indexed content for a specific service.

    Available services: medical, it, education, sports, banquets, graveyard, organization
    """
    try:
        rag_service = get_rag_service()
        chunks = rag_service.get_service_info(service)

        if not chunks:
            raise HTTPException(status_code=404, detail=f"Service '{service}' not found or has no content")

        chunk_dicts = [
            {
                "id": c.id,
                "category": c.category,
                "title": c.title,
                "content": c.content,
                "source": c.source
            }
            for c in chunks
        ]

        return ServiceInfoResponse(
            service=service,
            chunks=chunk_dicts,
            total=len(chunks)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def rag_health():
    """Check RAG system health and index status."""
    try:
        rag_service = get_rag_service()
        services = rag_service.get_available_services()
        total_chunks = len(rag_service.chunks)

        return {
            "status": "healthy",
            "indexed": True,
            "total_chunks": total_chunks,
            "services": services
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
