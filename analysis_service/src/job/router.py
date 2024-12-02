from fastapi import APIRouter
from src.job import service
from src.job.schemas import JobSchema

router = APIRouter()


# @router.post("/analyse", response_model=ResponseSchema)
@router.post("/analyse")
async def analyse_job(job_data: JobSchema):
    result = service.analyse_job(job_data=job_data)

    return result
