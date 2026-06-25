'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type User = {
  firstName: string
  role: string
}

function readUserCookie(): User | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')))
  } catch {
    return null
  }
}

export default function NavbarActions() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(() => readUserCookie())

  function handleLogout() {
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'user=; path=/; max-age=0'
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const navLinkClass = (active: boolean) =>
    `text-[15px] font-semibold transition-colors duration-150 no-underline ${
      active ? 'text-[#2563EB]' : 'text-[#0B1524] hover:text-[#2563EB]'
    }`

  if (user) {
    return (
      <>
        {user.role === 'admin' && (
          <Link href="/admin" className={navLinkClass(pathname.startsWith('/admin'))}>
            Back-office
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="text-[15px] font-semibold text-[#5B6B82] hover:text-[#DC2626] transition-colors cursor-pointer bg-transparent border-none"
        >
          Déconnexion
        </button>
      </>
    )
  }

  return (
    <>
      <Link href="/login" className={navLinkClass(pathname === '/login')}>
        Connexion
      </Link>
      <Link
        href="/register"
        className="flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] px-6 py-2.5 rounded-full transition-colors no-underline whitespace-nowrap"
      >
        S&apos;inscrire
      </Link>
    </>
  )
}