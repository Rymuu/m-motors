import { Router } from 'express'
import { getVehicleByIdController, getVehiclesController } from '../controllers/vehicle.controller.js'

const router = Router()

router.get('/', getVehiclesController)
router.get('/:id', getVehicleByIdController)

export default router