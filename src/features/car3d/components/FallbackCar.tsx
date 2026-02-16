import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import { createCoveringMaterial } from '@/features/car3d/lib/coveringMaterials'
import { WheelSet } from '@/features/car3d/components/WheelSet'
import { StickerDecals } from '@/features/car3d/components/StickerDecals'
import type { CarModelSpec } from '@/features/car3d/db/carModels'

export function FallbackCar({ spec }: { spec?: CarModelSpec }) {
  const coveringStyle = useCarConfigStore((s) => s.coveringStyle)
  const material = useMemo(() => createCoveringMaterial(coveringStyle), [coveringStyle])

  const bodyGeom = useMemo(() => new THREE.BoxGeometry(2.1, 0.7, 4.1), [])
  const cabinGeom = useMemo(() => new THREE.BoxGeometry(1.7, 0.55, 1.7), [])
  const bodyRef = useRef<THREE.Mesh | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <group castShadow>
      <group position={[0, 0.55, 0]}>
        <mesh ref={bodyRef} geometry={bodyGeom} material={material} castShadow />
        {spec && ready && bodyRef.current ? (
          <StickerDecals spec={spec} targetMesh={bodyRef.current} anchorRoot={bodyRef.current} />
        ) : null}
        <mesh geometry={cabinGeom} position={[0, 0.55, -0.25]} castShadow>
          <meshStandardMaterial color="#111827" roughness={0.55} metalness={0.25} />
        </mesh>
      </group>

      <WheelSet />
    </group>
  )
}

