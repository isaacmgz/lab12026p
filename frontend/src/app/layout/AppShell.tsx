import { NavLink, Outlet, ScrollRestoration } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { ApiStatus } from './ApiStatus'
import { BrandMark } from './BrandMark'
import { navigationItems } from './navigation'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
        <BrandMark className="px-2" />
        <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-muted hover:bg-surface-muted hover:text-foreground',
                )
              }
            >
              <item.icon aria-hidden="true" className="size-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 pt-4">
          <ApiStatus />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <BrandMark />
      </header>

      <main id="main-content" tabIndex={-1} className="pb-24 lg:pb-0 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted',
              )
            }
          >
            <item.icon aria-hidden="true" className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <ScrollRestoration />
    </div>
  )
}
