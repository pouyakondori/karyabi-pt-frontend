export type Role = "admin" | "job_seeker" | "employer";
export type JobType = "full-time" | "part-time";
export type JobStatus = "pending" | "approved" | "rejected" | "closed";
export type WorkplaceType = "on_site" | "hybrid" | "remote";
export type ExperienceLevel = "entry" | "mid" | "senior";
export type PortugalRegion =
  | "aveiro"
  | "beja"
  | "braga"
  | "braganca"
  | "castelo_branco"
  | "coimbra"
  | "evora"
  | "faro"
  | "guarda"
  | "leiria"
  | "lisboa"
  | "portalegre"
  | "porto"
  | "santarem"
  | "setubal"
  | "viana_do_castelo"
  | "vila_real"
  | "viseu"
  | "azores"
  | "madeira";

export type UserSession = {
  userId: string;
  role: Role;
  email?: string;
};

export type AuthLoginPayload = {
  token: string;
  user: UserSession;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  isSuspended?: boolean;
  companyName?: string | null;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  workplaceType?: WorkplaceType | null;
  experienceLevel?: ExperienceLevel | null;
  vacancies?: number | null;
  applicationDeadline?: string | null;
  type: JobType;
  status?: JobStatus;
  createdAt: string;
  _count?: {
    applications: number;
  };
};

export type JobSeekerProfile = {
  fullName: string;
  hasResidencePermit: boolean;
  residencyExpirationDate?: string;
  hasWorkPermit: boolean;
  residencyPermitType: string;
  canRideBike: boolean;
  universityFieldAndDegree: string;
  hasPortugueseDrivingLicense: boolean;
  hasUberExperience: boolean;
  generalExpertise: string[];
  portugalRegion: PortugalRegion;
  phoneNumber: string;
  address: string;
  resumeUrl?: string;
  linkedinUrl?: string;
};

export type CandidateApplicationStatus = "pending" | "accepted" | "rejected";

export type CandidateApplication = {
  id: string;
  status: CandidateApplicationStatus;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  appliedAt: string;
  seeker: {
    id: string;
    email: string;
    seekerProfile?: JobSeekerProfile;
  };
};

export type CreateEmployerJobPayload = {
  title: string;
  description: string;
  companyName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  workplaceType: WorkplaceType;
  experienceLevel: ExperienceLevel;
  vacancies: number;
  applicationDeadline?: string;
  type: JobType;
};

export type JobCandidatesPayload = {
  job: Job;
  applications: CandidateApplication[];
};

export type EmployerCandidateDetailPayload = {
  job: Job;
  application: CandidateApplication;
};

export type ResumeUploadPayload = {
  url: string;
  fileName: string;
};

export type AdminEmployerSummary = {
  id: string;
  email: string;
  isSuspended: boolean;
  createdAt: string;
  _count?: {
    employerJobs: number;
  };
};

export type AdminJobSeekerSummary = {
  id: string;
  email: string;
  isSuspended: boolean;
  createdAt: string;
  seekerProfile?: {
    fullName?: string;
    portugalRegion?: PortugalRegion;
  } | null;
  _count?: {
    applications: number;
  };
};

export type AdminOverviewPayload = {
  employers: AdminEmployerSummary[];
  jobSeekers: AdminJobSeekerSummary[];
  jobs: Job[];
};
