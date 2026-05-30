import { Navigate, Route, Routes } from "react-router-dom";

import { LayoutWrapper } from "./components/LayoutWrapper";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { JobSeekerDashboard } from "./pages/JobSeekerDashboard";
import { EmployerDashboard } from "./pages/EmployerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { LoginPage } from "./pages/LoginPage";
import { CreateJobOfficePage } from "./pages/CreateJobOfficePage";
import { EmployerJobOfferPage } from "./pages/EmployerJobOfferPage";
import { EmployerCandidatePage } from "./pages/EmployerCandidatePage";
import { JobSeekerProfilePage } from "./pages/JobSeekerProfilePage";

function App() {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AuthCallbackPage />} />
        <Route path="/auth/callback" element={<Navigate replace to="/dashboard" />} />
        <Route
          path="/dashboard/employer/create-job-offer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <CreateJobOfficePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/job-seeker"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/job-seeker/profile"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <JobSeekerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer/job-offers/:jobId"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerJobOfferPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer/job-offers/:jobId/candidates/:candidateId"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerCandidatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </LayoutWrapper>
  );
}

export default App;
