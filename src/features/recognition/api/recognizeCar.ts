import type { CarRecognitionResult } from '@/shared/domain/car'

export interface RecognizeCarInput {
  photos: File[]
}

function inferFromFilename(files: File[]): CarRecognitionResult {
  const names = files.map((f) => f.name.toLowerCase()).join(' ')
  if (names.includes('tesla') || names.includes('model3') || names.includes('model-3')) {
    return { make: 'Tesla', model: 'Model 3', yearRange: '2019–2025', confidence: 0.86, modelId: 'demo/sedan' }
  }
  if (names.includes('golf') || names.includes('gti') || names.includes('vw')) {
    return { make: 'Volkswagen', model: 'Golf', yearRange: '2016–2021', confidence: 0.82, modelId: 'demo/hatchback' }
  }
  return { make: 'Demo', model: 'Hatchback', yearRange: '—', confidence: 0.64, modelId: 'demo/hatchback' }
}

/**
 * Production note:
 * - This should call a backend vision model (or 3rd party) and return a stable `modelId`
 * - This frontend demo intentionally does NOT generate any 3D geometry from photos
 */
export async function recognizeCar(input: RecognizeCarInput): Promise<CarRecognitionResult> {
  // Simulate network + model inference latency
  await new Promise((r) => setTimeout(r, 800))
  return inferFromFilename(input.photos)
}

