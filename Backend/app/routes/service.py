from fastapi import APIRouter, HTTPException
from app.models.service_model import ServiceCategory
from app.utils.firebase_utils import get_collection_ref

router = APIRouter()

@router.post("/services")
async def add_service_category(service: ServiceCategory):
    """Add a new service category."""
    services_ref = get_collection_ref("services")
    services_ref.add(service.dict())
    return {"message": "Service category added successfully"}

@router.get("/services")
async def get_service_categories():
    """Fetch all service categories."""
    services_ref = get_collection_ref("services")
    docs = services_ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]
