import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, TrendingUp, Loader2, RefreshCw, CheckCircle, Clock, AlertCircle, Check, X, Hourglass } from 'lucide-react';
import { 
  getRecruiterDashboard, 
  getStudentDashboard, 
  type RecruiterDashboardData, 
  type StudentDashboardData 
} from '../utils/dashboard';
import { 
  getEnhancedStudentDashboard,
  type EnhancedStudentDashboard 
} from '../utils/student';

const Dashboard = () => {
  const { isAuthenticated, currentUser, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recruiterData, setRecruiterData] = useState<RecruiterDashboardData | null>(null);
  const [studentData, setStudentData] = useState<StudentDashboardData | null>(null);
  const [enhancedStudentData, setEnhancedStudentData] = useState<EnhancedStudentDashboard | null>(null);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (userType === 'recruiter') {
        const data = await getRecruiterDashboard();
        setRecruiterData(data);
      } else {
        // Get enhanced student dashboard data (includes basic data)
        try {
          const enhancedData = await getEnhancedStudentDashboard();
          setEnhancedStudentData(enhancedData);
          // Set basic data from enhanced data for backward compatibility
          setStudentData({
            total_applications: enhancedData.total_applications,
            active_applications: enhancedData.active_applications,
            upcoming_interviews: enhancedData.upcoming_interviews,
            profile_views: enhancedData.profile_views
          });
        } catch (err) {
          // Fallback to basic dashboard if enhanced fails
          const basicData = await getStudentDashboard();
          setStudentData(basicData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated, userType]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isStudent = userType === 'student';

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {currentUser?.first_name || currentUser?.email}!
            </h1>
            <p className="mt-2 text-gray-600">
              {isStudent 
                ? "Track your internship applications and opportunities"
                : `Manage ${recruiterData?.organization_name || "your company's"} internship postings and applications`
              }
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
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
                  <div className="text-2xl font-bold text-blue-600">
                    {enhancedStudentData?.active_applications || studentData?.active_applications || 0} Active
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {enhancedStudentData?.total_applications || 0} Total
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Accepted, pending, and rejected applications</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Accepted</div>
                      <div className="text-xl font-bold text-green-600">{enhancedStudentData?.accepted_applications || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Pending</div>
                      <div className="text-xl font-bold text-yellow-600">{enhancedStudentData?.pending_applications || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Rejected</div>
                      <div className="text-xl font-bold text-red-600">{(enhancedStudentData?.status_breakdown && enhancedStudentData.status_breakdown['rejected']) || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Views</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Companies viewing your profile</p>
                  <div className="text-2xl font-bold text-purple-600">
                    {enhancedStudentData?.profile_views || studentData?.profile_views || 0} This Week
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Complete your profile for better chances</p>
                  <div className="text-2xl font-bold text-orange-600">
                    {enhancedStudentData?.profile_completion || 0}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {enhancedStudentData?.recommendations?.complete_profile ? 'Complete your profile' : 'Profile complete!'}
                  </div>
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
                  <div className="text-2xl font-bold text-orange-600">
                    {recruiterData?.active_postings || 0} Active
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                  </div>
                  <p className="text-gray-600 mb-4">New applications received</p>
                  <div className="text-2xl font-bold text-indigo-600">
                    {recruiterData?.new_applications || 0} New
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Accepted</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Candidates you accepted</p>
                  <div className="text-2xl font-bold text-green-600">
                    {recruiterData?.accepted_applications || 0}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Rejected</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Candidates you rejected</p>
                  <div className="text-2xl font-bold text-red-600">
                    {recruiterData?.rejected_applications || 0}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Hourglass className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Awaiting your decision</p>
                  <div className="text-2xl font-bold text-yellow-600">
                    {recruiterData?.pending_applications || 0}
                  </div>
                </div>

                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="bg-red-100 p-2 rounded-lg">
                       <Users className="h-6 w-6 text-red-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900">Total Applications</h3>
                   </div>
                   <p className="text-gray-600 mb-4">All time applications</p>
                   <div className="text-2xl font-bold text-red-600">
                     {recruiterData?.total_applications || 0} Total
                   </div>
                 </div>
               </>
             )}
           </div>
                 )}

        {/* Summary Section */}
        {!loading && !error && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {isStudent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Application Overview</h3>
                    <p className="text-gray-600">
                      You have applied to <span className="font-semibold">{enhancedStudentData?.total_applications || studentData?.total_applications || 0}</span> internships 
                      with <span className="font-semibold">{enhancedStudentData?.active_applications || studentData?.active_applications || 0}</span> active applications.
                    </p>
                    {enhancedStudentData && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Status:</span> {enhancedStudentData.pending_applications} Pending, {enhancedStudentData.accepted_applications} Accepted
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile & Recommendations</h3>
                    <p className="text-gray-600">
                      Profile completion: <span className="font-semibold">{enhancedStudentData?.profile_completion || 0}%</span>
                    </p>
                    {enhancedStudentData?.recommendations && (
                      <div className="mt-2 text-sm text-gray-500">
                        {enhancedStudentData.recommendations.complete_profile && (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Complete your profile</span>
                          </div>
                        )}
                        {enhancedStudentData.recommendations.apply_more && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            <span>Apply to more internships</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Listing Overview</h3>
                    <p className="text-gray-600">
                      You have <span className="font-semibold">{recruiterData?.active_postings || 0}</span> active internship postings 
                      and have received <span className="font-semibold">{recruiterData?.total_applications || 0}</span> total applications.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">{recruiterData?.new_applications || 0}</span> new applications received in the last 7 days.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                <Link to="/applications" className="text-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Applications
                </Link>
              </>
            ) : (
              <>
                <Link to="/listings" className="text-center bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Post New Internship
                </Link>
                <Link to="/listings" className="text-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Listings
                </Link>
                <Link to="/org-profile" className="text-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Manage Company Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 