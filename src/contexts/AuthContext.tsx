import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

import { getDashboardPath } from '../lib/auth'
import { t } from '../lib/i18n'
import { api, apiBaseUrl, authStorageKey } from '../services/api'
import type { Role, UserSession } from '../types'

type AuthContextValue = {
  session: UserSession | null
  signIn: (role: Role) => Promise<void>
  signOut: () => void
  setSession: (session: UserSession | null, token?: string) => void
  isDevAuthMode: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<UserSession | null>(null)
  const isDevAuthMode = import.meta.env.VITE_AUTH_MODE === 'dev'

  useEffect(() => {
    const rawSession = window.localStorage.getItem(authStorageKey)

    if (rawSession) {
      setSessionState(JSON.parse(rawSession) as UserSession)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isDevAuthMode,
      signIn: async role => {
        try {
          if (isDevAuthMode) {
            const response = await api.devLogin(role)
            window.localStorage.setItem(authStorageKey, JSON.stringify(response.data.user))
            window.localStorage.setItem('karyabi-token', response.data.token)
            setSessionState(response.data.user)
            window.location.assign(getDashboardPath(response.data.user.role))
            return
          }

          const response = await fetch(
            `${apiBaseUrl}/auth/google?role=${encodeURIComponent(role)}`,
            {
              headers: {
                'x-gdpr-consent': 'true',
              },
              credentials: 'include',
            }
          )

          if (!response.ok) {
            const payload = (await response.json()) as { message?: string }
            throw new Error(payload.message ?? t('common.loginFailed'))
          }

          const payload = (await response.json()) as {
            data: {
              url: string
            }
          }

          window.location.assign(payload.data.url)
        } catch (error) {
          window.alert(error instanceof Error ? error.message : t('common.loginFailed'))
        }
      },
      signOut: () => {
        window.localStorage.removeItem(authStorageKey)
        window.localStorage.removeItem('karyabi-token')
        setSessionState(null)
      },
      setSession: (nextSession, token) => {
        if (!nextSession) {
          window.localStorage.removeItem(authStorageKey)
          window.localStorage.removeItem('karyabi-token')
          setSessionState(null)
          return
        }

        window.localStorage.setItem(authStorageKey, JSON.stringify(nextSession))

        if (token) {
          window.localStorage.setItem('karyabi-token', token)
        }

        setSessionState(nextSession)
      },
    }),
    [isDevAuthMode, session]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('auth_context_missing')
  }

  return context
}
