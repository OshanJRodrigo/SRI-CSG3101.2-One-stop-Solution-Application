from app.utils.firebase_utils import get_collection_ref

async def get_assigned_jobs(employee_id):
    requests_ref = get_collection_ref("requests")
    docs = requests_ref.where("assigned_to", "==", employee_id).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

async def update_job_status(job_data):
    request_ref = get_collection_ref("requests").document(job_data["id"])
    request_ref.update({"status": job_data["status"]})
    return {"message": "Job updated successfully"}
