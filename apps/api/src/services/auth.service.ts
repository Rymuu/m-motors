import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'

type RegisterInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('Email already in use')
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      phone: data.phone,
      role: 'client',
    },
  })

  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}