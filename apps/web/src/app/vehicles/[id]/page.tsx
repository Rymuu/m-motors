import { fetchVehicleById } from '@/lib/api'
import type { Vehicle } from '@m-motors/types'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params
  const vehicle: Vehicle | null = await fetchVehicleById(id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h1>
      <p className="text-gray-500 mb-6">{vehicle.year} · {vehicle.mileage.toLocaleString('fr-FR')} km · {vehicle.fuelType} · {vehicle.transmission}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-3xl font-bold text-blue-600 mb-4">{vehicle.price.toLocaleString('fr-FR')} €</p>
          {vehicle.listingType === 'rental' && vehicle.minDeposit && (
            <p className="text-gray-600">Apport minimum : {vehicle.minDeposit.toLocaleString('fr-FR')} €</p>
          )}
          <p className="mt-4 text-gray-700">{vehicle.description}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-semibold">Carburant :</span> {vehicle.fuelType}</p>
          <p><span className="font-semibold">Transmission :</span> {vehicle.transmission}</p>
          <p><span className="font-semibold">Puissance :</span> {vehicle.power} ch</p>
          <p><span className="font-semibold">Portes :</span> {vehicle.doors}</p>
          <p><span className="font-semibold">Places :</span> {vehicle.seats}</p>
          <p><span className="font-semibold">Couleur :</span> {vehicle.color}</p>
          <p><span className="font-semibold">Type :</span> {vehicle.listingType === 'purchase' ? 'Achat' : 'Location'}</p>
        </div>
      </div>
    </div>
  )
}