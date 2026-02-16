import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/app/shell/AppShell'
import { ConfiguratorPage } from '@/app/views/ConfiguratorPage'
import { ExportPage } from '@/app/views/ExportPage'
import { ScanPage } from '@/app/views/ScanPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/scan" replace /> },
      { path: 'scan', element: <ScanPage /> },
      { path: 'configurator', element: <ConfiguratorPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: '*', element: <Navigate to="/scan" replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

