import type { ApplicationDocument } from './document.js'

export type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected'
export type ApplicationType = 'purchase' | 'rental'

export type Application = {
  id: string
  userId: string
  vehicleId: string
  type: ApplicationType
  status: ApplicationStatus
  documents: ApplicationDocument[]
  createdAt: Date
  updatedAt: Date
}