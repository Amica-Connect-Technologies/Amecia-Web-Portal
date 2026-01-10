import React from "react";

const HomePage = () => {
  return (
    <>
      <div className="font-sans bg-gradient-to-br from-blue-50 to-white min-h-screen">
        {/* Hero Section */}

        <section
          className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8"
          style={{ background: "#6c3fea" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Logo/Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Amica Connect
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Connecting healthcare professionals with clinics and employers
                across the globe.
              </p>

              {/* Button Container */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* White Button - Find Providers */}
                <button className="flex items-center justify-center gap-3 w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13-7.25a10.949 10.949 0 00-2.051-3.593M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Find Providers
                </button>

                {/* Transparent Button - Browse Jobs */}
                <button className="flex items-center justify-center gap-3 w-full sm:w-auto bg-transparent hover:bg-blue-50 hover:text-blue-900 text-white font-semibold py-4 px-8 rounded-lg text-lg border-2 border-white transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Featured Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the most in-demand healthcare specialties with
              opportunities updated daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Nursing",
                opportunities: 420,
                color: "bg-blue-100",
                icon: "🩺",
              },
              {
                name: "Dentistry",
                opportunities: 112,
                color: "bg-teal-100",
                icon: "🦷",
              },
              {
                name: "General Practice",
                opportunities: 165,
                color: "bg-green-100",
                icon: "👨‍⚕️",
              },
              {
                name: "Pediatrics",
                opportunities: 66,
                color: "bg-pink-100",
                icon: "👶",
              },
              {
                name: "Emergency Care",
                opportunities: 94,
                color: "bg-red-100",
                icon: "🚑",
              },
              {
                name: "Diagnostics",
                opportunities: 45,
                color: "bg-purple-100",
                icon: "🔬",
              },
            ].map((category, index) => (
              <div
                key={index}
                className={`${category.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="text-blue-900 font-bold text-lg">
                    {category.opportunities} Opportunities
                  </div>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-700 mb-4">
                  Find the perfect match in this high-demand specialty with
                  competitive salaries and benefits.
                </p>
                <button className="text-blue-700 font-medium flex items-center hover:text-blue-900">
                  Explore Opportunities
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="text-blue-900 font-semibold px-6 py-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition flex items-center mx-auto">
              View All Categories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Our Mission & Vision
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                  <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-blue-100 mb-6">
                    To empower the healthcare community by creating a
                    transparent, efficient, and professional marketplace that
                    connects talent with purpose.
                  </p>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Streamline healthcare hiring processes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Provide verified professional credentials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        Ensure fair opportunities for all healthcare workers
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                  <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">🔭</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-blue-100 mb-6">
                    A world where every healthcare facility is perfectly staffed
                    and every medical professional finds their ideal role
                    effortlessly.
                  </p>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Reduce healthcare staffing shortages globally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        Create seamless international healthcare employment
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        Build a community of trusted healthcare professionals
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Meet the Founders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our leadership team brings decades of combined experience in
              healthcare, technology, and operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Dr. Sarah Jenkins",
                role: "Founder & CEO",
                description:
                  "Former Chief of Medicine with 20 years of clinical experience.",
                details:
                  "Board-certified internal medicine physician with a passion for healthcare innovation and workforce development.",
                color: "bg-blue-50",
              },
              {
                name: "Marcus Chen",
                role: "Co-Founder & CFO",
                description:
                  "Tech veteran passionate about building scalable health-tech solutions.",
                details:
                  "Former fintech executive with 15+ years experience in scaling technology companies globally.",
                color: "bg-teal-50",
              },
              {
                name: "Elena Rodriguez",
                role: "Head of Operations",
                description:
                  "Expert in healthcare logistics and community management.",
                details:
                  "Specialized in healthcare administration with a focus on international medical staffing solutions.",
                color: "bg-purple-50",
              },
            ].map((founder, index) => (
              <div
                key={index}
                className={`${founder.color} rounded-xl p-8 text-center hover:shadow-lg transition`}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                  {founder.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">
                  {founder.name}
                </h3>
                <div className="text-blue-700 font-medium mb-3">
                  {founder.role}
                </div>
                <p className="text-gray-700 mb-4">{founder.description}</p>
                <p className="text-gray-600 text-sm">{founder.details}</p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href="#"
                    className="text-blue-700 font-medium text-sm hover:text-blue-900"
                  >
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are you a Healthcare Provider?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of medical professionals and find your next career
              milestone today.
            </p>
            <button className="bg-white text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition shadow-lg text-lg">
              Create Your Profile — It's Free
            </button>
          </div>
        </section>

        {/* Join Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                For Professionals
              </h3>
              <p className="text-gray-700 mb-6">
                Create your profile and let top clinics find you. Access
                exclusive job opportunities, competitive salaries, and career
                advancement resources.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Personalized job recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Verified credential badge</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Direct contact with employers</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Career coaching and resources</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow">
                Join as Seeker
              </button>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-teal-100">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏥</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                For Clinics & Employers
              </h3>
              <p className="text-gray-700 mb-6">
                Post job listings and browse verified professionals to grow your
                medical team. Find the perfect candidates with our intelligent
                matching system.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Access to verified healthcare professionals</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Advanced candidate filtering</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Streamlined hiring workflow</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow">
                Join as Employer
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
