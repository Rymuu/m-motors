'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoIcon from './LogoIcon'

export default function Navbar() {
  const pathname = usePathname()

  const navLinkClass = (active: boolean) =>
    `text-[15px] font-semibold transition-colors duration-150 no-underline ${
      active ? 'text-[#2563EB]' : 'text-[#0B1524] hover:text-[#2563EB]'
    }`

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <span className="w-9 h-9 bg-[#2563EB] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                <LogoIcon size={24} />
            </span>
          <span className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-xl tracking-tight">
            M-MOTORS
          </span>
        </Link>

        <div className="flex items-center gap-10">
          <Link href="/vehicles?listingType=purchase" className={navLinkClass(pathname.startsWith('/vehicles'))}>
            Acheter
          </Link>
          <Link href="/vehicles?listingType=rental" className={navLinkClass(false)}>
            Louer
          </Link>
          <Link href="/vehicles" className={navLinkClass(false)}>
            Catalogue
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className={navLinkClass(pathname === '/login')}>
            Connexion
          </Link>
          <Link
            href="/register"
            className="flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] px-6 py-2.5 rounded-full transition-colors no-underline whitespace-nowrap"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </nav>
  )
}