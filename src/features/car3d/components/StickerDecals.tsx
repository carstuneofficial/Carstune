import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import type { CarModelSpec } from '@/features/car3d/db/carModels'
import { createStickerTexture } from '@/features/car3d/lib/textures'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'

type DecalRender = {
  key: string
  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
}

export function StickerDecals({
  spec,
  targetMesh,
  anchorRoot,
}: {
  spec?: CarModelSpec
  targetMesh: THREE.Mesh
  anchorRoot?: THREE.Object3D
}) {
  const stickers = useCarConfigStore((s) => s.stickers)

  const decals = useMemo<DecalRender[]>(() => {
    if (!spec) return []
    const out: DecalRender[] = []

    const root = anchorRoot ?? targetMesh
    const tmpPos = new THREE.Vector3()
    const tmpQuat = new THREE.Quaternion()
    const tmpEuler = new THREE.Euler()

    for (const zone of Object.keys(stickers) as Array<keyof typeof stickers>) {
      const sel = stickers[zone]
      if (sel.option === 'none') continue

      const anchorSpec = spec.anchors[zone]
      const anchorNode = anchorSpec.anchorNodeName ? root.getObjectByName(anchorSpec.anchorNodeName) : null

      const pos = new THREE.Vector3()
      const euler = new THREE.Euler()

      if (anchorNode) {
        anchorNode.getWorldPosition(pos)
        anchorNode.getWorldQuaternion(tmpQuat)
        euler.setFromQuaternion(tmpQuat)
      } else {
        pos.set(anchorSpec.position[0], anchorSpec.position[1], anchorSpec.position[2])
        euler.set(anchorSpec.rotationEuler[0], anchorSpec.rotationEuler[1], anchorSpec.rotationEuler[2])
      }

      // small lift to reduce z-fighting
      tmpEuler.copy(euler)
      tmpPos.set(0, 0, 0.003)
      tmpPos.applyEuler(tmpEuler)
      pos.add(tmpPos)

      const size = new THREE.Vector3(sel.widthMm / 1000, sel.heightMm / 1000, anchorSpec.sizeMeters[2] ?? 0.12)
      const geometry = new DecalGeometry(targetMesh, pos, euler, size)

      const map = createStickerTexture(sel.option, sel.zone)
      const material = new THREE.MeshStandardMaterial({
        map,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        roughness: 0.6,
        metalness: 0.1,
      })
      material.side = THREE.DoubleSide

      out.push({ key: `${zone}:${sel.option}`, geometry, material })
    }

    return out
  }, [anchorRoot, spec, stickers, targetMesh])

  useEffect(() => {
    return () => {
      decals.forEach((d) => {
        d.geometry.dispose()
        d.material.map?.dispose()
        d.material.dispose()
      })
    }
  }, [decals])

  if (decals.length === 0) return null

  return (
    <group renderOrder={10}>
      {decals.map((d) => (
        <mesh key={d.key} geometry={d.geometry} material={d.material} />
      ))}
    </group>
  )
}

