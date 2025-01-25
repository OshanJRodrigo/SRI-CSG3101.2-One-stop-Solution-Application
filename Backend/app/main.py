from fastapi import FastAPI
from app.utils.firebase_utils import add_document, get_all_documents
from app.routes import auth, service, request, bookings
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Maintenance App API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Welcome to the Maintenance App API"}

@app.post("/test-add")
async def test_add_document():
    """Test adding a document to Firestore."""
    data = {"name": "Test Document", "status": "success"}
    response = add_document("test", data)
    return response

@app.get("/test-get")
async def test_get_documents():
    """Test fetching all documents from Firestore."""
    documents = get_all_documents("test")
    return documents

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(service.router)
app.include_router(request.router)
app.include_router(bookings.router)