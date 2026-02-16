If you use Draco-compressed GLBs, place the Draco decoder files in this folder so `useGLTF(..., '/draco/')` can decode them.

Typical files:
- `draco_decoder.js`
- `draco_decoder.wasm`
- `draco_wasm_wrapper.js`

You can copy them from the `three` package:
- `node_modules/three/examples/jsm/libs/draco/`

