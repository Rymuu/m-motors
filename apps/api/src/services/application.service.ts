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
      documents: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getApplicationById(applicationId: string, userId: string, userRole: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
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
      documents: true,
    },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.userId !== userId && userRole !== 'admin') {
    throw new Error('Unauthorized')
  }

  return application
}