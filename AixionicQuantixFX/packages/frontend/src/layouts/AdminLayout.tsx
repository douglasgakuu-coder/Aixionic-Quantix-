import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

export default function AdminLayout() {
  const { user } = useAuthStore()

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow">
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
          <nav className="mt-8 space-y-2">
            <a href="/admin" className="block rounded p-2 hover:bg-gray-100">
              Dashboard
            </a>
            <a href="/admin/users" className="block rounded p-2 hover:bg-gray-100">
              Users
            </a>
            <a href="/admin/kyc" className="block rounded p-2 hover:bg-gray-100">
              KYC
            </a>
            <a href="/admin/transactions" className="block rounded p-2 hover:bg-gray-100">
              Transactions
            </a>
            <a href="/admin/wallets" className="block rounded p-2 hover:bg-gray-100">
              Wallets
            </a>
            <a href="/admin/analytics" className="block rounded p-2 hover:bg-gray-100">
              Analytics
            </a>
            <a href="/admin/reports" className="block rounded p-2 hover:bg-gray-100">
              Reports
            </a>
            <a href="/admin/support" className="block rounded p-2 hover:bg-gray-100">
              Support
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}