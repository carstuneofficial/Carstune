import { Suspense } from 'react'
import type { CarModelSpec } from '@/features/car3d/db/carModels'
import { CarModel } from '@/features/car3d/components/CarModel'
import { FallbackCar } from '@/features/car3d/components/FallbackCar'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import type { PreparedCarModelAsset } from '@/shared/domain/car'

export function CarModelRenderer({ spec, prepared }: { spec?: CarModelSpec; prepared?: PreparedCarModelAsset }) {
  return (
    <ErrorBoundary fallback={<FallbackCar spec={spec} />}>
      <Suspense fallback={<FallbackCar spec={spec} />}>
        <CarModel spec={spec} prepared={prepared} />
      </Suspense>
    </ErrorBoundary>
  )
}

