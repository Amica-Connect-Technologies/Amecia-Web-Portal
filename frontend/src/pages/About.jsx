import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const [animatedStats, setAnimatedStats] = useState({
    professionals: 0,
    clinics: 0,
    countries: 0,
    successRate: 0
  });

  useEffect(() => {
    const finalStats = {
      professionals: 5000,
      clinics: 850,
      countries: 48,
      successRate: 92
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const counters = {
      professionals: { current: 0, step: finalStats.professionals / steps },
      clinics: { current: 0, step: finalStats.clinics / steps },
      countries: { current: 0, step: finalStats.countries / steps },
      successRate: { current: 0, step: finalStats.successRate / steps }
    };

    const timer = setInterval(() => {
      const newStats = {};
      Object.keys(counters).forEach(key => {
        counters[key].current += counters[key].step;
        if (counters[key].current >= finalStats[key]) {
          counters[key].current = finalStats[key];
        }
        newStats[key] = Math.floor(counters[key].current);
      });

      setAnimatedStats(newStats);

      // Clear interval when all values reach their targets
      if (Object.values(newStats).every((val, idx) => 
        val >= Object.values(finalStats)[idx]
      )) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
                About Amica Connect
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Connecting
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3"
              >
                Healthcare Heroes
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
            >
              We're revolutionizing how healthcare professionals and facilities connect, collaborate, and grow together in a global marketplace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center space-x-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                Join Our Community
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <UsersIcon className="w-8 h-8" />, value: animatedStats.professionals, label: "Healthcare Professionals", suffix: "+" },
              { icon: <HeartIcon className="w-8 h-8" />, value: animatedStats.clinics, label: "Clinics & Hospitals", suffix: "+" },
              { icon: <GlobeAltIcon className="w-8 h-8" />, value: animatedStats.countries, label: "Countries", suffix: "" },
              { icon: <ChartBarIcon className="w-8 h-8" />, value: animatedStats.successRate, label: "Success Rate", suffix: "%" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story: Born from <span className="text-blue-600">Healthcare Passion</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Amica Connect was founded in 2020 by Dr. Sarah Jenkins, a Chief of Medicine who saw firsthand the challenges healthcare facilities face in finding qualified staff, and the difficulties professionals encounter in locating ideal opportunities.
              </p>
              <p className="text-gray-600 mb-8">
                What started as a simple solution to connect local clinics with available professionals has grown into a global platform serving thousands of healthcare organizations and medical experts across 48 countries.
              </p>
              <div className="space-y-4">
                {[
                  "Founded by healthcare professionals for healthcare professionals",
                  "Seed funded by leading health-tech investors",
                  "Recognized as Top Healthcare Platform 2023",
                  "ISO 27001 certified for data security"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-5xl font-bold mb-4">2020</div>
                <div className="text-xl font-semibold mb-2">Our Journey Begins</div>
                <p className="opacity-90">
                  Launched with a mission to bridge the gap between healthcare talent and opportunities worldwide.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-gray-600">Platform Rating</div>
                <div className="flex text-yellow-400 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-blue-600">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Amica Connect
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <HeartIcon className="w-12 h-12" />,
                title: "Empathy First",
                description: "We understand the unique challenges of healthcare and build solutions that truly serve medical professionals and facilities.",
                color: "text-pink-600 bg-pink-50"
              },
              {
                icon: <ShieldCheckIcon className="w-12 h-12" />,
                title: "Trust & Security",
                description: "Your data and privacy are our top priority. We maintain the highest security standards in healthcare technology.",
                color: "text-green-600 bg-green-50"
              },
              {
                icon: <LightBulbIcon className="w-12 h-12" />,
                title: "Innovation",
                description: "Continuously evolving our platform with cutting-edge technology to better serve the healthcare community.",
                color: "text-yellow-600 bg-yellow-50"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Leadership</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate team driving innovation in healthcare staffing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Jenkins",
                role: "Founder & CEO",
                bio: "Former Chief of Medicine with 20+ years of clinical experience. Passionate about healthcare innovation.",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
                color: "from-blue-500 to-blue-600"
              },
              {
                name: "Marcus Chen",
                role: "Co-Founder & CFO",
                bio: "Tech veteran with 15+ years in scaling health-tech solutions and financial strategy.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w-400",
                color: "from-purple-500 to-purple-600"
              },
              {
                name: "Elena Rodriguez",
                role: "Head of Operations",
                bio: "Expert in healthcare logistics and international medical staffing solutions.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400",
                color: "from-pink-500 to-pink-600"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <div className={`h-48 bg-gradient-to-r ${member.color} flex items-center justify-center`}>
                    <div className="w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the Healthcare Revolution
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Whether you're a healthcare professional seeking opportunities or a facility looking for talent, we're here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register/professional"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Join as Professional
                </Link>
                <Link
                  to="/register/employer"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Join as Employer
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;