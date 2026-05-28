import type {
  AuthLoginPayload,
  CreateEmployerJobPayload,
  Job,
  JobCandidatesPayload,
  JobSeekerProfile,
  JobStatus,
  UserSession
} from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const gdprStorageKey = "karyabi-gdpr-consent";
const authStorageKey = "karyabi-session";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getConsentValue() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(gdprStorageKey) === "true";
}

function getSession(): UserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(authStorageKey);

  return rawSession ? (JSON.parse(rawSession) as UserSession) : null;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const session = getSession();
  const headers = new Headers(init?.headers);

  if (getConsentValue()) {
    headers.set("x-gdpr-consent", "true");
  }

  headers.set("Content-Type", "application/json");

  if (session?.userId) {
    const token = window.localStorage.getItem("karyabi-token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    const errorPayload = (await response.json()) as Partial<ApiResponse<null>>;
    throw new Error(errorPayload.message ?? "request_failed");
  }

  return (await response.json()) as ApiResponse<T>;
}

export const api = {
  getPublicJobs: async (type?: Job["type"]) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    return request<Job[]>(`/jobs/public${query}`);
  },
  applyToJob: async (jobId: string) => request(`/jobs/${jobId}/apply`, { method: "POST" }),
  getSeekerProfile: async () => request<JobSeekerProfile | null>("/seeker/profile"),
  saveSeekerProfile: async (payload: JobSeekerProfile) =>
    request<JobSeekerProfile>("/seeker/profile", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getRecommendedJobs: async () => request<Job[]>("/seeker/recommended-jobs"),
  getEmployerJobs: async () => request<Job[]>("/employer/jobs"),
  createEmployerJob: async (payload: CreateEmployerJobPayload) =>
    request<Job>("/employer/jobs", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getCandidates: async (jobId: string) => request<JobCandidatesPayload>(`/employer/jobs/${jobId}/candidates`),
  deleteEmployerJob: async (jobId: string) =>
    request<null>(`/employer/jobs/${jobId}`, {
      method: "DELETE"
    }),
  getPendingJobs: async () => request<Job[]>("/admin/jobs/pending"),
  updateJobStatus: async (jobId: string, status: Extract<JobStatus, "approved" | "rejected">) =>
    request<Job>(`/admin/jobs/${jobId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  devLogin: async (role: UserSession["role"]) =>
    request<AuthLoginPayload>("/auth/dev-login", {
      method: "POST",
      body: JSON.stringify({ role })
    })
};

export { apiBaseUrl, authStorageKey, gdprStorageKey };
