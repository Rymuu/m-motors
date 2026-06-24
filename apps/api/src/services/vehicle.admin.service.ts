import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

export const createVehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  transmission: z.enum(['manual', 'automatic']),
  power: z.number().int().min(1),
  doors: z.number().int().min(2).max(5),
  seats: z.number().int().min(1).max(9),
  color: z.string().min(1),
  price: z.number().min(0),
  minDeposit: z.number().min(0).optional(),
  listingType: z.enum(['purchase', 'rental']),
  description: z.string().min(1),
  images: z.array(z.string()).default([]),
})

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>

export async function getAllVehiclesAdmin(page: number, limit: number) {
  const skip = (page - 1) * limit

  const [data, totalItems] = await Promise.all([
    prisma.vehicle.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.vehicle.count(),
  ])

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    limit,
  }
}

export async function createVehicle(data: CreateVehicleInput) {
  return prisma.vehicle.create({
    data: {
      ...data,
      status: 'available',
    },
  })
}

export async function updateVehicleListingType(
  vehicleId: string,
  listingType: 'purchase' | 'rental'
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  })

  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  return prisma.vehicle.update({
    where: { id: vehicleId },
    data: { listingType },
  })
}

export async function updateVehicleStatus(
  vehicleId: string,
  status: 'available' | 'reserved' | 'sold' | 'rented' | 'maintenance'
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  })

  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  return prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status },
  })
}