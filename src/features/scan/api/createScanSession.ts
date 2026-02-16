import type { PhotoAngle } from '@/shared/domain/car'
import { apiUrl, fetchJson } from '@/shared/lib/api'

export interface CreateScanSessionInput {
  photos: Array<{ file: File; angle?: PhotoAngle }>
}

export interface CreateScanSessionResponse {
  scanSessionId: string
  received: number
}

/**
 * Upload photos to the backend.
 *
 * Production notes:
 * - Use presigned uploads for large images.
 * - Store EXIF + capture metadata to improve alignment.
 */
export async function createScanSession(input: CreateScanSessionInput): Promise<CreateScanSessionResponse> {
  const form = new FormData()
  input.photos.forEach((p, idx) => {
    form.append('photos', p.file, p.file.name)
    form.append(`angle_${idx}`, p.angle ?? 'other')
  })

  // Backend example: FastAPI endpoint `POST /v1/scan/sessions` (multipart/form-data)
  return await fetchJson<CreateScanSessionResponse>(apiUrl('/v1/scan/sessions'), {
    method: 'POST',
    body: form,
  })
}

