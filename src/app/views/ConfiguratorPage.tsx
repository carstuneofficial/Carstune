import { Suspense } from 'react'
import { ConfiguratorLayout } from '@/features/customization/components/ConfiguratorLayout'

export function ConfiguratorPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 md:grid-cols-[1fr_380px]">
          <div className="h-[520px] rounded-lg border border-border bg-card" />
          <div className="h-[520px] rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <ConfiguratorLayout />
    </Suspense>
  )
}

