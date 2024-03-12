import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider, useAuth } from './auth'
import { Toaster } from './components/ui/toaster'

import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined! // This will be set after we wrap the app in an AuthProvider
  }
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
          {/* <main className="flex-1">{children}</main> */}
          <InnerApp />
        </div>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
