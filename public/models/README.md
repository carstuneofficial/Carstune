Put your pre-built parametric GLB models here.

Expected demo paths (referenced in code):
- `/models/demo-hatchback.glb`
- `/models/demo-sedan.glb`

Production notes:
- Store GLBs in a versioned model registry (S3/GCS + CDN) keyed by stable `modelId`.
- Use glTF compression (Draco / Meshopt) and texture compression (KTX2/Basis).

