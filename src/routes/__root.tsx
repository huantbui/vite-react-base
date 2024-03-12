import { Navbar } from '@/components/custom/navbar'
import { ModeToggle } from '@/components/mode-toggle'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { useAuth, type AuthContext } from '../auth'

interface MyRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent
})

function RootComponent() {
  const auth = useAuth()
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Navbar />
          <ModeToggle />
        </div>
      </header>
      <Outlet />
    </>
  )
}
