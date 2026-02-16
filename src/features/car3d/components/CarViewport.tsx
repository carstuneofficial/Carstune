import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { CarCanvas } from '@/features/car3d/components/CarCanvas'

export function CarViewport() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>3D Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[520px] w-full">
          <Suspense fallback={<div className="h-full w-full bg-card" />}>
            <CarCanvas />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
}

