'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Document = {
  id: string
  type: string
  fileUrl: string
  uploadedAt: string
}

type Vehicle = {
  brand: string
  model: string
  year: number
  price: number
  listingType: 'purchase' | 'rental'
}

type Application = {
  id: string
  type: 'purchase' | 'rental'
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  vehicle: Vehicle
  documents: Document[]
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Déposé',
  under_review: "En cours d'étude",
  approved: 'Validé',
  rejected: 'Refusé',
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  under_review: 'bg-[#2563EB]/10 text-[#2563EB]',
  approved: 'bg-[#16A34A]/10 text-[#16A34A]',
  rejected: 'bg-[#DC2626]/10 text-[#DC2626]',
}

const DOC_LABELS: Record<string, string> = {
  id_card: "Pièce d'identité",
  proof_of_address: 'Justificatif de domicile',
  proof_of_income: 'Justificatif de revenus',
  bank_details: 'RIB',
}

const REQUIRED_DOCS = ['id_card', 'proof_of_address', 'proof_of_income', 'bank_details']

function getToken(): string | null {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] ?? null
}

function getUser(): { firstName: string; role: string } | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')))
  } catch {
    return null
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ firstName: string } | null>(null)

  useEffect(() => {
    const token = getToken()
    const currentUser = getUser()

    if (!token || !currentUser) {
      router.push('/login')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement')
        return res.json()
      })
      .then(data => {
        setUser(currentUser)
        setApplications(data)
      })
      .catch(() => setError('Impossible de charger vos dossiers.'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-16 text-center text-[#5B6B82]">
        Chargement de vos dossiers...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-8">
        <p className="text-[#5B6B82] text-sm mb-1">Bonjour,</p>
        <h1 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B]">
          {user?.firstName}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E9F2] p-12 text-center">
          <p className="text-[#5B6B82] mb-4">Vous n&apos;avez pas encore de dossier en cours.</p>
          <Link
            href="/vehicles"
            className="inline-flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] px-6 py-2.5 rounded-full transition-colors no-underline"
          >
            Voir les véhicules
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-[#E4E9F2] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="[font-family:var(--font-sora)] text-lg font-bold text-[#0E2A6B]">
                    {app.vehicle.brand} {app.vehicle.model} {app.vehicle.year}
                  </h2>
                  <p className="text-[#5B6B82] text-sm mt-0.5">
                    {app.type === 'purchase' ? 'Achat' : 'Location LLD-OA'} ·{' '}
                    {app.vehicle.listingType === 'purchase'
                      ? `${app.vehicle.price.toLocaleString('fr-FR')} €`
                      : `${app.vehicle.price.toLocaleString('fr-FR')} €/mois`}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                  {STATUS_LABELS[app.status]}
                </span>
              </div>

              {/* Documents */}
              <div className="border-t border-[#E4E9F2] pt-4">
                <p className="text-[#0B1524] text-sm font-semibold mb-3">
                  Documents ({app.documents?.length ?? 0}/{REQUIRED_DOCS.length})
                </p>
                <ul className="flex flex-col gap-1">
                  {REQUIRED_DOCS.map(docType => {
                    const submitted = app.documents?.find(d => d.type === docType)
                    return (
                      <li key={docType} className="flex items-center gap-2 text-sm">
                        {submitted ? (
                          <span className="text-[#16A34A]">✓</span>
                        ) : (
                          <span className="text-[#5B6B82]">✗</span>
                        )}
                        <span className={submitted ? 'text-[#0B1524]' : 'text-[#5B6B82]'}>
                          {DOC_LABELS[docType]}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <p className="text-[#5B6B82] text-xs mt-4">
                Dossier déposé le{' '}
                {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}