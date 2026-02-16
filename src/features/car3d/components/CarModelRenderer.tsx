import { Suspense } from 'react'
import type { CarModelSpec } from '@/features/car3d/db/carModels'
import { CarModel } from '@/features/car3d/components/CarModel'
import { FallbackCar } from '@/features/car3d/components/FallbackCar'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'

export function CarModelRenderer({ spec }: { spec: CarModelSpec }) {
  return (
    <ErrorBoundary fallback={<FallbackCar />}>
      <Suspense fallback={<FallbackCar />}>
        <CarModel spec={spec} />
      </Suspense>
    </ErrorBoundary>
  )
}

