import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import type { CarModelSpec } from '@/features/car3d/db/carModels'
import { createStickerTexture } from '@/features/car3d/lib/textures'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import type { AnchorTransform, StickerZoneId } from '@/shared/domain/car'

type DecalRender = {
  key: string
  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
}

export function StickerDecals({
  spec,
  targetMesh,
  anchorRoot,
  anchorOverrides,
}: {
  spec?: CarModelSpec
  targetMesh: THREE.Mesh
  anchorRoot?: THREE.Object3D
  /**
   * AI-generated anchors (preferred) from segmentation + geometry analysis.
   * If omitted, fall back to `spec.anchors`.
   */
  anchorOverrides?: Partial<Record<StickerZoneId, AnchorTransform>>
}) {
  const stickers = useCarConfigStore((s) => s.stickers)

  const decals = useMemo<DecalRender[]>(() => {
    if (!spec && !anchorOverrides) return []
    const out: DecalRender[] = []

    const root = anchorRoot ?? targetMesh
    const tmpPos = new THREE.Vector3()
    const tmpQuat = new THREE.Quaternion()
    const tmpEuler = new THREE.Euler()

    for (const zone of Object.keys(stickers) as Array<keyof typeof stickers>) {
      const sel = stickers[zone]
      if (sel.option === 'none') continue

      const override = anchorOverrides?.[zone]
      const anchorSpec = spec?.anchors?.[zone]
      if (!override && !anchorSpec) continue

      const anchorNode =
        override?.targetMeshName || !anchorSpec?.anchorNodeName ? null : root.getObjectByName(anchorSpec.anchorNodeName)

      const pos = new THREE.Vector3()
      const euler = new THREE.Euler()

      if (override) {
        pos.set(override.position[0], override.position[1], override.position[2])
        euler.set(override.rotationEuler[0], override.rotationEuler[1], override.rotationEuler[2])
      } else if (anchorNode) {
        anchorNode.getWorldPosition(pos)
        anchorNode.getWorldQuaternion(tmpQuat)
        euler.setFromQuaternion(tmpQuat)
      } else {
        pos.set(anchorSpec!.position[0], anchorSpec!.position[1], anchorSpec!.position[2])
        euler.set(anchorSpec!.rotationEuler[0], anchorSpec!.rotationEuler[1], anchorSpec!.rotationEuler[2])
      }

      // small lift to reduce z-fighting
      tmpEuler.copy(euler)
      tmpPos.set(0, 0, 0.003)
      tmpPos.applyEuler(tmpEuler)
      pos.add(tmpPos)

      const depth =
        override?.sizeMeters?.[2] ?? anchorSpec?.sizeMeters?.[2] ?? 0.12
      const size = new THREE.Vector3(sel.widthMm / 1000, sel.heightMm / 1000, depth)

      // If segmentation returns a zone-specific mesh, project onto it.
      const segTarget =
        override?.targetMeshName ? (root.getObjectByName(override.targetMeshName) as THREE.Mesh | null) : null
      const projectionTarget = segTarget && (segTarget as any).isMesh ? segTarget : targetMesh

      const geometry = new DecalGeometry(projectionTarget, pos, euler, size)

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
  }, [anchorOverrides, anchorRoot, spec, stickers, targetMesh])

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

