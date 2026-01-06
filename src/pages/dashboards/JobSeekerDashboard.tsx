
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Calendar, Bookmark, RefreshCcw, LogOut, User } from 'lucide-react';
import { useAuth } from '../../App';

const JobSeekerDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Applications', value: '8', bg: 'bg-primary', icon: FileText },
    { label: 'Interviews', value: '2', bg: 'bg-success', icon: Calendar },
    { label: 'Saved Jobs', value: '14', bg: 'bg-warning', icon: Bookmark },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in">
      <div className="container">
        <header className="mb-5 text-white">
          <h1 className="display-5 fw-bold mb-2">Job Seeker Dashboard</h1>
          <p className="opacity-50">Track applications and manage profile</p>
        </header>

        <div className="card rounded-5 shadow-lg border-0 overflow-hidden">
          <div className="card-header bg-dark p-4 d-flex justify-content-between align-items-center border-0">
            <h2 className="h5 fw-bold text-white mb-0">Amica Connect - Job Seeker</h2>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="card-body p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="row g-4 mb-5">
                  {stats.map((stat, i) => (
                    <div key={i} className="col-md-4">
                      <div className={`${stat.bg} p-4 rounded-4 shadow-sm text-white`}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <p className="small fw-bold opacity-75 mb-0 text-uppercase">{stat.label}</p>
                          <stat.icon size={20} className="opacity-75" />
                        </div>
                        <p className="h3 fw-black mb-0">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <section>
                  <h3 className="h4 fw-bold mb-4">Your Applications</h3>
                  <div className="d-flex flex-column gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="card p-4 rounded-4 border-0 bg-body-tertiary shadow-sm">
                        <div className="row align-items-center g-3">
                          <div className="col-auto">
                            <div className="bg-indigo bg-opacity-10 text-indigo p-2 rounded-3">
                              <FileText size={24} />
                            </div>
                          </div>
                          <div className="col">
                             <h4 className="h6 fw-bold mb-0">Advanced Nurse Specialist</h4>
                             <p className="x-small text-secondary mb-0">City Hospital • Dec 12, 2025</p>
                          </div>
                          <div className="col-auto">
                            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 small fw-bold">
                              <RefreshCcw size={12} className="me-1" /> Under Review
                            </span>
                          </div>
                          <div className="col-auto">
                             <button className="btn btn-white btn-sm border rounded-3 px-3 fw-bold">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="col-lg-4">
                 <div className="card p-4 rounded-5 border-0 bg-body-tertiary text-center shadow-sm">
                   <p className="x-small fw-black text-secondary text-uppercase mb-4" style={{fontSize: '0.6rem', letterSpacing: '0.1rem'}}>Profile Snapshot</p>
                   <div className="mx-auto mb-4 p-1 bg-white rounded-circle border border-2 border-dashed border-secondary-subtle" style={{width: '96px', height: '96px'}}>
                      <img src="https://i.pravatar.cc/150?u=seeker" className="w-100 h-100 rounded-circle object-fit-cover" alt="Profile" />
                   </div>
                   <h3 className="h5 fw-bold mb-1">Alex Johnson</h3>
                   <p className="small text-secondary mb-4">Medical Student • Final Year</p>
                   
                   <div className="text-start mb-4">
                     <div className="d-flex justify-content-between mb-2">
                       <p className="x-small fw-bold text-secondary mb-0">Profile Completion</p>
                       <p className="x-small fw-bold text-indigo mb-0">85%</p>
                     </div>
                     <div className="progress rounded-pill" style={{height: '6px'}}>
                       <div className="progress-bar bg-indigo" style={{width: '85%'}}></div>
                     </div>
                   </div>

                   <div className="d-grid gap-2">
                     <Link to="/profile/seeker" className="btn btn-primary rounded-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                       <User size={16} /> Edit Profile
                     </Link>
                     <button className="btn btn-outline-secondary rounded-3 py-2 fw-bold">Update Skills</button>
                   </div>
                 </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
