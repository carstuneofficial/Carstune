# Carstune

Production-grade starter for an **AI car tuning configurator**:

- **Scan flow**: user uploads photos → AI vision returns stable `carModelId` + approximate dimensions  
- **3D configurator**: app loads a **prepared** GLB (aligned/scaled from a base parametric model) by `carModelId`  
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

### Enable AI backend (optional)

Set `VITE_API_BASE_URL` to point at your backend:

```bash
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

A FastAPI placeholder backend is included under `backend/`.

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

- The recognition step in `src/features/recognition/api/recognizeCar.ts` falls back to a **mock** if the backend is unreachable.
- The “prepared model” step (`/v1/models/prepare`) is where you implement **parametric alignment** and **AI anchor generation** for decals.
- The export step is a minimal example. Production implementations usually connect `carModelId` to **CAD/UV templates** to generate true cutting paths.
