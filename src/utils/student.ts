// Student API service
import { getToken } from './auth';

export interface StudentProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone_num: string | null;
  address: string | null;
  institution: string | null;
  major: string | null;
  cgpa: number | null;
  resume_path: string | null;
  github_url: string | null;
  profile_image_url: string | null;
  created_at: string | null;
}

export interface StudentProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone_num?: string;
  address?: string;
  institution?: string;
  major?: string;
  cgpa?: number;
  github_url?: string;
  password?: string;
}

export interface StudentApplication {
  id: number;
  listing_id: number;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  status: string;
  similarity_score: number | null;
  applied_at: string | null;
  degree_required: string;
  subject_required: string;
  duration_months: number;
  deadline: string;
}

export interface ApplicationDetails {
  application: {
    id: number;
    status: string;
    similarity_score: number | null;
    applied_at: string | null;
  };
  listing: {
    id: number;
    title: string;
    description: string;
    degree: string;
    subject: string;
    recommended_cgpa: number | null;
    duration_months: number;
    location: string;
    is_remote: boolean;
    required_skills: string[];
    optional_skills: string[];
    deadline: string;
    created_at: string | null;
  };
  company: {
    name: string;
    email: string;
  };
}

export interface EnhancedStudentDashboard {
  total_applications: number;
  active_applications: number;
  accepted_applications: number;
  pending_applications: number;
  recent_applications: number;
  status_breakdown: Record<string, number>;
  profile_completion: number;
  upcoming_interviews: number;
  profile_views: number;
  recommendations: {
    complete_profile: boolean;
    apply_more: boolean;
    update_resume: boolean;
  };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get student profile
export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await fetch(`${API_BASE}/api/student/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch student profile');
  }

  return response.json();
};

// Update student profile
export const updateStudentProfile = async (profileData: StudentProfileUpdate): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE}/api/student/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update student profile');
  }

  return response.json();
};

// Get all student applications
export const getStudentApplications = async (): Promise<StudentApplication[]> => {
  const response = await fetch(`${API_BASE}/api/student/applications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch student applications');
  }

  return response.json();
};

// Apply for an internship
export const applyForInternship = async (listingId: number): Promise<{ message: string; application_id: number }> => {
  const response = await fetch(`${API_BASE}/api/student/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ listing_id: listingId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to submit application');
  }

  return response.json();
};

// Get application details
export const getApplicationDetails = async (applicationId: number): Promise<ApplicationDetails> => {
  const response = await fetch(`${API_BASE}/api/student/applications/${applicationId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch application details');
  }

  return response.json();
};

// Get enhanced student dashboard
export const getEnhancedStudentDashboard = async (): Promise<EnhancedStudentDashboard> => {
  const response = await fetch(`${API_BASE}/api/student/dashboard/enhanced`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch enhanced dashboard data');
  }

  return response.json();
};
