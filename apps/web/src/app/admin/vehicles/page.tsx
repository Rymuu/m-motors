'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: string
  price: number
  listingType: 'purchase' | 'rental'
  status: 'available' | 'reserved' | 'sold' | 'rented' | 'maintenance'
  color: string
}

type ConfirmState = {
  vehicleId: string
  action: 'listing-type' | 'status'
  value: string
  message: string
  confirmLabel: string
  confirmVariant: 'success' | 'danger' | 'info'
}

// Pour l'affichage des badges (garde tout)
const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
  rented: 'Loué',
  maintenance: 'Maintenance',
}

// Pour le select admin (seulement ce que l'admin peut choisir manuellement)
const ADMIN_STATUS_OPTIONS: Record<string, string> = {
  available: 'Disponible',
  sold: 'Vendu',
  maintenance: 'Maintenance',
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-[#16A34A]/10 text-[#16A34A]',
  reserved: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  sold: 'bg-[#5B6B82]/10 text-[#5B6B82]',
  rented: 'bg-[#2563EB]/10 text-[#2563EB]',
  maintenance: 'bg-[#DC2626]/10 text-[#DC2626]',
}

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
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

export default function AdminVehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setVehicles(data.data))
      .catch(() => toast.error('Impossible de charger les véhicules.'))
      .finally(() => setLoading(false))
  }, [router])

  async function confirmAction() {
    if (!confirm) return
    const token = getToken()
    if (!token) return

    const { vehicleId, action, value } = confirm
    setConfirm(null)
    setUpdating(vehicleId)

    const toastId = toast.loading('Mise à jour en cours...')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicles/${vehicleId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            action === 'listing-type'
              ? { listingType: value }
              : { status: value }
          ),
        }
      )

      if (!res.ok) throw new Error()

      const updated = await res.json()
      setVehicles(prev =>
        prev.map(v => v.id === vehicleId ? { ...v, ...updated } : v)
      )

      toast.success('Véhicule mis à jour.', { id: toastId })
    } catch {
      toast.error('Erreur lors de la mise à jour.', { id: toastId })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-16 text-center text-[#5B6B82]">
        Chargement des véhicules...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
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
            Gestion des véhicules
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-[15px] px-6 py-2.5 rounded-full transition-colors no-underline"
          >
            ← Dossiers
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E9F2] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E9F2]">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#5B6B82] uppercase tracking-wider">Véhicule</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#5B6B82] uppercase tracking-wider">Prix</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#5B6B82] uppercase tracking-wider">Statut</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#5B6B82] uppercase tracking-wider">Canal</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#5B6B82] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={`border-b border-[#E4E9F2] last:border-0 ${index % 2 === 0 ? '' : 'bg-[#F5F8FD]/50'}`}
              >
                <td className="px-6 py-4">
                  <p className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-sm">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-[#5B6B82] text-xs mt-0.5">
                    {vehicle.year} · {vehicle.mileage.toLocaleString('fr-FR')} km · {FUEL_LABELS[vehicle.fuelType] ?? vehicle.fuelType} · {vehicle.color}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="[font-family:var(--font-sora)] font-bold text-[#2563EB] text-sm">
                    {vehicle.price.toLocaleString('fr-FR')} €
                    {vehicle.listingType === 'rental' && <span className="text-xs font-normal text-[#5B6B82]">/mois</span>}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[vehicle.status]}`}>
                    {STATUS_LABELS[vehicle.status]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    vehicle.listingType === 'purchase'
                      ? 'bg-[#0E2A6B]/10 text-[#0E2A6B]'
                      : 'bg-[#2563EB]/10 text-[#2563EB]'
                  }`}>
                    {vehicle.listingType === 'purchase' ? 'Achat' : 'LLD-OA'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Basculer achat ↔ location */}
                    <button
                      onClick={() => setConfirm({
                        vehicleId: vehicle.id,
                        action: 'listing-type',
                        value: vehicle.listingType === 'purchase' ? 'rental' : 'purchase',
                        confirmLabel: 'Confirmer',
                        confirmVariant: 'info',
                        message: `Basculer "${vehicle.brand} ${vehicle.model}" en ${vehicle.listingType === 'purchase' ? 'location LLD-OA' : 'vente'} ?`,
                      })}
                      disabled={updating === vehicle.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
                    >
                      {vehicle.listingType === 'purchase' ? '→ Location' : '→ Vente'}
                    </button>

                    {/* Changer statut */}
                    <select
                      value={vehicle.status}
                      disabled={updating === vehicle.id}
                      onChange={e => setConfirm({
                        vehicleId: vehicle.id,
                        action: 'status',
                        value: e.target.value,
                        confirmLabel: 'Confirmer',
                        confirmVariant: 'info',
                        message: `Changer le statut de "${vehicle.brand} ${vehicle.model}" en "${STATUS_LABELS[e.target.value]}" ?`,
                      })}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E4E9F2] text-[#5B6B82] outline-none focus:border-[#2563EB] transition-colors bg-white disabled:opacity-40 cursor-pointer"
                    >
                      {Object.entries(ADMIN_STATUS_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}