from __future__ import annotations

import uuid
from typing import Literal, Optional

from fastapi import FastAPI, File, Form, UploadFile
from pydantic import BaseModel, Field

app = FastAPI(title="Carstune AI Backend (placeholder)", version="0.1.0")

# In production, persist sessions + assets to a real database/object storage.
_sessions: dict[str, dict] = {}


class DimensionsMm(BaseModel):
    lengthMm: int = Field(..., ge=1000, le=8000)
    widthMm: int = Field(..., ge=800, le=3500)
    heightMm: int = Field(..., ge=800, le=3500)


class RecognitionResponse(BaseModel):
    make: str
    model: str
    generation: Optional[str] = None
    yearRange: Optional[str] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    carModelId: str
    dimensionsMm: Optional[DimensionsMm] = None


class RecognizeRequest(BaseModel):
    scanSessionId: str


class AnchorTransform(BaseModel):
    position: tuple[float, float, float]
    rotationEuler: tuple[float, float, float]
    sizeMeters: Optional[tuple[float, float, float]] = None
    targetMeshName: Optional[str] = None


class PreparedModelResponse(BaseModel):
    scanSessionId: str
    carModelId: str
    glbUrl: str
    transform: Optional[dict] = None
    anchors: Optional[dict] = None
    dimensionsMm: Optional[DimensionsMm] = None
    pipeline: Literal["parametric_ai", "photogrammetry_ai"]


class PrepareModelRequest(BaseModel):
    scanSessionId: str
    carModelId: str
    dimensionsMm: Optional[DimensionsMm] = None
    pipeline: Literal["parametric_ai", "photogrammetry_ai"] = "parametric_ai"


@app.post("/v1/scan/sessions")
async def create_scan_session(
    photos: list[UploadFile] = File(...),
    # Optional per-photo angle labels (front/side/rear/top/other); used to improve alignment.
    angle_0: str = Form(default="other"),
    angle_1: str = Form(default="other"),
    angle_2: str = Form(default="other"),
    angle_3: str = Form(default="other"),
    angle_4: str = Form(default="other"),
):
    if len(photos) < 3 or len(photos) > 5:
        return {"error": "Please upload 3–5 photos."}

    scan_session_id = f"scan_{uuid.uuid4().hex}"
    _sessions[scan_session_id] = {
        "photos": [p.filename for p in photos],
        "angles": [angle_0, angle_1, angle_2, angle_3, angle_4][: len(photos)],
    }
    return {"scanSessionId": scan_session_id, "received": len(photos)}


@app.post("/v1/scan/recognize", response_model=RecognitionResponse)
async def recognize(req: RecognizeRequest):
    """
    Placeholder recognition endpoint.

    Production:
    - Run YOLOv8/CLIP or a dedicated classifier for make/model/generation.
    - Estimate approximate dimensions (or retrieve priors from a DB by generation).
    """
    # Demo: always returns a stable carModelId so the frontend can pick a base GLB.
    return RecognitionResponse(
        make="Tesla",
        model="Model 3",
        generation="Gen 1",
        yearRange="2019–2025",
        confidence=0.88,
        carModelId="demo/sedan",
        dimensionsMm=DimensionsMm(lengthMm=4694, widthMm=1849, heightMm=1443),
    )


@app.post("/v1/models/prepare", response_model=PreparedModelResponse)
async def prepare_model(req: PrepareModelRequest):
    """
    Option A: parametric alignment + anchor generation.

    Production output:
    - aligned GLB URL (hosted in object storage/CDN)
    - transform to apply (if using a base model)
    - AI anchors for sticker zones derived from segmentation
    """
    # Stub: point to the frontend's public models path so it loads in dev.
    glb_url = "/models/demo-sedan.glb" if "sedan" in req.carModelId else "/models/demo-hatchback.glb"

    # Very rough "alignment" placeholder: scale based on length prior.
    scale = 1.0
    if req.dimensionsMm and req.dimensionsMm.lengthMm:
        base_len = 4694 if "sedan" in req.carModelId else 4255
        scale = float(req.dimensionsMm.lengthMm) / float(base_len)

    # Anchor transforms are in meters in (approx) model space.
    # In production, derive these from SAM segmentation + back-projection onto mesh surfaces.
    anchors = {
        "hood": AnchorTransform(
            position=(0.0, 0.9, 1.35),
            rotationEuler=(-1.5708, 0.0, 0.0),
            sizeMeters=(0.62, 0.22, 0.15),
            # Optional: if you output a separate mesh for the hood surface after segmentation.
            targetMeshName=None,
        ).model_dump(),
        "side_skirt": AnchorTransform(
            position=(-0.78, 0.35, 0.05),
            rotationEuler=(0.0, 1.5708, 0.0),
            sizeMeters=(0.95, 0.16, 0.15),
            targetMeshName=None,
        ).model_dump(),
    }

    return PreparedModelResponse(
        scanSessionId=req.scanSessionId,
        carModelId=req.carModelId,
        glbUrl=glb_url,
        transform={"scale": scale, "position": [0.0, 0.0, 0.0], "rotationEuler": [0.0, 0.0, 0.0]},
        anchors=anchors,
        dimensionsMm=req.dimensionsMm,
        pipeline=req.pipeline,
    )


# Optional endpoint for Option B (photogrammetry/NeRF) could be:
# - POST /v1/models/reconstruct -> returns jobId
# - GET /v1/models/jobs/{jobId} -> returns status + final glbUrl + scale metadata

