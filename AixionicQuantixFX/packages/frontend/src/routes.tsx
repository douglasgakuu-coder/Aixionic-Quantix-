import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import TradingPage from './pages/trading/TradingPage'
import WalletPage from './pages/wallet/WalletPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="markets" element={<div>Markets</div>} />
        <Route path="pricing" element={<div>Pricing</div>} />
        <Route path="about" element={<div>About</div>} />
        <Route path="blog" element={<div>Blog</div>} />
        <Route path="contact" element={<div>Contact</div>} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="trading" element={<TradingPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="portfolio" element={<div>Portfolio</div>} />
        <Route path="deposits" element={<div>Deposits</div>} />
        <Route path="withdrawals" element={<div>Withdrawals</div>} />
        <Route path="transactions" element={<div>Transactions</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />
        <Route path="profile" element={<div>Profile</div>} />
        <Route path="security" element={<div>Security</div>} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<div>User Management</div>} />
        <Route path="kyc" element={<div>KYC Verification</div>} />
        <Route path="transactions" element={<div>Transactions</div>} />
        <Route path="wallets" element={<div>Wallet Monitoring</div>} />
        <Route path="analytics" element={<div>Analytics</div>} />
        <Route path="reports" element={<div>Revenue Reports</div>} />
        <Route path="support" element={<div>Support Tickets</div>} />
      </Route>
    </>
  )
)