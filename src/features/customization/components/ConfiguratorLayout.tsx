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
  const modelId = useCarConfigStore((s) => s.modelId)

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_380px]">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Loaded model</CardTitle>
            <CardDescription>
              {recognition ? (
                <>
                  {recognition.make} {recognition.model} · {Math.round(recognition.confidence * 100)}% confidence ·{' '}
                  <span className="font-mono">{modelId}</span>
                </>
              ) : (
                <>
                  No recognition result yet. Using default demo model · <span className="font-mono">{modelId ?? 'demo/hatchback'}</span>
                </>
              )}
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

