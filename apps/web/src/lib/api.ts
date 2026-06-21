const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function fetchVehicles(searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  const res = await fetch(`${API_URL}/vehicles?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch vehicles')
  }

  return res.json()
}