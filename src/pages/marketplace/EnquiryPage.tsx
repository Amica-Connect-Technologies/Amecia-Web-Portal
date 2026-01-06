
import React from 'react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';

const EnquiryPage: React.FC = () => {
  const [enquiryType, setEnquiryType] = React.useState('General Question');
  const types = ['General Question', 'Provider Enquiry', 'Job Related', 'Technical'];

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in">
      <div className="container" style={{maxWidth: '800px'}}>
        <header className="text-center mb-5 text-white">
           <h1 className="display-5 fw-bold mb-2">Contact Us</h1>
           <p className="opacity-50">Have a question? We're here to help.</p>
        </header>

        <div className="card rounded-5 border-0 shadow-lg overflow-hidden bg-body">
           <div className="card-body p-4 p-md-5">
              <div className="mb-5">
                 <p className="x-small fw-black text-secondary text-uppercase mb-3" style={{fontSize: '0.65rem'}}>Enquiry Type</p>
                 <div className="row g-2">
                    {types.map(t => (
                      <div key={t} className="col-6 col-md-3">
                        <button 
                          onClick={() => setEnquiryType(t)}
                          className={`btn w-100 rounded-3 x-small fw-bold py-3 ${enquiryType === t ? 'btn-primary' : 'btn-light border text-secondary'}`}
                        >
                          {t}
                        </button>
                      </div>
                    ))}
                 </div>
              </div>

              <form className="row g-4">
                 <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Your Name</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary shadow-none" placeholder="Enter name" />
                 </div>
                 <div className="col-md-6">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Email Address</label>
                    <input type="email" className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary shadow-none" placeholder="you@example.com" />
                 </div>
                 <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Subject</label>
                    <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary shadow-none" placeholder="Subject" />
                 </div>
                 <div className="col-12">
                    <label className="x-small fw-black text-secondary text-uppercase mb-2">Message</label>
                    <textarea rows={5} className="form-control form-control-lg rounded-3 border-0 bg-body-tertiary shadow-none" placeholder="How can we help?"></textarea>
                 </div>
                 <div className="col-12 mt-4">
                    <button className="btn btn-dark btn-lg w-100 rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-3">
                      <Send size={20} /> Send Message
                    </button>
                 </div>
              </form>

              <div className="row g-4 mt-5 pt-4 border-top text-center">
                 <div className="col-md-4">
                    <div className="bg-light rounded-circle p-2 d-inline-block mb-2 text-indigo">
                       <Mail size={18} />
                    </div>
                    <p className="x-small fw-black mb-0">EMAIL</p>
                    <p className="small text-secondary mb-0">support@amica.com</p>
                 </div>
                 <div className="col-md-4">
                    <div className="bg-light rounded-circle p-2 d-inline-block mb-2 text-indigo">
                       <Phone size={18} />
                    </div>
                    <p className="x-small fw-black mb-0">PHONE</p>
                    <p className="small text-secondary mb-0">+1-800-AMICA</p>
                 </div>
                 <div className="col-md-4">
                    <div className="bg-light rounded-circle p-2 d-inline-block mb-2 text-indigo">
                       <MessageSquare size={18} />
                    </div>
                    <p className="x-small fw-black mb-0">CHAT</p>
                    <p className="small text-secondary mb-0">24/7 Live Support</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
