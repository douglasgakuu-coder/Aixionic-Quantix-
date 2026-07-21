import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../services/api'

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => apiClient.get('/admin/analytics').then((res) => res.data),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold">{data?.totalUsers || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm text-gray-600">Total Volume</h3>
          <p className="text-2xl font-bold">{data?.totalVolume || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm text-gray-600">Active Orders</h3>
          <p className="text-2xl font-bold">{data?.activeOrders || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm text-gray-600">Pending KYC</h3>
          <p className="text-2xl font-bold">{data?.pendingKYC || 0}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="flex gap-4">
          <a href="/admin/kyc" className="btn-primary">
            Review KYC
          </a>
          <a href="/admin/support" className="btn-primary">
            Support Tickets
          </a>
          <a href="/admin/reports" className="btn-primary">
            View Reports
          </a>
        </div>
      </div>
    </div>
  )
}