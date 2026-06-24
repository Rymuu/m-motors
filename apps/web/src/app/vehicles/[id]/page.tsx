import { fetchVehicleById } from '@/lib/api'
import type { Vehicle } from '@m-motors/types'
import { notFound } from 'next/navigation'
import ApplyButton from '@/components/ApplyButton'
import Link from 'next/link'

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'Manuelle',
  automatic: 'Automatique',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params
  const vehicle: Vehicle | null = await fetchVehicleById(id)

  if (!vehicle) notFound()

  const image = vehicle.images?.[0] ??
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#5B6B82] mb-6">
        <Link href="/vehicles" className="hover:text-[#2563EB] no-underline transition-colors">
          Véhicules
        </Link>
        <span>›</span>
        <span className="text-[#0B1524]">{vehicle.brand} {vehicle.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-[#EEF3FF] h-72 lg:h-96">
            <img
              src={image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-[#E4E9F2] p-5 mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Carburant', value: FUEL_LABELS[vehicle.fuelType] ?? vehicle.fuelType },
              { label: 'Transmission', value: TRANSMISSION_LABELS[vehicle.transmission] ?? vehicle.transmission },
              { label: 'Puissance', value: `${vehicle.power} ch` },
              { label: 'Kilométrage', value: `${vehicle.mileage.toLocaleString('fr-FR')} km` },
              { label: 'Portes', value: String(vehicle.doors) },
              { label: 'Places', value: String(vehicle.seats) },
              { label: 'Couleur', value: vehicle.color },
              { label: 'Année', value: String(vehicle.year) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[#5B6B82] text-xs">{label}</p>
                <p className="text-[#0B1524] font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            vehicle.listingType === 'purchase'
              ? 'bg-[#0E2A6B] text-white'
              : 'bg-[#2563EB] text-white'
          }`}>
            {vehicle.listingType === 'purchase' ? 'ACHAT' : 'LLD-OA'}
          </span>

          <h1 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B] mt-3 mb-1">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-[#5B6B82] text-sm mb-6">
            {vehicle.year} · {vehicle.mileage.toLocaleString('fr-FR')} km · {FUEL_LABELS[vehicle.fuelType] ?? vehicle.fuelType}
          </p>

          <div className="bg-white rounded-2xl border border-[#E4E9F2] p-6 mb-6">
            <p className="text-[#5B6B82] text-sm mb-1">
              {vehicle.listingType === 'purchase' ? 'Prix de vente' : 'Mensualité estimée'}
            </p>
            <p className="[font-family:var(--font-sora)] text-4xl font-bold text-[#2563EB]">
              {vehicle.price.toLocaleString('fr-FR')} €
              {vehicle.listingType === 'rental' && (
                <span className="text-lg font-normal text-[#5B6B82]">/mois</span>
              )}
            </p>
            {vehicle.listingType === 'rental' && vehicle.minDeposit && (
              <p className="text-[#5B6B82] text-sm mt-1">
                Apport minimum : {vehicle.minDeposit.toLocaleString('fr-FR')} €
              </p>
            )}
          </div>

          <p className="text-[#5B6B82] text-sm leading-relaxed mb-8">
            {vehicle.description}
          </p>

          <ApplyButton vehicleId={vehicle.id} listingType={vehicle.listingType} />
          <p className="text-[#5B6B82] text-xs text-center mt-3">
            Connexion requise pour déposer un dossier
          </p>
        </div>
      </div>
    </div>
  )
}