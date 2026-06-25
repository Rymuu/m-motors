import type { Request, Response } from 'express'
import { z } from 'zod'
import { createDocument, getApplicationDocuments } from '../services/document.service.js'

const documentSchema = z.object({
  type: z.enum(['id_card', 'proof_of_address', 'proof_of_income', 'bank_details']),
})

export async function uploadDocumentController(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const parsed = documentSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid data',
        errors: z.flattenError(parsed.error).fieldErrors,
      })
    }

    const document = await createDocument(
      applicationId,
      req.user!.userId,
      req.user!.role,
      parsed.data.type,
      req.file
    )

    res.status(201).json(document)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return res.status(403).json({ message: error.message })
    }
    if (error instanceof Error && error.message === 'Application not found') {
      return res.status(404).json({ message: error.message })
    }
    console.error('Upload document error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getDocumentsController(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string
    const documents = await getApplicationDocuments(
      applicationId,
      req.user!.userId,
      req.user!.role
    )
    res.json(documents)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return res.status(403).json({ message: error.message })
    }
    if (error instanceof Error && error.message === 'Application not found') {
      return res.status(404).json({ message: error.message })
    }
    console.error('Get documents error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}