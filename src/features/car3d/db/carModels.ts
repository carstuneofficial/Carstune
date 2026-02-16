import type { CarModelId, StickerZoneId } from '@/shared/domain/car'

export interface AnchorZoneSpec {
  /**
   * Anchor transform in meters, in world-ish model space.
   * If the GLB contains a node named `anchorNodeName`, it wins.
   */
  anchorNodeName?: string
  position: [number, number, number]
  rotationEuler: [number, number, number]
  /**
   * Decal size in meters (used as initial projection size).
   * This is distinct from physical print size (mm) used for export.
   */
  sizeMeters: [number, number, number]
}

export interface CarModelSpec {
  id: CarModelId
  label: string
  glbUrl: string
  /**
   * Mesh names used for body material swaps and decal projection targets.
   * If empty or missing, the renderer falls back to heuristic matching.
   */
  bodyMeshNames?: string[]
  /**
   * Optional named wheel mount points inside the GLB (empties).
   * If missing, fallback wheel positions are used.
   */
  wheelMountNodeNames?: string[]
  anchors: Record<StickerZoneId, AnchorZoneSpec>
}

export const CAR_MODELS: Record<CarModelId, CarModelSpec> = {
  'demo/hatchback': {
    id: 'demo/hatchback',
    label: 'Demo Hatchback',
    glbUrl: '/models/demo-hatchback.glb',
    bodyMeshNames: ['Body', 'CarBody', 'Chassis'],
    wheelMountNodeNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    anchors: {
      hood: {
        anchorNodeName: 'ANCHOR_HOOD',
        position: [0, 0.85, 1.15],
        rotationEuler: [-Math.PI / 2, 0, 0],
        sizeMeters: [0.6, 0.22, 0.15],
      },
      side_skirt: {
        anchorNodeName: 'ANCHOR_SIDE_SKIRT',
        position: [-0.75, 0.35, 0.1],
        rotationEuler: [0, Math.PI / 2, 0],
        sizeMeters: [0.9, 0.16, 0.15],
      },
    },
  },
  'demo/sedan': {
    id: 'demo/sedan',
    label: 'Demo Sedan',
    glbUrl: '/models/demo-sedan.glb',
    bodyMeshNames: ['Body', 'CarBody', 'Chassis'],
    wheelMountNodeNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    anchors: {
      hood: {
        anchorNodeName: 'ANCHOR_HOOD',
        position: [0, 0.9, 1.35],
        rotationEuler: [-Math.PI / 2, 0, 0],
        sizeMeters: [0.62, 0.22, 0.15],
      },
      side_skirt: {
        anchorNodeName: 'ANCHOR_SIDE_SKIRT',
        position: [-0.78, 0.35, 0.05],
        rotationEuler: [0, Math.PI / 2, 0],
        sizeMeters: [0.95, 0.16, 0.15],
      },
    },
  },
}

export function getCarModelSpec(id: CarModelId): CarModelSpec {
  return CAR_MODELS[id]
}

