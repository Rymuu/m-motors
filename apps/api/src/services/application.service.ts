import { prisma } from '../lib/prisma.js'

type CreateApplicationInput = {
  userId: string
  vehicleId: string
  type: 'purchase' | 'rental'
}

export async function createApplication(data: CreateApplicationInput) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: data.vehicleId },
  })

  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  if (vehicle.status !== 'available') {
    throw new Error('Vehicle not available')
  }

  if (vehicle.listingType !== data.type) {
    throw new Error(`This vehicle is not available for ${data.type}`)
  }

  const application = await prisma.application.create({
    data: {
      userId: data.userId,
      vehicleId: data.vehicleId,
      type: data.type,
      status: 'submitted',
    },
  })

  return application
}

export async function getUserApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: {
      vehicle: {
        select: {
          brand: true,
          model: true,
          year: true,
          price: true,
          listingType: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}