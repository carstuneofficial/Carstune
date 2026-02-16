import * as THREE from 'three'
import type { CoveringStyleId } from '@/shared/domain/car'
import { createCarbonFiberTexture } from '@/features/car3d/lib/textures'

export function createCoveringMaterial(style: CoveringStyleId): THREE.Material {
  if (style === 'gloss_black') {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0b0b0f'),
      metalness: 0.35,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
    })
  }
  if (style === 'matte_grey') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6b7280'),
      metalness: 0.05,
      roughness: 0.9,
    })
  }
  // carbon
  const map = createCarbonFiberTexture()
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#101827'),
    metalness: 0.2,
    roughness: 0.55,
    map,
  })
}

