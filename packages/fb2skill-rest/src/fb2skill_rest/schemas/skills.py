from pydantic import BaseModel


class SkillListResponse(BaseModel):
    skills: list[str]
    warnings: list[str] = []
