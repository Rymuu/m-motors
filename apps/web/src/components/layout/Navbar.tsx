'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import LogoIcon from '@/components/layout/LogoIcon'

const NavbarActions = dynamic(() => import('@/components/layout/NavbarActions'), { ssr: false })

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <span className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
            <LogoIcon size={24} />
          </span>
          <span className="[font-family:var(--font-sora)] font-bold text-[#0E2A6B] text-xl tracking-tight">
            M-MOTORS
          </span>
        </Link>

        <div className="flex items-center gap-10">
          <Link href="/vehicles?listingType=purchase" className="text-[15px] font-semibold text-[#0B1524] hover:text-[#2563EB] transition-colors no-underline">
            Acheter
          </Link>
          <Link href="/vehicles?listingType=rental" className="text-[15px] font-semibold text-[#0B1524] hover:text-[#2563EB] transition-colors no-underline">
            Louer
          </Link>
          <Link href="/vehicles" className="text-[15px] font-semibold text-[#0B1524] hover:text-[#2563EB] transition-colors no-underline">
            Catalogue
          </Link>
        </div>

        <div className="flex items-center gap-4 min-w-[220px] justify-end">
          <NavbarActions />
        </div>
      </div>
    </nav>
  )
}