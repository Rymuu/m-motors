import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ListingType, VehicleStatus, FuelType, TransmissionType } from '../generated/prisma/client.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    vehicle: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import { getVehicles, getVehicleById } from '../services/vehicle.service.js'

const mockVehicle = {
  id: 'vehicle-123',
  brand: 'Renault',
  model: 'Clio V',
  year: 2022,
  mileage: 15000,
  fuelType: 'petrol' as FuelType,
  transmission: 'manual' as TransmissionType,
  power: 90,
  doors: 5,
  seats: 5,
  color: 'Bleu',
  price: 16990,
  minDeposit: null,
  listingType: 'purchase' as ListingType,
  status: 'available' as VehicleStatus,
  description: 'Citadine compacte.',
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('vehicle.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getVehicles', () => {
    it('should return paginated vehicles', async () => {
      vi.mocked(prisma.vehicle.findMany).mockResolvedValue([mockVehicle])
      vi.mocked(prisma.vehicle.count).mockResolvedValue(1)

      const result = await getVehicles({}, 1, 10)

      expect(result.data).toHaveLength(1)
      expect(result.totalItems).toBe(1)
      expect(result.currentPage).toBe(1)
      expect(result.totalPages).toBe(1)
    })

    it('should filter by listingType', async () => {
      vi.mocked(prisma.vehicle.findMany).mockResolvedValue([mockVehicle])
      vi.mocked(prisma.vehicle.count).mockResolvedValue(1)

      await getVehicles({ listingType: 'purchase' }, 1, 10)

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ listingType: 'purchase' }),
        })
      )
    })

    it('should filter by price range', async () => {
      vi.mocked(prisma.vehicle.findMany).mockResolvedValue([])
      vi.mocked(prisma.vehicle.count).mockResolvedValue(0)

      await getVehicles({ minPrice: 10000, maxPrice: 20000 }, 1, 10)

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: { gte: 10000, lte: 20000 },
          }),
        })
      )
    })

    it('should filter by year range', async () => {
      vi.mocked(prisma.vehicle.findMany).mockResolvedValue([])
      vi.mocked(prisma.vehicle.count).mockResolvedValue(0)

      await getVehicles({ minYear: 2020, maxYear: 2023 }, 1, 10)

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            year: { gte: 2020, lte: 2023 },
          }),
        })
      )
    })

    it('should filter by mileage range', async () => {
    vi.mocked(prisma.vehicle.findMany).mockResolvedValue([])
    vi.mocked(prisma.vehicle.count).mockResolvedValue(0)

    await getVehicles({ minMileage: 1000, maxMileage: 50000 }, 1, 10)

    expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
        where: expect.objectContaining({
            mileage: { gte: 1000, lte: 50000 },
        }),
        })
    )
    })

    it('should return empty result when no vehicles match', async () => {
      vi.mocked(prisma.vehicle.findMany).mockResolvedValue([])
      vi.mocked(prisma.vehicle.count).mockResolvedValue(0)

      const result = await getVehicles({ brand: 'Ferrari' }, 1, 10)

      expect(result.data).toHaveLength(0)
      expect(result.totalItems).toBe(0)
      expect(result.totalPages).toBe(0)
    })
  })

  describe('getVehicleById', () => {
    it('should return a vehicle by id', async () => {
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue(mockVehicle)

      const result = await getVehicleById('vehicle-123')

      expect(result).toEqual(mockVehicle)
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: 'vehicle-123' },
      })
    })

    it('should return null if vehicle does not exist', async () => {
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue(null)

      const result = await getVehicleById('unknown-id')

      expect(result).toBeNull()
    })
  })
})