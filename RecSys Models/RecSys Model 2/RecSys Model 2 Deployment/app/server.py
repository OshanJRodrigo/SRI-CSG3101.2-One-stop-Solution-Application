from fastapi import FastAPI, HTTPException

from pydantic import BaseModel

import os
import firebase_admin
from firebase_admin import firestore, credentials

from app.recsys_model_2_deployment import load_models, retrieve_employees, rank_employees, get_firestore_data


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
    id: str
    location: Location

    class Config:
        # Provide example data for FastAPI
        json_schema_extra = {
            "example": {
                "id": "Ha3iJu77CxlrFm-vQRs_8g",
                "location": {
                    "latitude": 32.241638,
                    "longitude": -110.961819
                }
            }
        }


@app.get('/')
async def root():
    return {"message": "RecSys Model 2 API"}


@app.post('/predict')
async def predict(data: RequestBody):
    """
    Provide recommendations of the 20 most nearest (within 20 km radius)
    active employees to the given customer's location.


    Args: 
        data (dict): A dictionary contaning customer id and customer's location. 
        e.g. 
            {
                "id": "Ha3iJu77CxlrFm-vQRs_8g", 
                "location": {"latitude": 32.241638, "longitude": -110.961819}
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
    #             "suggestion": "Please provide a valid JSON object with 'id' and 'location' fields."
    #         }
    #     )


    # Check if data is empty
    # if not data:
    #     raise HTTPException(
    #         status_code=400,
    #         detail={
    #             "error": "Bad Request",
    #             "message": "Request body cannot be empty.",
    #             "suggestion": "Please provide a JSON object with the required fields: 'id' and 'location'."
    #         }
    #     )
 


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


    # customer_id = data['id']
    # latitude = data['location'] ['latitude']
    # longitude = data['location'] ['longitude']
    # customer_location = (latitude, longitude)

    # Extract values directly from the validated Pydantic model
    customer_id = data.id
    latitude = data.location.latitude
    longitude = data.location.longitude
    customer_location = (latitude, longitude)    

    # Retrieve Matching Employees
    retrieved_employees = retrieve_employees(retrieval_model, customer_id)

    # Rank Matching Employees
    ranked_employees = rank_employees(ranking_model, customer_id, retrieved_employees)

    # Get Data From Firestore
    recommended_employees = get_firestore_data(ranked_employees, customer_location, db)

    if not recommended_employees:
        return {"message": "NO MATCH FOUND"}

    return recommended_employees