import { Router } from 'express'
import {
  createVehicleController,
  getAllVehiclesAdminController,
  updateListingTypeController,
  updateVehicleStatusController,
} from '../controllers/vehicle.admin.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { adminMiddleware } from '../middlewares/admin.middleware.js'

const router = Router()

router.get('/', authMiddleware, adminMiddleware, getAllVehiclesAdminController)
router.post('/', authMiddleware, adminMiddleware, createVehicleController)
router.patch('/:id/listing-type', authMiddleware, adminMiddleware, updateListingTypeController)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateVehicleStatusController)

export default router