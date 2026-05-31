import type { PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'

import { useGDPR } from '../contexts/GDPRContext'
import { DashboardBackButton } from './DashboardBackButton'
import { GdprModal } from './GdprModal'
import { NavBar } from './NavBar'

export function LayoutWrapper({ children }: PropsWithChildren) {
  const { hasConsent } = useGDPR()
  const location = useLocation()
  const showDashboardBackButton = location.pathname.startsWith('/dashboard/')

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showDashboardBackButton ? <DashboardBackButton /> : null}
        {children}
      </main>
      {!hasConsent ? <GdprModal /> : null}
    </div>
  )
}
