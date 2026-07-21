import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow">
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-600">QuantixFX</h2>
          <nav className="mt-8 space-y-2">
            <a href="/dashboard" className="block rounded p-2 hover:bg-gray-100">
              Dashboard
            </a>
            <a href="/dashboard/trading" className="block rounded p-2 hover:bg-gray-100">
              Trading
            </a>
            <a href="/dashboard/wallet" className="block rounded p-2 hover:bg-gray-100">
              Wallet
            </a>
            <a href="/dashboard/portfolio" className="block rounded p-2 hover:bg-gray-100">
              Portfolio
            </a>
            <a href="/dashboard/transactions" className="block rounded p-2 hover:bg-gray-100">
              Transactions
            </a>
            {user?.role === 'ADMIN' && (
              <a href="/admin" className="block rounded p-2 font-semibold text-blue-600">
                Admin Panel
              </a>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}