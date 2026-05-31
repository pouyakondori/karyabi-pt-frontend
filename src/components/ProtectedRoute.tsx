import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { t } from '../lib/i18n'
import type { Role } from '../types'
import { SectionCard } from './SectionCard'

type ProtectedRouteProps = PropsWithChildren<{
  roles: Role[]
}>

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { session } = useAuth()

  if (!session) {
    return <SectionCard title={t('common.unauthorized')} />
  }

  if (!roles.includes(session.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
