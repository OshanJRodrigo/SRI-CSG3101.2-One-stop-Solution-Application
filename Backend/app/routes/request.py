from fastapi import APIRouter, HTTPException
from app.models.request_model import ServiceRequest, MLRequest
from app.utils.firebase_utils import get_collection_ref
from firebase_admin.firestore import GeoPoint
import requests
import logging
import httpx  # Import httpx for making asynchronous HTTP requests

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/requests")
async def create_service_request(request: ServiceRequest):
    """Log a new service request."""
    requests_ref = get_collection_ref("requests")
    requests_ref.add(request.dict())
    return {"message": "Request logged successfully"}

@router.get("/requests")
async def get_all_requests():
    """Fetch all service requests."""
    requests_ref = get_collection_ref("requests")
    docs = requests_ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@router.post("/ml/predict")
async def send_to_ml_model(request: MLRequest):
    try:
        # ML model endpoint
        ml_model_url = "https://recsys-model-one-208758525655.us-central1.run.app/predict"

        # Create a GeoPoint instance from the location data
        geopoint = GeoPoint(request.location.latitude, request.location.longitude)

        # Prepare data payload for the ML model
        data = {
            "category": request.category,
            "location": {
                "latitude": geopoint.latitude,
                "longitude": geopoint.longitude,
            },
        }

        # Log the request payload
        logger.info(f"Sending data to ML model: {data}")

        # Send POST request to the ML model
        response = requests.post(ml_model_url, json=data)

        # Log the response for debugging
        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"Response Body: {response.text}")

        # Raise an exception for non-2xx responses
        response.raise_for_status()

        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error communicating with ML model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error communicating with ML model: {str(e)}")

@router.get("/ml/test")
async def test_ml_model():
    try:
        # Replace with the actual ML model URL
        ml_model_url = "https://recsys-model-one-208758525655.us-central1.run.app"
        
        # Perform a GET request
        async with httpx.AsyncClient() as client:
            response = await client.get(ml_model_url)
        
        # Log the response and return it
        logger.info(f"Test response: {response.status_code}, {response.json()}")
        return {"status": response.status_code, "message": response.json()}
    except Exception as e:
        logger.error(f"Error testing ML model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error testing ML model: {str(e)}")