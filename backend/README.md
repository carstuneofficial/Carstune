## Carstune AI backend (placeholder)

This folder contains a **minimal FastAPI skeleton** showing the endpoints the React app calls:

- `POST /v1/scan/sessions` (multipart upload 3–5 photos)
- `POST /v1/scan/recognize` (make/model/generation + approximate dimensions)
- `POST /v1/models/prepare` (Option A parametric alignment + anchor generation)

### Run (dev)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then run the frontend with:

```bash
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

### Where the ML fits (production sketch)

- **Recognition**: YOLOv8 + CLIP (or a dedicated make/model classifier) → `carModelId` + confidence
- **Dimensions**: predicted by model/generation prior + keypoints (or a regression head)
- **Parametric alignment (Option A)**:
  - estimate camera poses (COLMAP-style) or learned pose
  - optimize parametric car template parameters to multi-view silhouettes/keypoints
  - output aligned GLB + per-zone anchor transforms
- **Segmentation**: SAM for hood / side skirt masks
  - back-project mask → mesh surface region (raycasting / UV reprojection)
  - compute decal plane / normal → anchor `position + rotationEuler`
- **Photogrammetry/NeRF (Option B)**: run Meshroom / Open3D / NeRF → mesh → retopo + UV + texture → optimized GLB

This repo keeps the backend as a stub so you can swap in your preferred ML stack.

