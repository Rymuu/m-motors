import { Router } from 'express'
import {
  getAllApplicationsController,
  updateApplicationStatusController,
} from '../controllers/application.admin.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { adminMiddleware } from '../middlewares/admin.middleware.js'

const router = Router()

router.get('/', authMiddleware, adminMiddleware, getAllApplicationsController)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateApplicationStatusController)

export default router