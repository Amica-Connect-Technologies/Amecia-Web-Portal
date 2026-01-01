
import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, FileText, 
  Upload, Save, Edit2, History, CheckCircle, Trash2, X, Plus, Check, HeartPulse, Stethoscope
} from 'lucide-react';

interface Resume {
  id: string;
  name: string;
  size: string;
  date: string;
}

const JobSeekerProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSkill, setNewSkill] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 (555) 0123',
    location: 'San Francisco, CA',
    title: 'Senior Registered Nurse',
    bio: 'Dedicated healthcare professional with over 8 years of experience in critical care. Seeking a role in a fast-paced emergency department where I can utilize my pediatric and trauma training.',
    skills: ['Critical Care', 'Emergency', 'Pediatrics', 'Trauma Nursing', 'Advanced Life Support']
  });

  const [resumes, setResumes] = useState<Resume[]>([
    { id: '1', name: 'Alex_Johnson_CV_2024.pdf', size: '2.4 MB', date: '2 days ago' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: 'Just now'
      };
      setResumes(prev => [newResume, ...prev]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    setDeleteConfirmId(null);
  };

  const applications = [
    {
      id: 1,
      title: 'Advanced Nurse Specialist',
      company: 'City General Hospital',
      date: 'Dec 12, 2025',
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=128&h=128',
      status: 'Under Review'
    },
    {
      id: 2,
      title: 'Registered Nurse (Emergency)',
      company: 'Mercy Health Care',
      date: 'Dec 10, 2025',
      logo: 'https://images.unsplash.com/photo-1586773860418-d319a39ec52d?auto=format&fit=crop&q=80&w=128&h=128',
      status: 'Under Review'
    }
  ];

  return (
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container" style={{maxWidth: '1000px'}}>
        {/* Header Card */}
        <div className="card rounded-5 border-0 shadow-sm overflow-hidden mb-4 bg-white">
          <div className="bg-indigo" style={{height: '140px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}></div>
          <div className="card-body px-4 pb-4">
             <div className="row align-items-end g-4" style={{marginTop: '-70px'}}>
                <div className="col-auto">
                   <div className="bg-white p-1 rounded-circle shadow-lg position-relative mx-auto mx-md-0" style={{width: '130px', height: '130px'}}>
                      <img src="https://i.pravatar.cc/150?u=seeker" className="rounded-circle border w-100 h-100 object-fit-cover" alt="Alex" />
                      <button className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow border-2 border-white">
                        <Upload size={14} />
                      </button>
                   </div>
                </div>
                <div className="col text-center text-md-start mb-2">
                   <h1 className="h3 fw-bold mb-1 text-dark">{profile.name}</h1>
                   <p className="text-indigo fw-bold small mb-2">{profile.title}</p>
                   <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 x-small text-secondary fw-bold text-uppercase" style={{letterSpacing: '0.05rem'}}>
                      <span className="d-flex align-items-center gap-1"><MapPin size={12} /> {profile.location}</span>
                      <span className="d-flex align-items-center gap-1"><Briefcase size={12} /> {profile.skills.length} Specializations</span>
                   </div>
                </div>
                <div className="col-12 col-md-auto text-center">
                   {isEditing ? (
                     <button onClick={() => setIsEditing(false)} className="btn btn-primary rounded-4 px-5 py-3 fw-bold d-flex align-items-center gap-2 mx-auto shadow-sm">
                        <Check size={20} /> Save Changes
                     </button>
                   ) : (
                     <button onClick={() => setIsEditing(true)} className="btn btn-light border rounded-4 px-5 py-3 fw-bold d-flex align-items-center gap-2 mx-auto shadow-sm">
                        <Edit2 size={18} /> Edit Profile
                     </button>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card p-2 rounded-pill bg-white shadow-sm mb-4 d-inline-block mx-auto mx-md-0 border-0">
          <ul className="nav nav-pills gap-1 flex-nowrap overflow-x-auto no-scrollbar">
            <li className="nav-item">
              <button onClick={() => setActiveTab('personal')} className={`nav-link fw-bold px-4 py-2 rounded-pill transition-all ${activeTab === 'personal' ? 'active bg-indigo shadow-sm' : 'text-secondary hover-bg-light'}`}>Personal Info</button>
            </li>
            <li className="nav-item">
              <button onClick={() => setActiveTab('documents')} className={`nav-link fw-bold px-4 py-2 rounded-pill transition-all ${activeTab === 'documents' ? 'active bg-indigo shadow-sm' : 'text-secondary hover-bg-light'}`}>Documents</button>
            </li>
            <li className="nav-item">
              <button onClick={() => setActiveTab('history')} className={`nav-link fw-bold px-4 py-2 rounded-pill transition-all ${activeTab === 'history' ? 'active bg-indigo shadow-sm' : 'text-secondary hover-bg-light'}`}>Applications</button>
            </li>
          </ul>
        </div>

        <div className="row g-4 mb-5">
           <div className="col-lg-8">
              {activeTab === 'personal' && (
                <div className="d-flex flex-column gap-4 animate-fade-in">
                   <div className="card p-4 p-md-5 rounded-4 border-0 shadow-sm bg-white">
                      <h3 className="h5 fw-bold mb-4 d-flex align-items-center gap-2 text-indigo">
                        <User size={20} /> 
                        {isEditing ? 'Update Personal Details' : 'Basic Details'}
                      </h3>
                      <div className="row g-4">
                         <div className="col-md-6">
                            <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Full Name</label>
                            {isEditing ? (
                              <input type="text" name="name" className="form-control form-control-lg rounded-3 border-0 bg-light" value={profile.name} onChange={handleInputChange} />
                            ) : (
                              <p className="fw-bold mb-0 text-dark">{profile.name}</p>
                            )}
                         </div>
                         <div className="col-md-6">
                            <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Professional Title</label>
                            {isEditing ? (
                              <input type="text" name="title" className="form-control form-control-lg rounded-3 border-0 bg-light" value={profile.title} onChange={handleInputChange} />
                            ) : (
                              <p className="fw-bold mb-0 text-dark">{profile.title}</p>
                            )}
                         </div>
                         <div className="col-md-6">
                            <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Email Address</label>
                            {isEditing ? (
                              <input type="email" name="email" className="form-control form-control-lg rounded-3 border-0 bg-light" value={profile.email} onChange={handleInputChange} />
                            ) : (
                              <p className="fw-bold mb-0 text-dark">{profile.email}</p>
                            )}
                         </div>
                         <div className="col-md-6">
                            <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Phone Number</label>
                            {isEditing ? (
                              <input type="text" name="phone" className="form-control form-control-lg rounded-3 border-0 bg-light" value={profile.phone} onChange={handleInputChange} />
                            ) : (
                              <p className="fw-bold mb-0 text-dark">{profile.phone}</p>
                            )}
                         </div>
                      </div>
                   </div>

                   <div className="card p-4 p-md-5 rounded-4 border-0 shadow-sm bg-white">
                      <h3 className="h5 fw-bold mb-4 text-dark">About Me</h3>
                      {isEditing ? (
                        <textarea 
                          name="bio" 
                          className="form-control form-control-lg rounded-3 border-0 bg-light p-3" 
                          rows={6} 
                          value={profile.bio} 
                          onChange={handleInputChange}
                          placeholder="Tell potential employers about your experience and goals..."
                        ></textarea>
                      ) : (
                        <p className="text-secondary lh-lg mb-0">{profile.bio}</p>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="d-flex flex-column gap-4 animate-fade-in">
                   <div className="card p-4 p-md-5 rounded-4 border-0 shadow-sm bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                         <div>
                            <h3 className="h5 fw-bold mb-1 text-dark">Professional Resumes</h3>
                            <p className="small text-secondary mb-0">Manage your CVs for job applications</p>
                         </div>
                         <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary px-4 rounded-3 d-flex align-items-center gap-2 fw-bold shadow-sm">
                            <Upload size={18} /> Upload New
                         </button>
                         <input type="file" ref={fileInputRef} className="d-none" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                      </div>
                      
                      <div className="d-flex flex-column gap-3">
                         {resumes.length > 0 ? resumes.map(r => (
                           <div key={r.id} className="p-3 bg-light rounded-4 border d-flex align-items-center justify-content-between transition-all hover-border-indigo">
                              <div className="d-flex align-items-center gap-3">
                                 <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3 shadow-sm"><FileText size={24} /></div>
                                 <div>
                                    <p className="fw-bold mb-0 small text-dark">{r.name}</p>
                                    <p className="x-small text-secondary mb-0 fw-medium">{r.size} • Uploaded {r.date}</p>
                                 </div>
                              </div>
                              <div className="d-flex gap-2">
                                {deleteConfirmId === r.id ? (
                                  <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-3 border shadow-sm animate-fade-in">
                                    <span className="x-small fw-bold text-danger px-1">Delete?</span>
                                    <button onClick={() => deleteResume(r.id)} className="btn btn-danger btn-sm rounded-2 fw-bold px-3">Yes</button>
                                    <button onClick={() => setDeleteConfirmId(null)} className="btn btn-light btn-sm rounded-2 fw-bold border px-3">No</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setDeleteConfirmId(r.id)} className="btn btn-light text-danger p-2 rounded-3 hover-bg-danger-subtle transition-all border shadow-sm">
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                           </div>
                         )) : (
                           <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                              <FileText size={48} className="text-secondary opacity-25 mb-3 mx-auto" />
                              <p className="text-secondary small fw-bold mb-0">No resumes uploaded yet</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="d-flex flex-column gap-3 animate-fade-in">
                   {applications.map(app => (
                     <div key={app.id} className="card p-4 rounded-4 border-0 shadow-sm bg-white hover-border-indigo transition-all">
                        <div className="row align-items-center g-3">
                           <div className="col-auto">
                             <div className="rounded-3 overflow-hidden shadow-sm border" style={{width: '56px', height: '56px'}}>
                               <img src={app.logo} className="w-100 h-100 object-fit-cover" alt={app.company} />
                             </div>
                           </div>
                           <div className="col">
                              <h4 className="h6 fw-bold mb-1 text-dark">{app.title}</h4>
                              <p className="x-small text-secondary mb-0 fw-medium">{app.company} • Applied {app.date}</p>
                           </div>
                           <div className="col-auto text-end">
                              <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2 x-small fw-bold border border-warning-subtle">
                                {app.status}
                              </span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <aside className="col-lg-4">
              <div className="card p-4 rounded-4 border-0 shadow-sm mb-4 bg-white">
                 <h3 className="h6 fw-bold mb-4 d-flex justify-content-between align-items-center text-dark">
                   Skills & Specialty
                   {!isEditing && <span className="badge bg-indigo-subtle text-indigo rounded-pill x-small px-2">Focus</span>}
                 </h3>
                 <div className="d-flex flex-wrap gap-2 mb-4">
                    {profile.skills.map(s => (
                      <div key={s} className="badge bg-body-tertiary text-dark border px-3 py-2 rounded-3 small fw-medium d-flex align-items-center gap-2">
                        {s}
                        {isEditing && (
                          <button onClick={() => removeSkill(s)} className="btn btn-link p-0 text-danger border-0">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                 </div>
                 
                 {isEditing && (
                   <div className="input-group input-group-sm animate-fade-in shadow-sm">
                     <input 
                       type="text" 
                       className="form-control border-0 bg-light" 
                       placeholder="Add new skill..." 
                       value={newSkill}
                       onChange={e => setNewSkill(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && addSkill()}
                     />
                     <button onClick={addSkill} className="btn btn-indigo px-3">
                       <Plus size={14} />
                     </button>
                   </div>
                 )}
              </div>

              <div className="card p-4 rounded-5 border-0 shadow-lg bg-dark text-white text-center overflow-hidden position-relative">
                 <div className="position-absolute bottom-0 end-0 bg-white opacity-10 rounded-circle" style={{width: '100px', height: '100px', transform: 'translate(20%, 20%)'}}></div>
                 <h4 className="h6 fw-bold mb-2 position-relative z-1">Profile Visibility</h4>
                 <p className="x-small opacity-50 mb-4 position-relative z-1">Control how verified employers see your profile in searches.</p>
                 <div className="bg-white bg-opacity-10 rounded-4 p-3 d-flex justify-content-between align-items-center mb-2 position-relative z-1 border border-white border-opacity-10">
                    <span className="small fw-bold">Public Search</span>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                 </div>
                 <div className="bg-white bg-opacity-10 rounded-4 p-3 d-flex justify-content-between align-items-center position-relative z-1 border border-white border-opacity-10">
                    <span className="small fw-bold">Open to Locums</span>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfilePage;
