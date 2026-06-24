import { Router } from 'express'
import { createApplicationController, getApplicationByIdController, getUserApplicationsController } from '../controllers/application.controller.js'
import { authMiddleware} from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, createApplicationController)
router.get('/me', authMiddleware, getUserApplicationsController)
router.get('/:applicationId', authMiddleware, getApplicationByIdController)

export default router