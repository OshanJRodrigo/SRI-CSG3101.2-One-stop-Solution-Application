from app.utils.firebase_utils import get_collection_ref
from app.utils.token_utils import generate_token

async def register_user(user_data):
    users_ref = get_collection_ref("users")
    users_ref.add(user_data)
    return {"message": "User registered successfully"}

async def register_employee(employee_data):
    employees_ref = get_collection_ref("employees")
    employees_ref.add(employee_data)
    return {"message": "Employee registered successfully"}

async def login(email, password, role):
    collection_name = "users" if role == "user" else "employees"
    ref = get_collection_ref(collection_name)
    docs = ref.where("email", "==", email).where("password", "==", password).stream()
    for doc in docs:
        return {"message": f"{role.capitalize()} logged in successfully", "data": doc.to_dict()}
    raise HTTPException(status_code=401, detail="Invalid credentials")
