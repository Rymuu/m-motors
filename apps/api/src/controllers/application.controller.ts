import type { Request, Response } from 'express'
import { z } from 'zod'
import { createApplication, getUserApplications } from '../services/application.service.js'

const applicationSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(['purchase', 'rental']),
})

export async function createApplicationController(req: Request, res: Response) {
  try {
    const parsed = applicationSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid data',
        errors: z.flattenError(parsed.error).fieldErrors,
      })
    }

    const application = await createApplication({
      ...parsed.data,
      userId: req.user!.userId,
    })

    res.status(201).json(application)
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({ message: error.message })
    }
    if (error instanceof Error && error.message === 'Vehicle not available') {
      return res.status(409).json({ message: error.message })
    }
    console.error('Create application error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getUserApplicationsController(req: Request, res: Response) {
  try {
    const applications = await getUserApplications(req.user!.userId)
    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}