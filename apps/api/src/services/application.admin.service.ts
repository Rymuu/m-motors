import { prisma } from '../lib/prisma.js'

export async function getAllApplications(page: number, limit: number) {
  const skip = (page - 1) * limit

  const [data, totalItems] = await Promise.all([
    prisma.application.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            brand: true,
            model: true,
            year: true,
            price: true,
            listingType: true,
          },
        },
        documents: true,
      },
    }),
    prisma.application.count(),
  ])

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    limit,
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: { status },
  })
}