import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildCutPdf, buildCutSvg } from '@/features/print-export/lib/exportStickers'
import { downloadBlob, downloadText } from '@/shared/lib/download'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'

export function ExportPanel() {
  const navigate = useNavigate()
  const modelId = useCarConfigStore((s) => s.modelId) ?? 'demo/hatchback'
  const recognition = useCarConfigStore((s) => s.recognition)
  const stickers = useCarConfigStore((s) => Object.values(s.stickers))
  const [busy, setBusy] = useState(false)

  const active = useMemo(() => stickers.filter((s) => s.option !== 'none'), [stickers])

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader>
          <CardTitle>Print export</CardTitle>
          <CardDescription>Cutting-ready outlines in SVG/PDF with exact millimeter dimensions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="text-sm">
            <div className="text-muted-foreground">Model ID</div>
            <div className="font-mono">{modelId}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Recognition metadata</div>
            <div>{recognition ? `${recognition.make} ${recognition.model} (${Math.round(recognition.confidence * 100)}%)` : '—'}</div>
          </div>
          <Separator />

          {active.length > 0 ? (
            <div className="grid gap-2 text-sm">
              {active.map((s) => (
                <div key={s.zone} className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                  <div>
                    <div className="font-medium">{s.zone.replace('_', ' ')}</div>
                    <div className="text-xs text-muted-foreground">{s.option}</div>
                  </div>
                  <div className="font-mono text-xs">
                    {s.widthMm}×{s.heightMm}mm
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No stickers selected. Go to the configurator to add hood/side-skirt stickers.
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="secondary" onClick={() => navigate('/configurator')}>
              Back to configurator
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                const svg = buildCutSvg({ modelId, recognition, stickers })
                downloadText(`carstune-cut-${modelId}.svg`, svg, 'image/svg+xml;charset=utf-8')
              }}
            >
              Download SVG
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  const pdfBlob = await buildCutPdf({ modelId, recognition, stickers })
                  downloadBlob(`carstune-cut-${modelId}.pdf`, pdfBlob)
                } finally {
                  setBusy(false)
                }
              }}
            >
              {busy ? 'Building PDF…' : 'Download PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>This is a minimal example of a production export pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div>
            - Exports are based on the configured sticker sizes (mm) and include cutting outlines.
            <br />- In production, you’ll typically generate true cut paths from CAD/UV templates linked to the model ID.
          </div>
          <Separator />
          <div>
            - The 3D view uses decal projection onto predefined anchor zones.
            <br />- The “scan” step only recognizes make/model and selects a pre-existing GLB; it never generates arbitrary geometry from photos.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

