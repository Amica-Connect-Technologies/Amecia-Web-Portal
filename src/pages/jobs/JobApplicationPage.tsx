
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ChevronLeft } from 'lucide-react';

const JobApplicationPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in">
      <div className="container" style={{maxWidth: '800px'}}>
        <header className="mb-4 d-flex align-items-center justify-content-between text-white">
           <Link to="/jobs" className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-2 small fw-bold">
             <ChevronLeft size={16} /> Back to Jobs
           </Link>
           <p className="x-small text-secondary fw-black text-uppercase mb-0">Reference: JOB-{id}</p>
        </header>

        <div className="card rounded-5 border-0 shadow-lg overflow-hidden">
           <div className="bg-indigo p-5 text-white">
              <h1 className="h3 fw-bold mb-1">Apply for Position</h1>
              <p className="opacity-75 mb-0 small">Senior Registered Nurse • City Hospital</p>
           </div>

           <div className="card-body p-4 p-md-5">
              <form className="row g-4">
                 <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Full Name</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary" placeholder="John Doe" />
                 </div>
                 <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Email</label>
                    <input type="email" className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary" placeholder="john@example.com" />
                 </div>

                 <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Resume / CV</label>
                    <div className="card rounded-4 border-2 border-dashed border-secondary-subtle bg-body-tertiary p-5 text-center hover-border-indigo transition-all cursor-pointer">
                       <FileText size={40} className="text-secondary opacity-50 mb-3 mx-auto" />
                       <p className="fw-bold mb-1">Click or drag files here</p>
                       <p className="x-small text-secondary mb-0">Support PDF, DOCX up to 10MB</p>
                       <input type="file" className="position-absolute opacity-0" style={{inset: 0, cursor: 'pointer'}} />
                    </div>
                 </div>

                 <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Cover Letter (Optional)</label>
                    <textarea rows={5} className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary" placeholder="Tell us why you're a great fit..."></textarea>
                 </div>

                 <div className="col-12 pt-4 border-top">
                    <div className="row g-3">
                       <div className="col-md-8">
                          <button type="submit" className="btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-sm">Submit Application</button>
                       </div>
                       <div className="col-md-4">
                          <Link to="/jobs" className="btn btn-light btn-lg w-100 rounded-4 py-3 fw-bold border text-secondary">Cancel</Link>
                       </div>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
