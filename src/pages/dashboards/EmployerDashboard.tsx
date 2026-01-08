
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, FileText, Calendar, CheckCircle, Plus, 
  Edit2, Eye, EyeOff, LogOut, Trash2, X, Check, Camera, RefreshCcw 
} from 'lucide-react';
import { useAuth } from '../../../App';

interface JobListing {
  id: string;
  title: string;
  applications: number;
  postedDate: string;
  status: 'Active' | 'Hidden';
  location: string;
  salary: string;
  logo: string;
}

const INITIAL_JOBS: JobListing[] = [
  { 
    id: '1', 
    title: 'Registered Nurse', 
    applications: 12, 
    postedDate: '2 days ago', 
    status: 'Active',
    location: 'Los Angeles, CA',
    salary: '$90k - $110k',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=128&h=128'
  },
  { 
    id: '2', 
    title: 'Physiotherapist', 
    applications: 8, 
    postedDate: '4 days ago', 
    status: 'Active',
    location: 'Houston, TX',
    salary: '$75k - $95k',
    logo: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?auto=format&fit=crop&q=80&w=128&h=128'
  },
  { 
    id: '3', 
    title: 'Medical Admin', 
    applications: 24, 
    postedDate: '1 week ago', 
    status: 'Hidden',
    location: 'New York, NY',
    salary: '$50k - $65k',
    logo: 'https://images.unsplash.com/photo-1586773860418-d319a39ec52d?auto=format&fit=crop&q=80&w=128&h=128'
  }
];

const EmployerDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<JobListing>>({
    title: '',
    location: '',
    salary: '',
    logo: ''
  });

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Active').length.toString(), bg: 'bg-primary', icon: Briefcase },
    { label: 'Total Apps', value: jobs.reduce((acc, curr) => acc + curr.applications, 0).toString(), bg: 'bg-success', icon: FileText },
    { label: 'Interviews', value: '5', bg: 'bg-warning', icon: Calendar },
    { label: 'Hired', value: '2', bg: 'bg-info', icon: CheckCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openModal = (job?: JobListing) => {
    if (job) {
      setEditingJob(job);
      setFormData({ ...job });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        location: '',
        salary: '',
        logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=128&h=128`
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...formData } : j));
    } else {
      const newJob: JobListing = {
        ...formData as JobListing,
        id: Date.now().toString(),
        applications: 0,
        postedDate: 'Just now',
        status: 'Active'
      };
      setJobs(prev => [newJob, ...prev]);
    }
    closeModal();
  };

  const toggleStatus = (id: string) => {
    setJobs(prev => prev.map(j => 
      j.id === id ? { ...j, status: j.status === 'Active' ? 'Hidden' : 'Active' } : j
    ));
  };

  const confirmDelete = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setDeleteConfirmId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const shuffleLogo = () => {
    setFormData(prev => ({ 
      ...prev, 
      logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=128&h=128` 
    }));
  };

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in" style={{backgroundColor: '#0f172a !important'}}>
      <div className="container">
        <header className="mb-5 text-white">
          <h1 className="display-5 fw-bold mb-2">Employer Dashboard</h1>
          <p className="opacity-50">Manage your hiring pipeline and job listings</p>
        </header>

        <div className="card rounded-5 shadow-lg border-0 overflow-hidden bg-body">
          <div className="card-header bg-dark p-4 d-flex justify-content-between align-items-center border-0">
             <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo rounded p-1 d-flex align-items-center justify-content-center text-white" style={{width: '32px', height: '32px', fontSize: '10px'}}>AC</div>
              <h2 className="h5 fw-bold text-white mb-0">Employer Command Center</h2>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2 border-secondary text-secondary hover-bg-danger hover-text-white transition-all shadow-none">
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="card-body p-4 p-md-5">
            {/* Stats Grid */}
            <div className="row g-4 mb-5">
              {stats.map((stat, i) => (
                <div key={i} className="col-sm-6 col-lg-3">
                  <div className={`${stat.bg} p-4 rounded-4 shadow-sm text-white transition-all hover-shadow`}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <p className="small fw-bold opacity-75 mb-0 text-uppercase" style={{letterSpacing: '0.05rem'}}>{stat.label}</p>
                      <stat.icon size={20} className="opacity-75" />
                    </div>
                    <p className="h2 fw-black mb-0">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-5">
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h3 className="h5 fw-bold mb-0 text-dark">Your Job Listings</h3>
                  <button onClick={() => openModal()} className="btn btn-primary rounded-3 d-flex align-items-center gap-2 fw-bold shadow-sm px-4">
                    <Plus size={18} /> Post Job
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-3">
                  {jobs.length > 0 ? jobs.map((j) => (
                    <div key={j.id} className={`p-3 bg-white border rounded-4 shadow-sm transition-all hover-shadow-sm d-flex align-items-center justify-content-between ${j.status === 'Hidden' ? 'opacity-75 bg-light' : ''}`}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 overflow-hidden shadow-sm border p-1 bg-white" style={{width: '60px', height: '60px'}}>
                          <img src={j.logo} className="w-100 h-100 object-fit-cover rounded-2" alt={j.title} />
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <p className="fw-bold mb-0 text-dark lh-sm">{j.title}</p>
                            <span className={`badge rounded-pill x-small px-2 ${j.status === 'Active' ? 'bg-success-subtle text-success border border-success' : 'bg-secondary-subtle text-secondary border border-secondary'}`}>
                              {j.status}
                            </span>
                          </div>
                          <p className="text-secondary x-small fw-semibold text-uppercase mb-0" style={{fontSize: '0.65rem'}}>
                            {j.applications} Applications • {j.postedDate} • {j.location}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {deleteConfirmId === j.id ? (
                          <div className="d-flex align-items-center gap-2 animate-fade-in bg-danger-subtle p-2 rounded-3 border border-danger border-opacity-25 shadow-sm">
                            <span className="x-small fw-bold text-danger px-1">Delete?</span>
                            <button onClick={() => confirmDelete(j.id)} className="btn btn-danger btn-sm rounded-2 px-3 fw-bold">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="btn btn-light btn-sm rounded-2 px-3 border fw-bold">No</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => toggleStatus(j.id)} className={`btn btn-light p-2 rounded-3 border shadow-sm transition-all ${j.status === 'Active' ? 'text-secondary hover-text-indigo' : 'text-indigo hover-text-success'}`} title={j.status === 'Active' ? 'Hide Job' : 'Show Job'}>
                              {j.status === 'Active' ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button onClick={() => openModal(j)} className="btn btn-light text-secondary p-2 rounded-3 border shadow-sm transition-all hover-text-indigo" title="Edit Job">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(j.id)} className="btn btn-light text-danger p-2 rounded-3 border shadow-sm transition-all hover-bg-danger-subtle" title="Delete Job">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-5 border border-dashed rounded-4 bg-light">
                      <Briefcase size={48} className="text-secondary opacity-25 mb-3 mx-auto" />
                      <p className="text-secondary mb-0 fw-bold">No job listings yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <h3 className="h5 fw-bold mb-4 text-dark border-bottom pb-2">Upcoming Interviews</h3>
                <div className="d-flex flex-column gap-3">
                  {[
                    { name: 'Sarah Smith', time: 'Tomorrow 10:00 AM', role: 'RN' },
                    { name: 'Mark Wilson', time: 'Wed 2:30 PM', role: 'Physio' }
                  ].map((interview, i) => (
                    <div key={i} className="d-flex gap-3 p-3 bg-white rounded-4 border shadow-sm hover-border-indigo transition-all">
                       <div className="bg-indigo-subtle text-indigo rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{width: '48px', height: '48px', flexShrink: 0}}>
                         <Calendar size={20} />
                       </div>
                       <div>
                         <p className="fw-bold mb-0 text-dark small">Interview with {interview.name}</p>
                         <p className="x-small text-secondary fw-semibold text-uppercase mb-1" style={{fontSize: '0.6rem'}}>{interview.role}</p>
                         <p className="x-small text-indigo fw-bold mb-0" style={{fontSize: '0.65rem'}}>{interview.time}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="card bg-indigo text-white p-4 rounded-5 border-0 shadow-lg mt-4 overflow-hidden position-relative">
                   <div className="position-absolute bottom-0 end-0 bg-white opacity-10 rounded-circle" style={{width: '80px', height: '80px', transform: 'translate(20%, 20%)'}}></div>
                   <h4 className="h6 fw-bold mb-2">Hiring Tips</h4>
                   <p className="x-small opacity-75 mb-0">Verified profiles receive 4x more applications on average.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post/Edit Job Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 px-3" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="card rounded-5 border-0 shadow-lg animate-fade-in" style={{width: '100%', maxWidth: '550px'}}>
            <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center rounded-top-5">
              <h4 className="h5 fw-bold mb-0 text-dark">{editingJob ? 'Update Listing' : 'Post New Job'}</h4>
              <button onClick={closeModal} className="btn btn-light rounded-circle p-2 text-secondary hover-text-dark border-0">
                <X size={20} />
              </button>
            </div>
            <div className="card-body p-4 p-md-5 overflow-auto" style={{maxHeight: '80vh'}}>
              <form onSubmit={handleSave} className="d-flex flex-column gap-4">
                <div className="text-center mb-2">
                   <div className="position-relative d-inline-block">
                      <div className="rounded-4 border p-1 bg-white shadow-sm overflow-hidden" style={{width: '100px', height: '100px'}}>
                         <img src={formData.logo} className="w-100 h-100 rounded-3 object-fit-cover" alt="Preview" />
                      </div>
                      <div className="position-absolute bottom-0 end-0 d-flex gap-1" style={{transform: 'translate(20%, 20%)'}}>
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-sm rounded-circle p-2 border-white border-2 shadow hover-scale transition-all" title="Upload Logo">
                           <Camera size={14} />
                         </button>
                         <button type="button" onClick={shuffleLogo} className="btn btn-indigo btn-sm rounded-circle p-2 border-white border-2 shadow hover-scale transition-all" title="Shuffle Logo">
                           <RefreshCcw size={14} />
                         </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="d-none" accept="image/*" />
                   </div>
                   <p className="x-small text-secondary mt-3 mb-0">Upload facility logo or generate placeholder</p>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Job Title</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. Clinical Director" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Location</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. Dallas, TX" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Salary Range</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. $100k - $120k" required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="button" onClick={closeModal} className="btn btn-light btn-lg rounded-4 flex-grow-1 fw-bold text-secondary border">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-4 flex-grow-2 fw-bold d-flex align-items-center justify-content-center gap-2 px-5 shadow-sm">
                    <Check size={20} /> {editingJob ? 'Update Listing' : 'Publish Job'}
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

export default EmployerDashboard;
