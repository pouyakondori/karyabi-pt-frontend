import type {
  AdminOverviewPayload,
  AuthLoginPayload,
  CreateEmployerJobPayload,
  EmployerCandidateDetailPayload,
  Job,
  JobCandidatesPayload,
  JobSeekerProfile,
  JobStatus,
  ResumeUploadPayload,
  UserSession,
} from '../types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'
const gdprStorageKey = 'karyabi-gdpr-consent'
const authStorageKey = 'karyabi-session'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

function getAuthHeaders(init?: HeadersInit) {
  const session = getSession()
  const headers = new Headers(init)

  if (getConsentValue()) {
    headers.set('x-gdpr-consent', 'true')
  }

  if (session?.userId) {
    const token = window.localStorage.getItem('karyabi-token')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return headers
}

function resolveUrl(path: string) {
  return /^https?:\/\//i.test(path) ? path : `${apiBaseUrl}${path}`
}

function parseFileName(contentDisposition: string | null) {
  if (!contentDisposition) {
    return undefined
  }

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)

  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1])
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
  return basicMatch?.[1]
}

function getConsentValue() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(gdprStorageKey) === 'true'
}

function getSession(): UserSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(authStorageKey)

  return rawSession ? (JSON.parse(rawSession) as UserSession) : null
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const headers = getAuthHeaders(init?.headers)

  if (!(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(resolveUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const errorPayload = (await response.json()) as Partial<ApiResponse<null>>
    throw new Error(errorPayload.message ?? 'request_failed')
  }

  return (await response.json()) as ApiResponse<T>
}

export const api = {
  getPublicJobs: async (type?: Job['type']) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : ''
    return request<Job[]>(`/jobs/public${query}`)
  },
  applyToJob: async (jobId: string) => request(`/jobs/${jobId}/apply`, { method: 'POST' }),
  getSeekerProfile: async () => request<JobSeekerProfile | null>('/seeker/profile'),
  saveSeekerProfile: async (payload: JobSeekerProfile) =>
    request<JobSeekerProfile>('/seeker/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  uploadSeekerResume: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return request<ResumeUploadPayload>('/seeker/profile/resume', {
      method: 'POST',
      body: formData,
    })
  },
  openProtectedFile: async (url: string) => {
    const response = await fetch(resolveUrl(url), {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as Partial<
        ApiResponse<null>
      > | null
      throw new Error(errorPayload?.message ?? 'request_failed')
    }

    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)
    const fileName = parseFileName(response.headers.get('content-disposition'))

    if (blob.type === 'application/pdf') {
      const openedWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer')

      if (!openedWindow) {
        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.target = '_blank'
        anchor.rel = 'noopener noreferrer'
        anchor.click()
      }
    } else {
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = fileName ?? 'resume'
      anchor.click()
    }

    window.setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl)
    }, 60_000)
  },
  getRecommendedJobs: async () => request<Job[]>('/seeker/recommended-jobs'),
  getEmployerJobs: async () => request<Job[]>('/employer/jobs'),
  createEmployerJob: async (payload: CreateEmployerJobPayload) =>
    request<Job>('/employer/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCandidates: async (jobId: string) =>
    request<JobCandidatesPayload>(`/employer/jobs/${jobId}/candidates`),
  getEmployerCandidate: async (jobId: string, candidateId: string) =>
    request<EmployerCandidateDetailPayload>(`/employer/jobs/${jobId}/candidates/${candidateId}`),
  reviewEmployerCandidate: async (
    jobId: string,
    candidateId: string,
    payload: { decision: 'accepted' | 'rejected'; rejectionReason?: string }
  ) =>
    request<EmployerCandidateDetailPayload>(
      `/employer/jobs/${jobId}/candidates/${candidateId}/review`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),
  deleteEmployerJob: async (jobId: string) =>
    request<null>(`/employer/jobs/${jobId}`, {
      method: 'DELETE',
    }),
  getAdminOverview: async () => request<AdminOverviewPayload>('/admin/overview'),
  createAdminUser: async (email: string) =>
    request('/admin/admins', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  getPendingJobs: async () => request<Job[]>('/admin/jobs/pending'),
  updateJobStatus: async (jobId: string, status: Extract<JobStatus, 'approved' | 'rejected'>) =>
    request<Job>(`/admin/jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  suspendAdminUser: async (userId: string, suspended: boolean) =>
    request(`/admin/users/${userId}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ suspended }),
    }),
  deleteAdminUser: async (userId: string) =>
    request<null>(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  suspendAdminJob: async (jobId: string, suspended: boolean) =>
    request<Job>(`/admin/jobs/${jobId}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ suspended }),
    }),
  deleteAdminJob: async (jobId: string) =>
    request<null>(`/admin/jobs/${jobId}`, {
      method: 'DELETE',
    }),
  devLogin: async (role: UserSession['role']) =>
    request<AuthLoginPayload>('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
}

export { apiBaseUrl, authStorageKey, gdprStorageKey }
