from app.utils.firebase_utils import get_collection_ref

async def create_request(request_data):
    requests_ref = get_collection_ref("requests")
    request_doc = requests_ref.add(request_data)
    return {"message": "Request created", "id": request_doc[1].id}

async def get_requests():
    requests_ref = get_collection_ref("requests")
    docs = requests_ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]
