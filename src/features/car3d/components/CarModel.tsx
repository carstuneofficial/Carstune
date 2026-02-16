import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { CarModelSpec } from '@/features/car3d/db/carModels'
import { createCoveringMaterial } from '@/features/car3d/lib/coveringMaterials'
import { StickerDecals } from '@/features/car3d/components/StickerDecals'
import { WheelSet } from '@/features/car3d/components/WheelSet'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import type { PreparedCarModelAsset } from '@/shared/domain/car'

export function CarModel({ spec, prepared }: { spec?: CarModelSpec; prepared?: PreparedCarModelAsset }) {
  const coveringStyle = useCarConfigStore((s) => s.coveringStyle)
  const glbUrl = prepared?.glbUrl ?? spec?.glbUrl
  if (!glbUrl) {
    throw new Error('No GLB URL available for CarModel')
  }
  const { scene } = useGLTF(glbUrl, '/draco/')

  const bodyMeshes = useMemo(() => findBodyMeshes(scene, spec?.bodyMeshNames), [scene, spec?.bodyMeshNames])

  const coveringMaterial = useMemo(() => createCoveringMaterial(coveringStyle), [coveringStyle])

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh
        m.castShadow = true
        m.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    const targets = bodyMeshes.length > 0 ? bodyMeshes : []
    if (targets.length === 0) return

    targets.forEach((m) => {
      m.material = coveringMaterial
    })

    return () => {
      // Dispose our generated material (not GLB originals)
      disposeMaterial(coveringMaterial)
    }
  }, [bodyMeshes, coveringMaterial])

  const decalTarget = bodyMeshes[0] ?? findLargestMesh(scene)

  return (
    <group>
      <primitive object={scene} />
      {decalTarget ? (
        <StickerDecals spec={spec} anchorOverrides={prepared?.anchors} targetMesh={decalTarget} anchorRoot={scene} />
      ) : null}
      <WheelSet />
    </group>
  )
}

function findBodyMeshes(scene: THREE.Object3D, preferredNames?: string[]) {
  const meshes: THREE.Mesh[] = []
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) meshes.push(obj as THREE.Mesh)
  })

  if (preferredNames && preferredNames.length > 0) {
    const byName = preferredNames
      .map((n) => meshes.find((m) => m.name === n))
      .filter(Boolean) as THREE.Mesh[]
    if (byName.length > 0) return byName
  }

  const heuristic = meshes.filter((m) => /body|chassis|carbody/i.test(m.name))
  return heuristic.length > 0 ? heuristic : meshes.slice(0, 1)
}

function findLargestMesh(scene: THREE.Object3D) {
  let best: THREE.Mesh | null = null
  let bestScore = -Infinity
  const box = new THREE.Box3()
  const size = new THREE.Vector3()

  scene.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return
    const m = obj as THREE.Mesh
    if (!m.geometry) return
    box.setFromObject(m)
    box.getSize(size)
    const score = size.x * size.y * size.z
    if (score > bestScore) {
      bestScore = score
      best = m
    }
  })

  return best
}

function disposeMaterial(material: THREE.Material) {
  const mat = material as THREE.MeshStandardMaterial
  mat.map?.dispose()
  ;(mat as any).normalMap?.dispose?.()
  ;(mat as any).roughnessMap?.dispose?.()
  ;(mat as any).metalnessMap?.dispose?.()
  material.dispose()
}

// Preload best-effort (won't error until used)
useGLTF.preload('/models/demo-hatchback.glb')
useGLTF.preload('/models/demo-sedan.glb')

