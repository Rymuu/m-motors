export type DocumentType = 'id_card' | 'proof_of_address' | 'proof_of_income' | 'bank_details'

export type ApplicationDocument = {
  id: string
  applicationId: string
  type: DocumentType
  fileUrl: string
  uploadedAt: Date
}