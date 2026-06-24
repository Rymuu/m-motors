import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import type { UserRole } from '../generated/prisma/client.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock.jwt.token'),
  },
}))

import { prisma } from '../lib/prisma.js'
import { registerUser, loginUser } from '../services/auth.service.js'

const mockUser = {
  id: 'user-123',
  firstName: 'Ryme',
  lastName: 'Test',
  email: 'ryme@test.com',
  passwordHash: 'hashed_password',
  phone: null,
  role: 'client' as UserRole,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerUser', () => {
    it('should create a user and return it without passwordHash', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as never)
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

      const result = await registerUser({
        firstName: 'Ryme',
        lastName: 'Test',
        email: 'ryme@test.com',
        password: 'password123',
      })

      expect(result).not.toHaveProperty('passwordHash')
      expect(result).toHaveProperty('email', 'ryme@test.com')
      expect(prisma.user.create).toHaveBeenCalledOnce()
    })

    it('should throw if email is already in use', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      await expect(
        registerUser({
          firstName: 'Ryme',
          lastName: 'Test',
          email: 'ryme@test.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already in use')
    })
  })

  describe('loginUser', () => {
    it('should return token and user without passwordHash on valid credentials', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await loginUser('ryme@test.com', 'password123')

      expect(result).toHaveProperty('token', 'mock.jwt.token')
      expect(result.user).not.toHaveProperty('passwordHash')
      expect(result.user).toHaveProperty('email', 'ryme@test.com')
    })

    it('should throw if user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      await expect(loginUser('unknown@test.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      )
    })

    it('should throw if password is wrong', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      await expect(loginUser('ryme@test.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })
})