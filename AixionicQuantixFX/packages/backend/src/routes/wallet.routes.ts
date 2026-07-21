import { Router } from 'express'
import { WalletController } from '../controllers/wallet.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()
const walletController = new WalletController()

router.get('/', authenticate, walletController.getWallets)
router.get('/:currency', authenticate, walletController.getWallet)
router.post('/deposit-address', authenticate, walletController.generateDepositAddress)
router.post('/withdraw', authenticate, walletController.withdraw)
router.get('/transactions', authenticate, walletController.getTransactions)

export default router