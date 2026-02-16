import { Outlet } from 'react-router-dom'
import { AppTopNav } from '@/app/shell/AppTopNav'

export function AppShell() {
  return (
    <div className="min-h-full">
      <AppTopNav />
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}

