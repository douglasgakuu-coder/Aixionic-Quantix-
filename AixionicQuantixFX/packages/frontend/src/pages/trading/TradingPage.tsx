import { useState } from 'react'
import { TradingViewWidget } from '../../components/TradingViewWidget'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '../../services/api'
import { Order } from '../../types'

export default function TradingPage() {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  const { data: orders } = useQuery<{ orders: Order[] }>({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/trading/orders').then((res) => res.data),
  })

  const createOrderMutation = useMutation({
    mutationFn: (order: { symbol: string; side: string; orderType: string; price?: string; quantity: string }) =>
      apiClient.post('/trading/orders', order),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createOrderMutation.mutate({
      symbol,
      side,
      orderType,
      price: orderType === 'LIMIT' ? price : undefined,
      quantity: amount,
    })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Trading</h1>

      <div className="mb-6">
        <TradingViewWidget symbol={symbol} theme="dark" height={500} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Place Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
              >
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Side</label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as 'BUY' | 'SELL')}
                className="mt-1 w-full rounded-md border p-2"
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
                className="mt-1 w-full rounded-md border p-2"
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
              </select>
            </div>

            {orderType === 'LIMIT' && (
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2"
                  step="0.01"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
                step="0.0001"
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Open Orders</h2>
          <div className="space-y-2">
            {orders?.orders.map((order) => (
              <div key={order.id} className="border-b py-2 last:border-0">
                <p className="font-medium">{order.symbol}</p>
                <p className="text-sm text-gray-600">
                  {order.side} {order.quantity} @ {order.price || 'Market'}
                </p>
                <span className="text-xs">{order.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}