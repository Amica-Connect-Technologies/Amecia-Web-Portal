
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, ChevronRight, Stethoscope, Heart, Shield, Activity, Users, Target, Eye, Quote } from 'lucide-react';

const HomePage: React.FC = () => {
  const featuredCategories = [
    { name: 'Nursing', icon: Heart, count: 420 },
    { name: 'General Practice', icon: Stethoscope, count: 185 },
    { name: 'Emergency Care', icon: Activity, count: 94 },
    { name: 'Dentistry', icon: Shield, count: 112 },
    { name: 'Pediatrics', icon: Users, count: 68 },
    { name: 'Diagnostics', icon: Search, count: 45 },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Founder & CEO',
      bio: 'Former Chief of Medicine with 20 years of clinical experience.',
      image: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      name: 'Marcus Chen',
      role: 'Co-Founder & CTO',
      bio: 'Tech veteran passionate about building scalable health-tech solutions.',
      image: 'https://i.pravatar.cc/150?u=marcus'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Operations',
      bio: 'Expert in healthcare logistics and community management.',
      image: 'https://i.pravatar.cc/150?u=elena'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 py-md-5 overflow-hidden position-relative" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
        <div className="container py-5 text-center">
          <h1 className="display-3 fw-bold mb-4 tracking-tight">Amica Connect</h1>
          <p className="lead opacity-75 mb-5 mx-auto" style={{maxWidth: '700px'}}>
            Connecting healthcare professionals with clinics and employers across the globe.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link 
              to="/professionals" 
              className="btn btn-light btn-lg px-5 py-3 rounded-4 fw-bold text-indigo"
            >
              <Users size={20} className="me-2" />
              Find Providers
            </Link>
            <Link 
              to="/jobs" 
              className="btn btn-outline-light btn-lg px-5 py-3 rounded-4 fw-bold"
              style={{backdropFilter: 'blur(10px)'}}
            >
              <Briefcase size={20} className="me-2" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-5 container">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold h2">Featured Categories</h2>
            <p className="text-secondary small">Explore the most in-demand healthcare specialties.</p>
          </div>
          <Link to="/categories" className="text-indigo fw-semibold text-decoration-none d-flex align-items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {featuredCategories.map((cat, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <Link 
                to={`/categories?q=${cat.name}`}
                className="card h-100 p-4 rounded-4 text-decoration-none transition-transform"
              >
                <div className="bg-light rounded-4 d-flex align-items-center justify-content-center text-indigo mb-3" style={{width: '48px', height: '48px'}}>
                  <cat.icon size={24} />
                </div>
                <h3 className="h5 fw-bold text-dark mb-1">{cat.name}</h3>
                <p className="text-secondary small mb-0">{cat.count} Opportunities</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Mission, Vision & Team Section */}
      <section className="py-5 bg-white border-top">
        <div className="container py-5">
          <div className="row g-5 align-items-start mb-5">
            <div className="col-lg-6">
              <h2 className="fw-bold h2 mb-4">Our Mission & Vision</h2>
              <div className="d-flex flex-column gap-5">
                <div className="d-flex gap-3">
                  <div className="bg-light rounded-4 d-flex align-items-center justify-content-center text-indigo flex-shrink-0" style={{width: '48px', height: '48px'}}>
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="fw-bold h5 mb-2">Our Mission</h4>
                    <p className="text-secondary small mb-0">
                      To empower the healthcare community by creating a transparent, efficient, and professional marketplace that connects talent with purpose.
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="bg-light rounded-4 d-flex align-items-center justify-content-center text-purple flex-shrink-0" style={{width: '48px', height: '48px', color: '#7c3aed'}}>
                    <Eye size={24} />
                  </div>
                  <div>
                    <h4 className="fw-bold h5 mb-2">Our Vision</h4>
                    <p className="text-secondary small mb-0">
                      A world where every healthcare facility is perfectly staffed and every medical professional finds their ideal role effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card rounded-5 p-5 bg-light border-0">
                 <h3 className="h4 fw-bold mb-4">Meet the Founders</h3>
                 <div className="d-flex flex-column gap-4">
                   {teamMembers.map((member, i) => (
                     <div key={i} className="d-flex align-items-center gap-3">
                        <img src={member.image} alt={member.name} className="rounded-circle border border-2 border-white shadow-sm" style={{width: '64px', height: '64px'}} />
                        <div>
                          <h5 className="h6 fw-bold mb-1">{member.name}</h5>
                          <p className="text-indigo fw-semibold small mb-1">{member.role}</p>
                          <p className="text-secondary x-small mb-0" style={{fontSize: '0.75rem'}}>{member.bio}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light border-top">
        <div className="container py-5 text-center">
          <h2 className="fw-bold h2 mb-3">Are you a Healthcare Provider?</h2>
          <p className="text-secondary mb-5 mx-auto" style={{maxWidth: '600px'}}>Join thousands of medical professionals and find your next career milestone today.</p>
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="card p-5 rounded-5 h-100 shadow-sm border-0">
                <h4 className="fw-bold mb-3">For Professionals</h4>
                <p className="text-secondary small mb-4">Create your profile and let top clinics find you. Access exclusive job opportunities.</p>
                <Link to="/signup" className="btn btn-primary w-100 rounded-4">Join as Seeker</Link>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card p-5 rounded-5 h-100 shadow-sm border-0 bg-dark text-white">
                <h4 className="fw-bold mb-3">For Clinics</h4>
                <p className="text-light opacity-75 small mb-4">Post job listings and browse verified professionals to grow your medical team.</p>
                <Link to="/signup" className="btn btn-outline-light w-100 rounded-4">Join as Employer</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
