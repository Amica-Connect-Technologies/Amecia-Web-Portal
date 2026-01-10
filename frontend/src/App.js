import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateClinicProfile from './pages/CreateProfile/CreateClinicProfile';
import CreateEmployerProfile from './pages/CreateProfile/CreateEmployerProfile';
import CreateJobSeekerProfile from './pages/CreateProfile/CreateJobSeekerProfile';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import JobProfileView from "./pages/CreateProfile/JobSeeker/ProfileView";
import JobProfileEdit from "./pages/CreateProfile/JobSeeker/ProfileEdit";
import JobBrowse from "./pages/CreateProfile/JobSeeker/JobBrowse";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";
import JobsPage from "./pages/Jobs";
import ClinicProfileView from "./pages/CreateProfile/ClinicProfile/ClinicProfileView";
import ClinicProfileEdit from "./pages/CreateProfile/ClinicProfile/ClinicProfileEdit";
import EmployerProfileView from "./pages/CreateProfile/Employer/EmployerProfileView";
import EmployerProfileEdit from "./pages/CreateProfile/Employer/EmployerProfileEdit";
import HomePage from './pages/Home';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Clinic Profile Routes */}
          <Route path="/create/profile/clinic/" element={<CreateClinicProfile />} />
          <Route path="/clinic/profile" element={<ClinicProfileView />} />
          <Route path="/clinic/profile/edit" element={<ClinicProfileEdit />} />

          {/* Job-Seeker Profile Routes */}
          <Route path="/create/profile/jobseeker" element={<CreateJobSeekerProfile />} />
          <Route path="/jobseeker/profile/edit" element={<JobProfileEdit />} />
          <Route path="/jobseeker/profile/view" element={<JobProfileView />} />
          <Route path="/jobseeker/browse-jobs" element={<JobBrowse />} />
          

          {/* Employer Profile Routes */}
          <Route path="/create/profile/employer" element={<CreateEmployerProfile />} />
          <Route path="/employer/profile" element={<EmployerProfileView />} />
          <Route path="/employer/profile/edit" element={<EmployerProfileEdit />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          

          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
  );
}

// Component to redirect based on user type
const ProfileRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  switch (user.user_type) {
    case 'clinic':
      return <Navigate to="/create/profile/clinic" replace />;
    case 'employer':
      return <Navigate to="/create/profile/employer" replace />;
    case 'job_seeker':
      return <Navigate to="/create/profile/jobseeker" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default App;