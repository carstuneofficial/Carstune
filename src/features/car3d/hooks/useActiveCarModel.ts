import { useMemo } from 'react'
import { getCarModelSpec } from '@/features/car3d/db/carModels'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

/**
 * Resolves the "active" car model for the 3D scene.
 *
 * Priority:
 * - If the AI backend prepared an aligned model (`preparedModel`), use its `glbUrl`, transform, anchors.
 * - Otherwise, fall back to local model DB mapping by `carModelId`.
 */
export function useActiveCarModel() {
  const prepared = useCarConfigStore((s) => s.preparedModel)
  const carModelId = useCarConfigStore((s) => s.carModelId) ?? prepared?.carModelId ?? 'demo/hatchback'
  const spec = useMemo(() => getCarModelSpec(carModelId), [carModelId])
  return { carModelId, spec, prepared }
}

