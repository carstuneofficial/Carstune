# Carstune

Production-grade starter for an **AI car tuning configurator**:

- **Scan flow**: user uploads photos → AI vision returns stable `modelId` (make/model)  
- **3D configurator**: app loads a **pre-existing** parametric GLB by `modelId` (no photo-generated geometry)  
- **Customization**: covering (material swap), wheels (variant swap), stickers (decal projection)  
- **Print export**: SVG/PDF cut outlines with **exact millimeter** dimensions

## Tech stack

- React + Vite + TypeScript
- React Three Fiber (Three.js) + Drei
- TailwindCSS + shadcn/ui-style primitives
- Zustand state management
- TanStack Query (recognition + data fetching)

## Project architecture

```
src/
  app/
    providers/
    router/
    shell/
    views/
  features/
    scan/
    recognition/
    car3d/
    customization/
    print-export/
  shared/
    domain/
    lib/
    store/
    ui/
```

## Running locally

```bash
npm install
npm run dev
```

## 3D models (GLB)

This repo intentionally does **not** ship large binary assets.

Add your GLBs under `public/models/`:

- `public/models/demo-hatchback.glb`
- `public/models/demo-sedan.glb`

Model mapping lives in `src/features/car3d/db/carModels.ts`.

### Smart sticker anchors

For best results, include named empty nodes in your GLB:

- `ANCHOR_HOOD`
- `ANCHOR_SIDE_SKIRT`

The decal system will use these transforms if present; otherwise it falls back to hardcoded anchor coordinates from the model spec.

### GLTF compression

If your GLB is Draco-compressed, copy the Draco decoder files into `public/draco/` (see `public/draco/README.md`).

## Notes

- The recognition step in `src/features/recognition/api/recognizeCar.ts` is a **mock**. In production it should call your backend vision system and return a stable `modelId`.
- The export step is a minimal example. Production implementations usually connect `modelId` to **CAD/UV templates** to generate true cutting paths.
