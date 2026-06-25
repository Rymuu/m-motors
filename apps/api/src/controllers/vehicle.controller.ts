import type { Request, Response } from 'express'
import { getVehicleById, getVehicles } from '../services/vehicle.service.js'
import type { VehicleFilters } from '@m-motors/types'

export async function getVehiclesController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12

    const filters: VehicleFilters = {
      listingType: req.query.listingType as VehicleFilters['listingType'],
      brand: req.query.brand as string | undefined,
      fuelType: req.query.fuelType as VehicleFilters['fuelType'],
      transmission: req.query.transmission as VehicleFilters['transmission'],
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minYear: req.query.minYear ? Number(req.query.minYear) : undefined,
      maxYear: req.query.maxYear ? Number(req.query.maxYear) : undefined,
      minMileage: req.query.minMileage ? Number(req.query.minMileage) : undefined,
      maxMileage: req.query.maxMileage ? Number(req.query.maxMileage) : undefined,
      color: req.query.color as string | undefined,
      power: req.query.power ? Number(req.query.power) : undefined,
      seats: req.query.seats ? Number(req.query.seats) : undefined,
      doors: req.query.doors ? Number(req.query.doors) : undefined,
    }

    const result = await getVehicles(filters, page, limit)
    res.json(result)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getVehicleByIdController(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const vehicle = await getVehicleById(id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}