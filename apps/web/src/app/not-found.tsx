import Link from 'next/link'
import LogoIcon from '@/components/layout/LogoIcon'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <span className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center">
            <LogoIcon size={36} />
          </span>
        </div>
        <h1 className="[font-family:var(--font-sora)] text-8xl font-extrabold text-[#E4E9F2] mb-4">
          404
        </h1>
        <h2 className="[font-family:var(--font-sora)] text-2xl font-bold text-[#0E2A6B] mb-3">
          Page introuvable
        </h2>
        <p className="text-[#5B6B82] text-sm leading-relaxed mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] px-6 py-3 rounded-full transition-colors no-underline"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/vehicles"
            className="inline-flex items-center border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 font-bold text-[15px] px-6 py-3 rounded-full transition-colors no-underline"
          >
            Voir les véhicules
          </Link>
        </div>
      </div>
    </div>
  )
}