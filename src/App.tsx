import { Route, Routes } from "react-router-dom";

import { LayoutWrapper } from "./components/LayoutWrapper";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { JobSeekerDashboard } from "./pages/JobSeekerDashboard";
import { EmployerDashboard } from "./pages/EmployerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

function App() {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/seeker"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
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
