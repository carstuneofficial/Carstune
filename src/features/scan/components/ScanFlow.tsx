import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecognizeCarMutation } from '@/features/recognition/hooks/useRecognizeCarMutation'
import { usePrepareCarModelMutation } from '@/features/car3d/hooks/usePrepareCarModelMutation'
import { useCreateScanSessionMutation } from '@/features/scan/hooks/useCreateScanSessionMutation'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function ScanFlow() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<File[]>([])
  const createSession = useCreateScanSessionMutation()
  const recognize = useRecognizeCarMutation()
  const prepareModel = usePrepareCarModelMutation()

  const setRecognition = useCarConfigStore((s) => s.setRecognition)
  const setScanSessionId = useCarConfigStore((s) => s.setScanSessionId)
  const setPreparedModel = useCarConfigStore((s) => s.setPreparedModel)
  const resetAll = useCarConfigStore((s) => s.resetAll)

  const previews = useMemo(() => photos.map((p) => ({ file: p, url: URL.createObjectURL(p) })), [photos])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const validCount = photos.length >= 3 && photos.length <= 5
  const busy = createSession.isPending || recognize.isPending || prepareModel.isPending

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader>
          <CardTitle>Scan your car</CardTitle>
          <CardDescription>
            Upload 3–5 photos from different angles. We run AI recognition and prepare a 3D model (aligned + sticker anchors).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="photos">Photos</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                setPhotos(files)
              }}
            />
            <div className="text-xs text-muted-foreground">
              Required angles (recommended): front, side, rear, top. Tip: filenames like <span className="font-mono">tesla_model3_front.jpg</span> help the local mock.
            </div>
            {!validCount ? (
              <div className="text-xs text-destructive">Please select 3–5 photos.</div>
            ) : null}
          </div>

          {previews.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {previews.slice(0, 6).map((p) => (
                <img
                  key={p.url}
                  src={p.url}
                  className="aspect-square w-full rounded-md border border-border object-cover"
                  alt={p.file.name}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Add 3–5 photos (front, side, rear, top).
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI pipeline</CardTitle>
          <CardDescription>
            1) Upload photos → 2) recognize make/model/generation + dimensions → 3) prepare aligned GLB + decal anchors.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col gap-2">
            <Button
              disabled={!validCount || busy}
              onClick={async () => {
                // 1) Upload photos (preferred). If backend is unavailable, we fall back to local mock recognition.
                let scanSessionId: string | undefined
                try {
                  const session = await createSession.mutateAsync({ photos: photos.map((f) => ({ file: f })) })
                  scanSessionId = session.scanSessionId
                  setScanSessionId(scanSessionId)
                } catch {
                  // No backend available; continue with local mock.
                }

                // 2) Recognize car model + approximate dimensions
                const result = await recognize.mutateAsync({ photos, scanSessionId })
                setRecognition(result)

                // 3) Prepare 3D model + AI anchors (Option A recommended).
                // If backend isn't available, we skip and keep using local model mapping.
                if (scanSessionId) {
                  try {
                    const asset = await prepareModel.mutateAsync({
                      scanSessionId,
                      recognition: result,
                      pipeline: 'parametric_ai',
                    })
                    setPreparedModel(asset)
                  } catch {
                    // Keep going with the base model id only.
                  }
                }

                navigate('/configurator')
              }}
            >
              {busy ? 'Processing…' : 'Run AI scan'}
            </Button>
            <Button variant="outline" onClick={() => resetAll()} disabled={busy}>
              Reset
            </Button>
          </div>

          {recognize.data ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="font-medium">Result</div>
              <div className="text-muted-foreground">
                {recognize.data.make} {recognize.data.model} {recognize.data.generation ? `· ${recognize.data.generation}` : ''}{' '}
                ({recognize.data.yearRange ?? '—'})
              </div>
              <div className="text-muted-foreground">
                Confidence: {Math.round(recognize.data.confidence * 100)}% · Car model ID:{' '}
                <span className="font-mono">{recognize.data.carModelId}</span>
              </div>
              {recognize.data.dimensionsMm ? (
                <div className="text-muted-foreground">
                  Approx dims: {recognize.data.dimensionsMm.lengthMm}×{recognize.data.dimensionsMm.widthMm}×{recognize.data.dimensionsMm.heightMm}mm
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              This demo can run without a backend (mock recognition). To enable AI model prep, set `VITE_API_BASE_URL` and implement the backend endpoints.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

