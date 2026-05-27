from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..schemas.skills import SkillListResponse
from ..services.conversion import ConversionError, discover_only

router = APIRouter(tags=["skills"])


@router.post("/skills/discover", response_model=SkillListResponse)
async def discover(
    project_zip: UploadFile = File(...),
    opcua_xml_rel_path: str = Form(""),
) -> SkillListResponse:
    zip_bytes = await project_zip.read()
    try:
        return discover_only(zip_bytes, opcua_xml_rel_path=opcua_xml_rel_path or None)
    except ConversionError as e:
        raise HTTPException(status_code=422, detail=str(e))
