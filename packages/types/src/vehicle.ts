export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid'
export type TransmissionType = 'manual' | 'automatic'
export type ListingType = 'purchase' | 'rental'
export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'maintenance'

export type Vehicle = {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: FuelType
  transmission: TransmissionType
  power: number
  doors: number
  seats: number
  color: string
  price: number
  minDeposit?: number | null
  maxDeposit?: number | null
  listingType: ListingType
  status: VehicleStatus
  description: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}