
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, DollarSign, Clock, Filter, 
  ChevronDown, Bookmark, Briefcase, Pill, 
  FlaskConical, Stethoscope, HeartPulse, Activity,
  Plus, X, Check, Camera, Trash2, RefreshCcw
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  loc: string;
  salary: string;
  type: string;
  posted: string;
  experience: string;
  logo: string;
}

const INITIAL_JOBS: Job[] = [
  { 
    id: '1', 
    title: 'Senior Registered Nurse', 
    company: 'Mercy Hospital', 
    loc: 'Los Angeles, CA', 
    salary: '$95k - $120k', 
    type: 'Full-time', 
    posted: '2 days ago', 
    experience: 'Senior',
    logo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=128&h=128'
  },
  { 
    id: '2', 
    title: 'General Practitioner', 
    company: 'HealthLink Clinic', 
    loc: 'San Francisco, CA', 
    salary: '$180k - $220k', 
    type: 'Contract', 
    posted: '5h ago', 
    experience: 'Intermediate',
    logo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=128&h=128'
  },
  { 
    id: '3', 
    title: 'Medical Laboratory Tech', 
    company: 'BioTech Diagnostics', 
    loc: 'Houston, TX', 
    salary: '$60k - $80k', 
    type: 'Part-time', 
    posted: '1 week ago', 
    experience: 'Entry Level',
    logo: 'https://images.unsplash.com/photo-1581595221475-199128969795?auto=format&fit=crop&q=80&w=128&h=128'
  }
];

const JobLogo = ({ src, alt, title }: { src: string, alt: string, title: string }) => {
  const [error, setError] = useState(false);

  const getFallbackIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('nurse') || t.includes('rn') || t.includes('care')) return <HeartPulse size={28} className="opacity-75" />;
    if (t.includes('lab') || t.includes('laboratory') || t.includes('diagnostics')) return <FlaskConical size={28} className="opacity-75" />;
    if (t.includes('pharmacy') || t.includes('pharmacist') || t.includes('medication')) return <Pill size={28} className="opacity-75" />;
    if (t.includes('surgical') || t.includes('surgery')) return <Activity size={28} className="opacity-75" />;
    if (t.includes('doctor') || t.includes('practitioner') || t.includes('physician') || t.includes('gp')) return <Stethoscope size={28} className="opacity-75" />;
    return <Briefcase size={28} className="opacity-75" />;
  };

  if (error || !src) {
    return (
      <div className="bg-body-tertiary text-indigo border border-indigo-subtle rounded-4 d-flex align-items-center justify-content-center shadow-sm" style={{width: '64px', height: '64px'}}>
        {getFallbackIcon()}
      </div>
    );
  }

  return (
    <div className="rounded-4 overflow-hidden shadow-sm border border-indigo-subtle bg-white p-1" style={{width: '64px', height: '64px'}}>
      <img 
        src={src} 
        alt={alt} 
        className="w-100 h-100 rounded-3 object-fit-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

const JobOpportunitiesPage: React.FC = () => {
  const [jobsList, setJobsList] = useState<Job[]>(INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: '',
    loc: '',
    salary: '',
    type: 'Full-time',
    experience: 'Intermediate',
    logo: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobsList.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = job.loc.toLowerCase().includes(locationTerm.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchTerm, locationTerm, selectedTypes, jobsList]);

  const openModal = () => {
    setFormData({
      title: '',
      company: '',
      loc: '',
      salary: '',
      type: 'Full-time',
      experience: 'Intermediate',
      logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=128&h=128`
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      ...formData as Job,
      id: Date.now().toString(),
      posted: 'Just now'
    };
    setJobsList(prev => [newJob, ...prev]);
    closeModal();
  };

  const confirmDelete = (id: string) => {
    setJobsList(prev => prev.filter(job => job.id !== id));
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
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <div>
            <h1 className="h2 fw-bold mb-1 text-dark">Job Opportunities</h1>
            <p className="text-secondary small mb-0">Browse and search healthcare job opportunities</p>
          </div>
          <button 
            onClick={openModal}
            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center gap-2"
          >
            <Plus size={18} /> Post a Job
          </button>
        </div>

        <div className="card p-3 rounded-4 shadow-sm border-0 mb-5 bg-white">
          <div className="row g-3">
            <div className="col-md-5 d-flex align-items-center bg-body-tertiary rounded-3 px-3 border-0">
              <Search className="text-secondary me-2" size={20} />
              <input 
                type="text" 
                placeholder="Job title, keywords..." 
                className="form-control border-0 bg-transparent py-3 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-center bg-body-tertiary rounded-3 px-3 border-0">
              <MapPin className="text-secondary me-2" size={20} />
              <input 
                type="text" 
                placeholder="Location" 
                className="form-control border-0 bg-transparent py-3 shadow-none"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary btn-lg w-100 rounded-3 fw-bold">Search</button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <aside className="col-lg-3">
            <div className="card p-4 rounded-4 shadow-sm border-0 sticky-top bg-white" style={{top: '100px'}}>
              <h3 className="h6 fw-bold mb-4 d-flex align-items-center gap-2 text-dark"><Filter size={18} /> Filters</h3>
              <div className="mb-4">
                <h4 className="x-small fw-bold text-secondary text-uppercase mb-3" style={{fontSize: '0.65rem'}}>Job Type</h4>
                {['Full-time', 'Part-time', 'Contract'].map(t => (
                  <div key={t} className="form-check mb-2">
                    <input 
                      type="checkbox" 
                      className="form-check-input shadow-none"
                      id={`type-${t}`}
                      checked={selectedTypes.includes(t)}
                      onChange={() => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    />
                    <label className="form-check-label small" htmlFor={`type-${t}`}>{t}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="col-lg-9">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-4 rounded-4 border-0 shadow-sm mb-3 bg-white animate-pulse">
                   <div className="row align-items-center g-3">
                     <div className="col-auto"><div className="bg-light rounded-4" style={{width: '64px', height: '64px'}}></div></div>
                     <div className="col"><div className="bg-light rounded h-4 w-50 mb-2"></div><div className="bg-light rounded h-3 w-25"></div></div>
                   </div>
                </div>
              ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="card p-4 rounded-4 border-0 shadow-sm mb-3 hover-shadow transition-all bg-white border">
                  <div className="row align-items-center g-4">
                    <div className="col-auto">
                      <JobLogo src={job.logo} alt={job.company} title={job.title} />
                    </div>
                    <div className="col">
                      <div className="d-flex justify-content-between">
                         <h3 className="h5 fw-bold mb-1 text-dark">{job.title}</h3>
                         <span className="badge bg-light text-secondary border rounded-pill x-small d-md-none">{job.experience}</span>
                      </div>
                      <p className="text-indigo fw-bold small mb-2">{job.company}</p>
                      <div className="d-flex flex-wrap gap-3 text-secondary x-small fw-medium">
                        <span className="d-flex align-items-center gap-1"><MapPin size={12} /> {job.loc}</span>
                        <span className="d-flex align-items-center gap-1"><DollarSign size={12} /> {job.salary}</span>
                        <span className="d-flex align-items-center gap-1"><Clock size={12} /> {job.posted}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-auto">
                      <div className="d-flex align-items-center gap-2">
                         {deleteConfirmId === job.id ? (
                           <div className="d-flex align-items-center gap-2 animate-fade-in bg-danger-subtle p-2 rounded-3 border border-danger border-opacity-25 shadow-sm">
                              <span className="x-small fw-bold text-danger px-1">Delete?</span>
                              <button onClick={() => confirmDelete(job.id)} className="btn btn-danger btn-sm rounded-2 px-3 fw-bold">Yes</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-light btn-sm rounded-2 px-3 border fw-bold">No</button>
                           </div>
                         ) : (
                           <>
                            <Link to={`/apply/${job.id}`} className="btn btn-primary px-4 rounded-3 fw-bold flex-grow-1">Apply Now</Link>
                            <button className="btn btn-light rounded-3 text-secondary p-2 shadow-sm border"><Bookmark size={20} /></button>
                            <button 
                              onClick={() => setDeleteConfirmId(job.id)}
                              className="btn btn-light text-danger p-2 rounded-3 hover-bg-danger-subtle border shadow-sm"
                            >
                              <Trash2 size={18} />
                            </button>
                           </>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-5 rounded-5 border-0 shadow-sm text-center bg-white">
                <Search size={48} className="text-light mb-4 mx-auto" />
                <h3 className="h4 fw-bold">No jobs found</h3>
                <p className="text-secondary small">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post a Job Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 px-3" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="card rounded-5 border-0 shadow-lg animate-fade-in" style={{width: '100%', maxWidth: '600px'}}>
            <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center rounded-top-5">
              <h4 className="h5 fw-bold mb-0 text-dark">Post a New Opportunity</h4>
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
                   <p className="x-small text-secondary mt-3 mb-0">Upload company logo or generate placeholder</p>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Job Title</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. Registered Nurse" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Company Name</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. City General" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Location</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. New York, NY" required value={formData.loc} onChange={e => setFormData({...formData, loc: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Salary Range</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-light" placeholder="e.g. $80k - $100k" required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Job Type</label>
                    <select className="form-select form-select-lg rounded-3 border-0 bg-light" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="button" onClick={closeModal} className="btn btn-light btn-lg rounded-4 flex-grow-1 fw-bold text-secondary border">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-4 flex-grow-2 fw-bold d-flex align-items-center justify-content-center gap-2 px-5 shadow-sm">
                    <Check size={20} /> Publish Job
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

export default JobOpportunitiesPage;
