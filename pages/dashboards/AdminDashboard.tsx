
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Stethoscope, Landmark, CreditCard, LogOut, Plus, Check, Eye, X, Trash2, MapPin, Award } from 'lucide-react';
import { useAuth } from '../../App';

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  status: 'Success' | 'Rejected' | 'Pending';
  time: string;
}

interface PendingJob {
  id: string;
  title: string;
  company: string;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([
    { id: '1', action: 'New Provider Signup', user: 'St. Jude Hospital', status: 'Success', time: '2m ago' },
    { id: '2', action: 'Subscription Renewal', user: 'City Health', status: 'Success', time: '15m ago' },
    { id: '3', action: 'System Update', user: 'Admin-01', status: 'Success', time: '1h ago' },
  ]);

  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([
    { id: 'p1', title: 'Cardiologist', company: 'City Health' },
    { id: 'p2', title: 'Senior RN', company: 'Metro Clinic' },
    { id: 'p3', title: 'Lab Director', company: 'BioLabs Inc' },
  ]);

  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', specialty: '', location: '' });

  const stats = [
    { label: 'Users', value: '1.2k', bg: 'bg-primary', icon: Users },
    { label: 'Jobs', value: '450', bg: 'bg-success', icon: Briefcase },
    { label: 'Providers', value: (86 + (recentActivity.filter(a => a.action === 'Provider Added').length)).toString(), bg: 'bg-warning', icon: Stethoscope },
    { label: 'Revenue', value: '$45k', bg: 'bg-indigo', icon: Landmark },
    { label: 'Subs', value: '124', bg: 'bg-danger', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const addActivity = (action: string, user: string, status: 'Success' | 'Rejected' | 'Pending' = 'Success') => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      user,
      status,
      time: 'Just now'
    };
    setRecentActivity(prev => [newLog, ...prev]);
  };

  const handleApprove = (job: PendingJob) => {
    setPendingJobs(prev => prev.filter(j => j.id !== job.id));
    addActivity('Job Approved', `${job.title} @ ${job.company}`, 'Success');
  };

  const handleReject = (jobId: string) => {
    setPendingJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProvider.name) {
      addActivity('Provider Added', newProvider.name, 'Success');
      setIsProviderModalOpen(false);
      setNewProvider({ name: '', specialty: '', location: '' });
    }
  };

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in">
      <div className="container-fluid px-md-5">
        <header className="mb-5 text-white">
          <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
          <p className="opacity-50">System management and healthcare network oversight</p>
        </header>

        <div className="card rounded-5 shadow-lg border-0 overflow-hidden">
          <div className="card-header bg-dark p-4 d-flex justify-content-between align-items-center border-0">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo rounded p-1 d-flex align-items-center justify-content-center text-white" style={{width: '32px', height: '32px', fontSize: '10px'}}>AC</div>
              <h2 className="h5 fw-bold text-white mb-0">Platform HQ</h2>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2 border-secondary text-secondary hover-bg-danger hover-text-white transition-all shadow-none">
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="card-body p-4 p-md-5">
            <div className="row g-3 mb-5">
              {stats.map((stat, i) => (
                <div key={i} className="col-6 col-md">
                  <div className={`${stat.bg || 'bg-secondary'} p-4 rounded-4 shadow-sm text-white h-100 transition-all hover-shadow`}>
                    <p className="x-small fw-bold opacity-75 mb-3 text-uppercase" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>{stat.label}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="h3 fw-black mb-0">{stat.value}</p>
                      <stat.icon size={18} className="opacity-75" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-5">
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h3 className="h5 fw-bold mb-0">Recent Activity Log</h3>
                  <button onClick={() => setRecentActivity([])} className="btn btn-link text-secondary x-small fw-bold text-decoration-none p-0">Clear Logs</button>
                </div>
                <div className="card rounded-4 border shadow-sm overflow-hidden border-0 bg-light">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-white">
                        <tr className="x-small fw-black text-uppercase text-secondary" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Entity</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-end">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.length > 0 ? recentActivity.map((log) => (
                          <tr key={log.id} className="bg-white border-bottom">
                            <td className="px-4 py-3 fw-bold small text-dark">{log.action}</td>
                            <td className="px-4 py-3 small text-secondary">{log.user}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`badge rounded-pill fw-black x-small text-uppercase px-2 py-1 ${log.status === 'Success' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 x-small text-secondary text-end fw-medium">{log.time}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center py-5 text-secondary small italic">No recent activities found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <aside className="col-lg-4">
                <div className="mb-5">
                  <h3 className="h5 fw-bold mb-4 text-dark border-bottom pb-2">Quick Commands</h3>
                  <div className="d-grid gap-3">
                    <button onClick={() => setIsProviderModalOpen(true)} className="btn btn-primary btn-lg rounded-4 fw-bold py-3 d-flex justify-content-between align-items-center shadow-sm">
                      Add New Provider <Plus size={20} />
                    </button>
                    <button className="btn btn-light btn-lg rounded-4 fw-bold py-3 text-start d-flex justify-content-between align-items-center border shadow-sm text-dark">
                      Manage Subscriptions <CreditCard size={20} />
                    </button>
                    <button className="btn btn-light btn-lg rounded-4 fw-bold py-3 text-start d-flex justify-content-between align-items-center border shadow-sm text-dark">
                      Generate Revenue Report <Landmark size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="h5 fw-bold mb-4 text-dark border-bottom pb-2 d-flex align-items-center justify-content-between">
                    Pending Jobs
                    <span className="badge bg-indigo rounded-pill x-small">{pendingJobs.length}</span>
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {pendingJobs.length > 0 ? pendingJobs.map(job => (
                      <div key={job.id} className="card rounded-4 p-3 border shadow-sm bg-white animate-fade-in">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                           <div>
                              <p className="small fw-bold mb-0 text-dark">{job.title}</p>
                              <p className="x-small text-secondary mb-0 fw-medium">at {job.company}</p>
                           </div>
                           <button onClick={() => handleReject(job.id)} className="btn btn-link text-danger p-0 border-0" title="Reject & Delete">
                             <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="row g-2 mt-2">
                          <div className="col">
                            <button onClick={() => handleApprove(job)} className="btn btn-indigo btn-sm w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-1 py-2 shadow-sm">
                              <Check size={14} /> Approve
                            </button>
                          </div>
                          <div className="col">
                            <button onClick={() => handleReject(job.id)} className="btn btn-outline-danger btn-sm w-100 rounded-3 fw-bold py-2 shadow-sm">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-5 bg-light rounded-4 border border-dashed border-secondary-subtle">
                         <Briefcase size={32} className="text-secondary opacity-25 mb-2 mx-auto" />
                         <p className="x-small text-secondary fw-bold mb-0">All clear! No pending approvals.</p>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Add Provider Modal */}
      {isProviderModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 px-3" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="card rounded-5 border-0 shadow-lg animate-fade-in" style={{width: '100%', maxWidth: '500px'}}>
            <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center rounded-top-5">
              <h4 className="h5 fw-bold mb-0 text-dark">Onboard New Provider</h4>
              <button onClick={() => setIsProviderModalOpen(false)} className="btn btn-light rounded-circle p-2 text-secondary hover-text-dark border-0 shadow-none">
                <X size={20} />
              </button>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleAddProvider} className="d-flex flex-column gap-4">
                <div>
                  <label className="x-small fw-black text-secondary text-uppercase mb-2 d-flex align-items-center gap-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>
                    <Stethoscope size={14} className="text-indigo" /> Facility / Doctor Name
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg rounded-3 border-0 bg-light shadow-none" 
                    placeholder="e.g. St. Jude Hospital" 
                    required 
                    value={newProvider.name}
                    onChange={e => setNewProvider({...newProvider, name: e.target.value})}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2 d-flex align-items-center gap-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>
                      <Award size={14} className="text-indigo" /> Specialty
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg rounded-3 border-0 bg-light shadow-none" 
                      placeholder="e.g. Cardiology" 
                      required 
                      value={newProvider.specialty}
                      onChange={e => setNewProvider({...newProvider, specialty: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2 d-flex align-items-center gap-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>
                      <MapPin size={14} className="text-indigo" /> Location
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg rounded-3 border-0 bg-light shadow-none" 
                      placeholder="e.g. Houston, TX" 
                      required 
                      value={newProvider.location}
                      onChange={e => setNewProvider({...newProvider, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button type="button" onClick={() => setIsProviderModalOpen(false)} className="btn btn-light btn-lg rounded-4 flex-grow-1 fw-bold text-secondary border">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-4 flex-grow-2 fw-bold d-flex align-items-center justify-content-center gap-2 px-5 shadow-sm">
                    <Check size={20} /> Onboard Provider
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
