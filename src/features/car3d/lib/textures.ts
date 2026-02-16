import * as THREE from 'three'
import type { StickerOptionId, StickerZoneId } from '@/shared/domain/car'

export function createStickerTexture(option: StickerOptionId, zone: StickerZoneId) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const base = zone === 'hood' ? '#ffffff' : '#d1fae5'
  const accent = option === 'stealth_text' ? '#0b0b0b' : '#111827'

  // background shape (cut outline reference)
  ctx.strokeStyle = 'rgba(255,255,255,0.20)'
  ctx.lineWidth = 10
  roundRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, 40)
  ctx.stroke()

  if (option === 'none') {
    ctx.fillStyle = 'rgba(255,255,255,0.16)'
    ctx.font = 'bold 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillText('NO STICKER', 90, 160)
  }

  if (option === 'racing_stripes') {
    ctx.fillStyle = base
    ctx.fillRect(140, 0, 90, canvas.height)
    ctx.fillRect(canvas.width - 230, 0, 90, canvas.height)
  }

  if (option === 'logo_pack') {
    ctx.fillStyle = base
    ctx.beginPath()
    ctx.arc(260, canvas.height / 2, 120, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = accent
    ctx.font = 'bold 72px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillText('CT', 210, canvas.height / 2 + 24)
  }

  if (option === 'stealth_text') {
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.fillRect(0, canvas.height / 2 - 90, canvas.width, 180)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 80px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillText('CARSTUNE', 120, canvas.height / 2 + 26)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

export function createCarbonFiberTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#0b0f16'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const step = 32
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const on = ((x / step) ^ (y / step)) & 1
      ctx.fillStyle = on ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.18)'
      ctx.beginPath()
      ctx.moveTo(x, y + step / 2)
      ctx.lineTo(x + step / 2, y)
      ctx.lineTo(x + step, y + step / 2)
      ctx.lineTo(x + step / 2, y + step)
      ctx.closePath()
      ctx.fill()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 6)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

