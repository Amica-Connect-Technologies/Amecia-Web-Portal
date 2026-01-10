import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contactInfo = [
    {
      icon: <PhoneIcon className="w-8 h-8" />,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      subtitle: "Mon-Fri 9AM-6PM EST",
      color: "bg-blue-500"
    },
    {
      icon: <EnvelopeIcon className="w-8 h-8" />,
      title: "Email",
      details: "support@amicaconnect.com",
      subtitle: "Response within 24 hours",
      color: "bg-purple-500"
    },
    {
      icon: <MapPinIcon className="w-8 h-8" />,
      title: "Office",
      details: "123 Healthcare Ave, Suite 500",
      subtitle: "San Francisco, CA 94107",
      color: "bg-green-500"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Live Chat",
      details: "Available Now",
      subtitle: "Click the chat icon below",
      color: "bg-orange-500"
    }
  ];

  const contactTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'career', label: 'Career Inquiry' },
    { value: 'feedback', label: 'Feedback/Suggestion' }
  ];

  const faqItems = [
    {
      question: "How quickly will I get a response?",
      answer: "We typically respond within 24 hours for email inquiries and immediately for live chat during business hours."
    },
    {
      question: "Do you offer support for healthcare professionals?",
      answer: "Yes! We have a dedicated support team for healthcare professionals using our platform. They can assist with profile setup, job applications, and any questions about using Amica Connect."
    },
    {
      question: "Can I schedule a demo for my clinic/hospital?",
      answer: "Absolutely! We offer personalized demos for healthcare facilities. Please select 'Partnership Opportunity' in the contact form and mention you'd like a demo."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please include your full name, organization (if applicable), specific questions or needs, and any relevant details that will help us assist you better."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Get in
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"
              >
                Touch
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-100"
            >
              We're here to help you connect, grow, and succeed in healthcare. Reach out anytime.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300">
                <a href="tel:+15551234567" className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300">
                <a href="mailto:support@amicaconnect.com" className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Email Us
                </a>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium text-lg mb-1">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600">We'll get back to you as soon as possible</p>
                  </div>
                </div>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-800">Message Sent Successfully!</p>
                        <p className="text-green-700 text-sm">We'll respond to your inquiry within 24 hours.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contactTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                            formData.contactType === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="contactType"
                            value={type.value}
                            checked={formData.contactType === type.value}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 border rounded-full mr-3 flex items-center justify-center ${
                            formData.contactType === type.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-400'
                          }`}>
                            {formData.contactType === type.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <PaperAirplaneIcon className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Support Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <ClockIcon className="w-6 h-6 text-blue-600 mr-3" />
                  Support Hours
                </h3>
                <div className="space-y-4">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                    { day: "Sunday", hours: "Emergency Support Only" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-900 font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Emergency Support:</span> Available 24/7 for urgent healthcare staffing emergencies
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/faq"
                  className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all FAQs
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
                <p className="text-gray-600 mb-6">Follow us for updates, tips, and healthcare news</p>
                <div className="flex space-x-4">
                  {['twitter', 'linkedin', 'facebook', 'instagram'].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-purple-300 transition-colors"
                    >
                      <div className="text-gray-700">
                        {platform === 'twitter' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        )}
                        {platform === 'linkedin' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        )}
                        {platform === 'facebook' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        )}
                        {platform === 'instagram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're located in the heart of San Francisco's healthcare innovation district
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="grid lg:grid-cols-2">
              {/* Map Placeholder */}
              <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Amica Connect HQ</h3>
                    <p className="opacity-90">123 Healthcare Ave, Suite 500</p>
                    <p className="opacity-90">San Francisco, CA 94107</p>
                  </div>
                </div>
                {/* Interactive Map Dots */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-white rounded-full animate-ping animation-delay-2000"></div>
              </div>

              {/* Location Details */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Location Details</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">123 Healthcare Avenue, Suite 500</p>
                    <p className="text-gray-600">San Francisco, California 94107</p>
                    <p className="text-gray-600">United States</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parking Information</h4>
                    <p className="text-gray-600">Visitor parking available in the building garage. Please check in at the front desk for a parking pass.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Public Transportation</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Bus #38</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Metro N</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">BART</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Muni</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Important Note</h4>
                    <p className="text-gray-600 text-sm">
                      Please schedule an appointment before visiting our office. Most of our team works remotely, and we want to ensure someone is available to assist you.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
          3
        </span>
      </motion.button>
    </div>
  );
};

export default ContactUs;