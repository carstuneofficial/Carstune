export type CarModelId = 'demo/hatchback' | 'demo/sedan' | (string & {})

export type PhotoAngle = 'front' | 'side' | 'rear' | 'top' | 'other'

export interface CarDimensionsMm {
  lengthMm: number
  widthMm: number
  heightMm: number
}

export interface CarRecognitionResult {
  make: string
  model: string
  generation?: string
  yearRange?: string
  confidence: number
  carModelId: CarModelId
  dimensionsMm?: CarDimensionsMm
}

export type CoveringStyleId = 'gloss_black' | 'matte_grey' | 'carbon'
export type WheelStyleId = 'sport_5spoke' | 'classic_mesh' | 'track_split'
export type StickerOptionId = 'none' | 'racing_stripes' | 'logo_pack' | 'stealth_text'

export type StickerZoneId = 'hood' | 'side_skirt'

export interface AnchorTransform {
  position: [number, number, number]
  rotationEuler: [number, number, number]
  /**
   * Decal projection box (meters). If omitted, the renderer falls back to model defaults.
   */
  sizeMeters?: [number, number, number]
  /**
   * Optional: name of mesh to project onto (segmentation result).
   */
  targetMeshName?: string
}

export interface PreparedCarModelAsset {
  /**
   * Backend session/job identifier for the uploaded photos.
   */
  scanSessionId: string
  /**
   * Stable ID used to select the base parametric model from a registry.
   */
  carModelId: CarModelId
  /**
   * URL to an aligned/optimized GLB (can be a signed URL).
   */
  glbUrl: string
  /**
   * Optional: model-space transform to align/scale the base model to the user car.
   * Apply this to a wrapper group around the loaded scene.
   */
  transform?: {
    position?: [number, number, number]
    rotationEuler?: [number, number, number]
    scale?: number | [number, number, number]
  }
  /**
   * AI-generated anchors, typically derived from segmentation + geometry analysis.
   */
  anchors?: Partial<Record<StickerZoneId, AnchorTransform>>
  /**
   * Approx. physical dimensions of the detected car; used for export metadata.
   */
  dimensionsMm?: CarDimensionsMm
  /**
   * Which pipeline produced the asset.
   */
  pipeline: 'parametric_ai' | 'photogrammetry_ai'
}

export interface StickerSelection {
  zone: StickerZoneId
  option: StickerOptionId
  widthMm: number
  heightMm: number
}

export interface CarCustomizationState {
  carModelId?: CarModelId
  recognition?: CarRecognitionResult
  scanSessionId?: string
  preparedModel?: PreparedCarModelAsset
  coveringStyle: CoveringStyleId
  wheelStyle: WheelStyleId
  stickers: Record<StickerZoneId, StickerSelection>
}

