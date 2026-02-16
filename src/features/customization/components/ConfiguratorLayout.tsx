import { lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomizationPanel } from '@/features/customization/components/CustomizationPanel'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

const CarViewportLazy = lazy(async () => {
  const mod = await import('@/features/car3d/components/CarViewport')
  return { default: mod.CarViewport }
})

export function ConfiguratorLayout() {
  const navigate = useNavigate()
  const recognition = useCarConfigStore((s) => s.recognition)
  const carModelId = useCarConfigStore((s) => s.carModelId)
  const prepared = useCarConfigStore((s) => s.preparedModel)

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_380px]">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Loaded model</CardTitle>
            <CardDescription>
              {recognition ? (
                <>
                  {recognition.make} {recognition.model}
                  {recognition.generation ? ` · ${recognition.generation}` : ''} · {Math.round(recognition.confidence * 100)}% confidence ·{' '}
                  <span className="font-mono">{carModelId}</span>
                  {recognition.dimensionsMm ? (
                    <> · {recognition.dimensionsMm.lengthMm}×{recognition.dimensionsMm.widthMm}×{recognition.dimensionsMm.heightMm}mm</>
                  ) : null}
                </>
              ) : (
                <>
                  No recognition result yet. Using default demo model · <span className="font-mono">{carModelId ?? 'demo/hatchback'}</span>
                </>
              )}
              {prepared ? <> · Prepared: <span className="font-mono">{prepared.pipeline}</span></> : <> · Prepared: <span className="font-mono">none</span></>}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/scan')}>
              Back to scan
            </Button>
            <Button onClick={() => navigate('/export')}>Validate & export</Button>
          </CardContent>
        </Card>

        <CarViewportLazy />
      </div>

      <CustomizationPanel />
    </div>
  )
}

