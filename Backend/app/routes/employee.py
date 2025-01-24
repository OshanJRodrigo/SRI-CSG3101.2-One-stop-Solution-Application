from fastapi import APIRouter
from app.services.employee_service import get_assigned_jobs, update_job_status

router = APIRouter()

@router.get("/jobs")
async def get_jobs(employee_id: str):
    return await get_assigned_jobs(employee_id)

@router.put("/jobs/update")
async def update_job(job_data: dict):
    return await update_job_status(job_data)
