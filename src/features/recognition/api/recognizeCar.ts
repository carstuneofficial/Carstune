import type { CarDimensionsMm, CarRecognitionResult } from '@/shared/domain/car'
import { apiUrl, fetchJson } from '@/shared/lib/api'

export interface RecognizeCarInput {
  /**
   * Preferred path: upload photos first and pass the backend scan session id.
   */
  scanSessionId?: string
  /**
   * Fallback path for local demo when no backend exists.
   */
  photos: File[]
}

function inferFromFilename(files: File[]): CarRecognitionResult {
  const names = files.map((f) => f.name.toLowerCase()).join(' ')
  if (names.includes('tesla') || names.includes('model3') || names.includes('model-3')) {
    return {
      make: 'Tesla',
      model: 'Model 3',
      generation: 'Gen 1',
      yearRange: '2019–2025',
      confidence: 0.86,
      carModelId: 'demo/sedan',
      dimensionsMm: { lengthMm: 4694, widthMm: 1849, heightMm: 1443 } satisfies CarDimensionsMm,
    }
  }
  if (names.includes('golf') || names.includes('gti') || names.includes('vw')) {
    return {
      make: 'Volkswagen',
      model: 'Golf',
      generation: 'Mk7',
      yearRange: '2016–2021',
      confidence: 0.82,
      carModelId: 'demo/hatchback',
      dimensionsMm: { lengthMm: 4255, widthMm: 1799, heightMm: 1452 } satisfies CarDimensionsMm,
    }
  }
  return {
    make: 'Demo',
    model: 'Hatchback',
    generation: '—',
    yearRange: '—',
    confidence: 0.64,
    carModelId: 'demo/hatchback',
    dimensionsMm: { lengthMm: 4300, widthMm: 1800, heightMm: 1500 } satisfies CarDimensionsMm,
  }
}

/**
 * Production note:
 * - This should call a backend vision model (or 3rd party) and return a stable `carModelId`
 * - Backend should output:
 *   - `carModelId` (stable DB key, e.g. "tesla/model3/2021")
 *   - `dimensionsMm` (approx length/width/height for scaling)
 */
export async function recognizeCar(input: RecognizeCarInput): Promise<CarRecognitionResult> {
  // Preferred: backend recognition (YOLOv8/CLIP for make/model + generation).
  if (input.scanSessionId) {
    try {
      return await fetchJson<CarRecognitionResult>(apiUrl('/v1/scan/recognize'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scanSessionId: input.scanSessionId }),
      })
    } catch {
      // Fallback to local mock if backend is not reachable.
    }
  }

  // Local mock (keeps the demo usable without an AI backend).
  await new Promise((r) => setTimeout(r, 650))
  return inferFromFilename(input.photos)
}

