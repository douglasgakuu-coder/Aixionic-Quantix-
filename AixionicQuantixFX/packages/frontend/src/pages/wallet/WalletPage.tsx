import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../services/api'
import { Wallet, Transaction } from '../../types'

export default function WalletPage() {
  const { data: wallets, refetch } = useQuery<{ wallets: Wallet[] }>({
    queryKey: ['wallets'],
    queryFn: () => apiClient.get('/wallet').then((res) => res.data),
  })

  const { data: transactions } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['transactions'],
    queryFn: () => apiClient.get('/wallet/transactions').then((res) => res.data),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Wallet</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Balances</h2>
          <div className="space-y-3">
            {wallets?.wallets.map((wallet) => (
              <div key={wallet.currency} className="flex items-center justify-between border-b pb-2 last:border-0">
                <span className="font-medium">{wallet.currency}</span>
                <span>{wallet.balance} {wallet.currency}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Generate Deposit Address</h2>
          <p className="mb-4 text-sm text-gray-600">Select a currency to generate a deposit address</p>
          <div className="space-y-2">
            {['BTC', 'ETH', 'USDT', 'USDC'].map((currency) => (
              <button
                key={currency}
                onClick={() => apiClient.post('/wallet/deposit-address', { currency }).then(() => refetch())}
                className="w-full rounded-md border border-blue-600 p-2 text-blue-600 hover:bg-blue-50"
              >
                Generate {currency} Address
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left">Type</th>
                <th className="text-left">Currency</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td>{tx.type}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.status}</td>
                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}