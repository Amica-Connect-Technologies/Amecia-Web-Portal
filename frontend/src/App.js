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

import JobProfileView from "./pages/CreateProfile/JobSeeker/ProfileView";
import JobProfileEdit from "./pages/CreateProfile/JobSeeker/ProfileEdit";
import JobBrowse from "./pages/CreateProfile/JobSeeker/JobBrowse";
import JobDetail from "./pages/CreateProfile/JobSeeker/JobDetail";
import Home from "./pages/Home";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";
import JobsPage from "./pages/Jobs";
import ClinicProfileView from "./pages/CreateProfile/ClinicProfile/ClinicProfileView";
import ClinicProfileEdit from "./pages/CreateProfile/ClinicProfile/ClinicProfileEdit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Clinic Profile Routes */}
          <Route path="/clinic/profile" element={<ClinicProfileView />} />
          <Route path="/clinic/profile/edit" element={<ClinicProfileEdit />} />
          <Route path="/clinic/create" element={<ClinicProfile />} />

          {/* Job-Seeker Profile Routes */}
          <Route path="/jobseeker/profile/edit" element={<JobProfileEdit />} />
          <Route path="/jobseeker/profile/view" element={<JobProfileView />} />


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

          {/* <Route
            path="/create-profile/clinic"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClinicProfile />
                </Layout>
              </ProtectedRoute>
            }
          /> */}

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

          {/* Job Seeker Specific Routes - Protected */}
          {/* <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobProfileView />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobProfileEdit />
                </Layout>
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobBrowse />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Footer />
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
