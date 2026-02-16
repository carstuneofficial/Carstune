import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecognizeCarMutation } from '@/features/recognition/hooks/useRecognizeCarMutation'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function ScanFlow() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<File[]>([])
  const recognize = useRecognizeCarMutation()
  const setRecognition = useCarConfigStore((s) => s.setRecognition)
  const resetAll = useCarConfigStore((s) => s.resetAll)

  const previews = useMemo(() => photos.map((p) => ({ file: p, url: URL.createObjectURL(p) })), [photos])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader>
          <CardTitle>Scan your car</CardTitle>
          <CardDescription>
            Upload photos, run AI recognition, then load the matching <span className="font-medium">pre-built</span> parametric 3D model.
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
              Tip: filenames like <span className="font-mono">tesla_model3_1.jpg</span> will map to a demo sedan model.
            </div>
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
              Add 2–6 photos (front, side, rear, wheels).
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI recognition</CardTitle>
          <CardDescription>Detect make/model, then auto-select a compatible GLB from the model database.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col gap-2">
            <Button
              disabled={photos.length === 0 || recognize.isPending}
              onClick={async () => {
                const result = await recognize.mutateAsync({ photos })
                setRecognition(result)
                navigate('/configurator')
              }}
            >
              {recognize.isPending ? 'Recognizing…' : 'Detect make/model'}
            </Button>
            <Button variant="outline" onClick={() => resetAll()} disabled={recognize.isPending}>
              Reset
            </Button>
          </div>

          {recognize.data ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="font-medium">Result</div>
              <div className="text-muted-foreground">
                {recognize.data.make} {recognize.data.model} ({recognize.data.yearRange ?? '—'})
              </div>
              <div className="text-muted-foreground">
                Confidence: {Math.round(recognize.data.confidence * 100)}% · Model ID:{' '}
                <span className="font-mono">{recognize.data.modelId}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              This demo uses a mock recognizer. In production, connect this to your vision service and return a stable model ID.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

