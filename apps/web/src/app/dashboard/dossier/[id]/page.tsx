'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

type Document = {
  id: string
  type: string
  fileUrl: string
  uploadedAt: string
}

type Application = {
  id: string
  type: 'purchase' | 'rental'
  status: string
  vehicle: {
    brand: string
    model: string
    year: number
  }
  documents: Document[]
}

const REQUIRED_DOCS = [
  { type: 'id_card', label: "Pièce d'identité" },
  { type: 'proof_of_address', label: 'Justificatif de domicile' },
  { type: 'proof_of_income', label: 'Justificatif de revenus' },
  { type: 'bank_details', label: 'RIB' },
]

function getToken(): string | null {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] ?? null
}

export default function DossierPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [pendingReplace, setPendingReplace] = useState<{
    docType: string
    label: string
    file: File
  } | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setApplication(data))
      .catch(() => {
        toast.error('Impossible de charger le dossier.')
        router.push('/dashboard')
      })
      .finally(() => setLoading(false))
  }, [applicationId, router])

  async function uploadDocument(docType: string, file: File) {
    const token = getToken()
    if (!token) return

    setUploading(docType)
    const toastId = toast.loading('Upload en cours...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', docType)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/documents`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      )

      if (!res.ok) throw new Error()

      const newDoc = await res.json()

      setApplication(prev =>
        prev
          ? {
              ...prev,
              documents: [
                ...prev.documents.filter(d => d.type !== docType),
                newDoc,
              ],
            }
          : prev
      )

      toast.success('Document déposé avec succès.', { id: toastId })
    } catch {
      toast.error("Erreur lors de l'upload. Réessayez.", { id: toastId })
    } finally {
      setUploading(null)
    }
  }

  function handleFileChange(docType: string, label: string, file: File, isReplace: boolean) {
    if (isReplace) {
      // Demander confirmation avant de remplacer
      setPendingReplace({ docType, label, file })
    } else {
      uploadDocument(docType, file)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-16 text-center text-[#5B6B82]">
        Chargement du dossier...
      </div>
    )
  }

  if (!application) return null

  const submittedCount = application.documents.length
  const isFinal = ['approved', 'rejected'].includes(application.status)

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* Modal confirmation remplacement */}
      {pendingReplace && (
        <ConfirmModal
          message={`Remplacer votre "${pendingReplace.label}" par un nouveau fichier ? L'ancien document sera écrasé.`}
          confirmLabel="Remplacer"
          confirmVariant="info"
          onConfirm={() => {
            uploadDocument(pendingReplace.docType, pendingReplace.file)
            setPendingReplace(null)
          }}
          onCancel={() => setPendingReplace(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="text-[#5B6B82] text-sm mb-1">Mon dossier</p>
        <h1 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B]">
          {application.vehicle.brand} {application.vehicle.model} {application.vehicle.year}
        </h1>
        <p className="text-[#5B6B82] text-sm mt-1">
          {application.type === 'purchase' ? 'Achat' : 'Location LLD-OA'} ·{' '}
          {submittedCount}/{REQUIRED_DOCS.length} documents déposés
        </p>
        {isFinal && (
          <div className={`mt-3 inline-flex items-center text-sm font-semibold px-4 py-2 rounded-full ${
            application.status === 'approved'
              ? 'bg-[#16A34A]/10 text-[#16A34A]'
              : 'bg-[#DC2626]/10 text-[#DC2626]'
          }`}>
            {application.status === 'approved'
              ? '✓ Dossier validé — aucune modification possible'
              : '✗ Dossier refusé — aucune modification possible'}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!isFinal && (
        <div className="bg-[#E4E9F2] rounded-full h-2 mb-8">
          <div
            className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(submittedCount / REQUIRED_DOCS.length) * 100}%` }}
          />
        </div>
      )}

      {/* Documents */}
      <div className="flex flex-col gap-4">
        {REQUIRED_DOCS.map(({ type, label }) => {
          const submitted = application.documents.find(d => d.type === type)
          const isUploading = uploading === type

          return (
            <div
              key={type}
              className={`bg-white rounded-2xl border p-5 flex items-center justify-between gap-4 ${
                submitted ? 'border-[#16A34A]/30' : 'border-[#E4E9F2]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  submitted
                    ? 'bg-[#16A34A]/10 text-[#16A34A]'
                    : 'bg-[#F5F8FD] text-[#5B6B82]'
                }`}>
                  {submitted ? '✓' : '✗'}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${submitted ? 'text-[#0B1524]' : 'text-[#5B6B82]'}`}>
                    {label}
                  </p>
                  {submitted && (
                    <p className="text-[#5B6B82] text-xs mt-0.5">
                      Déposé le{' '}
                      {new Date(submitted.uploadedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              {!isFinal && (
                <label className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors ${
                  submitted
                    ? 'border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB]'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploading ? 'Upload...' : submitted ? 'Remplacer' : 'Déposer'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    disabled={isUploading}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleFileChange(type, label, file, !!submitted)
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm font-semibold text-[#5B6B82] hover:text-[#0B1524] transition-colors"
        >
          ← Retour au tableau de bord
        </button>
        {submittedCount === REQUIRED_DOCS.length && !isFinal && (
          <div className="bg-[#16A34A]/10 text-[#16A34A] text-sm font-semibold px-4 py-2 rounded-full">
            ✓ Dossier complet
          </div>
        )}
      </div>
    </div>
  )
}