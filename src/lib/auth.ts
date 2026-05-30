import type { Role } from "../types";

export function getDashboardPath(role: Role) {
  if (role === "job_seeker") {
    return "/dashboard/job-seeker";
  }

  if (role === "employer") {
    return "/dashboard/employer";
  }

  return "/dashboard/admin";
}
