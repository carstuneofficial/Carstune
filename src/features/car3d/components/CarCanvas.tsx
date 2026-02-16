import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { CarScene } from '@/features/car3d/components/CarScene'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

function InvalidateOnConfigChange() {
  const invalidate = useThree((s) => s.invalidate)
  const coveringStyle = useCarConfigStore((s) => s.coveringStyle)
  const wheelStyle = useCarConfigStore((s) => s.wheelStyle)
  const stickers = useCarConfigStore((s) => s.stickers)
  const carModelId = useCarConfigStore((s) => s.carModelId)
  const preparedUrl = useCarConfigStore((s) => s.preparedModel?.glbUrl)

  useEffect(() => {
    invalidate()
  }, [invalidate, coveringStyle, wheelStyle, stickers, carModelId, preparedUrl])

  return null
}

export function CarCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ position: [2.6, 1.4, 2.6], fov: 40, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#070a12']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 2]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.65} />

      <Suspense fallback={null}>
        <CarScene />
      </Suspense>

      <Controls />
      <InvalidateOnConfigChange />
    </Canvas>
  )
}

function Controls() {
  const invalidate = useThree((s) => s.invalidate)
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={1.8}
      maxDistance={6}
      onChange={() => invalidate()}
    />
  )
}

