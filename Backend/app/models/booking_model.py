from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingModel(BaseModel):
    customerId: str
    employeeId: str
    chargePerHour: float
    serviceDuration: int
    serviceType: str
    status: Optional[str] = "pending"  # Default status
    dateOfBooking: Optional[datetime] = None  # Will be set in the backend
    dateOfServiceCompletion: Optional[datetime] = None
    BookingCancel1ationReason: Optional[str] = None
    dateOfBookingCancel1ation: Optional[datetime] = None