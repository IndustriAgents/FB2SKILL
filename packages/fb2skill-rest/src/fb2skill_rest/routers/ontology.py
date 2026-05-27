from fastapi import APIRouter
from fastapi.responses import FileResponse

from ..services.ontology import ontology_path

router = APIRouter(tags=["ontology"])


@router.get("/ontology")
def ontology() -> FileResponse:
    return FileResponse(
        ontology_path(),
        media_type="text/turtle",
        filename="CaSkMan_v4.3.0.ttl",
    )
