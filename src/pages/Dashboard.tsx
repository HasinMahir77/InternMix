import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isStudent = currentUser === 'Mahir';

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser}!
          </h1>
          <p className="mt-2 text-gray-600">
            {isStudent 
              ? "Track your internship applications and opportunities"
              : "Manage your company's internship postings and applications"
            }
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isStudent ? (
            <>
              {/* Student Dashboard */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                </div>
                <p className="text-gray-600 mb-4">Track your internship applications</p>
                <div className="text-2xl font-bold text-blue-600">5 Active</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
                </div>
                <p className="text-gray-600 mb-4">Upcoming interviews</p>
                <div className="text-2xl font-bold text-green-600">2 Scheduled</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Views</h3>
                </div>
                <p className="text-gray-600 mb-4">Companies viewing your profile</p>
                <div className="text-2xl font-bold text-purple-600">12 This Week</div>
              </div>
            </>
          ) : (
            <>
              {/* Recruiter Dashboard */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Active Postings</h3>
                </div>
                <p className="text-gray-600 mb-4">Current internship opportunities</p>
                <div className="text-2xl font-bold text-orange-600">8 Active</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                </div>
                <p className="text-gray-600 mb-4">New applications received</p>
                <div className="text-2xl font-bold text-indigo-600">24 New</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
                </div>
                <p className="text-gray-600 mb-4">Scheduled interviews</p>
                <div className="text-2xl font-bold text-teal-600">6 This Week</div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isStudent ? (
              <>
                <Link to="/internships" className="bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center">
                  Browse Internships
                </Link>
                <Link to="/profile" className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
                  Update Profile
                </Link>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Applications
                </button>
              </>
            ) : (
              <>
                <button className="bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Post New Internship
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Review Applications
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Manage Company Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 