import { useMemo } from 'react'
import { getCarModelSpec } from '@/features/car3d/db/carModels'
import { CarModelRenderer } from '@/features/car3d/components/CarModelRenderer'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

export function CarScene() {
  const modelId = useCarConfigStore((s) => s.modelId) ?? 'demo/hatchback'
  const spec = useMemo(() => getCarModelSpec(modelId), [modelId])

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0b1220" roughness={1} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.448, 0]}>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#0f1a32" roughness={1} metalness={0} />
      </mesh>

      <group position={[0, -0.45, 0]}>
        <CarModelRenderer spec={spec} />
      </group>
    </group>
  )
}

