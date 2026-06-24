import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UserRole, ListingType, VehicleStatus, ApplicationStatus, ApplicationType, FuelType, TransmissionType } from '../generated/prisma/client.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    vehicle: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import { createApplication, getUserApplications, getApplicationById } from '../services/application.service.js'

const mockUser = {
  id: 'user-123',
  firstName: 'Ryme',
  lastName: 'Test',
  email: 'ryme@test.com',
  passwordHash: 'hashed',
  phone: null,
  role: 'client' as UserRole,
  createdAt: new Date(),
  updatedAt: new Date(),
}

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

const mockApplication = {
  id: 'app-123',
  userId: 'user-123',
  vehicleId: 'vehicle-123',
  type: 'purchase' as ApplicationType,
  status: 'submitted' as ApplicationStatus,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('application.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createApplication', () => {
    it('should create an application successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue(mockVehicle)
      vi.mocked(prisma.application.create).mockResolvedValue(mockApplication)

      const result = await createApplication({
        userId: 'user-123',
        vehicleId: 'vehicle-123',
        type: 'purchase',
      })

      expect(result).toHaveProperty('id', 'app-123')
      expect(result).toHaveProperty('status', 'submitted')
    })

    it('should throw if vehicle does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue(null)

      await expect(
        createApplication({ userId: 'user-123', vehicleId: 'unknown', type: 'purchase' })
      ).rejects.toThrow('Vehicle not found')
    })

    it('should throw if vehicle is not available', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue({
        ...mockVehicle,
        status: 'sold' as VehicleStatus,
      })

      await expect(
        createApplication({ userId: 'user-123', vehicleId: 'vehicle-123', type: 'purchase' })
      ).rejects.toThrow('Vehicle not available')
    })

    it('should throw if listing type does not match', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(prisma.vehicle.findUnique).mockResolvedValue({
        ...mockVehicle,
        listingType: 'rental' as ListingType,
      })

      await expect(
        createApplication({ userId: 'user-123', vehicleId: 'vehicle-123', type: 'purchase' })
      ).rejects.toThrow('This vehicle is not available for purchase')
    })

    it('should throw if user is admin', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        role: 'admin' as UserRole,
      })

      await expect(
        createApplication({ userId: 'user-123', vehicleId: 'vehicle-123', type: 'purchase' })
      ).rejects.toThrow('Admin cannot create application')
    })
  })

  describe('getUserApplications', () => {
    it('should return user applications', async () => {
      vi.mocked(prisma.application.findMany).mockResolvedValue([mockApplication])

      const result = await getUserApplications('user-123')

      expect(result).toHaveLength(1)
      expect(prisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
        })
      )
    })

    it('should return empty array if no applications', async () => {
      vi.mocked(prisma.application.findMany).mockResolvedValue([])

      const result = await getUserApplications('user-123')

      expect(result).toHaveLength(0)
    })
  })

  describe('getApplicationById', () => {
    it('should return application for owner', async () => {
      vi.mocked(prisma.application.findUnique).mockResolvedValue({
        ...mockApplication,
        vehicle: mockVehicle,
        documents: [],
      } as any)

      const result = await getApplicationById('app-123', 'user-123', 'client')

      expect(result).toHaveProperty('id', 'app-123')
    })

    it('should return application for admin', async () => {
      vi.mocked(prisma.application.findUnique).mockResolvedValue({
        ...mockApplication,
        vehicle: mockVehicle,
        documents: [],
      } as any)

      const result = await getApplicationById('app-123', 'other-user', 'admin')

      expect(result).toHaveProperty('id', 'app-123')
    })

    it('should throw Unauthorized if user is not owner and not admin', async () => {
      vi.mocked(prisma.application.findUnique).mockResolvedValue({
        ...mockApplication,
        vehicle: mockVehicle,
        documents: [],
      } as any)

      await expect(
        getApplicationById('app-123', 'other-user', 'client')
      ).rejects.toThrow('Unauthorized')
    })

    it('should throw if application not found', async () => {
      vi.mocked(prisma.application.findUnique).mockResolvedValue(null)

      await expect(
        getApplicationById('unknown', 'user-123', 'client')
      ).rejects.toThrow('Application not found')
    })
  })
})