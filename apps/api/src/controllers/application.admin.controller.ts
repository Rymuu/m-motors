import type { Request, Response } from 'express'
import { getAllApplications, updateApplicationStatus } from '../services/application.admin.service.js'

export async function getAllApplicationsController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const result = await getAllApplications(page, limit)
    res.json(result)
  } catch (error) {
    console.error('Get all applications error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateApplicationStatusController(req: Request, res: Response) {
  try {
    const applicationId = req.params.id as string
    const { status } = req.body

    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const application = await updateApplicationStatus(applicationId, status)
    res.json(application)
  } catch (error) {
    if (error instanceof Error && error.message === 'Incomplete documents') {
      return res
        .status(400)
        .json({ message: 'Le dossier est incomplet — 4 documents requis avant validation.' })
    }

    if (error instanceof Error && error.message === 'Application not found') {
      return res.status(404).json({ message: error.message })
    }

    console.error('Update application status error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}