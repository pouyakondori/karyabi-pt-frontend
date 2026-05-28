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

function App() {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AuthCallbackPage />} />
        <Route path="/auth/callback" element={<Navigate replace to="/dashboard" />} />
        <Route
          path="/create-job-offer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <CreateJobOfficePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seeker"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <JobSeekerDashboard />
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
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/seeker" element={<Navigate replace to="/dashboard/seeker" />} />
        <Route path="/employer" element={<Navigate replace to="/dashboard/employer" />} />
        <Route path="/admin" element={<Navigate replace to="/dashboard/admin" />} />
      </Routes>
    </LayoutWrapper>
  );
}

export default App;
