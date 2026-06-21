'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function VehicleFiltersForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const queryParams = new URLSearchParams()

    const fields = ['listingType', 'brand', 'minPrice', 'maxPrice']
    fields.forEach((field) => {
      const value = formData.get(field) as string
      if (value) {
        queryParams.set(field, value)
      }
    })

    router.push(`/vehicles?${queryParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-8 p-4 border rounded-lg">
      <select
        name="listingType"
        defaultValue={searchParams.get('listingType') || ''}
        className="border rounded px-3 py-2"
      >
        <option value="">Achat ou location</option>
        <option value="purchase">Achat</option>
        <option value="rental">Location</option>
      </select>

      <input
        type="text"
        name="brand"
        placeholder="Marque"
        defaultValue={searchParams.get('brand') || ''}
        className="border rounded px-3 py-2"
      />

      <input
        type="number"
        name="minPrice"
        placeholder="Prix min"
        defaultValue={searchParams.get('minPrice') || ''}
        className="border rounded px-3 py-2 w-32"
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Prix max"
        defaultValue={searchParams.get('maxPrice') || ''}
        className="border rounded px-3 py-2 w-32"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Rechercher
      </button>
    </form>
  )
}