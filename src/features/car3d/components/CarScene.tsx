import { CarModelRenderer } from '@/features/car3d/components/CarModelRenderer'
import { useActiveCarModel } from '@/features/car3d/hooks/useActiveCarModel'

export function CarScene() {
  const { spec, prepared } = useActiveCarModel()
  const t = prepared?.transform

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
        <group
          position={t?.position ?? [0, 0, 0]}
          rotation={t?.rotationEuler ?? [0, 0, 0]}
          scale={(t?.scale as any) ?? 1}
        >
          <CarModelRenderer spec={spec} prepared={prepared} />
        </group>
      </group>
    </group>
  )
}

