export type Role = "admin" | "job_seeker" | "employer";
export type JobType = "full-time" | "part-time";
export type JobStatus = "pending" | "approved" | "rejected";
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

export type CandidateApplication = {
  id: string;
  appliedAt: string;
  seeker: {
    id: string;
    email: string;
    seekerProfile?: JobSeekerProfile;
  };
};

export type JobCandidatesPayload = {
  id: string;
  title: string;
  applications: CandidateApplication[];
};
