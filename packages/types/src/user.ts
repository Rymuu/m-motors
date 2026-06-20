export type UserRole = 'client' | 'admin'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  phone?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}