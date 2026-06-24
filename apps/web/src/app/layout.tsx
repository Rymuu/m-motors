import type { Metadata } from 'next'
import './globals.css'
import { Sora, Manrope } from 'next/font/google'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "M-Motors — Achat & Location de véhicules d'occasion",
  description: "Achetez ou louez un véhicule d'occasion certifié.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F5F8FD] text-[#0B1524]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}