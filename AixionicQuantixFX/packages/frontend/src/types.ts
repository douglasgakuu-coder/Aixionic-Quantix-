export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  status: string
}

export interface Wallet {
  id: string
  currency: string
  balance: number
  address?: string
  isWhitelisted: boolean
}

export interface Order {
  id: string
  symbol: string
  type: string
  orderType: string
  price?: number
  quantity: number
  filledQuantity: number
  status: string
  createdAt: string
  stopLoss?: number
  takeProfit?: number
}

export interface Transaction {
  id: string
  type: string
  currency: string
  amount: number
  status: string
  createdAt: string
}

export interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
}