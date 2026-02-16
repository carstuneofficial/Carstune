import { useMemo } from 'react'
import type { CoveringStyleId, StickerOptionId, StickerZoneId, WheelStyleId } from '@/shared/domain/car'
import { useCarConfigStore } from '@/shared/store/useCarConfigStore'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

const coveringOptions: Array<{ id: CoveringStyleId; label: string }> = [
  { id: 'gloss_black', label: 'Gloss black (clearcoat)' },
  { id: 'matte_grey', label: 'Matte grey' },
  { id: 'carbon', label: 'Carbon fiber' },
]

const wheelOptions: Array<{ id: WheelStyleId; label: string }> = [
  { id: 'sport_5spoke', label: 'Sport 5-spoke' },
  { id: 'classic_mesh', label: 'Classic mesh' },
  { id: 'track_split', label: 'Track split' },
]

const stickerOptions: Array<{ id: StickerOptionId; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'racing_stripes', label: 'Racing stripes' },
  { id: 'logo_pack', label: 'Logo pack' },
  { id: 'stealth_text', label: 'Stealth text' },
]

export function CustomizationPanel() {
  const coveringStyle = useCarConfigStore((s) => s.coveringStyle)
  const wheelStyle = useCarConfigStore((s) => s.wheelStyle)
  const stickers = useCarConfigStore((s) => s.stickers)
  const setCoveringStyle = useCarConfigStore((s) => s.setCoveringStyle)
  const setWheelStyle = useCarConfigStore((s) => s.setWheelStyle)
  const setStickerOption = useCarConfigStore((s) => s.setStickerOption)
  const setStickerSizeMm = useCarConfigStore((s) => s.setStickerSizeMm)
  const resetAll = useCarConfigStore((s) => s.resetAll)

  const hood = stickers.hood
  const side = stickers.side_skirt

  const stickerSummary = useMemo(() => {
    const active = [hood, side].filter((s) => s.option !== 'none')
    if (active.length === 0) return 'No stickers selected'
    return active.map((s) => `${s.zone} · ${s.option}`).join(' · ')
  }, [hood, side])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customization</CardTitle>
        <CardDescription>Real-world options applied to a pre-built 3D model (no photo-generated geometry).</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="covering">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="covering">Covering</TabsTrigger>
            <TabsTrigger value="wheels">Wheels</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
          </TabsList>

          <TabsContent value="covering" className="grid gap-3">
            <div className="grid gap-2">
              <Label>Covering style</Label>
              <Select value={coveringStyle} onValueChange={(v) => setCoveringStyle(v as CoveringStyleId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select covering" />
                </SelectTrigger>
                <SelectContent>
                  {coveringOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">Applied as a material swap on the body meshes.</div>
            </div>
          </TabsContent>

          <TabsContent value="wheels" className="grid gap-3">
            <div className="grid gap-2">
              <Label>Wheel style</Label>
              <Select value={wheelStyle} onValueChange={(v) => setWheelStyle(v as WheelStyleId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wheels" />
                </SelectTrigger>
                <SelectContent>
                  {wheelOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">This demo shows mesh replacement via wheel variants.</div>
            </div>
          </TabsContent>

          <TabsContent value="stickers" className="grid gap-4">
            <div className="text-xs text-muted-foreground">{stickerSummary}</div>
            <Separator />

            <StickerControls
              zone="hood"
              label="Hood sticker"
              option={hood.option}
              widthMm={hood.widthMm}
              heightMm={hood.heightMm}
              onOptionChange={(o) => setStickerOption('hood', o)}
              onSizeChange={(w, h) => setStickerSizeMm('hood', w, h)}
            />

            <StickerControls
              zone="side_skirt"
              label="Side skirt sticker"
              option={side.option}
              widthMm={side.widthMm}
              heightMm={side.heightMm}
              onOptionChange={(o) => setStickerOption('side_skirt', o)}
              onSizeChange={(w, h) => setStickerSizeMm('side_skirt', w, h)}
            />

            <div className="text-xs text-muted-foreground">
              Stickers are projected using decal geometry onto predefined anchor zones in the model.
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => resetAll()}>
            Reset all
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StickerControls({
  zone,
  label,
  option,
  widthMm,
  heightMm,
  onOptionChange,
  onSizeChange,
}: {
  zone: StickerZoneId
  label: string
  option: StickerOptionId
  widthMm: number
  heightMm: number
  onOptionChange: (o: StickerOptionId) => void
  onSizeChange: (w: number, h: number) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{label}</div>
      <Select value={option} onValueChange={(v) => onOptionChange(v as StickerOptionId)}>
        <SelectTrigger>
          <SelectValue placeholder="Select sticker" />
        </SelectTrigger>
        <SelectContent>
          {stickerOptions.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label htmlFor={`${zone}-w`}>Width (mm)</Label>
          <Input
            id={`${zone}-w`}
            type="number"
            min={10}
            step={1}
            value={widthMm}
            onChange={(e) => onSizeChange(Number(e.target.value || 0), heightMm)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor={`${zone}-h`}>Height (mm)</Label>
          <Input
            id={`${zone}-h`}
            type="number"
            min={10}
            step={1}
            value={heightMm}
            onChange={(e) => onSizeChange(widthMm, Number(e.target.value || 0))}
          />
        </div>
      </div>
    </div>
  )
}

