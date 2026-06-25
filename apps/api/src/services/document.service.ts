import { prisma } from '../lib/prisma.js'
import path from 'path'

export async function createDocument(
  applicationId: string,
  userId: string,
  userRole: string,
  type: string,
  file: Express.Multer.File
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.userId !== userId && userRole !== 'admin') {
    throw new Error('Unauthorized')
  }

  const fileUrl = path.join('uploads', applicationId, file.filename).replace(/\\/g, '/')

  return prisma.applicationDocument.create({
    data: {
      applicationId,
      type: type as any,
      fileUrl,
    },
  })
}

export async function getApplicationDocuments(applicationId: string, userId: string, userRole: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.userId !== userId && userRole !== 'admin') {
    throw new Error('Unauthorized')
  }

  return prisma.applicationDocument.findMany({
    where: { applicationId },
  })
}