from pydantic import BaseModel


class SkillTtl(BaseModel):
    name: str
    ttl: str


class Failure(BaseModel):
    name: str
    error: str


class ConvertResponse(BaseModel):
    skills: list[SkillTtl]
    warnings: list[str] = []
    failures: list[Failure] = []
