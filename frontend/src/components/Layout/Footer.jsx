import React from "react";

const Footer = () => {
  return (
    <footer className=" border-t mt-auto" >
      {/* Footer */}
      <footer style={{ background: "rgb(33 37 41)" }} className="text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-900 font-bold text-xl">A</span>
                </div>
                <h2 className="text-2xl font-bold">Amica Connect</h2>
              </div>
              <p className="text-gray-400 mb-4 text-sm ">
                Connecting healthcare professionals with clinics and opportunities across the country. Simple, transparent, and professional.                Connecting healthcare talent with opportunities worldwide since
                2020.
              </p>
              {/* <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                >
                  in
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                >
                  t
                </a>
              </div> */}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">For Professionals</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Career Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Salary Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Profile Verification
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Professionals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Employer Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-400 text-center text-gray-400 text-sm">
            <p>
              © 2024 Amica Connect. All rights reserved. |{" "}
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
