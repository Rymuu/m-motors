import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createVehicle,
  createVehicleSchema,
  getAllVehiclesAdmin,
  updateVehicleListingType,
  updateVehicleStatus,
} from '../services/vehicle.admin.service.js'

export async function getAllVehiclesAdminController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const result = await getAllVehiclesAdmin(page, limit)
    res.json(result)
  } catch (error) {
    console.error('Get all vehicles admin error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function createVehicleController(req: Request, res: Response) {
  try {
    const parsed = createVehicleSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid data',
        errors: z.flattenError(parsed.error).fieldErrors,
      })
    }

    const vehicle = await createVehicle(parsed.data)
    res.status(201).json(vehicle)
  } catch (error) {
    console.error('Create vehicle error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateListingTypeController(req: Request, res: Response) {
  try {
    const vehicleId = req.params.id as string
    const { listingType } = req.body

    if (!['purchase', 'rental'].includes(listingType)) {
      return res.status(400).json({ message: 'Invalid listing type' })
    }

    const vehicle = await updateVehicleListingType(vehicleId, listingType)
    res.json(vehicle)
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({ message: error.message })
    }
    console.error('Update listing type error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateVehicleStatusController(req: Request, res: Response) {
  try {
    const vehicleId = req.params.id as string
    const { status } = req.body

    const validStatuses = ['available', 'reserved', 'sold', 'rented', 'maintenance']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const vehicle = await updateVehicleStatus(vehicleId, status)
    res.json(vehicle)
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({ message: error.message })
    }
    console.error('Update vehicle status error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}