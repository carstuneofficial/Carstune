export type CarModelId = 'demo/hatchback' | 'demo/sedan'

export interface CarRecognitionResult {
  make: string
  model: string
  yearRange?: string
  confidence: number
  modelId: CarModelId
}

export type CoveringStyleId = 'gloss_black' | 'matte_grey' | 'carbon'
export type WheelStyleId = 'sport_5spoke' | 'classic_mesh' | 'track_split'
export type StickerOptionId = 'none' | 'racing_stripes' | 'logo_pack' | 'stealth_text'

export type StickerZoneId = 'hood' | 'side_skirt'

export interface StickerSelection {
  zone: StickerZoneId
  option: StickerOptionId
  widthMm: number
  heightMm: number
}

export interface CarCustomizationState {
  modelId?: CarModelId
  recognition?: CarRecognitionResult
  coveringStyle: CoveringStyleId
  wheelStyle: WheelStyleId
  stickers: Record<StickerZoneId, StickerSelection>
}

