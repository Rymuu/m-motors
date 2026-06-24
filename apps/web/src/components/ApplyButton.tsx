'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Props = {
  vehicleId: string
  listingType: 'purchase' | 'rental'
}

function getToken(): string | null {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] ?? null
}

export default function ApplyButton({ vehicleId, listingType }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleApply() {
    const token = getToken()

    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Création du dossier...')

    try {
      // Vérifier si un dossier existe déjà pour ce véhicule
      const existingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!existingRes.ok) throw new Error()

      const existing = await existingRes.json()
      const alreadyApplied = existing.find(
        (app: { id: string; vehicleId: string }) => app.vehicleId === vehicleId
      )

      if (alreadyApplied) {
        toast('Vous avez déjà un dossier pour ce véhicule.', {
          id: toastId,
          icon: 'ℹ️',
        })
        router.push(`/dashboard/dossier/${alreadyApplied.id}`)
        return
      }

      // Créer le dossier
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vehicleId, type: listingType }),
        }
      )

      if (!res.ok) throw new Error()

      const data = await res.json()
      toast.success('Dossier créé ! Déposez vos documents.', { id: toastId })
      router.push(`/dashboard/dossier/${data.id}`)
    } catch {
      toast.error('Une erreur est survenue. Réessayez.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-[15px] px-6 py-3.5 rounded-full transition-colors cursor-pointer"
    >
      {loading ? 'Création du dossier...' : 'Déposer mon dossier'}
    </button>
  )
}