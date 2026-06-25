import Link from 'next/link'
import LogoIcon from './LogoIcon'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0E2A6B] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <LogoIcon size={36} />
            </span>
            <span className="[font-family:var(--font-sora)] font-bold text-white text-lg">
              M-MOTORS
            </span>
          </div>
          <p className="text-[#E4E9F2] text-sm leading-relaxed">
            Achetez ou louez un véhicule d&apos;occasion certifié — garanti, contrôlé et livré. Depuis 1987.
          </p>
        </div>

        <div>
          <h3 className="[font-family:var(--font-sora)] font-semibold text-white mb-4">Nos services</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/vehicles?listingType=purchase" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Acheter un véhicule</Link></li>
            <li><Link href="/vehicles?listingType=rental" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Location LLD-OA</Link></li>
            <li><Link href="/vehicles" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Catalogue complet</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="[font-family:var(--font-sora)] font-semibold text-white mb-4">Compte</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/login" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Connexion</Link></li>
            <li><Link href="/register" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Créer un compte</Link></li>
            <li><Link href="/dashboard" className="text-[#E4E9F2] hover:text-white text-sm no-underline transition-colors">Mon espace client</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-6 border-t border-[#2563EB]/30 pt-6">
        <p className="text-[#5B6B82] text-sm text-center">© 2026 M-Motors. Tous droits réservés.</p>
      </div>
    </footer>
  )
}