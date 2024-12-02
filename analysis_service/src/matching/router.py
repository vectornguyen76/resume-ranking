from fastapi import APIRouter
from src.matching import service
from src.matching.schemas import MatchingSchema

router = APIRouter()


# @router.post("/analyse", response_model=ResponseSchema)
@router.post("/analyse")
async def analyse_matching(matching_data: MatchingSchema):
    result = service.analyse_matching(matching_data=matching_data)

    return result
