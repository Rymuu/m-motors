'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

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

type User = {
  firstName: string
  lastName: string
  email: string
}

type Application = {
  id: string
  type: 'purchase' | 'rental'
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  user: User
  vehicle: Vehicle
  documents: Document[]
}

type ConfirmState = {
  applicationId: string
  action: 'approved' | 'rejected' | 'under_review'
  confirmLabel: string
  confirmVariant: 'success' | 'danger' | 'info'
  message: string
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

const FINAL_STATUSES = ['approved', 'rejected']
const REQUIRED_DOCS = ['id_card', 'proof_of_address', 'proof_of_income', 'bank_details']

export default function AdminPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  useEffect(() => {
    const token = getToken()
    const user = getUser()

    if (!token || !user) {
      router.push('/login')
      return
    }

    if (user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setApplications(data.data))
      .catch(() => toast.error('Impossible de charger les dossiers.'))
      .finally(() => setLoading(false))
  }, [router])

  function askConfirm(state: ConfirmState) {
    setConfirm(state)
  }

  async function confirmAction() {
    if (!confirm) return
    const token = getToken()
    if (!token) return

    const { applicationId, action } = confirm
    setConfirm(null)
    setUpdating(applicationId)

    const toastId = toast.loading('Mise à jour en cours...')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: action }),
        }
      )

      if (!res.ok) throw new Error()

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: action } : app
        )
      )

      if (action === 'approved') {
        toast.success('Dossier validé.', { id: toastId })
      } else if (action === 'rejected') {
        toast('Dossier refusé.', { id: toastId, icon: '🚫' })
      } else {
        toast.success("Dossier passé en cours d'étude.", { id: toastId })
      }
    } catch {
      toast.error('Erreur lors de la mise à jour.', { id: toastId })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-16 text-center text-[#5B6B82]">
        Chargement des dossiers...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          confirmVariant={confirm.confirmVariant}
          onConfirm={confirmAction}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#5B6B82] text-sm mb-1">Back-office</p>
          <h1 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B]">
            Dossiers clients
          </h1>
        </div>
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center bg-[#0E2A6B] hover:bg-[#0a1f50] text-white font-bold text-[15px] px-6 py-2.5 rounded-full transition-colors no-underline"
        >
          Gérer les véhicules
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E9F2] p-12 text-center">
          <p className="text-[#5B6B82]">Aucun dossier pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-[#E4E9F2] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="[font-family:var(--font-sora)] text-lg font-bold text-[#0E2A6B]">
                    {app.user.firstName} {app.user.lastName}
                  </h2>
                  <p className="text-[#5B6B82] text-sm">{app.user.email}</p>
                  <p className="text-[#0B1524] text-sm mt-1 font-medium">
                    {app.vehicle.brand} {app.vehicle.model} {app.vehicle.year} ·{' '}
                    {app.type === 'purchase' ? 'Achat' : 'Location'}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                  {STATUS_LABELS[app.status]}
                </span>
              </div>

              {/* Documents */}
            <div className="border-t border-[#E4E9F2] pt-4 mb-4">
                <p className="text-[#0B1524] text-sm font-semibold mb-2">
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

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-[#E4E9F2] pt-4">
                {FINAL_STATUSES.includes(app.status) ? (
                  <p className="text-[#5B6B82] text-sm italic">
                    Dossier {STATUS_LABELS[app.status].toLowerCase()} — aucune modification possible.
                  </p>
                ) : (
                  <>
                    <button
                      onClick={() => askConfirm({
                        applicationId: app.id,
                        action: 'under_review',
                        confirmLabel: "Confirmer",
                        confirmVariant: 'info',
                        message: `Passer le dossier de ${app.user.firstName} ${app.user.lastName} en cours d'étude ?`,
                      })}
                      disabled={app.status === 'under_review' || updating === app.id}
                      className="text-sm font-semibold px-4 py-2 rounded-full border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      En cours d&apos;étude
                    </button>
                    <button
                      onClick={() => askConfirm({
                        applicationId: app.id,
                        action: 'approved',
                        confirmLabel: 'Valider',
                        confirmVariant: 'success',
                        message: `Valider le dossier de ${app.user.firstName} ${app.user.lastName} pour le ${app.vehicle.brand} ${app.vehicle.model} ? Cette action est définitive.`,
                      })}
                      disabled={updating === app.id}
                      className="text-sm font-semibold px-4 py-2 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => askConfirm({
                        applicationId: app.id,
                        action: 'rejected',
                        confirmLabel: 'Refuser',
                        confirmVariant: 'danger',
                        message: `Refuser le dossier de ${app.user.firstName} ${app.user.lastName} ? Cette action est définitive.`,
                      })}
                      disabled={updating === app.id}
                      className="text-sm font-semibold px-4 py-2 rounded-full border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Refuser
                    </button>
                  </>
                )}
                <span className="text-[#5B6B82] text-xs ml-auto">
                  Déposé le{' '}
                  {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}