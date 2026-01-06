
import React, { useState } from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { Check, Star, ShieldCheck, Zap, Info, HelpCircle } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  const plans = [
    { 
      name: 'Basic', 
      price: billingCycle === 'monthly' ? '29' : '24', 
      desc: 'Essential tools for small clinics.',
      features: ['3 Job Postings', 'Standard Search', 'Email Support'], 
      icon: Zap 
    },
    { 
      name: 'Professional', 
      price: billingCycle === 'monthly' ? '79' : '65', 
      desc: 'Advanced features for growing practices.',
      features: ['Unlimited Jobs', 'Priority Search', '24/7 Support'], 
      icon: Star, 
      popular: true 
    },
    { 
      name: 'Enterprise', 
      price: billingCycle === 'monthly' ? '199' : '165', 
      desc: 'Custom solutions for hospital networks.',
      features: ['API Access', 'Account Manager', 'Dedicated Pipeline'], 
      icon: ShieldCheck 
    },
  ];

  return (
    <div className="bg-dark min-vh-100 py-5 animate-fade-in">
      <div className="container">
        <header className="text-center mb-5 text-white">
          <div className="badge bg-indigo bg-opacity-10 text-indigo rounded-pill px-3 py-2 x-small text-uppercase fw-black mb-3 border border-indigo border-opacity-25">For Clinics & Employers</div>
          <h1 className="display-4 fw-black mb-4">Scale Your Healthcare Team</h1>
          <p className="lead opacity-50 mx-auto" style={{maxWidth: '700px'}}>Choose the right plan to connect with the best medical professionals and streamline your hiring process.</p>
          
          <div className="mt-5 d-flex align-items-center justify-content-center gap-3">
            <span className={`small fw-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-secondary'}`}>Monthly</span>
            <div className="form-check form-switch mb-0">
               <input 
                 className="form-check-input" 
                 type="checkbox" 
                 style={{width: '3rem', height: '1.5rem'}}
                 checked={billingCycle === 'annually'} 
                 onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')} 
               />
            </div>
            <span className={`small fw-bold ${billingCycle === 'annually' ? 'text-white' : 'text-secondary'}`}>
              Annually <span className="text-success ms-1 x-small fw-black">SAVE 20%</span>
            </span>
          </div>
        </header>

        <div className="card rounded-5 border-0 shadow-lg p-4 p-md-5 overflow-hidden position-relative">
          <div className="row g-4 mb-5">
            {plans.map((plan) => (
              <div key={plan.name} className="col-lg-4">
                <div 
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`card h-100 p-4 rounded-5 border-2 transition-all cursor-pointer position-relative ${selectedPlan === plan.name ? 'border-indigo bg-indigo bg-opacity-10 shadow-sm' : 'border-light hover-border-secondary'}`}
                  style={{borderStyle: 'solid'}}
                >
                  {plan.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle badge bg-indigo rounded-pill px-3 py-1 shadow-sm x-small fw-black text-uppercase">Most Popular</div>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className={`p-3 rounded-4 ${selectedPlan === plan.name ? 'bg-indigo text-white' : 'bg-light text-secondary'}`}>
                      <plan.icon size={24} />
                    </div>
                    <div className="text-end">
                      <p className="x-small fw-black text-secondary text-uppercase mb-0">{plan.name}</p>
                      <p className="h2 fw-black mb-0">${plan.price}</p>
                      <p className="x-small text-secondary mb-0">/ month</p>
                    </div>
                  </div>

                  <p className="small text-secondary mb-4">{plan.desc}</p>

                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {plan.features.map(f => (
                      <li key={f} className="d-flex align-items-center gap-2 small mb-2">
                        <Check size={14} className="text-success" /> {f}
                      </li>
                    ))}
                  </ul>

                  <button className={`btn w-100 py-3 rounded-4 fw-bold ${selectedPlan === plan.name ? 'btn-primary shadow-indigo' : 'btn-light border text-secondary'}`}>
                    {selectedPlan === plan.name ? 'Plan Selected' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-body-tertiary rounded-5 p-4 p-md-5 border mt-5">
             <div className="row g-5">
               <div className="col-lg-6 border-end-lg">
                 <h3 className="h4 fw-bold mb-5">Secure Checkout</h3>
                 <div className="row g-3">
                   <div className="col-6">
                     <label className="x-small fw-black text-secondary text-uppercase mb-2">First Name</label>
                     <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-white" placeholder="John" />
                   </div>
                   <div className="col-6">
                     <label className="x-small fw-black text-secondary text-uppercase mb-2">Last Name</label>
                     <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-white" placeholder="Doe" />
                   </div>
                   <div className="col-12">
                     <label className="x-small fw-black text-secondary text-uppercase mb-2">Card Number</label>
                     <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-white" placeholder="0000 0000 0000 0000" />
                   </div>
                   <div className="col-6">
                     <label className="x-small fw-black text-secondary text-uppercase mb-2">Expiry</label>
                     <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-white" placeholder="MM/YY" />
                   </div>
                   <div className="col-6">
                     <label className="x-small fw-black text-secondary text-uppercase mb-2">CVC</label>
                     <input type="text" className="form-control form-control-lg rounded-3 border-0 bg-white" placeholder="***" />
                   </div>
                 </div>
               </div>
               
               <div className="col-lg-6">
                 <div className="card rounded-4 p-4 border shadow-sm h-100 bg-white">
                   <h4 className="h6 fw-bold d-flex justify-content-between mb-4">
                     Order Summary
                     <span className="text-indigo">{selectedPlan} Plan</span>
                   </h4>
                   <div className="border-bottom pb-4 mb-4">
                     <div className="d-flex justify-content-between small text-secondary mb-2">
                       <span>Subscription Fee</span>
                       <span className="fw-bold text-dark">${plans.find(p => p.name === selectedPlan)?.price}.00</span>
                     </div>
                     <div className="d-flex justify-content-between small text-secondary">
                       <span>Processing Fee</span>
                       <span className="fw-bold text-dark">$0.00</span>
                     </div>
                   </div>
                   <div className="d-flex justify-content-between align-items-center mb-5">
                     <span className="fw-bold">Total Amount</span>
                     <span className="h3 fw-black text-indigo mb-0">${plans.find(p => p.name === selectedPlan)?.price}.00</span>
                   </div>
                   <button className="btn btn-dark btn-lg w-100 rounded-4 py-3 fw-bold shadow-sm mb-3">Complete Payment</button>
                   <div className="d-flex align-items-center justify-content-center gap-2 x-small text-secondary fw-bold">
                     <ShieldCheck size={14} className="text-success" /> Secure SSL Encrypted
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="small text-secondary fw-medium d-flex align-items-center justify-content-center gap-2">
            <HelpCircle size={18} /> Need help choosing? <Link to="/contact" className="text-indigo fw-bold text-decoration-none">Chat with Sales</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
