import { fetchVehicles } from '@/lib/api'
import type { Vehicle } from '@m-motors/types'

export default async function VehiclesPage() {
  const result = await fetchVehicles()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nos véhicules</h1>
      <p className="text-gray-600 mb-4">{result.totalItems} véhicules disponibles</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.data.map((vehicle: Vehicle) => (
          <div key={vehicle.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{vehicle.brand} {vehicle.model}</h2>
            <p className="text-gray-500">{vehicle.year} · {vehicle.mileage.toLocaleString('fr-FR')} km</p>
            <p className="text-lg font-bold mt-2">{vehicle.price.toLocaleString('fr-FR')} €</p>
            <p className="text-sm text-gray-400 mt-1">{vehicle.fuelType} · {vehicle.transmission}</p>
          </div>
        ))}
      </div>
    </div>
  )
}