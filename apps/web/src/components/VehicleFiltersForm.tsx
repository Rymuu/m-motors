'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const BRANDS = ['Renault', 'Peugeot', 'Citroën', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Ford', 'Opel']

const FUEL_OPTIONS = [
  { value: 'petrol', label: 'Essence' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Électrique' },
  { value: 'hybrid', label: 'Hybride' },
]

const TRANSMISSION_OPTIONS = [
  { value: 'manual', label: 'Manuelle' },
  { value: 'automatic', label: 'Automatique' },
]

const inputClass = "w-full border border-[#E4E9F2] rounded-lg px-3 py-2.5 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-colors bg-white"

export default function VehicleFiltersForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const queryParams = new URLSearchParams()

    const currentListingType = searchParams.get('listingType')
    if (currentListingType) queryParams.set('listingType', currentListingType)

    const fields = ['brand', 'minPrice', 'maxPrice', 'fuelType', 'transmission']
    fields.forEach(field => {
      const value = formData.get(field) as string
      if (value) queryParams.set(field, value)
    })

    router.push(`/vehicles?${queryParams.toString()}`)
  }

  function handleReset() {
    const currentListingType = searchParams.get('listingType')
    router.push(currentListingType ? `/vehicles?listingType=${currentListingType}` : '/vehicles')
  }

  const hasFilters = ['brand', 'minPrice', 'maxPrice', 'fuelType', 'transmission']
    .some(f => searchParams.get(f))

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E4E9F2] p-5 sticky top-24">
      <h3 className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] mb-4">Filtres</h3>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0B1524] text-xs font-semibold">Marque</label>
          <select name="brand" defaultValue={searchParams.get('brand') || ''} className={inputClass}>
            <option value="">Toutes les marques</option>
            {BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#0B1524] text-xs font-semibold">Carburant</label>
          <select name="fuelType" defaultValue={searchParams.get('fuelType') || ''} className={inputClass}>
            <option value="">Tout carburant</option>
            {FUEL_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#0B1524] text-xs font-semibold">Transmission</label>
          <select name="transmission" defaultValue={searchParams.get('transmission') || ''} className={inputClass}>
            <option value="">Toute transmission</option>
            {TRANSMISSION_OPTIONS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#0B1524] text-xs font-semibold">Prix minimum (€)</label>
          <input
            type="number"
            name="minPrice"
            placeholder="0"
            defaultValue={searchParams.get('minPrice') || ''}
            min={0}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#0B1524] text-xs font-semibold">Prix maximum (€)</label>
          <input
            type="number"
            name="maxPrice"
            placeholder="100 000"
            defaultValue={searchParams.get('maxPrice') || ''}
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors"
        >
          Rechercher
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full text-sm font-semibold text-[#5B6B82] hover:text-[#0B1524] transition-colors py-1"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </form>
  )
}