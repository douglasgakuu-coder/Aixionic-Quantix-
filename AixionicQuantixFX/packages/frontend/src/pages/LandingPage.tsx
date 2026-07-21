import { motion } from 'framer-motion'
import { TradingViewWidget } from '../components/TradingViewWidget'

export default function LandingPage() {
  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold md:text-6xl"
          >
            Trade Crypto & Forex with Professional Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-xl md:text-2xl"
          >
            Advanced trading platform with real-time charts, secure wallets, and institutional features
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <a href="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </a>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">Live Market Charts</h2>
        <TradingViewWidget symbol="BTCUSDT" theme="dark" height={500} />
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose QuantixFX?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">Advanced Charts</h3>
              <p>Professional TradingView charts with real-time data</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">Secure Trading</h3>
              <p>Bank-level security with 2FA and cold storage</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">Fast Execution</h3>
              <p>Lightning-fast order execution with low latency</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}