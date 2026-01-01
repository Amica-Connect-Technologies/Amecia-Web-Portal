
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileText, MessageSquare, Plus, Edit2, LogOut, Trash2, X, Check, Camera, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../App';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { name: 'Dr. Jane Cooper', role: 'Chief Resident', id: '1', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { name: 'Arlene McCoy', role: 'Staff Nurse', id: '2', avatar: 'https://i.pravatar.cc/150?u=arlene' },
  { name: 'Leslie Alexander', role: 'Physiotherapist', id: '3', avatar: 'https://i.pravatar.cc/150?u=leslie' },
];

const ClinicDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', avatar: '' });
  
  // Custom confirmation state for deletion
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = [
    { label: 'Total Staff', value: staffList.length.toString(), bg: 'bg-primary', icon: Users },
    { label: 'Active Listings', value: '4', bg: 'bg-success', icon: Briefcase },
    { label: 'Applications', value: '28', bg: 'bg-warning', icon: FileText },
    { label: 'Messages', value: '15', bg: 'bg-danger', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openModal = (staff?: StaffMember) => {
    setDeleteConfirmId(null);
    if (staff) {
      setEditingStaff(staff);
      setFormData({ name: staff.name, role: staff.role, avatar: staff.avatar });
    } else {
      setEditingStaff(null);
      setFormData({ 
        name: '', 
        role: '', 
        avatar: `https://i.pravatar.cc/150?u=${Math.random().toString(36).substring(7)}` 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
    } else {
      const newStaff: StaffMember = {
        ...formData,
        id: Date.now().toString(),
      };
      setStaffList(prev => [...prev, newStaff]);
    }
    closeModal();
  };

  const confirmDelete = (id: string) => {
    setStaffList(prev => prev.filter(staff => staff.id !== id));
    setDeleteConfirmId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const shuffleAvatar = () => {
    setFormData(prev => ({ 
      ...prev, 
      avatar: `https://i.pravatar.cc/150?u=${Math.random().toString(36).substring(7)}` 
    }));
  };

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in" style={{backgroundColor: '#0f172a !important'}}>
      <div className="container">
        <header className="mb-5 text-white">
          <h1 className="display-5 fw-bold mb-2">Clinic Dashboard</h1>
          <p className="opacity-50">Manage staff, listings, and clinic profile</p>
        </header>

        <div className="card rounded-5 shadow-lg border-0 bg-body overflow-hidden">
          <div className="card-header bg-dark p-4 d-flex justify-content-between align-items-center border-0">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo rounded p-1 d-flex align-items-center justify-content-center text-white" style={{width: '32px', height: '32px', fontSize: '10px'}}>AC</div>
              <h2 className="h5 fw-bold text-white mb-0">Clinic Management Portal</h2>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2 shadow-none border-secondary text-secondary hover-bg-danger hover-text-white transition-all">
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
              <div className="col-lg-7">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <div>
                    <h3 className="h5 fw-bold mb-0 text-dark">Your Medical Staff</h3>
                    <p className="text-secondary small mb-0">Manage roles and permissions</p>
                  </div>
                  <button 
                    onClick={() => openModal()}
                    className="btn btn-primary rounded-3 d-flex align-items-center gap-2 fw-bold shadow-sm px-4 py-2"
                  >
                    <Plus size={18} /> Add Staff
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-3">
                  {staffList.length > 0 ? staffList.map((s) => (
                    <div key={s.id} className="d-flex align-items-center justify-content-between p-3 bg-white border rounded-4 shadow-sm transition-all hover-shadow-sm">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-body-tertiary border shadow-sm p-1" style={{width: '60px', height: '60px'}}>
                           <img src={s.avatar} className="w-100 h-100 rounded-circle object-fit-cover" alt={s.name} />
                        </div>
                        <div>
                          <p className="fw-bold mb-0 text-dark lh-sm">{s.name}</p>
                          <p className="text-indigo small fw-semibold mb-0" style={{fontSize: '0.85rem'}}>
                            {s.role}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {deleteConfirmId === s.id ? (
                          <div className="d-flex align-items-center gap-2 animate-fade-in bg-danger-subtle p-2 rounded-3 border border-danger border-opacity-25 shadow-sm">
                            <span className="x-small fw-bold text-danger px-1">Delete?</span>
                            <button 
                              onClick={() => confirmDelete(s.id)}
                              className="btn btn-danger btn-sm rounded-2 px-3 py-1 fw-bold shadow-sm"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(null)}
                              className="btn btn-light btn-sm rounded-2 px-3 py-1 fw-bold border shadow-sm"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => openModal(s)}
                              className="btn btn-light text-secondary p-2 rounded-3 hover-text-indigo border shadow-sm transition-all"
                              title="Edit Staff"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(s.id)}
                              className="btn btn-light text-danger p-2 rounded-3 hover-bg-danger-subtle border shadow-sm transition-all"
                              title="Remove Staff"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-5 border border-dashed rounded-4 bg-light">
                      <Users size={48} className="text-secondary opacity-25 mb-3 mx-auto" />
                      <p className="text-secondary mb-0 fw-bold">No staff members listed yet</p>
                      <p className="text-secondary x-small">Click "Add Staff" to build your team</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-5">
                <h3 className="h5 fw-bold mb-4 text-dark border-bottom pb-2">Recent Activity</h3>
                <div className="d-flex flex-column gap-4 border-start ms-2 ps-4">
                  {[
                    { title: 'New Staff Joined', detail: 'Sarah Jenkins (RN)', time: '1 hour ago' },
                    { title: 'Job Posting Updated', detail: 'Nursing Staff Needed', time: '2 hours ago' },
                    { title: 'Application Received', detail: 'Dr. Michael Scott (GP)', time: '5 hours ago' }
                  ].map((activity, i) => (
                    <div key={i} className="position-relative">
                      <div className="position-absolute top-0 start-0 translate-middle-x bg-indigo rounded-circle shadow-sm" style={{width: '10px', height: '10px', marginLeft: '-24px', marginTop: '6px', border: '2px solid white'}}></div>
                      <p className="small mb-0 text-dark fw-bold">{activity.title}</p>
                      <p className="x-small text-secondary mb-0">{activity.detail}</p>
                      <p className="x-small text-indigo opacity-75 mt-1" style={{fontSize: '0.7rem'}}>{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Modal Overlay */}
      {isModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
          style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'}}
        >
          <div className="card rounded-5 border-0 shadow-lg animate-fade-in" style={{width: '100%', maxWidth: '500px'}}>
            <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center rounded-top-5">
              <h4 className="h5 fw-bold mb-0 text-dark">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
              </h4>
              <button onClick={closeModal} className="btn btn-light rounded-circle p-2 text-secondary hover-text-dark border-0">
                <X size={20} />
              </button>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSave} className="d-flex flex-column gap-4">
                <div className="text-center mb-2">
                   <div className="position-relative d-inline-block">
                      <div 
                        className="rounded-circle border p-1 bg-white shadow-sm overflow-hidden" 
                        style={{width: '110px', height: '110px'}}
                      >
                         <img 
                          src={formData.avatar} 
                          className="w-100 h-100 rounded-circle object-fit-cover" 
                          alt="Preview" 
                        />
                      </div>
                      <div className="position-absolute bottom-0 end-0 d-flex gap-1" style={{transform: 'translate(15%, 15%)'}}>
                         <button 
                          type="button"
                          onClick={triggerFileSelect}
                          className="btn btn-primary btn-sm rounded-circle p-2 border-white border-2 shadow hover-scale transition-all"
                          title="Upload Image"
                        >
                          <Camera size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={shuffleAvatar}
                          className="btn btn-indigo btn-sm rounded-circle p-2 border-white border-2 shadow hover-scale transition-all"
                          title="Shuffle Avatar"
                        >
                          <RefreshCcw size={14} />
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="d-none" 
                        accept="image/*"
                      />
                   </div>
                   <p className="x-small text-secondary mt-3 mb-0">Upload a photo or shuffle for AI avatar</p>
                </div>

                <div className="form-group">
                  <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg rounded-3 border-0 bg-light px-3"
                    placeholder="e.g. Dr. John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="x-small fw-black text-secondary text-uppercase mb-2" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>Role / Designation</label>
                  <select 
                    className="form-select form-select-lg rounded-3 border-0 bg-light px-3"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="" disabled>Select a role...</option>
                    <option value="Chief Resident">Chief Resident</option>
                    <option value="Staff Nurse">Staff Nurse</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="General Practitioner">General Practitioner</option>
                    <option value="Surgical Lead">Surgical Lead</option>
                    <option value="Administrative Head">Administrative Head</option>
                    <option value="Laboratory Tech">Laboratory Tech</option>
                    <option value="Receptionist">Receptionist</option>
                  </select>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="button" onClick={closeModal} className="btn btn-light btn-lg rounded-4 flex-grow-1 fw-bold text-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg rounded-4 flex-grow-2 fw-bold d-flex align-items-center justify-content-center gap-2 px-5">
                    <Check size={20} /> {editingStaff ? 'Update Staff' : 'Save Staff'}
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

export default ClinicDashboard;
