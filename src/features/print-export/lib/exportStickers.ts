import type { CarRecognitionResult, StickerSelection } from '@/shared/domain/car'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface StickerExportInput {
  modelId: string
  recognition?: CarRecognitionResult
  stickers: StickerSelection[]
}

export function buildCutSvg(input: StickerExportInput) {
  const active = input.stickers.filter((s) => s.option !== 'none')
  const marginMm = 10
  const gapMm = 12
  const maxWidthMm = Math.max(...active.map((s) => s.widthMm + marginMm * 2), 210)
  const totalHeightMm =
    active.reduce((acc, s) => acc + s.heightMm + marginMm * 2, 0) + Math.max(0, active.length - 1) * gapMm

  let y = 0
  const blocks = active
    .map((s) => {
      const w = s.widthMm
      const h = s.heightMm
      const x = marginMm
      const blockY = y + marginMm
      const label = `${s.zone} · ${s.option} · ${w}×${h}mm`
      y += h + marginMm * 2 + gapMm

      return `
  <g transform="translate(0 ${blockY})">
    <rect x="${x}" y="0" width="${w}" height="${h}" fill="none" stroke="black" stroke-width="0.6" />
    <rect x="${x + 2}" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="black" stroke-width="0.2" stroke-dasharray="2 2" />
    <text x="${x}" y="${h + 6}" font-family="ui-sans-serif, system-ui" font-size="6">${escapeXml(label)}</text>
  </g>`
    })
    .join('\n')

  const meta = [
    `Model ID: ${input.modelId}`,
    input.recognition ? `${input.recognition.make} ${input.recognition.model} (${Math.round(input.recognition.confidence * 100)}%)` : 'No recognition metadata',
    `Generated: ${new Date().toISOString()}`,
  ].join(' · ')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidthMm}mm" height="${Math.max(totalHeightMm, 80)}mm" viewBox="0 0 ${maxWidthMm} ${Math.max(
    totalHeightMm,
    80,
  )}">
  <rect x="0" y="0" width="${maxWidthMm}" height="${Math.max(totalHeightMm, 80)}" fill="white"/>
  <text x="10" y="14" font-family="ui-sans-serif, system-ui" font-size="7">${escapeXml(meta)}</text>
  <g transform="translate(0 20)">
${blocks || `    <text x="10" y="18" font-family="ui-sans-serif, system-ui" font-size="10">No stickers selected</text>`}
  </g>
</svg>`

  return svg
}

export async function buildCutPdf(input: StickerExportInput) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const marginMm = 10

  const active = input.stickers.filter((s) => s.option !== 'none')
  if (active.length === 0) {
    const page = pdfDoc.addPage([mmToPt(210), mmToPt(80)])
    page.drawText('No stickers selected', { x: mmToPt(10), y: mmToPt(60), size: 18, font, color: rgb(0, 0, 0) })
    const bytes = await pdfDoc.save()
    const ab = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(ab).set(bytes)
    return new Blob([ab], { type: 'application/pdf' })
  }

  for (const s of active) {
    const w = s.widthMm + marginMm * 2
    const h = s.heightMm + marginMm * 2 + 12
    const page = pdfDoc.addPage([mmToPt(w), mmToPt(h)])

    const x = mmToPt(marginMm)
    const y = mmToPt(marginMm + 12)
    page.drawRectangle({
      x,
      y,
      width: mmToPt(s.widthMm),
      height: mmToPt(s.heightMm),
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
      color: undefined,
    })

    page.drawText(`${s.zone} · ${s.option}`, {
      x,
      y: mmToPt(6),
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })
    page.drawText(`${s.widthMm}×${s.heightMm}mm · Model ${input.modelId}`, {
      x,
      y: mmToPt(2),
      size: 8,
      font,
      color: rgb(0.1, 0.1, 0.1),
    })
  }

  const bytes = await pdfDoc.save()
  const ab = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(ab).set(bytes)
  return new Blob([ab], { type: 'application/pdf' })
}

function mmToPt(mm: number) {
  return (mm / 25.4) * 72
}

function escapeXml(str: string) {
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

