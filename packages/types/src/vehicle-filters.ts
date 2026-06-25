import type { ListingType, FuelType, TransmissionType } from './vehicle.js'

export type VehicleFilters = {
  listingType?: ListingType
  brand?: string
  fuelType?: FuelType
  transmission?: TransmissionType
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  minMileage?: number
  maxMileage?: number
  color?: string
  power?: number
  seats?: number
  doors?: number
}