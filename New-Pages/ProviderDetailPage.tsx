
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, Globe, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const ProviderDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container">
        {/* Profile Header */}
        <div className="card rounded-5 border-0 shadow-lg text-white mb-4 p-4 p-md-5 overflow-hidden position-relative" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
           <div className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style={{width: '300px', height: '300px', transform: 'translate(30%, -30%)'}}></div>
           
           <div className="row align-items-center g-4 position-relative z-1">
              <div className="col-auto">
                <div className="bg-white p-1 rounded-circle shadow" style={{width: '128px', height: '128px'}}>
                  <img 
                    src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200&h=200`} 
                    className="w-100 h-100 rounded-circle object-fit-cover" 
                    alt="Provider"
                  />
                </div>
              </div>
              <div className="col text-center text-md-start">
                <h1 className="h2 fw-bold mb-2">St. Jude Medical Center</h1>
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 opacity-75 small fw-medium">
                  <span className="d-flex align-items-center gap-1"><Star size={14} className="text-warning fill-warning" /> 4.9 (120 Reviews)</span>
                  <span className="d-flex align-items-center gap-1"><MapPin size={14} /> New York, NY</span>
                  <span className="d-flex align-items-center gap-1"><Clock size={14} /> Open: 24/7</span>
                </div>
                <div className="mt-4 d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
                  <button className="btn btn-light px-4 py-2 rounded-3 fw-bold text-indigo shadow-sm">
                    Contact Clinic
                  </button>
                  <button className="btn btn-outline-light px-4 py-2 rounded-3 fw-bold" style={{backdropFilter: 'blur(10px)'}}>
                    Request Info
                  </button>
                </div>
              </div>
           </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card p-4 p-md-5 rounded-4 border-0 shadow-sm mb-4">
              <h2 className="h4 fw-bold mb-4">About</h2>
              <div className="text-secondary lh-lg">
                <p>We are a premier healthcare facility dedicated to providing top-notch medical services. Our team of experienced professionals ensures that every patient receives the best care possible.</p>
                <p>Established in 2005, we have grown to become a leader in cardiology and orthopedic care, serving over 50,000 patients annually.</p>
              </div>
            </div>

            <div className="card p-4 p-md-5 rounded-4 border-0 shadow-sm">
              <h2 className="h4 fw-bold mb-4">Services Offered</h2>
              <div className="row g-3">
                {[
                  'Emergency Cardiology', 'Digital X-Ray', 'Laboratory Testing', 
                  'Occupational Therapy', 'Vaccinations', 'Pediatric Care'
                ].map(service => (
                  <div key={service} className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-body-tertiary rounded-4 border hover-bg-light transition-all">
                      <CheckCircle2 className="text-success" size={18} />
                      <span className="fw-semibold small">{service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="col-lg-4">
            <div className="card p-4 rounded-4 border-0 shadow-sm mb-4 bg-white">
              <h2 className="h5 fw-bold mb-4">Contact Info</h2>
              <div className="d-flex flex-column gap-3">
                {/* Phone */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-body-tertiary hover-shadow transition-all cursor-pointer">
                  <div className="bg-white text-indigo rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm border border-indigo-subtle" style={{width: '44px', height: '44px'}}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-black text-secondary text-uppercase mb-0" style={{fontSize: '0.6rem', letterSpacing: '0.05rem'}}>Phone</p>
                    <p className="fw-bold mb-0 small">+1 (234) 567-890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-body-tertiary hover-shadow transition-all cursor-pointer">
                  <div className="bg-white text-indigo rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm border border-indigo-subtle" style={{width: '44px', height: '44px'}}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-black text-secondary text-uppercase mb-0" style={{fontSize: '0.6rem', letterSpacing: '0.05rem'}}>Email</p>
                    <p className="fw-bold mb-0 small">contact@stjude.com</p>
                  </div>
                </div>

                {/* Website */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-body-tertiary hover-shadow transition-all cursor-pointer">
                  <div className="bg-white text-indigo rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm border border-indigo-subtle" style={{width: '44px', height: '44px'}}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-black text-secondary text-uppercase mb-0" style={{fontSize: '0.6rem', letterSpacing: '0.05rem'}}>Website</p>
                    <p className="fw-bold mb-0 small">www.stjudemedical.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-4 rounded-4 border-0 shadow-sm text-center bg-indigo text-white overflow-hidden position-relative">
              <div className="position-absolute bottom-0 end-0 bg-white opacity-10 rounded-circle" style={{width: '100px', height: '100px', transform: 'translate(20%, 20%)'}}></div>
              <h4 className="h5 fw-bold mb-2 position-relative z-1">Need Help?</h4>
              <p className="small opacity-75 mb-4 position-relative z-1">Our support team is available 24/7 to assist with your medical inquiries.</p>
              <Link to="/contact" className="btn btn-light w-100 rounded-3 fw-bold text-indigo position-relative z-1 shadow-sm d-flex align-items-center justify-content-center gap-2">
                Support Center <ChevronRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
