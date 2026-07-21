import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()
const adminController = new AdminController()

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'))

router.get('/users', adminController.getUsers)
router.get('/users/:id', adminController.getUser)
router.put('/users/:id/status', adminController.updateUserStatus)
router.get('/kyc', adminController.getKYCApplications)
router.put('/kyc/:id/status', adminController.updateKYCStatus)
router.get('/transactions', adminController.getAllTransactions)
router.get('/wallets', adminController.getAllWallets)
router.get('/analytics', adminController.getAnalytics)
router.get('/reports/revenue', adminController.getRevenueReport)
router.get('/support-tickets', adminController.getSupportTickets)
router.put('/support-tickets/:id', adminController.updateSupportTicket)

export default router