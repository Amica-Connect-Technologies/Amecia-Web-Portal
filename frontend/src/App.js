import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClinicProfile from "./pages/CreateProfile/ClinicProfile";
import EmployerProfile from "./pages/CreateProfile/EmployerProfile";
import JobSeekerProfile from "./pages/CreateProfile/JobSeekerProfile";
import ProfileView from "./pages/CreateProfile/ProfileView";
import ProfileEdit from "./pages/CreateProfile/ProfileEdit";
import JobBrowse from "./pages/CreateProfile/JobBrowse";
import JobDetail from "./pages/CreateProfile/JobDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Profile Creation Routes */}
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfileRedirect />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-profile/clinic"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClinicProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-profile/employer"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployerProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-profile/job-seeker"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobSeekerProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/jobs" element={<JobBrowse />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Component to redirect based on user type
const ProfileRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  switch (user.user_type) {
    case "clinic":
      return <Navigate to="/create-profile/clinic" replace />;
    case "employer":
      return <Navigate to="/create-profile/employer" replace />;
    case "job_seeker":
      return <Navigate to="/create-profile/job-seeker" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default App;
