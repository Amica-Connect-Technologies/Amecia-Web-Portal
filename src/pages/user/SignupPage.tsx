import React from "react";
import { UserRole } from "../../../types";
import { Building2, Briefcase, User, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../App";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = React.useState<UserRole>(UserRole.JOB_SEEKER);

  const roles = [
    { id: UserRole.CLINIC, icon: Building2, label: "Clinic" },
    { id: UserRole.EMPLOYER, icon: Briefcase, label: "Employer" },
    { id: UserRole.JOB_SEEKER, icon: User, label: "Job Seeker" },
    { id: UserRole.ADMIN, icon: CheckCircle2, label: "Admin" },
  ];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);

    switch (role) {
      case UserRole.CLINIC:
        navigate("/dashboard/clinic");
        break;
      case UserRole.EMPLOYER:
        navigate("/dashboard/employer");
        break;
      case UserRole.JOB_SEEKER:
        navigate("/dashboard/seeker");
        break;
      case UserRole.ADMIN:
        navigate("/dashboard/admin");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center py-5">
      <div className="container" style={{ maxWidth: "650px" }}>
        <header className="text-center mb-5 text-white">
          <h1 className="fw-black h1 mb-3">Access Your Portal</h1>
          <p className="text-secondary">Select your role to continue</p>
        </header>

        <div className="card rounded-5 shadow-lg border-0">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold h2 mb-2 text-dark">Welcome Back</h2>
              <p className="text-secondary small">
                Join the Amica Connect network
              </p>
            </div>

            <div className="mb-4">
              <p
                className="small fw-black text-secondary text-uppercase tracking-widest mb-3"
                style={{ fontSize: "0.7rem" }}
              >
                Select Your Role
              </p>
              <div className="row g-2">
                {roles.map((r) => (
                  <div key={r.id} className="col-6 col-md-3">
                    <button
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`w-100 h-100 p-3 rounded-4 border-2 transition-all d-flex flex-column align-items-center gap-2 ${
                        role === r.id
                          ? "border-primary bg-light text-primary"
                          : "border-light bg-light bg-opacity-50 text-secondary"
                      }`}
                      style={{ borderStyle: "solid" }}
                    >
                      <r.icon size={24} />
                      <span
                        className="x-small fw-bold text-uppercase"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {r.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form className="d-flex flex-column gap-3" onSubmit={handleAuth}>
              <div className="form-group">
                <label
                  className="small fw-black text-secondary text-uppercase tracking-widest mb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Demo User"
                  className="form-control form-control-lg rounded-4 border-light bg-light"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  className="small fw-black text-secondary text-uppercase tracking-widest mb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="demo@amicaconnect.com"
                  className="form-control form-control-lg rounded-4 border-light bg-light"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  className="small fw-black text-secondary text-uppercase tracking-widest mb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  defaultValue="password123"
                  className="form-control form-control-lg rounded-4 border-light bg-light"
                  required
                />
              </div>

              <div className="form-check my-3 d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  defaultChecked
                  className="form-check-input"
                />
                <label
                  htmlFor="terms"
                  className="form-check-label small text-secondary"
                >
                  I agree to the{" "}
                  <span className="text-primary fw-bold">Terms</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-4 shadow py-3"
              >
                Login to Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
