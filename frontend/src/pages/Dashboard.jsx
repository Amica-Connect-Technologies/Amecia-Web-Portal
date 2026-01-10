import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI, jobAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Alert from "../components/Common/Alert";
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  DocumentCheckIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  AcademicCapIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProfile(),
        loadStats(),
        loadRecentActivity(),
        loadNotifications(),
      ]);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response && response.data) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Profile load error:", err);
      }
      setProfile(null);
    }
  };

  const loadStats = async () => {
    try {
      if (!user?.user_type) return;

      let statsData = {};

      switch (user.user_type) {
        case "job_seeker":
          // For job seeker: get applications count
          try {
            const applications = await jobAPI.getMyApplications();
            const appsCount =
              applications.data?.count || applications.data?.length || 0;

            statsData = {
              applicationsCount: appsCount,
              savedJobsCount: 0, // Add saved jobs API if available
              interviewsScheduled: 0,
              profileViews: 0,
            };
          } catch (err) {
            console.error("Job seeker stats error:", err);
            statsData = {
              applicationsCount: 0,
              savedJobsCount: 0,
              interviewsScheduled: 0,
              profileViews: 0,
            };
          }
          break;

        case "employer":
          // For employer: get posted jobs count
          try {
            const postedJobs = await jobAPI.getMyPostedJobs();
            const jobsCount =
              postedJobs.data?.count || postedJobs.data?.length || 0;

            // Get total applications for all jobs
            let totalApplications = 0;
            if (postedJobs.data?.results) {
              for (const job of postedJobs.data.results) {
                try {
                  const jobApps = await jobAPI.getJobApplications(job.id);
                  totalApplications +=
                    jobApps.data?.count || jobApps.data?.length || 0;
                } catch (err) {
                  console.error(
                    `Error getting applications for job ${job.id}:`,
                    err
                  );
                }
              }
            }

            statsData = {
              postedJobsCount: jobsCount,
              totalApplications: totalApplications,
              activeJobs: jobsCount, // Assuming all posted jobs are active
              newApplications: 0, // You can add logic to track new applications
            };
          } catch (err) {
            console.error("Employer stats error:", err);
            statsData = {
              postedJobsCount: 0,
              totalApplications: 0,
              activeJobs: 0,
              newApplications: 0,
            };
          }
          break;

        case "clinic":
          // For clinic: use profile data
          try {
            const profileResponse = await profileAPI.getProfile();
            const clinicData = profileResponse?.data || {};

            statsData = {
              totalDoctors: clinicData.number_of_doctors || 0,
              availableSlots: 0, // Add clinic schedule API if available
              appointmentsToday: 0, // Add appointments API if available
              patientVisits: 0, // Add patient visits tracking if available
            };
          } catch (err) {
            console.error("Clinic stats error:", err);
            statsData = {
              totalDoctors: 0,
              availableSlots: 0,
              appointmentsToday: 0,
              patientVisits: 0,
            };
          }
          break;

        default:
          statsData = {};
      }

      setStats(statsData);
    } catch (err) {
      console.error("Stats load error:", err);
      setStats({});
    }
  };

  const loadRecentActivity = async () => {
    try {
      let activities = [];

      if (!user?.user_type) {
        setRecentActivity(activities);
        return;
      }

      switch (user.user_type) {
        case "job_seeker":
          try {
            const applications = await jobAPI.getMyApplications();
            const recentApps =
              applications.data?.results?.slice(0, 3) ||
              applications.data?.slice(0, 3) ||
              [];

            activities = recentApps.map((app) => ({
              id: app.id,
              type: "application",
              title: `Applied for ${app.job?.title || "a job"}`,
              description: `Status: ${app.status || "Applied"}`,
              time: new Date(
                app.applied_at || app.created_at
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              icon: DocumentCheckIcon,
              color: "text-blue-500",
            }));
          } catch (err) {
            console.error("Error loading job seeker activity:", err);
          }
          break;

        case "employer":
          try {
            const allApps = await jobAPI.getAllApplications();
            const recentApps =
              allApps.data?.results?.slice(0, 3) ||
              allApps.data?.slice(0, 3) ||
              [];

            activities = recentApps.map((app) => ({
              id: app.id,
              type: "application_received",
              title: `New application received`,
              description: `For: ${app.job?.title || "your job"}`,
              time: new Date(
                app.applied_at || app.created_at
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              icon: UsersIcon,
              color: "text-green-500",
            }));
          } catch (err) {
            console.error("Error loading employer activity:", err);
          }
          break;

        case "clinic":
          // Add clinic appointments API call here
          activities = [
            {
              id: "1",
              type: "profile_updated",
              title: "Profile updated",
              description: "Your clinic profile is active",
              time: "Today",
              icon: CheckCircleIcon,
              color: "text-green-500",
            },
          ];
          break;
      }

      // Add profile creation activity
      if (profile) {
        activities.unshift({
          id: "profile",
          type: "profile_created",
          title: "Profile created",
          description: "Your profile is now active",
          time: "Recently",
          icon: CheckCircleIcon,
          color: "text-green-500",
        });
      }

      // Add account creation activity
      activities.push({
        id: "account",
        type: "account_created",
        title: "Account created",
        description: "Welcome to Arnica Connect",
        time: new Date(user?.date_joined).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        icon: UserCircleIcon,
        color: "text-purple-500",
      });

      setRecentActivity(activities);
    } catch (err) {
      console.error("Activity load error:", err);
      setRecentActivity([]);
    }
  };

  const loadNotifications = async () => {
    // You can add actual notifications API call here
    const mockNotifications = [];
    setNotifications(mockNotifications);
  };

  const getUserTypeIcon = () => {
    switch (user?.user_type) {
      case "clinic":
        return <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />;
      case "employer":
        return <BriefcaseIcon className="w-8 h-8 text-primary-600" />;
      case "job_seeker":
        return <UserCircleIcon className="w-8 h-8 text-primary-600" />;
      default:
        return <UserCircleIcon className="w-8 h-8 text-primary-600" />;
    }
  };

  const getUserTypeText = () => {
    if (!user?.user_type) return "";

    const typeMap = {
      job_seeker: "Job Seeker",
      employer: "Employer",
      clinic: "Clinic",
    };

    return (
      typeMap[user.user_type] ||
      user.user_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;

    // Define required fields based on user type
    let requiredFields = [];

    switch (user?.user_type) {
      case "job_seeker":
        requiredFields = [
          "first_name",
          "last_name",
          "phone_number",
          "address",
          "profession",
          "experience_years",
        ];
        break;
      case "employer":
        requiredFields = [
          "company_name",
          "contact_person",
          "phone_number",
          "company_address",
        ];
        break;
      case "clinic":
        requiredFields = [
          "clinic_name",
          "address",
          "phone_number",
          "services",
          "number_of_doctors",
        ];
        break;
      default:
        // Generic check for common fields
        requiredFields = ["first_name", "last_name", "phone_number"];
    }

    // Count filled required fields
    const filledFields = requiredFields.filter((field) => {
      const value = profile[field];
      return value !== null && value !== "" && value !== undefined;
    }).length;

    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const getNextStep = () => {
    const completion = getProfileCompletion();

    if (!profile) {
      return {
        title: "Complete Your Profile",
        description: "Set up your profile to start using Arnica Connect",
        buttonText: "Create Profile",
        icon: UserCircleIcon,
        action: () => navigate("/clinic/create"),
      };
    }

    if (completion < 70) {
      return {
        title: "Complete Your Profile",
        description: "Add more details to improve your profile visibility",
        buttonText: "Edit Profile",
        icon: UserCircleIcon,
        action: () => navigate("/profile/edit"),
      };
    }

    // User-specific next steps based on user type
    switch (user?.user_type) {
      case "job_seeker":
        if (stats.applicationsCount === 0) {
          return {
            title: "Start Applying",
            description: "Browse jobs and apply to find your next opportunity",
            buttonText: "Browse Jobs",
            icon: DocumentMagnifyingGlassIcon,
            action: () => navigate("/jobs"),
          };
        }
        break;
      case "employer":
        if (stats.postedJobsCount === 0) {
          return {
            title: "Post Your First Job",
            description: "Post a job to start receiving applications",
            buttonText: "Post a Job",
            icon: BriefcaseIcon,
            action: () => navigate("/jobs/create"),
          };
        }
        break;
      case "clinic":
        // Add clinic-specific next steps
        return {
          title: "Manage Your Clinic",
          description: "Update clinic information and manage appointments",
          buttonText: "Manage Clinic",
          icon: BuildingOfficeIcon,
          action: () => navigate("/clinic/manage"),
        };
    }

    return {
      title: "Profile Complete!",
      description: "Your profile is ready. Start exploring opportunities.",
      buttonText: "View Profile",
      icon: CheckCircleIcon,
      action: () => navigate("/profile"),
    };
  };

  const renderStatsCards = () => {
    if (!user?.user_type) return null;

    switch (user.user_type) {
      case "job_seeker":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.applicationsCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DocumentCheckIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total job applications submitted
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.savedJobsCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Jobs saved for later</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Interviews</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.interviewsScheduled || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Interviews scheduled</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.profileViews || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Times your profile was viewed
              </p>
            </div>
          </div>
        );

      case "employer":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Posted Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.postedJobsCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total jobs posted</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalApplications || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DocumentCheckIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total applications received
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeJobs || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Currently active job listings
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Apps</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.newApplications || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BellIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                New applications this week
              </p>
            </div>
          </div>
        );

      case "clinic":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Doctors</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalDoctors || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total doctors in clinic
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Slots</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.availableSlots || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Available appointment slots
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today's Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.appointmentsToday || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Appointments scheduled today
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Patient Visits</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.patientVisits || 0}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total patient visits this month
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderUserSpecificContent = () => {
    if (!user?.user_type) return null;

    switch (user.user_type) {
      case "job_seeker":
        return (
          <>
            {/* Job Recommendations */}
            {profile && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Your Profile Summary
                  </h3>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Full Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.profession && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <AcademicCapIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Profession
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.profession}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.experience_years && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ChartBarIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Experience
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.experience_years} years
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.phone_number}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <HomeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Location
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

      case "employer":
        return (
          <>
            {/* Quick Post Job */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Need to hire quickly?
                  </h3>
                  <p className="mt-2 opacity-90">
                    Post a job and reach qualified candidates
                  </p>
                </div>
                <button
                  onClick={() => navigate("/jobs/create")}
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Post Job
                </button>
              </div>
            </div>

            {/* Company Info */}
            {profile && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.company_name && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Company Name
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.company_name}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.contact_person && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Contact Person
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.contact_person}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.phone_number}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.company_address && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Address
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.company_address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

      case "clinic":
        return (
          <>
            {/* Today's Appointments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Clinic Information
              </h3>
              {profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.clinic_name && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Clinic Name
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.clinic_name}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Address
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.phone_number}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.number_of_doctors && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <UsersIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Doctors
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.number_of_doctors} doctors
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No clinic information available
                  </p>
                  <button
                    onClick={() => navigate("/profile/create")}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Set Up Clinic Profile
                  </button>
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const nextStep = getNextStep();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError("")}
          />
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name || user?.email?.split("@")[0]}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {getUserTypeIcon()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getUserTypeText()}
                    </h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
              </div>

              

              
            </div>

            {/* Stats Section */}
            {renderStatsCards()}

            {/* User-Specific Content */}
            {renderUserSpecificContent()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {user?.user_type === "job_seeker" && (
                  <>
                    <button
                      onClick={() => navigate("/jobs")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center">
                        <DocumentMagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Browse Jobs</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => navigate("/jobseeker/profile/view")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">View Profile</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => navigate("/jobseeker/profile/edit")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Edit Profile</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
                {user?.user_type === "employer" && (
                  <>
                    <button
                      onClick={() => navigate("/employer/profile")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center">
                        <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Profile View</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => navigate("/jobs")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center">
                        <UsersIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Browse Jobs</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
                {/* // In your Dashboard component, add these buttons: // In the
                Quick Actions section for clinic users: */}
                {user?.user_type === "clinic" && (
                  <>
                    <button
                      onClick={() => navigate("/clinic/profile")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          View Clinic Profile
                        </span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => navigate("/clinic/profile/edit")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center">
                        <PencilSquareIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          Edit Clinic Profile
                        </span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
                {/* Common Actions */}
                {/* <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center">
                    <UserCircleIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">View Profile</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                </button> */}
                {/* <button
                  onClick={() => navigate("/profile/edit")}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Edit Profile</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                </button> */}
                {/* <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center">
                    <ChartBarIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Settings</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                </button> */}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <button
                  onClick={() => navigate("/activity")}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start">
                        <div
                          className={`p-2 rounded-lg ${activity.color.replace(
                            "text",
                            "bg"
                          )} bg-opacity-10 mr-3`}
                        >
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips & Updates */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Pro Tip</h3>
              {user?.user_type === "job_seeker" && (
                <p className="text-sm opacity-90">
                  Complete your profile with skills and experience to increase
                  your chances of getting hired by 40%.
                </p>
              )}
              {user?.user_type === "employer" && (
                <p className="text-sm opacity-90">
                  Detailed job descriptions receive 50% more quality
                  applications.
                </p>
              )}
              {user?.user_type === "clinic" && (
                <p className="text-sm opacity-90">
                  Keep your schedule updated to avoid appointment conflicts and
                  maximize bookings.
                </p>
              )}
              {!user?.user_type && (
                <p className="text-sm opacity-90">
                  Complete your profile setup to unlock all features of Arnica
                  Connect.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
