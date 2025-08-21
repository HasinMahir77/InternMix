// Dashboard API service

export interface RecruiterDashboardData {
  active_postings: number;
  total_applications: number;
  new_applications: number;
  upcoming_interviews: number;
  organization_name: string;
}

export interface StudentDashboardData {
  total_applications: number;
  active_applications: number;
  upcoming_interviews: number;
  profile_views: number;
}

export interface DashboardStats {
  total_listings?: number;
  archived_listings?: number;
  total_applications?: number;
  accepted_applications?: number;
  user_type: 'student' | 'recruiter';
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('internmix_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get recruiter dashboard data
export const getRecruiterDashboard = async (): Promise<RecruiterDashboardData> => {
  const response = await fetch(`${API_BASE}/api/dashboard/recruiter`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch recruiter dashboard data');
  }

  return response.json();
};

// Get student dashboard data
export const getStudentDashboard = async (): Promise<StudentDashboardData> => {
  const response = await fetch(`${API_BASE}/api/dashboard/student`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch student dashboard data');
  }

  return response.json();
};

// Get general dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_BASE}/api/dashboard/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch dashboard stats');
  }

  return response.json();
};
