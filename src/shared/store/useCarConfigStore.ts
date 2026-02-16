import { create } from 'zustand'
import type {
  CarCustomizationState,
  CarModelId,
  CarRecognitionResult,
  CoveringStyleId,
  PreparedCarModelAsset,
  StickerOptionId,
  StickerZoneId,
  WheelStyleId,
} from '@/shared/domain/car'

interface CarConfigStore extends CarCustomizationState {
  setRecognition: (result: CarRecognitionResult) => void
  setCarModelId: (id: CarModelId) => void
  setScanSessionId: (id: string) => void
  setPreparedModel: (asset: PreparedCarModelAsset) => void
  setCoveringStyle: (id: CoveringStyleId) => void
  setWheelStyle: (id: WheelStyleId) => void
  setStickerOption: (zone: StickerZoneId, option: StickerOptionId) => void
  setStickerSizeMm: (zone: StickerZoneId, widthMm: number, heightMm: number) => void
  resetAll: () => void
}

const initialState: CarCustomizationState = {
  carModelId: undefined,
  recognition: undefined,
  scanSessionId: undefined,
  preparedModel: undefined,
  coveringStyle: 'gloss_black',
  wheelStyle: 'sport_5spoke',
  stickers: {
    hood: { zone: 'hood', option: 'none', widthMm: 600, heightMm: 220 },
    side_skirt: { zone: 'side_skirt', option: 'none', widthMm: 900, heightMm: 160 },
  },
}

export const useCarConfigStore = create<CarConfigStore>((set) => ({
  ...initialState,
  setRecognition: (result) => set({ recognition: result, carModelId: result.carModelId }),
  setCarModelId: (id) => set({ carModelId: id }),
  setScanSessionId: (id) => set({ scanSessionId: id }),
  setPreparedModel: (asset) => set({ preparedModel: asset, carModelId: asset.carModelId, scanSessionId: asset.scanSessionId }),
  setCoveringStyle: (id) => set({ coveringStyle: id }),
  setWheelStyle: (id) => set({ wheelStyle: id }),
  setStickerOption: (zone, option) =>
    set((s) => ({ stickers: { ...s.stickers, [zone]: { ...s.stickers[zone], option } } })),
  setStickerSizeMm: (zone, widthMm, heightMm) =>
    set((s) => ({ stickers: { ...s.stickers, [zone]: { ...s.stickers[zone], widthMm, heightMm } } })),
  resetAll: () => set({ ...initialState }),
}))

