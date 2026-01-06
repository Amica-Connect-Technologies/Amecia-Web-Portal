import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  Search,
  Briefcase,
  Users,
  LayoutDashboard,
  UserPlus,
  CreditCard,
  Mail,
  LogIn,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { UserRole } from "./types";

// Importing pages that are organized by folder hierarchy:

// dashboards
import AdminDashboard from "./src/pages/dashboards/AdminDashboard";
import ClinicDashboard from "./src/pages/dashboards/ClinicDashboard";
import EmployerDashboard from "./src/pages/dashboards/EmployerDashboard";
import JobSeekerDashboard from "./src/pages/dashboards/JobSeekerDashboard";

// jobs
import JobOpportunitiesPage from "./src/pages/jobs/JobOpportunitiesPage";
import JobApplicationPage from "./src/pages/jobs/JobApplicationPage";

// marketplace
import BrowseCategoriesPage from "./src/pages/marketplace/BrowseCategoriesPage";
import ProviderDetailPage from "./src/pages/marketplace/ProviderDetailPage";
import HealthcareProfessionalsPage from "./src/pages/marketplace/HealthcareProfessionalsPage";
import EnquiryPage from "./src/pages/marketplace/EnquiryPage";

// static
import HomePage from "./src/pages/static/HomePage";
import FAQPage from "./src/pages/static/FAQPage";

// user
import SignupPage from "./src/pages/user/SignupPage";
import SubscriptionPage from "./src/pages/user/SubscriptionPage";
import JobSeekerProfilePage from "./src/pages/user/JobSeekerProfilePage";

// Auth Context
interface AuthContextType {
  userRole: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Theme Context
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = (role: UserRole | null) => {
    switch (role) {
      case UserRole.CLINIC:
        return "/dashboard/clinic";
      case UserRole.EMPLOYER:
        return "/dashboard/employer";
      case UserRole.JOB_SEEKER:
        return "/dashboard/seeker";
      case UserRole.ADMIN:
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home, show: true },
    {
      name: "Categories",
      path: "/categories",
      icon: Search,
      show: !isAuthenticated || userRole !== UserRole.ADMIN,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: Briefcase,
      show:
        !isAuthenticated ||
        userRole === UserRole.JOB_SEEKER ||
        userRole === UserRole.CLINIC,
    },
    {
      name: "Professionals",
      path: "/professionals",
      icon: Users,
      show:
        !isAuthenticated ||
        userRole === UserRole.CLINIC ||
        userRole === UserRole.EMPLOYER,
    },
    {
      name: "Dashboard",
      path: getDashboardPath(userRole),
      icon: LayoutDashboard,
      show: isAuthenticated,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top bg-body transition-colors">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-indigo"
        >
          <div
            className="bg-indigo rounded p-1 d-flex align-items-center justify-content-center text-white"
            style={{ width: "32px", height: "32px", fontSize: "10px" }}
          >
            AC
          </div>
          <span>Amica Connect</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <Menu size={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            {navLinks
              .filter((l) => l.show)
              .map((link) => (
                <li className="nav-item" key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link fw-medium ${
                      isActive(link.path)
                        ? "text-indigo active"
                        : "text-secondary"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-link text-secondary p-2 rounded-circle hover-bg-light"
              style={{ textDecoration: "none" }}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {!isAuthenticated ? (
              <div className="d-flex gap-2">
                <Link
                  to="/signup"
                  className="btn btn-link text-secondary fw-medium text-decoration-none d-none d-sm-block"
                >
                  Register
                </Link>
                <Link to="/signup" className="btn btn-primary px-4 shadow-sm">
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-4"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-dark text-secondary py-5 border-top border-secondary">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-3">
          <h3 className="text-white h5 fw-bold mb-3">Amica Connect</h3>
          <p className="small">
            Connecting healthcare professionals with clinics and opportunities
            across the country. Simple, transparent, and professional.
          </p>
        </div>
        <div className="col-md-3">
          <h4 className="text-white h6 fw-semibold mb-3">Quick Links</h4>
          <ul className="list-unstyled small d-flex flex-column gap-2">
            <li>
              <Link
                to="/jobs"
                className="text-secondary text-decoration-none hover-white"
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                to="/professionals"
                className="text-secondary text-decoration-none hover-white"
              >
                Find Professionals
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="text-secondary text-decoration-none hover-white"
              >
                Specialties
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-secondary text-decoration-none hover-white"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/checkout"
                className="text-secondary text-decoration-none hover-white"
              >
                Pricing Plan
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <h4 className="text-white h6 fw-semibold mb-3">Portals</h4>
          <ul className="list-unstyled small d-flex flex-column gap-2">
            <li>
              <Link
                to="/dashboard/clinic"
                className="text-secondary text-decoration-none"
              >
                Clinic Portal
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/seeker"
                className="text-secondary text-decoration-none"
              >
                Job Seeker Portal
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/employer"
                className="text-secondary text-decoration-none"
              >
                Employer Portal
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/admin"
                className="text-secondary text-decoration-none"
              >
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <h4 className="text-white h6 fw-semibold mb-3">Contact</h4>
          <ul className="list-unstyled small d-flex flex-column gap-2">
            <li>support@amicaconnect.com</li>
            <li>1-800-AMICA-HEAL</li>
            <li>123 Medical Plaza, Health City</li>
          </ul>
        </div>
      </div>
      <div className="mt-5 pt-4 border-top border-secondary text-center small opacity-50">
        <div>
          &copy; {new Date().getFullYear()} Amica Connect. All rights reserved.
        </div>
        <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
          <span>Made with Love</span>
          <Heart size={12} className="text-danger fill-danger" />
          <span>by</span>
          <a
            href="https://www.linkedin.com/in/yasir-akbar-2b534513b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fw-semibold text-decoration-none"
          >
            Yasir Akbar
          </a>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem("amica_role");
    return saved ? (saved as UserRole) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("amica_auth")
  );

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("amica_theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("amica_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const login = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem("amica_role", role);
    localStorage.setItem("amica_auth", "true");
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("amica_role");
    localStorage.removeItem("amica_auth");
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <HashRouter>
          <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<BrowseCategoriesPage />} />
                <Route path="/provider/:id" element={<ProviderDetailPage />} />
                <Route path="/jobs" element={<JobOpportunitiesPage />} />
                <Route
                  path="/professionals"
                  element={<HealthcareProfessionalsPage />}
                />
                <Route path="/dashboard/clinic" element={<ClinicDashboard />} />
                <Route
                  path="/dashboard/employer"
                  element={<EmployerDashboard />}
                />
                <Route
                  path="/dashboard/seeker"
                  element={<JobSeekerDashboard />}
                />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route
                  path="/profile/seeker"
                  element={<JobSeekerProfilePage />}
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/checkout" element={<SubscriptionPage />} />
                <Route path="/apply/:id" element={<JobApplicationPage />} />
                <Route path="/contact" element={<EnquiryPage />} />
                <Route path="/faq" element={<FAQPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
