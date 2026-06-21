import { prisma } from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { Vehicle, VehicleFilters, PaginatedResponse } from '@m-motors/types'

export async function getVehicles(
  filters: VehicleFilters,
  page: number,
  limit: number
): Promise<PaginatedResponse<Vehicle>> {
  const where: Prisma.VehicleWhereInput = {
    status: 'available',
  }

  if (filters.listingType) where.listingType = filters.listingType
  if (filters.brand) where.brand = filters.brand
  if (filters.fuelType) where.fuelType = filters.fuelType
  if (filters.transmission) where.transmission = filters.transmission
  if (filters.color) where.color = filters.color
  if (filters.power) where.power = filters.power
  if (filters.seats) where.seats = filters.seats
  if (filters.doors) where.doors = filters.doors

  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = filters.minPrice
    if (filters.maxPrice) where.price.lte = filters.maxPrice
  }

  if (filters.minYear || filters.maxYear) {
    where.year = {}
    if (filters.minYear) where.year.gte = filters.minYear
    if (filters.maxYear) where.year.lte = filters.maxYear
  }

  if (filters.minMileage || filters.maxMileage) {
    where.mileage = {}
    if (filters.minMileage) where.mileage.gte = filters.minMileage
    if (filters.maxMileage) where.mileage.lte = filters.maxMileage
  }

  const skip = (page - 1) * limit

  const [data, totalItems] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.vehicle.count({ where }),
  ])

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    limit,
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return prisma.vehicle.findUnique({
    where: { id },
  })
}