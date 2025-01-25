from app.utils.firebase_utils import get_collection_ref

async def get_services():
    services_ref = get_collection_ref("services")
    docs = services_ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]
