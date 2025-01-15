from fastapi import FastAPI, HTTPException

from pydantic import BaseModel

import os
import firebase_admin
from firebase_admin import firestore, credentials

from app.recsys_model_1_deployment import load_models, retrieve_employees, rank_employees, get_firestore_data


# Valid service categories
valid_service_categories = [
                        'Plumbing', 'Electricians', 'Furniture Repair', 'Appliances & Repair', 'Painters', 
                        'Carpenters', 'Landscaping', 'Gardeners', 'Dry Cleaning & Laundry', 'Home Cleaning', 
                        'Carpet Cleaning', 'Dry Cleaning', 'Office Cleaning', 'Air Duct Cleaning', 
                        'Solar Panel Cleaning', 'Pest Control', 'Handyman'
                    ]


# Load the required models
retrieval_model, ranking_model = load_models()

# Path to Firebase Admin SDK credentials
JSON_KEY_FILE = "app/csg3101-service-providing-app-firebase-adminsdk-7xpfw-f39bc603db.json"

# Environment Variable with Credentials to Initialize Firebase Admin SDK (used as a backup)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = JSON_KEY_FILE

# Initialize Firebase Admin SDK
cred = credentials.Certificate(JSON_KEY_FILE)
firebase_admin.initialize_app(cred)

# Client for interacting with Google Cloud Firestore API
db = firestore.Client()

# Create a FastAPI instance
app = FastAPI()

# Define the Pydantic model for the request body
class Location(BaseModel):
    latitude: float
    longitude: float

class RequestBody(BaseModel):
    category: str
    location: Location

    class Config:
        # Provide example data for FastAPI
        json_schema_extra = {
            "example": {
                "category": "Plumbing",
                "location": {
                    "latitude": 29.935091,
                    "longitude": -90.110102
                }
            }
        }


@app.get('/')
async def root():
    return {"message": "RecSys Model 1 API"}


@app.post('/predict')
async def predict(data: RequestBody):
    """
    Provide recommendations of the 20 most nearest (within 20 km radius)
    active employees to the given customer's location.


    Args: 
        data (dict): A dictionary contaning customer selected service category
        and customer's location. e.g. 
            {
                "category": "Plumbing", 
                "location": {"latitude": 29.935091, "longitude": -90.110102}
            }

    Returns: 
        list: A list of dictionary objects containing details of the 20 most nearest 
        (within 20 km radius) active employees to the given customer's location. 

        If no employees are found, returns {"message": "NO MATCH FOUND"}.

    """

    # Validate that the incoming data is a dictionary
    # if not isinstance(data, dict):
    #     raise HTTPException(
    #         status_code=400,
    #         detail={
    #             "error": "Bad Request",
    #             "message": "Invalid request body. Expected a JSON object.",
    #             "suggestion": "Please provide a valid JSON object with 'category' and 'location' fields."
    #         }
    #     )


    # Check if data is empty
    # if not data:
    #     raise HTTPException(
    #         status_code=400,
    #         detail={
    #             "error": "Bad Request",
    #             "message": "Request body cannot be empty.",
    #             "suggestion": "Please provide a JSON object with the required fields: 'category' and 'location'."
    #         }
    #     )


    # Validate 'category' field
    # if ("category" not in data) or (data["category"] not in valid_service_categories):
    #     raise HTTPException(
    #         status_code=400,
    #         detail={
    #             "error": "Bad Request",
    #             "message": "Invalid or missing 'category' field in the request body.",
    #             "suggestion": f"Please include a valid 'category' from the following list: {', '.join(valid_service_categories)}"
    #         }
    #     )


    # Validate 'category' field
    if data.category not in valid_service_categories:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Bad Request",
                "message": "Invalid value for the 'category' field in the request body.",
                "suggestion": f"Please include a valid 'category' from the following list: {', '.join(valid_service_categories)}"
            }
        )    


    # Validate 'location' field
    # if (
    #     ("location" not in data) 
    #     or (not isinstance(data["location"], dict)) 
    #     or ("latitude" not in data["location"]) 
    #     or ("longitude" not in data["location"]) 
    #     or (not isinstance(data['location'] ['latitude'], (int, float))) 
    #     or (not isinstance(data['location'] ['longitude'], (int, float)))
    #     ):
    #     raise HTTPException(
    #         status_code=400,
    #         detail={
    #             "error": "Bad Request",
    #             "message": "Invalid or missing 'location' field in the request body.",
    #             "suggestion": "Please provide a 'location' object with 'latitude' and 'longitude' fields with numeric values."
    #         }
    #     )


    # service_category = data['category']
    # latitude = data['location'] ['latitude']
    # longitude = data['location'] ['longitude']
    # customer_location = (latitude, longitude)

    # Extract values directly from the validated Pydantic model
    service_category = data.category
    latitude = data.location.latitude
    longitude = data.location.longitude
    customer_location = (latitude, longitude)    

    # Retrieve Matching Employees
    retrieved_employees = retrieve_employees(retrieval_model, service_category)

    # Rank Matching Employees
    ranked_employees = rank_employees(ranking_model, service_category, retrieved_employees)

    # Get Data From Firestore
    recommended_employees = get_firestore_data(ranked_employees, customer_location, db)

    if not recommended_employees:
        return {"message": "NO MATCH FOUND"}

    return recommended_employees