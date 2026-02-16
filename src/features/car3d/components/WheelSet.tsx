import { useMemo } from 'react'
import * as THREE from 'three'
import type { WheelStyleId } from '@/shared/domain/car'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

const wheelPositions: Array<[number, number, number]> = [
  [-0.95, 0.35, 1.45], // FL
  [0.95, 0.35, 1.45], // FR
  [-0.95, 0.35, -1.45], // RL
  [0.95, 0.35, -1.45], // RR
]

export function WheelSet() {
  const wheelStyle = useCarConfigStore((s) => s.wheelStyle)

  return (
    <group>
      {wheelPositions.map((p, idx) => (
        <Wheel key={idx} position={p} style={wheelStyle} />
      ))}
    </group>
  )
}

function Wheel({ position, style }: { position: [number, number, number]; style: WheelStyleId }) {
  const tireGeom = useMemo(() => new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32, 1, true), [])
  const rimGeom = useMemo(() => new THREE.CylinderGeometry(0.26, 0.26, 0.24, 32), [])

  const rimColor = style === 'classic_mesh' ? '#e5e7eb' : style === 'track_split' ? '#9ca3af' : '#cbd5e1'
  const rimRoughness = style === 'classic_mesh' ? 0.25 : 0.35
  const spokeCount = style === 'sport_5spoke' ? 5 : style === 'track_split' ? 7 : 10

  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <mesh geometry={tireGeom} castShadow>
        <meshStandardMaterial color="#0b0b0f" roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rimGeom} castShadow>
        <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={0.9} />
      </mesh>

      {/* spokes (simple approximation) */}
      <group>
        {Array.from({ length: spokeCount }).map((_, i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, (i / spokeCount) * Math.PI * 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.52, 0.04, 0.06]} />
            <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

