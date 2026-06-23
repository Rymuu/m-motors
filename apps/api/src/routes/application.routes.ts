import { Router } from 'express'
import { createApplicationController, getUserApplicationsController } from '../controllers/application.controller.js'
import { authMiddleware} from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, createApplicationController)
router.get('/me', authMiddleware, getUserApplicationsController)

export default router