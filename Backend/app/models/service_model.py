from pydantic import BaseModel

class ServiceCategory(BaseModel):
    name: str
    description: str
