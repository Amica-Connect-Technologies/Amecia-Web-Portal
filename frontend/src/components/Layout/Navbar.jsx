import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const userTypeIcons = {
    clinic: <BuildingOfficeIcon className="w-5 h-5" />,
    employer: <BriefcaseIcon className="w-5 h-5" />,
    job_seeker: <UserCircleIcon className="w-5 h-5" />,
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Career", href: "/jobs" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },

    // { name: "Find Providers", href: "/providers" },
    {
      name: "Resources",
      href: "#",
      dropdown: [
        { name: "Career Resources", href: "/resources/career" },
        { name: "Salary Calculator", href: "/resources/salary" },
        { name: "Blog", href: "/resources/blog" },
        { name: "FAQ", href: "/resources/faq" },
      ],
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-lg border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                Amica <span className="text-primary-600">Connect</span>
              </span>
              <span className="ml-2 text-xl font-bold text-gray-900 sm:hidden">
                AC
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <>
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-md hover:bg-gray-50">
                      {link.name}
                      <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(link.href)
                        ? "text-primary-700 bg-primary-50"
                        : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <HomeIcon className="w-5 h-5 mr-1" />
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center mt-1">
                          {userTypeIcons[user.user_type] || (
                            <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                          )}
                          <p className="text-xs text-gray-500 capitalize">
                            {user.user_type?.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <Link
                to="/dashboard"
                className="p-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <HomeIcon className="w-6 h-6" />
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setIsResourcesDropdownOpen(!isResourcesDropdownOpen)
                        }
                        className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      >
                        {link.name}
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform ${
                            isResourcesDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isResourcesDropdownOpen && (
                        <div className="pl-4 space-y-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={`block px-3 py-2 text-base font-medium rounded-md ${
                        isActive(link.href)
                          ? "text-primary-700 bg-primary-50"
                          : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile User Section */}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center">
                        <span className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-700 font-medium text-lg">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center">
                            {userTypeIcons[user.user_type] || (
                              <UserCircleIcon className="w-4 h-4 mr-1 text-gray-500" />
                            )}
                            <p className="text-xs text-gray-500 capitalize">
                              {user.user_type?.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <HomeIcon className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md border-t"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-2 text-center text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg border border-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
