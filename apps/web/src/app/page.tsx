import Link from 'next/link'
import SearchIcon from '@/components/icons/SearchIcon'
import FileIcon from '@/components/icons/FileIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
}

async function getFeaturedVehicles() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicles?limit=3`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const vehicles = await getFeaturedVehicles()

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-20 flex items-center justify-between gap-12">
        <div className="flex-1 max-w-xl">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4">
            Refonte digitale · 2026
          </p>
          <h1 className="[font-family:var(--font-sora)] text-5xl font-extrabold text-[#0B1524] leading-tight mb-6">
            Votre prochaine voiture,<br />en toute confiance.
          </h1>
          <p className="text-[#5B6B82] text-lg leading-relaxed mb-8">
            Achetez ou louez un véhicule d&apos;occasion certifié — garanti, contrôlé et livré. Depuis 1987.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/vehicles?listingType=purchase"
              className="inline-flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] px-6 py-3 rounded-full transition-colors no-underline"
            >
              Acheter une voiture
            </Link>
            <Link
              href="/vehicles?listingType=rental"
              className="inline-flex items-center border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 font-bold text-[15px] px-6 py-3 rounded-full transition-colors no-underline"
            >
              Louer (LLD-OA)
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-[#E4E9F2]">
            <div>
              <p className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0B1524]">12 400+</p>
              <p className="text-[#5B6B82] text-sm">véhicules certifiés</p>
            </div>
            <div>
              <p className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0B1524]">4,8/5</p>
              <p className="text-[#5B6B82] text-sm">satisfaction client</p>
            </div>
            <div>
              <p className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0B1524]">100%</p>
              <p className="text-[#5B6B82] text-sm">dossier en ligne</p>
            </div>
          </div>
        </div>

        {/* Image hero */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#EEF3FF] rounded-3xl p-12 max-w-lg">
          <img
            src="https://png.pngtree.com/png-vector/20240905/ourmid/pngtree-black-electric-car-illustration-clipart-png-image_13757062.png"
            alt="Véhicule M-Motors"
            className="w-full max-w-sm object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* Barre de recherche rapide */}
      <section className="max-w-4xl mx-auto px-8 -mt-6 relative z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-[#E4E9F2] p-4 flex items-center gap-3">
          <div className="flex gap-2 shrink-0">
            <Link
              href="/vehicles?listingType=purchase"
              className="text-sm font-bold px-4 py-2 rounded-full bg-[#0E2A6B] text-white no-underline"
            >
              Acheter
            </Link>
            <Link
              href="/vehicles?listingType=rental"
              className="text-sm font-bold px-4 py-2 rounded-full border border-[#E4E9F2] text-[#5B6B82] hover:border-[#2563EB] hover:text-[#2563EB] no-underline transition-colors"
            >
              Louer
            </Link>
          </div>
          <div className="flex-1 border-l border-[#E4E9F2] pl-3">
            <form action="/vehicles" method="GET" className="flex items-center gap-2">
              <input
                type="text"
                name="brand"
                placeholder="Marque, modèle..."
                className="flex-1 text-sm text-[#0B1524] placeholder-[#5B6B82] outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm px-5 py-2 rounded-full transition-colors"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Véhicules en vedette */}
      {vehicles.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B] mb-2">
              Véhicules disponibles
            </h2>
            <p className="text-[#5B6B82] mb-8">Une sélection de nos meilleures offres du moment.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map((v: {
                id: string
                brand: string
                model: string
                year: number
                mileage: number
                fuelType: string
                price: number
                listingType: 'purchase' | 'rental'
                images: string[]
              }) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.id}`}
                  className="bg-[#F5F8FD] rounded-2xl overflow-hidden no-underline hover:shadow-md transition-shadow border border-[#E4E9F2]"
                >
                  <div className="bg-[#EEF3FF] h-44 flex items-center justify-center overflow-hidden">
                    <img
                      src={v.images?.[0] ?? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'}
                      alt={`${v.brand} ${v.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        v.listingType === 'purchase'
                          ? 'bg-[#0E2A6B] text-white'
                          : 'bg-[#2563EB] text-white'
                      }`}>
                        {v.listingType === 'purchase' ? 'ACHAT' : 'LLD-OA'}
                      </span>
                    </div>

                    <h3 className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-lg">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-[#5B6B82] text-sm">
                      {v.year} · {v.mileage.toLocaleString('fr-FR')} km · {FUEL_LABELS[v.fuelType] ?? v.fuelType}
                    </p>
                    <p className="[font-family:var(--font-sora)] font-bold text-[#2563EB] text-xl mt-3">
                      {v.price.toLocaleString('fr-FR')} €
                      {v.listingType === 'rental' && <span className="text-sm font-normal">/mois</span>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/vehicles"
                className="inline-flex items-center border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 font-bold text-[15px] px-8 py-3 rounded-full transition-colors no-underline"
              >
                Voir tous les véhicules
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Fonctionnalités */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="[font-family:var(--font-sora)] text-3xl font-bold text-[#0E2A6B] mb-12 text-center">
          Un parcours 100% digitalisé
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <SearchIcon size={24} />, title: 'Rechercher', desc: 'Filtrez par marque, prix, énergie et kilométrage.' },
            { icon: <FileIcon size={24} />, title: 'Constituer', desc: 'Déposez votre dossier et vos documents en ligne.' },
            { icon: <CheckIcon size={24} />, title: 'Suivre', desc: "Suivez l'avancement de votre dossier en temps réel." },
            { icon: <DashboardIcon size={24} />, title: 'Piloter', desc: 'Back-office complet pour gérer véhicules et dossiers.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#E4E9F2] p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#EEF3FF] rounded-xl flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] mb-2">{title}</h3>
              <p className="text-[#5B6B82] text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}