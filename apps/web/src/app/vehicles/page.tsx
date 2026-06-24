import Link from 'next/link'
import { fetchVehicles } from '@/lib/api'
import type { Vehicle } from '@m-motors/types'

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
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const listingType = params.listingType
  const result = await fetchVehicles(params as Record<string, string>)

  const isRental = listingType === 'rental'

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/vehicles?listingType=purchase"
            className={`text-sm font-bold px-5 py-2 rounded-full transition-colors no-underline ${
              !isRental
                ? 'bg-[#0E2A6B] text-white'
                : 'bg-white border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            Acheter
          </Link>
          <Link
            href="/vehicles?listingType=rental"
            className={`text-sm font-bold px-5 py-2 rounded-full transition-colors no-underline ${
              isRental
                ? 'bg-[#0E2A6B] text-white'
                : 'bg-white border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            Louer en LLD-OA
          </Link>
        </div>
        <h1 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B] mt-4">
          {isRental ? 'Location longue durée (LLD-OA)' : 'Véhicules à vendre'}
        </h1>
        <p className="text-[#5B6B82] mt-1">{result.totalItems} véhicules disponibles</p>
      </div>

      {/* Grid */}
      {result.data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E9F2] p-12 text-center">
          <p className="text-[#5B6B82]">Aucun véhicule disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.data.map((vehicle: Vehicle) => (
            <Link
              key={vehicle.id}
              href={`/vehicles/${vehicle.id}`}
              className="bg-white rounded-2xl border border-[#E4E9F2] overflow-hidden hover:shadow-md transition-shadow no-underline"
            >
              {/* Image */}
              <div className="relative h-48 bg-[#EEF3FF] overflow-hidden">
                <img
                  src={
                    vehicle.images?.[0] ??
                      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                  vehicle.listingType === 'purchase'
                    ? 'bg-[#0E2A6B] text-white'
                    : 'bg-[#2563EB] text-white'
                }`}>
                  {vehicle.listingType === 'purchase' ? 'ACHAT' : 'LLD-OA'}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-lg">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-[#5B6B82] text-sm mt-0.5">
                  {vehicle.year} · {vehicle.mileage.toLocaleString('fr-FR')} km · {FUEL_LABELS[vehicle.fuelType] ?? vehicle.fuelType}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="[font-family:var(--font-sora)] font-bold text-[#2563EB] text-xl">
                    {vehicle.price.toLocaleString('fr-FR')} €
                    {vehicle.listingType === 'rental' && (
                      <span className="text-sm font-normal text-[#5B6B82]">/mois</span>
                    )}
                  </p>
                  <span className="text-xs text-[#5B6B82]">
                    {TRANSMISSION_LABELS[vehicle.transmission] ?? vehicle.transmission}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(page => (
            <Link
              key={page}
              href={`/vehicles?${new URLSearchParams({ ...params, page: String(page) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold no-underline transition-colors ${
                String(params.page ?? '1') === String(page)
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}