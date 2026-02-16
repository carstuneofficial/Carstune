import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/app/shell/AppShell'

const ScanPage = lazy(async () => ({ default: (await import('@/app/views/ScanPage')).ScanPage }))
const ConfiguratorPage = lazy(async () => ({ default: (await import('@/app/views/ConfiguratorPage')).ConfiguratorPage }))
const ExportPage = lazy(async () => ({ default: (await import('@/app/views/ExportPage')).ExportPage }))

function PageFallback() {
  return <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading…</div>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/scan" replace /> },
      {
        path: 'scan',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ScanPage />
          </Suspense>
        ),
      },
      {
        path: 'configurator',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ConfiguratorPage />
          </Suspense>
        ),
      },
      {
        path: 'export',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ExportPage />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/scan" replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

