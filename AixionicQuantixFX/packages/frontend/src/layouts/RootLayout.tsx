import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            QuantixFX
          </a>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <a href="/login" className="btn-primary">
                  Login
                </a>
                <a href="/register" className="btn-primary">
                  Register
                </a>
              </>
            ) : (
              <a href="/dashboard" className="btn-primary">
                Dashboard
              </a>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 QuantixFX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}