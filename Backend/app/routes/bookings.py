from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.utils.firebase_utils import db
from app.models.booking_model import BookingModel  # Import the BookingModel

router = APIRouter()

@router.post("/bookings")
async def create_booking(booking_data: BookingModel):  # Use BookingModel for validation
    try:
        # Convert Pydantic model to a dictionary
        booking_dict = booking_data.dict()

        # Add a timestamp to the booking data
        booking_dict["dateOfBooking"] = datetime.now().isoformat()

        # Save the booking data to Firestore
        booking_ref = db.collection("bookings").document()
        booking_ref.set(booking_dict)

        return {"success": True, "message": "Booking created successfully", "bookingId": booking_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating booking: {str(e)}")