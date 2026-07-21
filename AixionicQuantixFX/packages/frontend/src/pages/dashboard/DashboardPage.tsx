import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../services/api'
import { Wallet } from '../../types'

interface DashboardData {
  wallets: Wallet[]
  prices: Record<string, { price: string; change: string }>
  notifications: { id: string; title: string; message: string; read: boolean }[]
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.get('/dashboard').then((res) => res.data),
  })

  const { data: wallets } = useQuery<{ wallets: Wallet[] }>({
    queryKey: ['wallets'],
    queryFn: () => apiClient.get('/wallet').then((res) => res.data),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {wallets?.wallets.map((wallet) => (
          <div key={wallet.currency} className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">{wallet.currency} Wallet</h3>
            <p className="text-2xl font-bold">{wallet.balance}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <p>No recent activity</p>
      </div>
    </div>
  )
}