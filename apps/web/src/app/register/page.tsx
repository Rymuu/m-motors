'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoIcon from '@/components/layout/LogoIcon'

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Une erreur est survenue.')
        return
      }

      // Rediriger vers login après inscription réussie
      window.location.href = '/login?registered=true'
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E4E9F2] p-8">
          <h1 className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0E2A6B] mb-1">
            Créer un compte
          </h1>
          <p className="text-[#5B6B82] text-sm mb-6">
            Rejoignez M-Motors pour accéder à nos services.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#0B1524] text-sm font-semibold">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                  className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[#0B1524] text-sm font-semibold">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                  className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#0B1524] text-sm font-semibold">Adresse email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                required
                className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#0B1524] text-sm font-semibold">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8 caractères minimum"
                required
                className="w-full border border-[#E4E9F2] rounded-lg px-4 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#0B1524] text-sm font-semibold">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
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
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5B6B82] mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#2563EB] font-semibold no-underline hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}