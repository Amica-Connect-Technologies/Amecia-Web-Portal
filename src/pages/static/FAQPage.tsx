
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: "What is Amica Connect?", 
      a: "Amica Connect is a comprehensive digital platform designed to bridge the gap between healthcare professionals, clinics, and medical employers. We provide tools for job searching, provider directory management, and specialized dashboards for all healthcare roles." 
    },
    { 
      q: "How do I register?", 
      a: "Click 'Register' in the top navigation, select your specific role (Clinic, Employer, or Job Seeker), and provide your professional details. The process is designed to take less than 2 minutes." 
    },
    { 
      q: "Are there any fees for job seekers?", 
      a: "No, registration and job searching are completely free for healthcare professionals and job seekers. We believe in removing barriers for talent to find their next career milestone." 
    },
    { 
      q: "How do I verify my medical credentials?", 
      a: "Once registered, you can upload your certifications and licenses in your Profile dashboard. Our team reviews these documents to grant you 'Verified' status, which significantly increases your visibility to top employers." 
    },
    { 
      q: "Can I apply for jobs internationally?", 
      a: "Yes! Amica Connect features opportunities from clinics and hospital networks globally. You can filter your search by country and region to find positions that offer relocation assistance or sponsorship." 
    },
    { 
      q: "How can I post a job listing as a clinic?", 
      a: "Clinics must first subscribe to one of our professional plans. Once active, you can access your Clinic Dashboard and use the 'Post a Job' tool to create detailed listings with specific requirements and salary ranges." 
    },
    { 
      q: "Is my personal and medical data secure?", 
      a: "Absolutely. We employ industry-standard AES-256 encryption and follow strict HIPAA and GDPR compliance protocols to ensure all sensitive professional and medical data remains private and protected." 
    },
    { 
      q: "What if I forget my password?", 
      a: "You can use the 'Forgot Password' link on the login page. We will send a secure reset link to your registered email address immediately." 
    },
    { 
      q: "Is there a mobile app available?", 
      a: "We currently offer a fully responsive web application that works perfectly on all mobile browsers. A dedicated iOS and Android app is currently in development and slated for release later this year." 
    },
    { 
      q: "How do I contact support if I have a technical issue?", 
      a: "You can reach our support team 24/7 through the 'Contact Us' page, or by emailing support@amicaconnect.com. Professional and Enterprise subscribers also have access to live chat support directly from their dashboards." 
    }
  ];

  return (
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container" style={{maxWidth: '800px'}}>
        <header className="text-center mb-5">
          <div className="bg-indigo bg-opacity-10 text-indigo rounded-4 p-3 d-inline-block mb-4">
            <HelpCircle size={32} />
          </div>
          <h1 className="display-5 fw-bold mb-3">Frequently Asked Questions</h1>
          <p className="lead text-secondary opacity-75">Find quick answers to common questions about the platform.</p>
        </header>

        <div className="card rounded-5 border-0 shadow-sm overflow-hidden mb-5">
           <div className="list-group list-group-flush">
             {faqs.map((faq, i) => (
               <div key={i} className="list-group-item border-0 border-bottom p-0">
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="btn btn-link w-100 text-start text-decoration-none p-4 d-flex justify-content-between align-items-center"
                  >
                    <span className={`fw-bold h6 mb-0 ${openIndex === i ? 'text-indigo' : 'text-dark'}`}>{faq.q}</span>
                    {openIndex === i ? <ChevronUp size={20} className="text-indigo" /> : <ChevronDown size={20} className="text-secondary" />}
                  </button>
                  <div className={`px-4 pb-4 text-secondary small collapse ${openIndex === i ? 'show' : ''}`} style={{ lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="card rounded-5 bg-indigo text-white p-5 border-0 shadow text-center position-relative overflow-hidden">
           <div className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style={{width: '200px', height: '200px', transform: 'translate(40%, -40%)'}}></div>
           <div className="position-relative z-1">
             <h2 className="h4 fw-bold mb-3">Still have questions?</h2>
             <p className="opacity-75 mb-5 mx-auto" style={{maxWidth: '500px'}}>If you couldn't find your answer here, our team is ready to help you 24/7 with any inquiries.</p>
             <a href="#/contact" className="btn btn-light btn-lg rounded-4 px-5 fw-bold text-indigo">Contact Support</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
