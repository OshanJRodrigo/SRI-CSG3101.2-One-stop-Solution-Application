from fastapi import APIRouter, HTTPException, UploadFile, Form
from app.utils.firebase_utils import add_employee, add_customer, authenticate_user_from_collection, save_to_firebase_storage
from app.models.user_model import EmployeeRegister, UserRegister, UserLogin
from typing import List, Optional
from app.utils.firebase_utils import db
from app.utils.firebase_utils import update_customer as firebase_update_customer
from fastapi import BackgroundTasks
from datetime import datetime
import logging
from app.utils.email_utils import send_email, generate_login_activity_email
from fastapi import Depends




router = APIRouter()


# Customer Registration
@router.post("/auth/register/customer")
async def register_customer(user: UserRegister):
    success, message = add_customer(
        email=user.email,
        password=user.password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
    )
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@router.post("/auth/login/employee")
async def login_employee(user: UserLogin, background_tasks: BackgroundTasks):
    success, user_data = authenticate_user_from_collection("employees", user.email, user.password)
    if not success:
        raise HTTPException(status_code=401, detail=user_data)

    email_body = generate_login_activity_email(
        user_data.get('first_name', 'Employee'), 
        datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    
    try:
        background_tasks.add_task(send_email, recipient=user.email, subject="Login Activity", body=email_body)
    except Exception as e:
        logging.error(f"Failed to schedule email for {user.email}: {str(e)}")

    return {"message": "Login successful", "user": user_data}

@router.post("/auth/login/customer")
async def login_customer(user: UserLogin, background_tasks: BackgroundTasks):
    success, user_data = authenticate_user_from_collection("customers", user.email, user.password)
    if not success:
        raise HTTPException(status_code=401, detail=user_data)

    email_body = generate_login_activity_email(
        user_data.get('first_name', 'Customer'), 
        datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    
    try:
        background_tasks.add_task(send_email, recipient=user.email, subject="Login Activity", body=email_body)
    except Exception as e:
        logging.error(f"Failed to schedule email for {user.email}: {str(e)}")

    return {"message": "Login successful", "user": user_data}


@router.post("/auth/register/employee")
async def register_employee(
    employee: EmployeeRegister,
    id_card_image: Optional[UploadFile] = None,
    experience_document: Optional[UploadFile] = None,
):
    # Initialize URLs for uploaded files
    id_card_url = None
    exp_doc_url = None

    # Save ID card image to Firebase Storage if provided
    if id_card_image:
        id_card_url = save_to_firebase_storage(id_card_image)

    # Save Experience Document if provided
    if experience_document:
        exp_doc_url = save_to_firebase_storage(experience_document)

    # Add employee to Firestore with uploaded file URLs
    success, message = add_employee(
        email=employee.email,
        password=employee.password,
        first_name=employee.first_name,
        last_name=employee.last_name,
        phone=employee.phone,
        skills=employee.skills,
        charge_per_hour=employee.charge_per_hour,
        experience=employee.experience,
        nic=employee.nic,
        latitude=employee.latitude,  # Pass latitude
        longitude=employee.longitude,  # Pass longitude
    )

    if not success:
        raise HTTPException(status_code=400, detail=message)

    # Save file URLs to Firestore document
    employee_ref = db.collection("employees").document(employee.email)
    update_data = {}
    if id_card_url:
        update_data["id_card_url"] = id_card_url
    if exp_doc_url:
        update_data["experience_document_url"] = exp_doc_url
    if update_data:  # Only update if there are URLs to save
        employee_ref.update(update_data)

    return {"message": message, "id_card_url": id_card_url, "experience_document_url": exp_doc_url}

@router.get("/auth/customer/{email}")
async def get_customer(email: str):
    customer_ref = db.collection("customers").document(email)
    customer_doc = customer_ref.get()

    if not customer_doc.exists:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer_doc.to_dict()

from app.utils.firebase_utils import update_customer as firebase_update_customer

@router.put("/auth/customer/{email}")
async def update_customer(email: str, updated_data: dict):
    result = firebase_update_customer(email, updated_data)
    if result == "Customer not found":
        raise HTTPException(status_code=404, detail=result)
    return {"message": result}

@router.get("/auth/employee/{email}")
async def get_employee(email: str):
    employee_ref = db.collection("employees").document(email)
    employee_doc = employee_ref.get()

    if not employee_doc.exists:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee_doc.to_dict()

@router.put("/auth/employee/{email}")
async def update_employee(email: str, updated_data: dict):
    result = update_employee(email, updated_data)
    if result == "Employee not found":
        raise HTTPException(status_code=404, detail=result)
    return {"message": result}










