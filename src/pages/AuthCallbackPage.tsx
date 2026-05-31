import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { SectionCard } from '../components/SectionCard'
import { useAuth } from '../contexts/AuthContext'
import { getDashboardPath } from '../lib/auth'
import { t } from '../lib/i18n'
import type { Role } from '../types'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { session, setSession } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') as Role | null
    const email = searchParams.get('email') ?? undefined

    if (token && userId && role) {
      setSession({ userId, role, email }, token)
      navigate(getDashboardPath(role), { replace: true })
      return
    }

    if (session) {
      navigate(getDashboardPath(session.role), { replace: true })
      return
    }

    navigate('/', { replace: true })
  }, [navigate, searchParams, session, setSession])

  return <SectionCard title={t('common.loading')} />
}
