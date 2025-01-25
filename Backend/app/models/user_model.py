from pydantic import BaseModel, EmailStr
from typing import Optional, List

# User Registration Model
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    phone: str
    first_name: str
    last_name: str
    

# Login Model
class UserLogin(BaseModel):
    email: EmailStr
    password: str



class EmployeeRegister(BaseModel):
    email: EmailStr
    password: str
    phone: str
    first_name: str
    last_name: str
    skills: List[str]
    charge_per_hour: float
    experience: Optional[str] = None
    nic: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


