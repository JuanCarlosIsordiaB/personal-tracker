import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/shell/Sidebar'
import { BottomNav } from '@/components/shell/BottomNav'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
})

export const metadata: Metadata = {
  title: 'Office Tracker',
  description: 'Seguimiento de días de oficina y gastos de viaje',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={hanken.variable} style={{ height: '100%' }}>
      <body suppressHydrationWarning style={{ height: '100%', display: 'flex', flexDirection: 'row', background: '#F3F5F8' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
