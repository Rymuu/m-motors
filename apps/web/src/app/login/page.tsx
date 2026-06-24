'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoIcon from '@/components/layout/LogoIcon'

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'Email ou mot de passe incorrect.',
  'Email already in use': 'Cette adresse email est déjà utilisée.',
  'Invalid data': 'Veuillez vérifier les informations saisies.',
}

function getFrenchError(message: string): string {
  return ERROR_MESSAGES[message] ?? 'Une erreur est survenue. Réessayez.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(getFrenchError(data.message))
        return
      }

      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`
      document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${7 * 24 * 60 * 60}`

      if (data.user.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <LogoIcon size={24} />
            </span>
            <span className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-xl tracking-tight">
              M-MOTORS
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E4E9F2] p-8">
          <h1 className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0E2A6B] mb-1">
            Connexion
          </h1>
          <p className="text-[#5B6B82] text-sm mb-6">
            Accédez à votre espace client M-Motors.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0B1524] text-sm font-semibold">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#0B1524] text-sm font-semibold">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-[15px] py-3 rounded-full transition-colors mt-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5B6B82] mt-6">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#2563EB] font-semibold no-underline hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}