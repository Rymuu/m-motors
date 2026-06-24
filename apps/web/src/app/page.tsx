import Link from 'next/link'
import SearchIcon from '@/components/icons/SearchIcon'
import FileIcon from '@/components/icons/FileIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'

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

        {/* Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#EEF3FF] rounded-3xl p-16 max-w-lg">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.27097 8.214C6.02074 6.312 6.92262 5 8.96427 5H14.4369C16.4766 5 17.3795 6.312 18.1302 8.214L18.88 10.249C19.4387 10.2559 19.9519 10.5661 20.2284 11.064C20.3911 11.3476 20.4763 11.6709 20.4751 12V14.624C20.4824 15.2367 20.1808 15.8098 19.6776 16.14C19.4382 16.2929 19.162 16.3739 18.88 16.374H4.52022C4.23827 16.3739 3.96199 16.2929 3.72267 16.14C3.21939 15.8098 2.91786 15.2367 2.92512 14.624V12C2.92406 11.6713 3.00927 11.3483 3.17179 11.065C3.44833 10.5671 3.96155 10.2569 4.52022 10.25L5.27097 8.214Z"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.86629 16.375C6.86629 15.9608 6.53051 15.625 6.11629 15.625C5.70208 15.625 5.36629 15.9608 5.36629 16.375H6.86629ZM6.11629 17.688H5.36629C5.36629 17.6958 5.36641 17.7036 5.36666 17.7114L6.11629 17.688ZM4.91899 19L4.89219 19.7495C4.90986 19.7502 4.92754 19.7502 4.9452 19.7496L4.91899 19ZM3.72267 17.687L4.47228 17.711C4.47254 17.703 4.47267 17.695 4.47267 17.687L3.72267 17.687ZM4.47267 16.14C4.47267 15.7258 4.13688 15.39 3.72267 15.39C3.30845 15.39 2.97267 15.7258 2.97267 16.14H4.47267ZM4.52022 9.49902C4.106 9.49902 3.77022 9.83481 3.77022 10.249C3.77022 10.6632 4.106 10.999 4.52022 10.999V9.49902ZM18.88 10.999C19.2942 10.999 19.63 10.6632 19.63 10.249C19.63 9.83481 19.2942 9.49902 18.88 9.49902V10.999ZM18.0349 16.374C18.0349 15.9598 17.6991 15.624 17.2849 15.624C16.8707 15.624 16.5349 15.9598 16.5349 16.374H18.0349ZM17.2849 17.687L18.0335 17.7336C18.0344 17.7181 18.0349 17.7026 18.0349 17.687H17.2849ZM17.8602 18.8173L18.2561 18.1803L18.2561 18.1803L17.8602 18.8173ZM19.1033 18.8173L18.7074 18.1803L18.7074 18.1803L19.1033 18.8173ZM19.6785 17.687H18.9285C18.9285 17.7026 18.929 17.7181 18.93 17.7336L19.6785 17.687ZM20.4285 16.14C20.4285 15.7258 20.0928 15.39 19.6785 15.39C19.2643 15.39 18.9285 15.7258 18.9285 16.14H20.4285ZM5.85012 12.75C5.4359 12.75 5.10012 13.0858 5.10012 13.5C5.10012 13.9142 5.4359 14.25 5.85012 14.25V12.75ZM6.82512 14.25C7.23933 14.25 7.57512 13.9142 7.57512 13.5C7.57512 13.0858 7.23933 12.75 6.82512 12.75V14.25ZM16.5751 12.75C16.1609 12.75 15.8251 13.0858 15.8251 13.5C15.8251 13.9142 16.1609 14.25 16.5751 14.25V12.75ZM17.5501 14.25C17.9643 14.25 18.3001 13.9142 18.3001 13.5C18.3001 13.0858 17.9643 12.75 17.5501 12.75V14.25ZM5.36629 16.375V17.688H6.86629V16.375H5.36629ZM5.36666 17.7114C5.37622 18.0175 5.14582 18.2416 4.89278 18.2505L4.9452 19.7496C6.05927 19.7106 6.90017 18.7608 6.86593 17.6646L5.36666 17.7114ZM4.94579 18.2505C4.69273 18.2415 4.46248 18.0171 4.47228 17.711L2.97305 17.663C2.93793 18.7592 3.77813 19.7097 4.89219 19.7495L4.94579 18.2505ZM4.47267 17.687V16.14H2.97267V17.687H4.47267ZM4.52022 10.999H18.88V9.49902H4.52022V10.999ZM16.5349 16.374V17.687H18.0349V16.374H16.5349ZM16.5364 17.6404C16.4912 18.3667 16.8425 19.0678 17.4642 19.4543L18.2561 18.1803C18.1138 18.0919 18.0217 17.9219 18.0335 17.7336L16.5364 17.6404ZM17.4642 19.4543C18.0887 19.8424 18.8747 19.8424 19.4992 19.4543L18.7074 18.1803C18.5678 18.2671 18.3957 18.2671 18.2561 18.1803L17.4642 19.4543ZM19.4992 19.4543C20.121 19.0678 20.4723 18.3667 20.4271 17.6404L18.93 17.7336C18.9417 17.9219 18.8497 18.0919 18.7074 18.1803L19.4992 19.4543ZM20.4285 17.687V16.14H18.9285V17.687H20.4285ZM5.85012 14.25H6.82512V12.75H5.85012V14.25ZM16.5751 14.25H17.5501V12.75H16.5751V14.25Z"
              fill="#2563EB"
            />
          </svg>
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
              }) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.id}`}
                  className="bg-[#F5F8FD] rounded-2xl p-6 no-underline hover:shadow-md transition-shadow border border-[#E4E9F2]"
                >
                  {/* Placeholder image */}
                  <div className="bg-[#EEF3FF] rounded-xl h-40 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.27097 8.214C6.02074 6.312 6.92262 5 8.96427 5H14.4369C16.4766 5 17.3795 6.312 18.1302 8.214L18.88 10.249C19.4387 10.2559 19.9519 10.5661 20.2284 11.064C20.3911 11.3476 20.4763 11.6709 20.4751 12V14.624C20.4824 15.2367 20.1808 15.8098 19.6776 16.14C19.4382 16.2929 19.162 16.3739 18.88 16.374H4.52022C4.23827 16.3739 3.96199 16.2929 3.72267 16.14C3.21939 15.8098 2.91786 15.2367 2.92512 14.624V12C2.92406 11.6713 3.00927 11.3483 3.17179 11.065C3.44833 10.5671 3.96155 10.2569 4.52022 10.25L5.27097 8.214Z"
                        stroke="#2563EB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M5.85012 13.5H6.82512M16.5751 13.5H17.5501" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      v.listingType === 'purchase'
                        ? 'bg-[#0E2A6B] text-white'
                        : 'bg-[#2563EB] text-white'
                    }`}>
                      {v.listingType === 'purchase' ? 'ACHAT' : 'LOCATION'}
                    </span>
                  </div>

                  <h3 className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-lg mt-2">
                    {v.brand} {v.model}
                  </h3>
                  <p className="text-[#5B6B82] text-sm">
                    {v.year} · {v.mileage.toLocaleString('fr-FR')} km · {v.fuelType}
                  </p>
                  <p className="[font-family:var(--font-sora)] font-bold text-[#2563EB] text-xl mt-3">
                    {v.price.toLocaleString('fr-FR')} €
                    {v.listingType === 'rental' && <span className="text-sm font-normal">/mois</span>}
                  </p>
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