import type { Request, Response } from 'express'
import { z } from 'zod'
import { registerUser } from '../services/auth.service.js'

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export async function registerController(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid data',
        errors: z.flattenError(parsed.error).fieldErrors,
      })
    }

    const user = await registerUser(parsed.data)
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already in use') {
      return res.status(409).json({ message: error.message })
    }
    console.error('Register error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}