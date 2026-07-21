import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'

const router = Router()
const authController = new AuthController()

router.post('/register', validate(authController.registerSchema), authController.register)
router.post('/login', validate(authController.loginSchema), authController.login)
router.post('/logout', authenticate, authController.logout)
router.post('/verify-email', authController.verifyEmail)
router.post('/resend-verification', authController.resendVerification)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', validate(authController.resetPasswordSchema), authController.resetPassword)
router.post('/refresh', authController.refreshToken)
router.post('/2fa/enable', authenticate, authController.enable2FA)
router.post('/2fa/verify', authenticate, authController.verify2FA)
router.post('/2fa/disable', authenticate, authController.disable2FA)
router.get('/me', authenticate, authController.me)

export default router