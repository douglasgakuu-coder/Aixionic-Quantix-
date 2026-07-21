import { Router } from 'express'
import { TradingController } from '../controllers/trading.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()
const tradingController = new TradingController()

router.get('/markets', tradingController.getMarkets)
router.get('/prices/:symbol', tradingController.getPrice)
router.get('/orderbook/:symbol', tradingController.getOrderBook)
router.post('/orders', authenticate, tradingController.createOrder)
router.get('/orders', authenticate, tradingController.getOrders)
router.get('/orders/:id', authenticate, tradingController.getOrder)
router.delete('/orders/:id', authenticate, tradingController.cancelOrder)
router.get('/watchlist', authenticate, tradingController.getWatchlist)
router.post('/watchlist', authenticate, tradingController.addToWatchlist)
router.delete('/watchlist/:symbol', authenticate, tradingController.removeFromWatchlist)

export default router