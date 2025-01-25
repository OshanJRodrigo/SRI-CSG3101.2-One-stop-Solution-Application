import firebase_admin
from firebase_admin import credentials, firestore, storage, initialize_app
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
from fastapi import UploadFile
from datetime import datetime
from firebase_admin.firestore import GeoPoint
from typing import List, Optional

# Import configuration settings
from config import FIREBASE_CRED

# Initialize Firebase app (only run this once globally)
STORAGE_BUCKET = "csg3101-service-providing-app"

firebase_app = None
if not firebase_admin._apps:
    firebase_app = initialize_app(FIREBASE_CRED, {
        'storageBucket': STORAGE_BUCKET
    })

# Test Bucket Access
bucket = storage.bucket()
print(f"Bucket name: {bucket.name}")

if bucket.exists():
    print("Bucket exists and is accessible.")
else:
    print("Bucket does not exist or is inaccessible.")

# Firestore client to interact with the database
db = firestore.client()

def get_collection_ref(collection_name):
    """
    Returns a reference to a Firestore collection.
    Args:
        collection_name (str): The name of the collection in Firestore.
    Returns:
        CollectionReference: Firestore collection reference.
    """
    return db.collection(collection_name)

def add_document(collection_name: str, data: dict):
    """
    Adds a new document to a Firestore collection.
    Args:
        collection_name (str): The name of the collection.
        data (dict): The data to add as a document.
    Returns:
        dict: Document reference ID.
    """
    ref = get_collection_ref(collection_name)
    doc_ref = ref.add(data)
    return {"id": doc_ref[1].id, "message": "Document added successfully"}

def get_all_documents(collection_name: str):
    """
    Fetches all documents from a Firestore collection.
    Args:
        collection_name (str): The name of the collection.
    Returns:
        list: List of documents in the collection."""
    ref = get_collection_ref(collection_name)
    docs = ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

def generate_user_id(first_name: str, email: str) -> str:
    """Generate a unique ID based on first_name and email."""
    unique_string = f"{first_name.lower()}_{email.lower()}"
    return hashlib.sha256(unique_string.encode()).hexdigest()[:10]  # Use the first 10 characters for brevity


def add_customer(email, password, first_name, last_name, phone, location=None):
    """Add a customer to Firestore."""
    user_ref = db.collection("customers").document(email)
    if user_ref.get().exists:
        return False, "Customer already exists"
    
    # Generate unique ID
    user_id = generate_user_id(first_name, email)

    hashed_password = generate_password_hash(password)
    data = {
        "id": user_id,
        "email": email,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
    }
    user_ref.set(data)
    return True, "Customer registered successfully"


def authenticate_user_from_collection(collection_name: str, email: str, password: str):
    """Authenticate a user or employee from the specified Firestore collection."""
    user_ref = db.collection(collection_name).document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return False, f"User does not exist in {collection_name}"

    user_data = user_doc.to_dict()
    if not check_password_hash(user_data["password"], password):
        return False, "Invalid credentials"

    return True, user_data

def save_to_firebase_storage(file: UploadFile) -> str:
    """
    Uploads a file to Firebase Storage and returns its public URL.
    Args:
        file (UploadFile): The file to upload.
    Returns:
        str: Public URL of the uploaded file.
    """
    bucket = storage.bucket()
    blob = bucket.blob(f"uploads/{file.filename}")
    blob.upload_from_file(file.file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url

def get_customer(email: str):
    """
    Fetch a customer document from Firestore by email.
    Args:
        email (str): The email of the customer.
    Returns:
        dict: Customer data or None if not found.
    """
    user_ref = db.collection("customers").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return None  # Customer not found

    return user_doc.to_dict()

def update_customer(email: str, updated_data: dict):
    """
    Update a customer's data in Firestore.
    Args:
        email (str): The email of the customer.
        updated_data (dict): The data to update.
    Returns:
        str: Success message or an error message.
    """
    user_ref = db.collection("customers").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return "Customer not found"

    user_ref.update(updated_data)
    return "Customer updated successfully"



def get_employee(email: str):
    """
    Fetch an employee document from Firestore by email.
    Args:
        email (str): The email of the employee.
    Returns:
        dict: Employee data or None if not found.
    """
    user_ref = db.collection("employees").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return None  # Employee not found

    return user_doc.to_dict()


def update_employee(email: str, updated_data: dict):
    """
    Update an employee's data in Firestore.
    Args:
        email (str): The email of the employee.
        updated_data (dict): The data to update.
    Returns:
        str: Success message or an error message.
    """
    user_ref = db.collection("employees").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return "Employee not found"

    user_ref.update(updated_data)
    return "Employee updated successfully"



def create_booking(booking_data: dict):
    """
    Create a new booking in Firestore.
    Args:
        booking_data (dict): The booking data to save.
    Returns:
        dict: Booking ID and success message.
    """
    try:
        # Add a timestamp to the booking data
        booking_data["dateOfBooking"] = datetime.now().isoformat()
        booking_data["status"] = "pending"  # Default status

        # Save the booking data to Firestore
        booking_ref = db.collection("bookings").document()
        booking_ref.set(booking_data)

        return {"id": booking_ref.id, "message": "Booking created successfully"}
    except Exception as e:
        return {"error": f"Error creating booking: {str(e)}"}

def get_booking(booking_id: str):
    """
    Fetch a booking document from Firestore by ID.
    Args:
        booking_id (str): The ID of the booking.
    Returns:
        dict: Booking data or None if not found.
    """
    booking_ref = db.collection("bookings").document(booking_id)
    booking_doc = booking_ref.get()

    if not booking_doc.exists:
        return None  # Booking not found

    return booking_doc.to_dict()

def update_booking(booking_id: str, updated_data: dict):
    """
    Update a booking's data in Firestore.
    Args:
        booking_id (str): The ID of the booking.
        updated_data (dict): The data to update.
    Returns:
        str: Success message or an error message.
    """
    booking_ref = db.collection("bookings").document(booking_id)
    booking_doc = booking_ref.get()

    if not booking_doc.exists:
        return "Booking not found"

    booking_ref.update(updated_data)
    return "Booking updated successfully"

def get_all_bookings():
    """
    Fetch all bookings from Firestore.
    Returns:
        list: List of all bookings.
    """
    bookings_ref = db.collection("bookings")
    bookings = bookings_ref.stream()
    return [{"id": booking.id, **booking.to_dict()} for booking in bookings]


def add_employee(
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone: str,
    skills: List[str],
    charge_per_hour: float,
    experience: Optional[str] = None,
    nic: Optional[str] = None,  # Add NIC field
    latitude: Optional[float] = None,  # Latitude
    longitude: Optional[float] = None,  # Longitude
):
    """
    Add an employee to Firestore.
    """
    user_ref = db.collection("employees").document(email)
    if user_ref.get().exists:
        return False, "Employee already exists"

    # Generate unique ID
    user_id = generate_user_id(first_name, email)

    hashed_password = generate_password_hash(password)

    # Create a GeoPoint if latitude and longitude are provided
    location = None
    if latitude is not None and longitude is not None:
        location = GeoPoint(latitude, longitude)

    data = {
        "id": user_id,
        "email": email,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "location": location,  # Store as GeoPoint
        "skills": skills,
        "charge_per_hour": charge_per_hour,
        "experience": experience,
        "nic": nic,  # Add NIC to the data
    }

    user_ref.set(data)
    return True, "Employee registered successfully"


