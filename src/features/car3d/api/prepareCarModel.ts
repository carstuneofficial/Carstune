import type { CarRecognitionResult, PreparedCarModelAsset } from '@/shared/domain/car'
import { apiUrl, fetchJson } from '@/shared/lib/api'

export interface PrepareCarModelInput {
  scanSessionId: string
  recognition: CarRecognitionResult
  pipeline?: PreparedCarModelAsset['pipeline']
}

/**
 * Option A (recommended): Parametric Model AI
 * - Select base parametric model by `carModelId`
 * - Align/scale it to the user's car using multi-view constraints (photos)
 * - Generate sticker anchors (hood, side skirts) from segmentation + geometry
 *
 * Backend implementation sketch:
 * - Detect keypoints / silhouette with YOLOv8 + shape priors (or NeRS)
 * - Estimate camera poses (COLMAP-like) or use learned pose
 * - Fit parametric model (SMPL-like but for cars) / adjust known variants
 * - Run SAM to segment hood/side skirt in images, back-project onto mesh
 * - Output: aligned GLB + anchors + physical dimensions
 */
export async function prepareCarModel(input: PrepareCarModelInput): Promise<PreparedCarModelAsset> {
  const pipeline = input.pipeline ?? 'parametric_ai'
  return await fetchJson<PreparedCarModelAsset>(apiUrl('/v1/models/prepare'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      scanSessionId: input.scanSessionId,
      carModelId: input.recognition.carModelId,
      dimensionsMm: input.recognition.dimensionsMm,
      pipeline,
    }),
  })
}

