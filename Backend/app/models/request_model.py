from pydantic import BaseModel

class ServiceRequest(BaseModel):
    user_id: str
    service_name: str
    description: str
    status: str = "pending"  # Default status

class Location(BaseModel):
    latitude: float
    longitude: float

class MLRequest(BaseModel):
    category: str
    location: Location

