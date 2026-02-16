import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/shared/ui/button'

export function AppTopNav() {
  return (
    <header className="border-b border-border bg-card/40 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/scan" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary" />
          <div className="text-sm font-semibold tracking-tight">Carstune</div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/scan"
            className={({ isActive }) =>
              `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            Scan
          </NavLink>
          <NavLink
            to="/configurator"
            className={({ isActive }) =>
              `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            3D Configurator
          </NavLink>
          <NavLink
            to="/export"
            className={({ isActive }) =>
              `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            Print Export
          </NavLink>
          <Button asChild variant="secondary" size="sm">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              Docs
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

